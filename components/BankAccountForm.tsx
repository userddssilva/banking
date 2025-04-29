"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  currentBalance: z.coerce.number().min(0, "Balance must be positive"),
  cardLastFour: z.string().length(4, "Must be exactly 4 digits"),
  cardHolderName: z.string().min(2, "Card holder name is required"),
});

type BankAccountFormValues = z.infer<typeof formSchema>;

const CreateBankAccountForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      currentBalance: 0,
      cardLastFour: "",
      cardHolderName: "",
    },
  });

  const onSubmit = async (data: BankAccountFormValues) => {
    setIsLoading(true);
    try {
      console.log("Saving bank account:", data);
      // 👉 lógica de envio pra API aqui

      form.reset();
    } catch (error) {
      console.error("Failed to save bank account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Bank Name */}
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Bank Name
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Enter the name of the bank (e.g., Chase, Bank of America)
                  </FormDescription>
                </div>

                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Ex: Nubank, Chase..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Current Balance */}
        <FormField
          control={form.control}
          name="currentBalance"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Current Balance
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Specify the initial balance in this bank account
                  </FormDescription>
                </div>

                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input type="number" placeholder="Ex: 1000.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Card Last Four */}
        {/* <FormField
          control={form.control}
          name="cardLastFour"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Last 4 Digits of Card
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Provide only the last 4 digits of the associated debit or credit card
                  </FormDescription>
                </div>

                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Ex: 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        /> */}

        {/* Card Holder Name */}
        {/* <FormField
          control={form.control}
          name="cardHolderName"
          render={({ field }) => (
            <FormItem className="border-t border-b border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Card Holder Name
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Enter the full name as it appears on the card
                  </FormDescription>
                </div>

                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Ex: João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        /> */}

        {/* Submit Button */}
        <div className="payment-transfer_btn-box">
          <Button type="submit" disabled={isLoading} className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Saving...
              </>
            ) : (
              "Save Bank Account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBankAccountForm;
