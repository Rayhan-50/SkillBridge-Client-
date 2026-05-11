"use client";

import StripeProvider from "@/components/modules/payment/StripeProvider";
import CheckoutForm from "@/components/modules/payment/CheckoutForm";
import { useState } from "react";
import { useSession } from "@/lib/auth-client"; // Assuming better-auth client

export default function PaymentPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number>(50); // Default amount or can be passed via URL query

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Securely complete your payment</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Tutoring Session</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-4 font-bold text-lg">
              <span>Total</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <StripeProvider>
            <CheckoutForm 
              amount={amount} 
              userId={session?.user?.id}
              // bookingId={searchParams.get("bookingId")} // if using useSearchParams
            />
          </StripeProvider>
        </div>
      </div>
    </div>
  );
}
