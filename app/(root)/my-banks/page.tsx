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
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard
                key={accounts.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks