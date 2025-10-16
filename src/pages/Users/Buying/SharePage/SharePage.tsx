"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SharePageProps {
    id: string;
}

export interface Seller {
    sellerName: string;
    quantity: number;
    price: number;
    deliveryTimeline: string;
    confirmDelivery: boolean;
    shareInStock: boolean;
    preShareTransfer: boolean;
}

export interface Share {
    id: string;
    shareName: string;
    quantityAvailable: number;
    price: number;
    sellers: Seller[];
}

export const dummyShares: Share[] = [
    {
        id: "1",
        shareName: "Alpha Corp",
        quantityAvailable: 1200,
        price: 45.5,
        sellers: [
            {
                sellerName: "Seller A1",
                quantity: 300,
                price: 45.5,
                deliveryTimeline: "2 weeks",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
            },
            {
                sellerName: "Seller A2",
                quantity: 400,
                price: 46.0,
                deliveryTimeline: "2 weeks",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: false,
            },
        ],
    },
    {
        id: "2",
        shareName: "Beta Holdings",
        quantityAvailable: 800,
        price: 38.2,
        sellers: [
            {
                sellerName: "Seller B1",
                quantity: 500,
                price: 38.2,
                deliveryTimeline: "1 week",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: true,
            },
            {
                sellerName: "Seller B2",
                quantity: 300,
                price: 39.0,
                deliveryTimeline: "1 week",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
            },
        ],
    },
    {
        id: "3",
        shareName: "Gamma Investments",
        quantityAvailable: 1500,
        price: 52.0,
        sellers: [
            {
                sellerName: "Seller G1",
                quantity: 700,
                price: 52.0,
                deliveryTimeline: "3 weeks",
                confirmDelivery: true,
                shareInStock: false,
                preShareTransfer: false,
            },
            {
                sellerName: "Seller G2",
                quantity: 800,
                price: 53.0,
                deliveryTimeline: "3 weeks",
                confirmDelivery: false,
                shareInStock: false,
                preShareTransfer: false,
            },
        ],
    },
    {
        id: "4",
        shareName: "Delta Ventures",
        quantityAvailable: 600,
        price: 27.75,
        sellers: [
            {
                sellerName: "Seller D1",
                quantity: 300,
                price: 27.75,
                deliveryTimeline: "5 days",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: false,
            },
            {
                sellerName: "Seller D2",
                quantity: 300,
                price: 28.0,
                deliveryTimeline: "5 days",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: false,
            },
        ],
    },
    {
        id: "5",
        shareName: "Epsilon Partners",
        quantityAvailable: 2000,
        price: 61.4,
        sellers: [
            {
                sellerName: "Seller E1",
                quantity: 1000,
                price: 61.4,
                deliveryTimeline: "1 month",
                confirmDelivery: true,
                shareInStock: true,
                preShareTransfer: true,
            },
            {
                sellerName: "Seller E2",
                quantity: 1000,
                price: 62.0,
                deliveryTimeline: "1 month",
                confirmDelivery: false,
                shareInStock: true,
                preShareTransfer: true,
            },
        ],
    },
];


export default function SharePage({ id }: SharePageProps) {
    const [share, setShare] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        const foundShare = dummyShares.find((s) => s.id === id);
        setShare(foundShare);
        setLoading(false);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!share) return <div>Share not found!</div>;

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
                            <span className="text-lg font-semibold">{share.quantityAvailable}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Price</span>
                            <span className="text-lg font-semibold">${share.price}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Delivery Timeline</span>
                            <span className="text-lg font-semibold">{share.sellers[0]?.deliveryTimeline}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Confirm Delivery</span>
                            <span className="text-lg font-semibold">
                                {share.confirmDelivery ? "Yes" : "No"}
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
                <div className="w-[20vw] h-[250px] flex justify-center items-center">
                    bids
                </div>

            </div>


            {/* Sellers Table */}
            <div className="border rounded-md flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
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
                                    <TableCell>{seller.deliveryTimeline ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{seller.confirmDelivery ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{seller.preShareTransfer ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="default">
                                                Buy
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
