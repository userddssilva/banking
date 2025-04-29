import BankAccountCard, { BankAccount } from "@/components/BankAccountCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/utils";

const BankAccounts = () => {
    const accounts = getAccounts();
    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Bank Accounts"
                subtext="Fill in the details below to add a new bank account to your profile."
            />

            <div className="mt-4 space-y-4 border-t border-gray-200">
                <div className="mt-4 flex flex-wrap gap-6">
                    {accounts && accounts.map((a: BankAccount) => (
                        <BankAccountCard
                            key={a.sharaebleId}
                            account={a}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
export default BankAccounts;