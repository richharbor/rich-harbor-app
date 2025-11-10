"use client"

import MetricCard from "./MetrixCard/MetrixCard"
import { AnalyticChart } from "./AnalyticChart/AnalyticChart"
import { SessionChart } from "./SessionCard/SessionCard"
import { TransactionTable } from "./TransactionTable/TransactionTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeftRight, BarChart3, Package, Share2, ShoppingCart, Star, TrendingDown } from "lucide-react"


export default function Dashboard() {
  return (
    <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden gap-6">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-5">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Shares"
                value="53"
                change="+12.95%"
                icon={BarChart3}
                bg="from-blue-500"
                
              />
              <MetricCard title="Total Trade" value="13" change="-8.12%" icon={ArrowLeftRight} bg="from-emerald-500"   />
              <MetricCard title="Total Sell" value="10" change="-5.18%" icon={TrendingDown} bg="from-rose-500 " />
              <MetricCard title="Rating" value="4.5/5" change="+28.45%" icon={Star} bg="from-amber-400" />

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticChart />
              <SessionChart />
            </div>

            {/* Transaction Table */}
            <TransactionTable />
          </div>
        </ScrollArea>
      </div>

    </div>
  )
}
