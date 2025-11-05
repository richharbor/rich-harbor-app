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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set } from "zod";
import { bookShare } from "@/services/purchase/bookingService";
import { toast } from "sonner";
import { BidShare } from "@/services/purchase/bidsService";

interface SharePageProps {
  id: string;
}

export interface Seller {
  sellId: string;
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

interface BidData {
  sellId: number;
  quantity: string;
  bidPrice: string;
}
interface BookingData {
  sellId: number;
  quantity: string;
}

export default function SharePage({ id }: SharePageProps) {
  const [share, setShare] = useState<any>(null);
  const { dummyBids } = useShareStore() as { dummyBids: Bid[] };
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<Bid[] | []>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedSell, setSelectedSell] = useState<Seller | null>(null)
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [bidData, setBidData] = useState<BidData>({
    sellId: 0,
    quantity: "",
    bidPrice: "",
  });
  const [bookingData, setBookingData] = useState<BookingData>({
    sellId: 0,
    quantity: "",
  });

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

  // useEffect(() => {
  //   console.log("userId changed:", userId);
  // }, [userId])

  useEffect(() => {
    const fetchSells = async () => {
      try {
        const data = await getSellsByShareId(id);

        setIsBestDeal(
          data.some((item: any) => item.bestDeal === true && item.approved === true)
        );

        // map API fields to your Seller interface
        const sellers = data.map((s: any) => ({
          sellId: s.id,
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


  const handleBook = (sellId: string) => {

    setSelectedSell(share.sellers.find((s: Seller) => s.sellId === sellId) || null);

    setBookingData({
      ...bookingData,
      sellId: parseInt(sellId),
    });
    setIsBookingOpen(true);
  }


  const handleBookingSubmit = async () => {
    setIsSending(true);
    try {
      // Map frontend form fields to backend API field names

      const payload = {
        sellId: bookingData.sellId,
        quantity: parseInt(bookingData.quantity),
      };


      const result = await bookShare(payload);

      if (result.success) {
        // Redirect to selling page after successful creation
        toast.success("Share is booked successfully");
        setBookingData({
          sellId: 0,
          quantity: "",
        })
        setIsBookingOpen(false);

      }
    } catch (error: any) {
      console.error("Failed to book share:", error);
      toast.error("Failed to book share. Please try again.");
    } finally {
      setIsSending(false);
    }

  }

  const handleBid = (sellId: string) => {
    setSelectedSell(share.sellers.find((s: Seller) => s.sellId === sellId) || null);
    setBidData({
      ...bidData,
      sellId: parseInt(sellId),
    });
    setIsBidOpen(true);
  }

  const handleBidSubmit = async () => {
    setIsSending(true);
    try {
      // Map frontend form fields to backend API field names
      const payload = {
        sellId: bidData.sellId,
        quantity: parseInt(bidData.quantity),
        bidPrice: parseFloat(bidData.bidPrice),
      };


      const result = await BidShare(payload);

      if (result.success) {
        // Redirect to selling page after successful creation
        toast.success("Bid raised successfully");
        setBidData({
          sellId: 0,
          quantity: "",
          bidPrice: "",
        })
        setIsBidOpen(false);

      }
    } catch (error: any) {
      console.error("Failed to bid share:", error);
      toast.error("Failed to bid share. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

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
            <span className={`${!isBestDeal && 'hidden'} px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}
            >
              {isBestDeal && "Available on Best Deals" }
            </span>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Available Quantity
              </span>
              <span className="text-lg font-semibold">
                {minQuantity !== maxQuantity ? minQuantity + " - " + maxQuantity : maxQuantity}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Price</span>
              <span className="text-lg font-semibold">
                {minPrice !== maxPrice ? "₹" + minPrice + " - ₹" + maxPrice : maxPrice}
              </span>
            </div>
            {/* <div className="flex flex-col">
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
            </div> */}
          </div>
        </div>

        {/* bids table */}
        <div className="w-[20vw] border rounded-md flex-col h-[250px] flex">
          <h1 className="text-xl p-3 border-b">Bids</h1>
          <ScrollArea className="h-full">
            <Table className="min-w-full h-full">
              <TableHeader>
                <TableRow>

                  <TableHead>Quantity</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids?.map((bid: Bid, index: any) => (
                  <TableRow key={index}>

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
                <TableRow key={index} className={`${(userId != null && userId === seller.sellerId) && 'hidden'}`}>
                  <TableCell>{seller.sellerId}</TableCell>
                  <TableCell>{seller.quantity}</TableCell>
                  <TableCell>{seller.price}</TableCell>
                  <TableCell>
                    {seller.fixed ? "Fixed" : "Negotiable"}
                  </TableCell>
                  <TableCell>{seller.moq}</TableCell>
                  <TableCell>
                    {seller.deliveryTimeline}
                  </TableCell>
                  <TableCell>
                    {seller.confirmDelivery ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {seller.preShareTransfer ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => handleBook(seller.sellId)} size="sm" variant="default">
                        Book
                      </Button>
                      <Button onClick={() => handleBid(seller.sellId)} size="sm" variant="outline">
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


      {/* Bid dialog */}
      <Dialog open={isBidOpen} onOpenChange={setIsBidOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Raise a Bid</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter your bid amount below. <br />
              <span className={`${(bidData.quantity !== "" && selectedSell !== null && Number(bidData.quantity) < Number(selectedSell.moq)) && 'text-red-500'}  ${(bidData.bidPrice !== "" && selectedSell !== null && Number(bidData.bidPrice) < Number(selectedSell.price) - 2) && 'text-red-500'}`}>The quantity must be greater then MOQ and bid price must be greater then price - 3</span>
            </p>
          </DialogHeader>
          <div className=" grid gap-4 space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="number">Bidding Price</Label>
              <Input
                id="price"
                placeholder="Enter Price"
                value={bidData.bidPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setBidData({ ...bidData, bidPrice: value });
                }}
                disabled={isSending}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="number">Quantity</Label>
              <Input
                id="quantity"
                placeholder="Enter Quantity"
                value={bidData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setBidData({ ...bidData, quantity: value });
                }}
                disabled={isSending}
              />
            </div>

          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBidOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button onClick={handleBidSubmit} disabled={isSending || bidData.bidPrice === "" || bidData.quantity === "" || (selectedSell != null && !isNaN(Number(selectedSell.moq))
              ? Number(bidData.quantity) < Number(selectedSell.moq)
              : false)
              || (selectedSell != null && !isNaN(Number(selectedSell.price))
                ? Number(bidData.bidPrice) < (Number(selectedSell.price) - 2)
                : false)
            }>
              {isSending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Booking dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book the Share</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter your booking quantity below to book this share. <br />
              <span className={`${(bookingData.quantity !== "" && selectedSell !== null && Number(bookingData.quantity) < Number(selectedSell.moq)) && 'text-red-500'}`}>The quantity must be greater then MOQ</span>
            </p>
          </DialogHeader>
          <div className=" grid gap-4 space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="number">Quantity</Label>
              <Input
                id="quantity"
                placeholder="Enter Quantity"
                // className={`${(selectedSell !== null && Number(bookingData.quantity) <= Number(selectedSell.moq))}`}
                value={bookingData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setBookingData({ ...bookingData, quantity: value });
                }}
                disabled={isSending}
              />
            </div>

          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              disabled={
                isSending ||
                bookingData.quantity === "" ||
                (selectedSell != null && !isNaN(Number(selectedSell.moq))
                  ? Number(bookingData.quantity) < Number(selectedSell.moq)
                  : false)
              }
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
