"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronRight } from "lucide-react";

import { getAllSellShares } from "@/services/sell/sellService";
import Loading from "@/app/loading";
import { getTieredPath } from "@/helpers/getTieredPath";

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
}

const dummyShares: SellItem[] = [
  {
    id: 5,
    userId: 6,
    shareId: 4,
    price: "50.000",
    quantityAvailable: 4544,
    minimumOrderQuatity: 45,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t+2",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-25T07:35:34.972Z",
    updatedAt: "2025-10-25T07:35:34.972Z",
    share: {
      id: 4,
      name: "BOAT",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 6,
      firstName: "Ah",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
  {
    id: 5,
    userId: 9,
    shareId: 2,
    price: "50.000",
    quantityAvailable: 4544,
    minimumOrderQuatity: 45,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t+2",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-25T07:35:34.972Z",
    updatedAt: "2025-10-25T07:35:34.972Z",
    share: {
      id: 4,
      name: "BOAT",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 9,
      firstName: "Vr",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
  {
    id: 4,
    userId: 2,
    shareId: 3,
    price: "23.000",
    quantityAvailable: 2332,
    minimumOrderQuatity: 232,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t+1",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-25T06:54:55.015Z",
    updatedAt: "2025-10-25T06:54:55.015Z",
    share: {
      id: 3,
      name: "Gamma Investments",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 2,
      firstName: "Prabhat",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
  {
    id: 3,
    userId: 2,
    shareId: 2,
    price: "43.000",
    quantityAvailable: 12,
    minimumOrderQuatity: 1214,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-23T06:53:20.560Z",
    updatedAt: "2025-10-23T06:53:20.560Z",
    share: {
      id: 2,
      name: "Apple",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 2,
      firstName: "Prabhat",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
  {
    id: 3,
    userId: 2,
    shareId: 4,
    price: "43.000",
    quantityAvailable: 12,
    minimumOrderQuatity: 1214,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-23T06:53:20.560Z",
    updatedAt: "2025-10-23T06:53:20.560Z",
    share: {
      id: 2,
      name: "Apple",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 2,
      firstName: "Prabhat",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
  {
    id: 1,
    userId: 2,
    shareId: 1,
    price: "45.000",
    quantityAvailable: 4545,
    minimumOrderQuatity: null,
    shareInStock: true,
    preShareTransfer: false,
    fixedPrice: false,
    confirmDelivery: false,
    deliveryTimeline: "t+1",
    endSellerLocation: "",
    endSellerName: "",
    endSellerProfile: "",
    createdAt: "2025-10-23T06:39:34.547Z",
    updatedAt: "2025-10-23T06:39:34.547Z",
    share: {
      id: 1,
      name: "Beta Holdings",
      symbol: null,
      price: "0.00",
    },
    seller: {
      id: 2,
      firstName: "Prabhat",
      lastName: "Patra",
      email: "prabhat@rhinontech.com",
    },
  },
];
interface GroupedShares {
  shareId: number;
  shareName: string;
  updatedAt: string;
  listings: SellItem[];
}

interface GroupedSharesWithStats extends GroupedShares {
  minPrice: number;
  maxPrice: number;
  minQuantity: number;
  maxQuantity: number;
}

export default function Buying() {
  const [shares, setShares] = useState<GroupedSharesWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAll, setIsAll] = useState(true);

  const currentRole = Cookies.get("currentRole");
  const route = useRouter();


  // const groupedByShareId = dummyShares.reduce((acc, item) => {
  //   const shareId = item.shareId;

  //   // if group not created yet, create it
  //   if (!acc[shareId]) {
  //     acc[shareId] = {
  //       shareId,
  //       shareName: item.share.name,
  //       updatedAt: item.updatedAt,
  //       listings: [],
  //     };
  //   }

  //   // push current item into its group
  //   acc[shareId].listings.push(item);

  //   return acc;
  // }, {} as Record<number, { shareId: number; shareName: string; updatedAt: string; listings: typeof dummyShares }>);

  // // convert object to array (optional)
  // const groupedArray = Object.values(groupedByShareId);

  // console.log(groupedArray);

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const response = await getAllSellShares();
        if (response.success && response.data.length) {
          // Map API SellItem[] directly to ShareItem[]
          // const mappedShares: ShareItem[] = response.data.map((sell: any) => ({
          //   id: sell.id,
          //   shareId: sell.share.id,
          //   shareName: sell.share.name,
          //   quantityAvailable: String(sell.quantityAvailable),
          //   price: sell.price,
          //   deliveryTimeline: sell.deliveryTimeline,
          //   confirmDelivery: sell.confirmDelivery,
          //   shareInStock: sell.shareInStock,
          //   preShareTransfer: sell.preShareTransfer,
          //   fixed: sell.fixedPrice,
          //   moq: String(sell.minimumOrderQuatity),
          // }));
          // // ✅ Remove duplicates by shareName
          // const uniqueShares = Array.from(
          //   new Map(mappedShares.map((item) => [item.shareName, item])).values()
          // );
          // setShares(uniqueShares);

          const groupedByShareId = response.data.reduce((acc: any, item: any) => {
            const shareId = item.shareId;

            // if group not created yet, create it
            if (!acc[shareId]) {
              acc[shareId] = {
                shareId,
                shareName: item.share.name,
                updatedAt: item.updatedAt,
                listings: [],
              };
            }

            // push current item into its group
            acc[shareId].listings.push(item);

            return acc;
          }, {} as Record<number, { shareId: number; shareName: string; updatedAt: string; listings: typeof dummyShares }>);

          // convert object to array (optional)
          const groupedArray = Object.values(groupedByShareId) as GroupedShares[];

          const groupedWithStats = enhanceGroupedShares(groupedArray);

          setShares(groupedWithStats);


        }
      } catch (error) {
        console.error("Failed to fetch shares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, []);

  const enhanceGroupedShares = (groups: GroupedShares[]): GroupedSharesWithStats[] =>
    groups.map((group) => {
      const prices = group.listings.map((l) => parseInt(l.price));
      const quantities = group.listings.map((l) => l.quantityAvailable);

      return {
        ...group,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        minQuantity: Math.min(...quantities),
        maxQuantity: Math.max(...quantities),
      };
    });

  if (loading) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }

  if (!shares.length) {
    return (
      <div className="h-[calc(100vh-4.7rem)] flex flex-col relative justify-center items-center overflow-hidden rounded-md">
        No shares found.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden gap-6">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Buy</h2>
          <p className="text-muted-foreground">
            Manage super admin and admin users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative ml-6 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search Shares..." className="pl-10" />
      </div>

      {/* <div className="-mb-6 flex gap-2">
        <button
          onClick={() => setIsAll(true)}
          className={`px-3 py-1 border-b font-medium transition-all duration-300 ease-in-out ${isAll
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground cursor-pointer hover:scale-105'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setIsAll(false)}
          className={`px-3 py-1 border-b font-medium transition-all duration-300 ease-in-out ${!isAll
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground cursor-pointer hover:scale-105'
            }`}
        >
          Best Deals
        </button>
      </div> */}

      {/* Table / Cards */}
      <div className="flex-1 min-h-0 border-t">
        <ScrollArea className="h-full">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
            {shares.map((share, index) => (
              <Card
                key={index}
                onClick={() => {
                  const base = getTieredPath();
                  route.push(`/${base}/buy/${share.shareId}`);
                }}
                className="group relative cursor-pointer border border-border/50 bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 rounded-2xl p-4">
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
                    {share.listings.length > 1 ? "₹"+share.minPrice +" - ₹"+share.maxPrice : share.maxPrice}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-border" />

                {/* Quantity + Deal Info */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <p>
                    <strong>Available:</strong> {share.listings.length > 1 ? share.minQuantity + " - " + share.maxQuantity : share.maxQuantity}
                  </p>
                  
                </div>

              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
