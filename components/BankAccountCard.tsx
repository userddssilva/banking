import { formatAmount } from '@/lib/utils'
import React from 'react'
import Copy from './Copy'
import Image from 'next/image'
import Link from 'next/link'

export type BankAccount = {
    name: string
    type: string
    currentBalance: number
    agency?: string
    accountNumber?: string
    pix?: string
    sharaebleId: string
    appwriteItemId: string
}

export type BankAccountCardProps = {
    account: BankAccount
    showBalance?: boolean
}

const BankAccountCard = ({ account, showBalance = true }: BankAccountCardProps) => {
    return (
        <div className="relative rounded-2xl bg-blue-600 p-5 text-white shadow-lg w-full max-w-md">
            <Link href={`/bank-account-details/${account.appwriteItemId}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{account.name}</h2>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full uppercase">
                        {account.type}
                    </span>
                </div>

                {showBalance && (
                    <p className="text-2xl font-bold mb-2">
                        {formatAmount(account.currentBalance)}
                    </p>
                )}

                <div className="text-sm opacity-90">
                    {account.agency && (
                        <p>Agency: {account.agency}</p>
                    )}
                    {account.accountNumber && (
                        <p>Account: {account.accountNumber}</p>
                    )}
                </div>

                <div className="mt-4">
                    <Copy title={account.pix || ''} />
                </div>

                <Image
                    src="/icons/lines.png"
                    alt="background lines"
                    width={316}
                    height={190}
                    className="absolute top-0 left-0 opacity-10 pointer-events-none"
                />
            </Link>
        </div>
    )
}

export default BankAccountCard
