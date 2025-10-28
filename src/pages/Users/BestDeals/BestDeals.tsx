"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronRight, Plus } from "lucide-react";

import { getAllSellShares } from "@/services/sell/sellService";
import Loading from "@/app/loading";
import { getTieredPath } from "@/helpers/getTieredPath";
import { Button } from "@/components/ui/button";

interface ShareItem {
  id: number;
  shareName: string;
  quantityAvailable: string;
  price: string;
  deliveryTimeline: string;
  confirmDelivery: boolean;
  shareInStock: boolean;
  preShareTransfer: boolean;
  fixed: boolean;
  moq: string;
  shareId: number;
}

export interface ShareInfo {
  id: number;
  name: string;
  symbol: string | null;
  price: string;
}

export interface SellerInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SellItem {
  id: number;
  userId: number;
  shareId: number;
  price: string;
  quantityAvailable: number;
  minimumOrderQuatity: number | null;
  shareInStock: boolean;
  preShareTransfer: boolean;
  fixedPrice: boolean;
  confirmDelivery: boolean;
  deliveryTimeline: string;
  endSellerLocation: string;
  endSellerName: string;
  endSellerProfile: string;
  createdAt: string;
  updatedAt: string;
  share: ShareInfo;
  seller: SellerInfo;
  specialDeal: boolean;
}

const dummyBestDeals: SellItem[] = [
  {
    id: 10,
    userId: 11,
    shareId: 10,
    price: "120.000",
    quantityAvailable: 5000,
    minimumOrderQuatity: 100,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: true,
    confirmDelivery: true,
    deliveryTimeline: "t+1",
    endSellerLocation: "Mumbai",
    endSellerName: "Vikram Singh",
    endSellerProfile: "",
    createdAt: "2025-10-27T09:00:00.000Z",
    updatedAt: "2025-10-27T09:00:00.000Z",
    share: {
      id: 10,
      name: "Tata Technologies",
      symbol: "TATA",
      price: "0.00",
    },
    seller: {
      id: 11,
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram@tata.com",
    },
    specialDeal: true,
  },
  {
    id: 11,
    userId: 12,
    shareId: 11,
    price: "85.000",
    quantityAvailable: 3000,
    minimumOrderQuatity: 50,
    shareInStock: true,
    preShareTransfer: true,
    fixedPrice: false,
    confirmDelivery: true,
    deliveryTimeline: "t+3",
    endSellerLocation: "Delhi",
    endSellerName: "Riya Kapoor",
    endSellerProfile: "",
    createdAt: "2025-10-27T09:10:00.000Z",
    updatedAt: "2025-10-27T09:10:00.000Z",
    share: {
      id: 11,
      name: "Zomato",
      symbol: "ZOMATO",
      price: "0.00",
    },
    seller: {
      id: 12,
      firstName: "Riya",
      lastName: "Kapoor",
      email: "riya@zomato.com",
    },
    specialDeal: true,
  },
  {
    id: 12,
    userId: 13,
    shareId: 12,
    price: "63.500",
    quantityAvailable: 2500,
    minimumOrderQuatity: 75,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t+2",
    endSellerLocation: "Bangalore",
    endSellerName: "Ankit Verma",
    endSellerProfile: "",
    createdAt: "2025-10-27T09:20:00.000Z",
    updatedAt: "2025-10-27T09:20:00.000Z",
    share: {
      id: 12,
      name: "Ola Cabs",
      symbol: "OLA",
      price: "0.00",
    },
    seller: {
      id: 13,
      firstName: "Ankit",
      lastName: "Verma",
      email: "ankit@ola.com",
    },
    specialDeal: true,
  },
  {
    id: 13,
    userId: 14,
    shareId: 13,
    price: "150.000",
    quantityAvailable: 800,
    minimumOrderQuatity: 25,
    shareInStock: true,
    preShareTransfer: true,
    fixedPrice: true,
    confirmDelivery: true,
    deliveryTimeline: "t+1",
    endSellerLocation: "Hyderabad",
    endSellerName: "Neha Joshi",
    endSellerProfile: "",
    createdAt: "2025-10-27T09:30:00.000Z",
    updatedAt: "2025-10-27T09:30:00.000Z",
    share: {
      id: 13,
      name: "Swiggy",
      symbol: "SWIGGY",
      price: "0.00",
    },
    seller: {
      id: 14,
      firstName: "Neha",
      lastName: "Joshi",
      email: "neha@swiggy.com",
    },
    specialDeal: true,
  },
];


export default function BestDeals() {
  const [shares, setShares] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentRole = Cookies.get("currentRole");
  const route = useRouter();

  // useEffect(() => {
  //   const fetchShares = async () => {
  //     try {
  //       const response = await getAllSellShares();
  //       if (response.success && response.data.length) {
  //         // Map API SellItem[] directly to ShareItem[]
  //         const mappedShares: ShareItem[] = response.data.map((sell: any) => ({
  //           id: sell.id,
  //           shareId: sell.share.id,
  //           shareName: sell.share.name,
  //           quantityAvailable: String(sell.quantityAvailable),
  //           price: sell.price,
  //           deliveryTimeline: sell.deliveryTimeline,
  //           confirmDelivery: sell.confirmDelivery,
  //           shareInStock: sell.shareInStock,
  //           preShareTransfer: sell.preShareTransfer,
  //           fixed: sell.fixedPrice,
  //           moq: String(sell.minimumOrderQuatity),
  //         }));
  //         // ✅ Remove duplicates by shareName
  //         const uniqueShares = Array.from(
  //           new Map(mappedShares.map((item) => [item.shareName, item])).values()
  //         );
  //         setShares(uniqueShares);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch shares:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchShares();
  // }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }

  // if (!shares.length) {
  //   return (
  //     <div className="h-[calc(100vh-4.7rem)] flex flex-col relative justify-center items-center overflow-hidden rounded-md">
  //       No shares found.
  //     </div>
  //   );
  // }

  return (
    <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden space-y-6">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Best Deals</h2>
          <p className="text-muted-foreground">
            Explore best deal shares available for purchase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const base = getTieredPath();
              route.push(`/${base}/best-deals/add`);
            }}>
            <Plus className="h-4 w-4 mr-2" /> Add Best Deal
          </Button>
        </div>

      </div>

      {/* Search */}
      <div className="relative ml-6 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search Shares..." className="pl-10" />
      </div>

      {/* Table / Cards */}
      <div className="flex-1 min-h-0 border-t">
        <ScrollArea className="h-full">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
            {dummyBestDeals.map((share, index) => (
              <Card
                key={index}
                onClick={() => {
                  const base = getTieredPath();
                  route.push(`/${base}/share/${share.shareId}`);
                }}
                className="group relative cursor-pointer border border-border/50 bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl p-4">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {share.share.name}
                  </CardTitle>
                  {/* <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1" /> */}
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
                    <strong>Deal Type:</strong>{" "}
                    {share.fixedPrice ? "Fixed" : "Negotiable"}
                  </p>
                </div>
                {/* Optional Badge for stock status */}
                {share.specialDeal && (
                  <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Best Deal
                  </span>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
