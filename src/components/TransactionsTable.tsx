import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

export interface ITransaction {
  id: string;
  amount: number;
  serviceFee: number;
  hash: string;
  confirmationTime: number;
  merchantId: string;
  createdAt: string;
}

interface TransactionsTableProps {
  transactions: ITransaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Hash</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Service Fee</TableHead>
          <TableHead>Confirmation Time</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell
              className="cursor-pointer hover:bg-accent"
              onClick={() =>
                navigator.clipboard
                  .writeText(transaction.id)
                  .then(() =>
                    toast.success("Transaction ID copied to clipboard")
                  )
              }
              title="Click to copy ID"
            >
              {transaction.id}
            </TableCell>
            <TableCell
              className="font-mono text-sm cursor-pointer hover:bg-accent"
              onClick={() =>
                navigator.clipboard
                  .writeText(transaction.hash)
                  .then(() =>
                    toast.success("Transaction hash copied to clipboard")
                  )
              }
              title="Click to copy hash"
            >
              {transaction.hash}
            </TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.serviceFee}</TableCell>
            <TableCell>{transaction.confirmationTime}</TableCell>
            <TableCell>
              {new Date(transaction.createdAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
