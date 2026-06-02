// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SatyakashaBuyback
 * @dev Smart contract for handling the circular economy of Satyakasha.
 * Converts fiat revenue records into token incentives for DePIN nodes.
 */
contract SatyakashaBuyback {
    address public owner;
    
    // Mapping node operator (DePIN) to their earned token balance
    mapping(address => uint256) public nodeRewards;
    uint256 public totalFiatRevenueRecorded; // Dalam satuan terkecil IDR (contoh: Rupiah)

    // Token KASHA sederhana untuk representasi insentif DePIN
    mapping(address => uint256) public tokenBalance;
    uint256 public totalSupply = 1000000 * 10**18; // 1 Juta KASHA Token Supply

    event BuybackTriggered(uint256 fiatAmount, uint256 tokensDistributed);
    event RewardClaimed(address indexed nodeOperator, uint256 amount);

    constructor() {
        owner = msg.sender;
        // Memberikan seluruh supply awal ke smart contract ini sendiri
        tokenBalance[address(this)] = totalSupply;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya pemilik (Relayer) yang dapat memanggil");
        _;
    }

    /**
     * @dev Dipanggil oleh Relayer (Backend Payment Bridge) setelah fiat berhasil masuk via Midtrans.
     * Akan mendistribusikan token dari perbendaharaan (treasury) ke node-node DePIN.
     */
    function recordFiatAndDistributeTokens(uint256 _fiatAmountRupiah, address[] memory _activeDePINNodes) public onlyOwner {
        require(_activeDePINNodes.length > 0, "Harus ada minimal 1 node DePIN aktif");
        
        // Simulasikan Konversi: Rp 1.000 = 10 KASHA Token
        // Karena _fiatAmountRupiah menggunakan satuan biasa
        uint256 tokensToDistribute = (_fiatAmountRupiah * 10 * 10**18) / 1000;
        
        require(tokenBalance[address(this)] >= tokensToDistribute, "Perbendaharaan token tidak mencukupi");

        uint256 tokensPerNode = tokensToDistribute / _activeDePINNodes.length;

        // Distribusikan ke setiap node
        for(uint i = 0; i < _activeDePINNodes.length; i++) {
            nodeRewards[_activeDePINNodes[i]] += tokensPerNode;
            tokenBalance[address(this)] -= tokensPerNode;
            tokenBalance[_activeDePINNodes[i]] += tokensPerNode;
        }

        totalFiatRevenueRecorded += _fiatAmountRupiah;

        emit BuybackTriggered(_fiatAmountRupiah, tokensToDistribute);
    }

    /**
     * @dev Node dapat mengklaim reward mereka jika diperlukan.
     */
    function claimRewards() public {
        uint256 reward = nodeRewards[msg.sender];
        require(reward > 0, "Tidak ada reward yang tersedia");
        
        nodeRewards[msg.sender] = 0;
        // (Logika transfer token aktual diletakkan di sini)
        
        emit RewardClaimed(msg.sender, reward);
    }
}
