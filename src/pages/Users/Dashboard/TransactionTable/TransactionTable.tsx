"use client"

import { Download, MoreVertical, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  product: string
  company: string
  amount: string
  date: string
  status: "Processing" | "Success" | "Declined"
  executor: string
  email: string
  avatar: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    product: "TSLA",
    company: "Tesla, Inc.",
    amount: "$30,021.23",
    date: "Dec 13, 2023",
    status: "Processing",
    executor: "Olivia Rhye",
    email: "oliv.rhye@company.com",
    avatar: "OR",
  },
  {
    id: "2",
    product: "MITCH",
    company: "Match Group, Inc.",
    amount: "$10,045.00",
    date: "Dec 13, 2023",
    status: "Success",
    executor: "Phoenix Baker",
    email: "phoenix@company.com",
    avatar: "PB",
  },
  {
    id: "3",
    product: "DDOG",
    company: "Datadog Inc",
    amount: "$40,132.16",
    date: "Dec 13, 2023",
    status: "Success",
    executor: "Lana Steiner",
    email: "lana@company.com",
    avatar: "LS",
  },
  {
    id: "4",
    product: "ARKG",
    company: "ARK Genomic Revolution ETF",
    amount: "$22,665.12",
    date: "Dec 28, 2023",
    status: "Declined",
    executor: "Demi Wilkinson",
    email: "demi@company.com",
    avatar: "DW",
  },
]

function StatusIcon({ status }: { status: "Processing" | "Success" | "Declined" }) {
  if (status === "Success") {
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  }
  if (status === "Declined") {
    return <AlertCircle className="w-4 h-4 text-red-500" />
  }
  return <Clock className="w-4 h-4 text-amber-500" />
}

function StatusBadge({ status }: { status: "Processing" | "Success" | "Declined" }) {
  const statusMap = {
    Processing: "text-amber-400",
    Success: "text-emerald-400",
    Declined: "text-red-400",
  }
  return <span className={`text-xs ${statusMap[status]}`}>{status}</span>
}

export function TransactionTable() {
  return (
    <Card className="bg-slate-900 border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-700 hover:bg-slate-800 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <span className="text-sm">↻ Re-issue</span>
          </Button> */}
          <button className="text-slate-400 hover:text-slate-200">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs font-medium text-slate-400 pb-3">Product Name</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3">Order amount</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3">Date</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3">Executed by</th>
              <th className="text-left text-xs font-medium text-slate-400 pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{tx.product}</p>
                    <p className="text-xs text-slate-500">{tx.company}</p>
                  </div>
                </td>
                <td className="py-4 text-sm text-white">{tx.amount}</td>
                <td className="py-4 text-sm text-slate-400">{tx.date}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={tx.status} />
                    <StatusBadge status={tx.status} />
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-200">{tx.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.executor}</p>
                      <p className="text-xs text-slate-500">{tx.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-200 text-sm">More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
