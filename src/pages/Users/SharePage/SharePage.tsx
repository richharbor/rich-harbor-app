"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShareStore } from "@/store/useShareStore";
import { useSearchParams } from "next/navigation";
import { getSellsByShareId } from "@/services/sell/sellService";
import Loading from "@/app/loading";

interface SharePageProps {
  id: string;
  owner?: boolean;
}

export interface Seller {
  sellerId: string;
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
  stockId: number; // 1-5
  userId: string; // example: "user1", "user2"
  amount: number; // bid price
  quantity: number; // number of shares
  count: number; // number of bids by this user for this stock
}
export default function SharePage({ id, owner }: SharePageProps) {
  const [share, setShare] = useState<any>(null);
  const { dummyBids } = useShareStore() as { dummyBids: Bid[] };
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<Bid[] | []>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      setUserId(parsed?.state?.user?.id ?? null);
      setUserName(
        `${parsed?.state?.user?.firstName ?? ""} ${parsed?.state?.user?.lastName ?? ""}`.trim()
      );
    }
  }, []);

  useEffect(() => {
    const fetchSells = async () => {
      try {
        const data = await getSellsByShareId(id);

        // map API fields to your Seller interface
        const sellers = data.map((s: any) => ({
          sellerId: s.userId,
          quantity: s.quantityAvailable.toString(),
          price: s.price,
          deliveryTimeline: s.deliveryTimeline,
          confirmDelivery: s.confirmDelivery,
          shareInStock: s.shareInStock,
          preShareTransfer: s.preShareTransfer,
          moq: s.minimumOrderQuatity?.toString() || "-",
          fixed: s.fixedPrice,
        }));

        setShare({ shareName: data[0]?.share.name || "", sellers });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSells();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }
  if (!share) return <div className="h-[calc(100vh-4.7rem)] flex flex-col relative justify-center items-center overflow-hidden rounded-md">No shares found.</div>;

  // Get all prices as numbers
  let prices = share.sellers.map((seller: Seller) => parseFloat(seller.price));

  // Find min and max
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  const quantity = share.sellers.map((seller: Seller) =>
    parseInt(seller.quantity)
  );

  const minQuantity = Math.min(...quantity);
  const maxQuantity = Math.max(...quantity);

  return (
    <div className=" h-[calc(100vh-4.7rem)] flex flex-col overflow-hidden p-6 space-y-6">
      {/* Share Details */}
      <div className="border flex gap-5 rounded-xl shadow-xs p-6 bg-card">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              {share.shareName}
            </h2>
            {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${share.shareInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                            {share.shareInStock ? "In Stock" : "Out of Stock"}
                        </span> */}
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Available Quantity
              </span>
              <span className="text-lg font-semibold">
                {minQuantity} - {maxQuantity}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Price</span>
              <span className="text-lg font-semibold">
                ₹{minPrice} - ₹{maxPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Delivery Timeline
              </span>
              <span className="text-lg font-semibold">
                {share.sellers[0]?.deliveryTimeline}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Confirm Delivery
              </span>
              <span className="text-lg font-semibold">
                {share.sellers[0]?.confirmDelivery ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Pre-Share Transfer
              </span>
              <span className="text-lg font-semibold">
                {share.preShareTransfer ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
        {!owner && (
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
                  {bids?.map((bid: Bid, index: any) => (
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
        )}
      </div>

      {/* Sellers Table */}
      {!owner && (
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
                    <TableCell>{userId != null ? userName  : seller.sellerId}</TableCell>
                    <TableCell>{seller.quantity}</TableCell>
                    <TableCell>{seller.price}</TableCell>
                    <TableCell>
                      {seller.fixed ? "Fixed" : "Negotiable"}
                    </TableCell>
                    <TableCell>{seller.moq}</TableCell>
                    <TableCell>
                      {seller.deliveryTimeline ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      {seller.confirmDelivery ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      {seller.preShareTransfer ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button disabled={userId != null} size="sm" variant="default">
                          Book
                        </Button>
                        <Button disabled={userId != null} size="sm" variant="outline">
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
      )}

      {/* bids tabel for the owner */}

      {owner && <h1 className="text-3xl mb-3">Bids</h1>}
      {owner && (
        <div className=" rounded-md flex-1 min-h-0">
          <ScrollArea className="h-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids?.map((bid: Bid, index: any) => (
                  <TableRow key={index}>
                    <TableCell>{bid.userId}</TableCell>
                    <TableCell>{bid.quantity}</TableCell>
                    <TableCell>{bid.amount}</TableCell>
                    <TableCell>{bid.count}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          Accept
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
