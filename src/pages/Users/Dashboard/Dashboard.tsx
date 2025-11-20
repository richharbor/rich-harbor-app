"use client"

import MetricCard from "./MetrixCard/MetrixCard"
import AnalyticChart from "./AnalyticChart/AnalyticChart"
import SessionChart from "./SessionCard/SessionCard"
import TransactionTable from "./TransactionTable/TransactionTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeftRight, BarChart3, Package, Share2, ShoppingCart, Star, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardInfo } from "@/services/Dashboard/dashboardService"
import Loading from "@/app/loading"





export interface DashboardResponse {
  shareCount: number;
  sellCount: number;
  transactions: Transaction[];
}

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


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardInfo, setDashboardInfo] = useState<DashboardResponse | null>(null);
  





  useEffect(() => {
    fetchDashBoardInfo();
  }, [])


  const fetchDashBoardInfo = async () => {
    try {
      const response = await getDashboardInfo();
      setDashboardInfo(response.data);
    } catch (error) {
      console.log("Error in fetching dashboard info", error)
    } finally {
      setLoading(false);
    }

  }


  if (loading) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }


  return (
    <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden gap-6">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-5">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Shares"
                value={String(dashboardInfo?.shareCount)}
                change="+12.95%"
                icon={BarChart3}
                bg="from-blue-500"

              />
              <MetricCard title="Total Trade" value={String(dashboardInfo?.transactions?.length)} change="-8.12%" icon={ArrowLeftRight} bg="from-emerald-500" />
              <MetricCard title="Total Sell" value={String(dashboardInfo?.sellCount)} change="-5.18%" icon={TrendingDown} bg="from-rose-500 " />
              <MetricCard title="Rating" value="NA" change="+28.45%" icon={Star} bg="from-amber-400" />

            </div>

            {/* Charts */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticChart />
              <SessionChart />
            </div> */}

            {/* Transaction Table */}
            <TransactionTable transactions={dashboardInfo?.transactions!} />
          </div>
        </ScrollArea>
      </div>

    </div>
  )
}
