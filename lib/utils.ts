/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const authFormSchema = (type: string) => z.object({
  // sign up
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  address1: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  state: type === 'sign-in' ? z.string().optional() : z.string().min(2).max(2),
  postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  // ssn: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  // both
  email: z.string().email(),
  password: z.string().min(8),
})

const accounts = {

  data: [
      {
          appwriteItemId: 'acc001',
          name: 'Itaú Conta Corrente',
          type: 'Checking',
          currentBalance: 3250.75,
          agency: '1234',
          accountNumber: '56789-0',
          sharaebleId: 'SHR-ACC-001',
          pix: '123.456.789-00',
      },
      {
          appwriteItemId: 'acc002',
          name: 'Nubank Poupança',
          type: 'Savings',
          currentBalance: 10450.10,
          agency: '0001',
          accountNumber: '88888-1',
          sharaebleId: 'SHR-ACC-002',
          pix: 'meuemail@exemplo.com',
      },
      {
          appwriteItemId: 'acc003',
          name: 'Banco do Brasil',
          type: 'Checking',
          currentBalance: 810.00,
          agency: '9876',
          accountNumber: '54321-2',
          sharaebleId: 'SHR-ACC-003',
          pix: '(11) 91234-5678',
      },
      {
          appwriteItemId: 'acc001',
          name: 'Itaú Conta Corrente',
          type: 'Checking',
          currentBalance: 3250.75,
          agency: '1234',
          accountNumber: '56789-0',
          sharaebleId: 'SHR-ACC-001',
          pix: '123.456.789-00',
      },
      {
          appwriteItemId: 'acc002',
          name: 'Nubank Poupança',
          type: 'Savings',
          currentBalance: 10450.10,
          agency: '0001',
          accountNumber: '88888-1',
          sharaebleId: 'SHR-ACC-002',
          pix: 'meuemail@exemplo.com',
      },
      {
          appwriteItemId: 'acc003',
          name: 'Banco do Brasil',
          type: 'Checking',
          currentBalance: 810.00,
          agency: '9876',
          accountNumber: '54321-2',
          sharaebleId: 'SHR-ACC-003',
          pix: '(11) 91234-5678',
      },
      {
          appwriteItemId: 'acc004',
          name: 'Bradesco PJ',
          type: 'Business',
          currentBalance: 22000.50,
          agency: '1122',
          accountNumber: '33445-6',
          sharaebleId: 'SHR-ACC-004',
          pix: 'empresa@bradesco.com',
      },
      {
          appwriteItemId: 'acc005',
          name: 'Santander Universitário',
          type: 'Student',
          currentBalance: 150.20,
          agency: '5678',
          accountNumber: '67890-1',
          sharaebleId: 'SHR-ACC-005',
          pix: 'universitario@santander.com',
      },
      {
          appwriteItemId: 'acc006',
          name: 'Neon Conta Digital',
          type: 'Digital',
          currentBalance: 6543.00,
          agency: '0005',
          accountNumber: '11223-4',
          sharaebleId: 'SHR-ACC-006',
          pix: 'neon.pix@neon.com.br',
      },
      {
          appwriteItemId: 'acc007',
          name: 'Inter Conta Poupança',
          type: 'Savings',
          currentBalance: 9200.00,
          agency: '0043',
          accountNumber: '98765-4',
          sharaebleId: 'SHR-ACC-007',
          pix: 'inter@pix.com',
      },
      {
          appwriteItemId: 'acc008',
          name: 'C6 Bank',
          type: 'Checking',
          currentBalance: 312.77,
          agency: '1001',
          accountNumber: '12345-7',
          sharaebleId: 'SHR-ACC-008',
          pix: 'c6-user@c6.com',
      },
      {
          appwriteItemId: 'acc009',
          name: 'Caixa Econômica',
          type: 'Savings',
          currentBalance: 199.99,
          agency: '1040',
          accountNumber: '00123-0',
          sharaebleId: 'SHR-ACC-009',
          pix: 'cpf.caixa@pix.com',
      },
      {
          appwriteItemId: 'acc010',
          name: 'PagBank Conta Digital',
          type: 'Digital',
          currentBalance: 8300.45,
          agency: '0301',
          accountNumber: '55667-8',
          sharaebleId: 'SHR-ACC-010',
          pix: 'paguser@pagseguro.com',
      },
      {
          appwriteItemId: 'acc011',
          name: 'Original Investimentos',
          type: 'Investment',
          currentBalance: 42000.00,
          agency: '9090',
          accountNumber: '99887-6',
          sharaebleId: 'SHR-ACC-011',
          pix: 'invest@original.com',
      },
      {
          appwriteItemId: 'acc012',
          name: 'Mercado Pago',
          type: 'Wallet',
          currentBalance: 300.00,
          agency: 'MP00',
          accountNumber: '44556-9',
          sharaebleId: 'SHR-ACC-012',
          pix: 'mercado@pix.com',
      },
  ]
}

export const getAccountById = (id: string) => {
  const account = accounts.data.find((a) => a.appwriteItemId === id);

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
}

export const getAccounts = () => {
  return accounts.data;
}