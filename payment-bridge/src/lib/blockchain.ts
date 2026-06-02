// =============================================================================
// Blockchain Client — Ethers.js v6 + Lisk Sepolia
// =============================================================================
// Provides:
//   1. JsonRpcProvider connected to Lisk Sepolia
//   2. Wallet (Relayer) for signing transactions
//   3. Contract instance for SatyakashaRegistry
//   4. Dynamic gas estimation with configurable buffers
// =============================================================================

import { ethers } from 'ethers';
import { env } from '../config/env.js';
import { blockchainLogger } from './logger.js';

// ---------------------------------------------------------------------------
// SatyakashaRegistry ABI (only the functions we need)
// ---------------------------------------------------------------------------

const REGISTRY_ABI = [
  // Write function — register a document on-chain
  'function registerDocument(string _docHash, string _ipfsCID, string _institutionName, string _recipientName)',

  // Read functions — for verification
  'function isDocumentRegistered(string) view returns (bool)',
  'function documents(string) view returns (string documentHash, string ipfsCID, string institutionName, string recipientName, address registeredBy, uint256 timestamp)',

  // Events
  'event DocumentRegistered(string indexed documentHash, string ipfsCID, string institutionName, string recipientName, address indexed registeredBy, uint256 timestamp)',
];

const BUYBACK_ABI = [
  'function recordFiatAndDistributeTokens(uint256 _fiatAmountRupiah, address[] memory _activeDePINNodes) public',
  'event BuybackTriggered(uint256 fiatAmount, uint256 tokensDistributed)'
];

// ---------------------------------------------------------------------------
// Provider (read-only connection to Lisk Sepolia)
// ---------------------------------------------------------------------------

export const provider = new ethers.JsonRpcProvider(
  env.LISK_RPC_URL,
  {
    name: 'lisk-sepolia',
    chainId: env.LISK_CHAIN_ID,
  }
);

// ---------------------------------------------------------------------------
// Relayer Wallet (signer for transactions)
// ---------------------------------------------------------------------------

/**
 * Creates the relayer wallet from the private key env var.
 *
 * ⚠️  SECURITY NOTES:
 * - The private key is loaded from env var and exists ONLY in memory
 * - In production, use AWS KMS / GCP Cloud KMS for key management
 * - The Pino logger automatically redacts any field containing 'privateKey'
 * - Keep minimal balance in this wallet (~100 tx worth of gas)
 */
export const relayerWallet = new ethers.Wallet(env.RELAYER_PRIVATE_KEY, provider);

blockchainLogger.info(
  { relayerAddress: relayerWallet.address },
  'Relayer wallet initialized'
);

// ---------------------------------------------------------------------------
// Contract Instance
// ---------------------------------------------------------------------------

export const registryContract = new ethers.Contract(
  env.CONTRACT_ADDRESS,
  REGISTRY_ABI,
  relayerWallet
);

// Fallback address if env is missing (for Hackathon MVP dev)
const BUYBACK_ADDRESS = process.env.BUYBACK_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const buybackContract = new ethers.Contract(
  BUYBACK_ADDRESS,
  BUYBACK_ABI,
  relayerWallet
);

// ---------------------------------------------------------------------------
// Dynamic Gas Estimation
// ---------------------------------------------------------------------------

/** Gas buffer multiplier percentage (e.g., 20 = +20%) */
const GAS_FEE_BUFFER_PERCENT = 20n;
const GAS_LIMIT_BUFFER_PERCENT = 30n;

export interface GasOverrides {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gasLimit: bigint;
}

/**
 * Fetches real-time gas prices and applies safety buffers.
 *
 * The buffers ensure the transaction doesn't get stuck in the mempool
 * if gas prices spike between estimation and submission.
 *
 * @param estimatedGasLimit - Gas limit from contract.estimateGas()
 * @returns Gas overrides to pass to the transaction
 */
export async function getDynamicGasOverrides(
  estimatedGasLimit: bigint
): Promise<GasOverrides> {
  const feeData = await provider.getFeeData();

  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    // Fallback for networks without EIP-1559 support
    const gasPrice = feeData.gasPrice ?? ethers.parseUnits('1', 'gwei');
    blockchainLogger.warn('Network does not support EIP-1559, using legacy gas price');
    return {
      maxFeePerGas: (gasPrice * (100n + GAS_FEE_BUFFER_PERCENT)) / 100n,
      maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei'),
      gasLimit: (estimatedGasLimit * (100n + GAS_LIMIT_BUFFER_PERCENT)) / 100n,
    };
  }

  const maxFeePerGas =
    (feeData.maxFeePerGas * (100n + GAS_FEE_BUFFER_PERCENT)) / 100n;
  const maxPriorityFeePerGas =
    (feeData.maxPriorityFeePerGas * (100n + GAS_FEE_BUFFER_PERCENT)) / 100n;
  const gasLimit =
    (estimatedGasLimit * (100n + GAS_LIMIT_BUFFER_PERCENT)) / 100n;

  blockchainLogger.debug(
    {
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      gasLimit: gasLimit.toString(),
      bufferPercent: Number(GAS_FEE_BUFFER_PERCENT),
    },
    'Dynamic gas overrides calculated'
  );

  return { maxFeePerGas, maxPriorityFeePerGas, gasLimit };
}

/**
 * Checks the relayer wallet balance and logs a warning if low.
 * Should be called periodically to prevent surprise failures.
 */
export async function checkRelayerBalance(): Promise<bigint> {
  const balance = await provider.getBalance(relayerWallet.address);
  const balanceEth = ethers.formatEther(balance);

  if (balance < ethers.parseEther('0.01')) {
    blockchainLogger.error(
      { balance: balanceEth, address: relayerWallet.address },
      '🚨 CRITICAL: Relayer wallet balance dangerously low!'
    );
  } else if (balance < ethers.parseEther('0.05')) {
    blockchainLogger.warn(
      { balance: balanceEth, address: relayerWallet.address },
      '⚠️  Relayer wallet balance is getting low'
    );
  } else {
    blockchainLogger.info(
      { balance: balanceEth, address: relayerWallet.address },
      'Relayer wallet balance OK'
    );
  }

  return balance;
}
