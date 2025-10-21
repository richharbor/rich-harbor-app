'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShareStore } from "@/store/useShareStore"
import { ChevronDown, ChevronRight, ChevronUp, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { useState } from "react";

interface ShareItem {
    id: number;
    shareName: string;
    quantityAvailable: string;
    price: string;
    deliveryTimeline: string;
    confirmDelivery: boolean;
    shareInStock: boolean;
    preShareTransfer: boolean;
    fixed:boolean;
    moq:string;
}
export default function Buying() {
    const { dummyShares } = useShareStore() as { dummyShares: ShareItem[] };

    const currentRole = Cookies.get("currentRole");


    const route = useRouter();

    return (
        <div className=" h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between px-6 pt-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Buy</h2>
                    <p className="text-muted-foreground">
                        Manage super admin and admin users
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            {/* <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Shares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dummyShares.length}</div>
                    </CardContent>
                </Card>
            </div> */}

            {/* Search */}
            <div className="relative ml-6 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search Shares..."
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}

            <div className="flex-1 min-h-0 border-t">
                <ScrollArea className="h-full">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                        {dummyShares.map((share, index) => (
                            <Card
                                key={index}
                                onClick={() => route.push(`/${currentRole}/share/${share.id}`)}
                                className="group relative cursor-pointer border border-border/50 bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl p-4"
                            >
                                {/* Top Row */}
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {share.shareName}
                                    </CardTitle>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1" />
                                </div>

                                {/* Price Section */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-muted-foreground">Price:</span>
                                    <span className="text-xl font-bold text-foreground tracking-tight">
                                        ₹{share.price}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="my-3 h-px bg-border" />

                                {/* Quantity + Deal Info */}
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <p>
                                        <strong>Available:</strong> {share.quantityAvailable}
                                    </p>
                                    <p>
                                        <strong>Deal Type:</strong> {share.fixed ? "Fixed" : "Negotiable"}
                                    </p>
                                </div>

                                {/* Optional Badge for stock status */}
                                {/* {share.shareInStock && (
                                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                        In Stock
                                    </span>
                                )} */}
                            </Card>

                        ))}
                    </div>
                </ScrollArea>
            </div>



        </div>
    )
}
