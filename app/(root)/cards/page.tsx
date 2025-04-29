import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
// import { mockRequestAccounts } from '@/app/mocks/mock-data';
import React from 'react'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  // const accounts = await getAccounts({ userId: loggedIn.$id });
  const accounts = await getAccounts({ userId: "2fsdf-dfas23-sdfasdf-23rf"});

  return (
    <section className='payment-transfer'>
        <HeaderBox
          title="My Cards"
          subtext="Effortlessly manage your bank cards."
        />

        <div className="mt-4 border-t border-gray-200">
          <div className="mt-4 flex flex-wrap gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard
                key={accounts.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
    </section>
  )
}

export default MyBanks