import BankAccountForm from "@/components/BankAccountForm";
import HeaderBox from "@/components/HeaderBox";

const Income = () => {
    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Create Income"
                subtext="Fill in the details below to record a new income entry."
            />

            <section className="size-full pt-5">
                <BankAccountForm />
            </section>
        </section>
    );
};
export default Income;