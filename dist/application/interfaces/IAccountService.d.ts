export interface IAccountService {
    /**
     * Checks if the institution has enough balance in Rupiah.
     */
    hasSufficientBalance(institutionId: string, amountRupiah: number): Promise<boolean>;
    /**
     * Deducts the amount in Rupiah from the institution's account.
     */
    deductBalance(institutionId: string, amountRupiah: number): Promise<void>;
    /**
     * Gets the current registration fee in Rupiah.
     */
    getCurrentRegistrationFee(): Promise<number>;
}
