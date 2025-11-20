"use client"

import { Download, MoreVertical, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAuthStore from "@/helpers/authStore"

export interface Transaction {
  id: number;
  closedBy: number;
  franchiseId: number;
  sellerId: number;
  buyerId: number;
  shareName: string;
  quantity: number;
  price: string;        // If you want number, tell me & I'll convert it.
  createdAt: string;    // Or Date if you prefer
  updatedAt: string;    // Or Date if you prefer
}

interface TransactionTableProps {
  transactions: Transaction[];
}




export default function TransactionTable({ transactions }: TransactionTableProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const firstName = useAuthStore((state) => state.user?.firstName);
  const lastName = useAuthStore((state) => state.user?.lastName);
  return (
    <div className="h-96">

      <Card className="shadow-md h-full">
        <ScrollArea className="h-full">
          <CardHeader className="flex flex-row w-full justify-between">
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Seller Id</TableHead>
                  <TableHead>Buyer Id</TableHead>
                  <TableHead>Share Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Buying Quantity</TableHead>
                  <TableHead>Date</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>




                {transactions?.length === 0 ? <TableRow>
                  <TableCell colSpan={9} className="text-center py-20 text-muted-foreground">
                    No Transaction available.
                  </TableCell>
                </TableRow> :
                  transactions?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="py-3">{transaction.sellerId === userId ? firstName+" "+lastName: transaction.sellerId}</TableCell>
                      <TableCell className="py-3">{transaction.buyerId === userId ? firstName+" "+lastName: transaction.buyerId}</TableCell>
                      <TableCell className="py-3">{transaction.shareName}</TableCell>
                      <TableCell className="py-3">{transaction.price}</TableCell>
                      <TableCell className="py-3">{transaction.quantity}</TableCell>
                      <TableCell className="py-3">{new Date(transaction.createdAt).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))
                }




              </TableBody>
            </Table>
          </CardContent>
        </ScrollArea>
      </Card>

    </div>

  )
}
