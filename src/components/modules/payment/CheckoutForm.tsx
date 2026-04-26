"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  amount: number;
  bookingId?: string;
  userId?: string; // Optional if we extract it from token on the backend
}

export default function CheckoutForm({ amount, bookingId, userId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // 1. Create Payment Intent on the backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include auth token if needed: "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      const clientSecret = data.data.clientSecret;

      // 2. Confirm the payment on the client
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        // 3. Save payment info in the database
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            transactionId: paymentResult.paymentIntent.id,
            status: paymentResult.paymentIntent.status,
            bookingId,
            userId,
          }),
        });

        const saveData = await saveRes.json();
        
        if (saveData.success) {
          toast.success("Payment successful!");
          router.push("/dashboard/payment-history");
        } else {
          toast.error("Payment succeeded, but failed to save record.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p className="text-sm text-gray-500">Amount to pay: <span className="font-bold text-black">${amount.toFixed(2)}</span></p>
        
        <div className="p-4 border rounded-md">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}
