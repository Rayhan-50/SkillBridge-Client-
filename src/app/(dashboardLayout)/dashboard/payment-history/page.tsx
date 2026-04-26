"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string;
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/history?userId=${session.user.id}`);
        const data = await res.json();
        
        if (data.success) {
          setPayments(data.data);
        } else {
          toast.error("Failed to load payment history");
        }
      } catch (error) {
        toast.error("An error occurred while fetching payment history");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchHistory();
    } else if (session === null) {
      // Not logged in
      setLoading(false);
    }
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No payments found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.createdAt), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.transactionId}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={payment.status === "succeeded" ? "default" : "destructive"}
                          className={payment.status === "succeeded" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
