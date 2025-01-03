"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // // get banks from db
    // const banks = await getBanks({ userId });

    // const accounts = await Promise.all(
    //   banks?.map(async (bank: Bank) => {
    //     // get each account info from plaid
    //     const accountsResponse = await plaidClient.accountsGet({
    //       access_token: bank.accessToken,
    //     });
    //     const accountData = accountsResponse.data.accounts[0];

    //     // get institution info from plaid
    //     const institution = await getInstitution({
    //       institutionId: accountsResponse.data.item.institution_id!,
    //     });

    //     const account = {
    //       id: accountData.account_id,
    //       availableBalance: accountData.balances.available!,
    //       currentBalance: accountData.balances.current!,
    //       institutionId: institution.institution_id,
    //       name: accountData.name,
    //       officialName: accountData.official_name,
    //       mask: accountData.mask!,
    //       type: accountData.type as string,
    //       subtype: accountData.subtype! as string,
    //       appwriteItemId: bank.$id,
    //       sharaebleId: bank.shareableId,
    //     };

    //     return account;
    //   })
    // );

    // const totalBanks = accounts.length;
    // const totalCurrentBalance = accounts.reduce((total, account) => {
    //   return total + account.currentBalance;
    // }, 0);

    // return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });

      const accounts = [
        {
          "id": "account_001",
          "availableBalance": 1500.75,
          "currentBalance": 2000.50,
          "institutionId": "ins_12345",
          "name": "Checking Account",
          "officialName": "Official Checking Account",
          "mask": "6789",
          "type": "depository",
          "subtype": "checking",
          "appwriteItemId": "bank_001",
          "sharaebleId": "shareable_001"
        },
        {
          "id": "account_002",
          "availableBalance": 3000.00,
          "currentBalance": 3500.00,
          "institutionId": "ins_67890",
          "name": "Savings Account",
          "officialName": "Official Savings Account",
          "mask": "1234",
          "type": "depository",
          "subtype": "savings",
          "appwriteItemId": "bank_002",
          "sharaebleId": "shareable_002"
        }
      ];
      
      const totalBanks = 2;
      const totalCurrentBalance = 5500.50;

      return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
    
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // // get bank from db
    // const bank = await getBank({ documentId: appwriteItemId });

    // // get account info from plaid
    // const accountsResponse = await plaidClient.accountsGet({
    //   access_token: bank.accessToken,
    // });
    // const accountData = accountsResponse.data.accounts[0];

    // // get transfer transactions from appwrite
    // const transferTransactionsData = await getTransactionsByBankId({
    //   bankId: bank.$id,
    // });

    // const transferTransactions = transferTransactionsData.documents.map(
    //   (transferData: Transaction) => ({
    //     id: transferData.$id,
    //     name: transferData.name!,
    //     amount: transferData.amount!,
    //     date: transferData.$createdAt,
    //     paymentChannel: transferData.channel,
    //     category: transferData.category,
    //     type: transferData.senderBankId === bank.$id ? "debit" : "credit",
    //   })
    // );

    // // get institution info from plaid
    // const institution = await getInstitution({
    //   institutionId: accountsResponse.data.item.institution_id!,
    // });

    // const transactions = await getTransactions({
    //   accessToken: bank?.accessToken,
    // });

    // const account = {
    //   id: accountData.account_id,
    //   availableBalance: accountData.balances.available!,
    //   currentBalance: accountData.balances.current!,
    //   institutionId: institution.institution_id,
    //   name: accountData.name,
    //   officialName: accountData.official_name,
    //   mask: accountData.mask!,
    //   type: accountData.type as string,
    //   subtype: accountData.subtype! as string,
    //   appwriteItemId: bank.$id,
    // };

    // // sort transactions by date such that the most recent transaction is first
    //   const allTransactions = [...transactions, ...transferTransactions].sort(
    //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    // );

    // return parseStringify({
    //   data: account,
    //   transactions: allTransactions,
    // });

    const account = {
      "id": "123456789", // account_id
      "availableBalance": 1500.75, // available balance
      "currentBalance": 2000.50, // current balance
      "institutionId": "ins_12345", // institution_id from Plaid
      "name": "My Checking Account", // account name
      "officialName": "Official Checking Account", // official name of the account
      "mask": "6789", // last 4 digits of the account
      "type": "depository", // type of account
      "subtype": "checking", // subtype of account
      "appwriteItemId": "bank_001" // $id from Appwrite database
    }
    const transactions = [
      {
        "id": "txn_001",
        "name": "Grocery Store",
        "amount": 50.25,
        "date": "2024-12-30",
        "paymentChannel": "in_store",
        "category": "Groceries",
        "type": "debit",
        "image": "https://example.com/grocery-logo.png"
      },
      {
        "id": "txn_002",
        "name": "Salary",
        "amount": 3000.00,
        "date": "2024-12-29",
        "paymentChannel": "direct_deposit",
        "category": "Income",
        "type": "credit",
        "image": "https://example.com/salary-logo.png"
      },
      {
        "id": "txn_003",
        "name": "Transfer to Savings",
        "amount": 500.00,
        "date": "2024-12-28",
        "paymentChannel": "online",
        "category": "Transfers",
        "type": "debit",
        "image": null
      },
      {
        "id": "txn_004",
        "name": "Utility Bill",
        "amount": 120.75,
        "date": "2024-12-27",
        "paymentChannel": "online",
        "category": "Utilities",
        "type": "debit",
        "image": null
      }
    ]

    return parseStringify({
      data: account,
      transactions: transactions,
    });

  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};