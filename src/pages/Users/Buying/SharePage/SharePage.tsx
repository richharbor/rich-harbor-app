"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShareStore } from "@/store/useShareStore";

interface SharePageProps {
    id: string;
}

export interface Seller {
    sellerName: string;
    quantity: string;
    price: string;
    deliveryTimeline: string;
    confirmDelivery: boolean;
    shareInStock: boolean;
    preShareTransfer: boolean;
    moq: string;
    fixed: boolean;
}

export interface Share {
    id: string;
    shareName: string;
    sellers: Seller[];
}
interface Bid {
    stockId: number;   // 1-5
    userId: string;    // example: "user1", "user2"
    amount: number;    // bid price
    quantity: number;  // number of shares
    count: number;     // number of bids by this user for this stock
};

export const dummyShares: Share[] = [
    {
        id: "1",
        shareName: "Alpha Corp",
        sellers: [
            {
                sellerName: "Seller A1",
                quantity: "1300",
                price: "45.5",
                deliveryTimeline: "T",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
                moq: "1200",
                fixed: false,
            },
            {
                sellerName: "Seller A2",
                quantity: "5400",
                price: "46.0",
                deliveryTimeline: "T+1",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: false,
                moq: "1210",
                fixed: true,
            },
        ],
    },
    {
        id: "2",
        shareName: "Beta Holdings",
        sellers: [
            {
                sellerName: "Seller B1",
                quantity: "4500",
                price: "38.2",
                deliveryTimeline: "T+4",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: true,
                moq: "1100",
                fixed: true,
            },
            {
                sellerName: "Seller B2",
                quantity: "7300",
                price: "39.0",
                deliveryTimeline: "T+1",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
                moq: "1100",
                fixed: false,
            },
        ],
    },
    {
        id: "3",
        shareName: "Gamma Investments",
        sellers: [
            {
                sellerName: "Seller G1",
                quantity: "6700",
                price: "52.0",
                deliveryTimeline: "3 weeks",
                confirmDelivery: true,
                shareInStock: false,
                preShareTransfer: false,
                moq: "1400",
                fixed: false,
            },
            {
                sellerName: "Seller G2",
                quantity: "5800",
                price: "53.0",
                deliveryTimeline: "3 weeks",
                confirmDelivery: false,
                shareInStock: false,
                preShareTransfer: false,
                moq: "1400",
                fixed: true,
            },
        ],
    },
    {
        id: "4",
        shareName: "Delta Ventures",
        sellers: [
            {
                sellerName: "Seller D1",
                quantity: "2300",
                price: "27.75",
                deliveryTimeline: "T",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: false,
                moq: "1000",
                fixed: true,
            },
            {
                sellerName: "Seller D2",
                quantity: "1300",
                price: "28.0",
                deliveryTimeline: "T",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
                moq: "1150",
                fixed: false,
            },
        ],
    },
    {
        id: "5",
        shareName: "Epsilon Partners",
        sellers: [
            {
                sellerName: "Seller E1",
                quantity: "1000",
                price: "61.4",
                deliveryTimeline: "T+3",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: true,
                moq: "500",
                fixed: false,
            },
            {
                sellerName: "Seller E2",
                quantity: "1000",
                price: "62.0",
                deliveryTimeline: "T+2",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: true,
                moq: "300",
                fixed: true,
            },
        ],
    },
];


export default function SharePage({ id }: SharePageProps) {
    const [share, setShare] = useState<any>(null);
    const {dummyBids} = useShareStore() as { dummyBids: Bid[] };;
    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState<Bid[] | []>([]);



    useEffect(() => {
        // Simulate fetching data
        const foundShare = dummyShares.find((s) => s.id === id);
        setShare(foundShare);

        const filterBids = dummyBids.filter((t) => String(t.stockId) === id);
        setBids(filterBids);

        setLoading(false);
    }, [id]);



    if (loading) return <div>Loading...</div>;
    if (!share) return <div>Share not found!</div>;



    // Get all prices as numbers
    let prices = share.sellers.map((seller : Seller) => parseFloat(seller.price));

    // Find min and max
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);

    const quantity = share.sellers.map((seller : Seller) => parseInt(seller.quantity))

    const minQuantity = Math.min(...quantity);
    const maxQuantity = Math.max(...quantity);

    

    return (
        <div className=" h-[calc(100vh-4.7rem)] flex flex-col overflow-hidden p-6 space-y-6">
            {/* Share Details */}
            <div className="border flex gap-5 rounded-xl shadow-sm p-6 bg-card">
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">{share.shareName}</h2>
                        {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${share.shareInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                            {share.shareInStock ? "In Stock" : "Out of Stock"}
                        </span> */}
                    </div>

                    {/* Grid Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Available Quantity</span>
                            <span className="text-lg font-semibold">{minQuantity} - {maxQuantity}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Price</span>
                            <span className="text-lg font-semibold">₹{minPrice} - ₹{maxPrice}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Delivery Timeline</span>
                            <span className="text-lg font-semibold">{share.sellers[0]?.deliveryTimeline}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Confirm Delivery</span>
                            <span className="text-lg font-semibold">
                                {share.sellers[0]?.confirmDelivery ? "Yes" : "No"}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Pre-Share Transfer</span>
                            <span className="text-lg font-semibold">
                                {share.preShareTransfer ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-[20vw] border rounded-md flex-col h-[250px] flex">
                    <h1 className="text-xl p-3 border-b">Bids</h1>
                    <ScrollArea className="h-full">
                    <Table className="min-w-full h-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Count</TableHead>
                                
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...bids,...bids,...bids]?.map((bid: Bid, index: any) => (
                                <TableRow key={index}>
                                    <TableCell>{bid.amount}</TableCell>
                                    <TableCell>{bid.quantity}</TableCell>
                                    <TableCell>{bid.count}</TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                </div>

            </div>


            {/* Sellers Table */}
            <div className="border rounded-md flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Deal Type</TableHead>
                                <TableHead>MOQ</TableHead>
                                <TableHead>Delivery Timeline</TableHead>
                                <TableHead>Confirm Delivery</TableHead>
                                <TableHead>Pre-Share Transfer</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {share.sellers.map((seller: Seller, index: any) => (
                                <TableRow key={index}>
                                    <TableCell>{seller.sellerName}</TableCell>
                                    <TableCell>{seller.quantity}</TableCell>
                                    <TableCell>{seller.price}</TableCell>
                                    <TableCell>{seller.fixed ? 'Fixed' : 'Negotiable'}</TableCell>
                                    <TableCell>{seller.moq}</TableCell>
                                    <TableCell>{seller.deliveryTimeline ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{seller.confirmDelivery ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{seller.preShareTransfer ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="default">
                                                Book
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                Bid
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
