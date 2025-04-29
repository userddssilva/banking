'use client';

import Copy from "@/components/Copy";
import { BankAccount } from "@/components/BankAccountCard";
import { formatAmount } from '@/lib/utils'
import { getAccountById } from '@/lib/utils'

const ViewAccount = ({ params }: { params: { id: string }}) => {
    var appwriteItemId = params.id;
    console.log(`AppWriteItemId: ${appwriteItemId}`)
    var account = getAccountById(appwriteItemId);
    return (
        <div className="flex justify-center mt-10">
            <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🏦</span>
                        <h2 className="text-lg font-semibold">{account.name}</h2>
                    </div>
                    <span className="text-sm rounded-full bg-gray-100 px-3 py-1 text-gray-600 capitalize">
                        {account.type}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Saldo:</strong> {formatAmount(account.currentBalance)}</p>
                    <p><strong>Agência:</strong> {account.agency}</p>
                    <p><strong>Conta:</strong> {account.accountNumber}</p>
                    {/* <p className="flex items-center gap-1"> */}
                    <span><strong>Pix:</strong> <Copy title={account.pix || ''} /></span>
                    {/* </p> */}
                    <p><strong>ID Compartilhável:</strong> {account.sharaebleId}</p>
                </div>

                <div className="mt-4">
                    <Copy title={account.sharaebleId} />
                </div>
                <button
                    className="absolute bottom-3 right-3 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => console.log('Editar conta', account.appwriteItemId)}
                >
                    ✏️
                </button>
            </div>
        </div>
    );
}
export default ViewAccount;