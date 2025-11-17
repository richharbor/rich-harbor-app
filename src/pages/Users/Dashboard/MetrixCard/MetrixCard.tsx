import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { HelpCircle } from "lucide-react";

interface MetricCardProps {
    title: string
    value: string
    change: string
    icon: LucideIcon
    bg: string

}

export default function MetricCard({ title, value, change, icon: Icon, bg }: MetricCardProps) {
    const SafeIcon = Icon || HelpCircle; // fallback


    return (
        <Card
            className={`relative p-6 border border-slate-700 bg-slate-900 rounded-lg overflow-hidden group`}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
            <div className="relative z-10 text-white">
                <div className="flex justify-between items-start mb-5">

                    <div className={`h-16 w-16 flex justify-center items-center rounded-full bg-gradient-to-b ${bg} to-transparent`}>
                        <SafeIcon size={32} className="fill" />
                    </div>
                    {/* <button className="text-slate-400 hover:text-slate-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button> */}
                </div>

                <div className="space-y-1">
                    <h3 className={`text-sm font-medium text-slate-400`}>{title}</h3>
                    <div className="text-3xl font-bold text-white">{value}</div>
                    {/* <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{change}</span>
        </div> */}
                    {/* <p className={`text-xs ${isPrimary ? "text-purple-100" : "text-slate-500"}`}>{comparison}</p> */}
                </div>
            </div>
        </Card>
    )
}
