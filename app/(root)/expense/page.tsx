import BankAccountForm from "@/components/BankAccountForm";
import HeaderBox from "@/components/HeaderBox";

const Expense = () => {
    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Create Expense"
                subtext="Fill in the details below to add a new expense to your records."
            />

            <section className="size-full pt-5">
                <BankAccountForm />
            </section>
        </section>
    );
};
export default Expense;