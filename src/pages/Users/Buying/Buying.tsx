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
    id:number;
    shareName: string;
    quantityAvailable: string;
    price: string;
    deliveryTimeline: string;
    confirmDelivery: boolean;
    shareInStock: boolean;
    preShareTransfer: boolean;
}
export default function Buying() {
    const { dummyShares } = useShareStore() as { dummyShares: ShareItem[] };

     const currentRole = Cookies.get("currentRole");


    const route = useRouter();

    return (
        <div className=" h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between px-6 pt-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Shares</h2>
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
                                className="cursor-pointer relative hover:bg-accent/50 bg-card transition-all border "
                                onClick={()=> route.push(`/${currentRole}/buying/${share.id}`)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">{share.shareName}</CardTitle>
                                    <ChevronRight className="w-5 absolute top-1/2 -translate-y-1/2 right-3 h-5 text-gray-600" />
                                </CardHeader>

                                <CardContent>
                                    <div className="text-sm -mt-3 text-muted-foreground">
                                        <p><strong>Price:</strong> ₹{share.price}</p>
                                        <p><strong>Available:</strong> {share.quantityAvailable}</p>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>



        </div>
    )
}
