"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AddStockForm from "./AddShare/AddShareForm";
import { useShareStore } from "@/store/useShareStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from "js-cookie";




interface ShareItem {
    id: number;
    shareName: string;
    quantityAvailable: string;
    price: string;
    deliveryTimeline: string;
    confirmDelivery: boolean;
    shareInStock: boolean;
    preShareTransfer: boolean;
    moq: string;
    fixed: boolean;
}


export default function Selling() {
    const [search, setSearch] = useState("");
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { dummyShares } = useShareStore() as { dummyShares: ShareItem[] };
    const [editShare, setEditShare] = useState<ShareItem | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [shares, setShares] = useState<ShareItem[]>(dummyShares);
    const currentRole = Cookies.get("currentRole");
    const route = useRouter();
    const [myShares, setMyShares] = useState(false);
    const [isAllShareOpen, setIsAllShareOpen] = useState(false);
    const [popupSearch, setPopupSearch] = useState("");

    const [updatedData, setUpdatedData] = useState({
        quantityAvailable: "",
        price: ""
    })

    useEffect(() => {

        setUpdatedData({
            ...updatedData, // keep the existing fields
            quantityAvailable: editShare?.quantityAvailable ?? "",
            price: editShare?.price ?? "", // convert to number safely
        });

    }, [editShare])



    const handleUpdateShare = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editShare) return;

        const updatedShares = shares.map((share) =>
            share.shareName === editShare.shareName
                ? {
                    ...share,
                    quantityAvailable: updatedData.quantityAvailable || "0",
                    price: updatedData.price || "0",
                }
                : share
        );

        setShares(updatedShares);
        setIsEditOpen(false);
    };




    return (
        <div className=" h-[calc(100vh-4.7rem)] flex flex-col relative overflow-hidden space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sell</h2>
                    <p className="text-muted-foreground">
                        Manage super admin and admin users
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* <Button
            variant="outline"
            onClick={() => setRolesModalOpen(true)}
            className="flex items-center gap-2"
          >
            Roles
            <Settings className="h-4 w-4" />
          </Button> */}
                    <Button
                        onClick={() => route.push(`/${currentRole}/selling/addShare`)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add New Share
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card 
                className={`${myShares && 'dark:bg-background bg-white cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out' }`}
                onClick={()=> setMyShares(false)}
                >
                    <CardHeader>
                        <CardTitle>Total Shares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dummyShares.length}</div>
                    </CardContent>
                </Card>
                <Card 
                className={`${!myShares && 'dark:bg-background bg-white cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out' }`}
                onClick={()=> setMyShares(true)}
                >
                    <CardHeader>
                        <CardTitle>My Shares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dummyShares.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search Shares..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}

            {myShares ? (
                <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="sticky top-0 z-10">
                                <TableRow>
                                    <TableHead>Share Name</TableHead>
                                    <TableHead>Available Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Deal Type</TableHead>
                                    <TableHead>Delivery Timeline</TableHead>
                                    <TableHead>Confirm Delivery</TableHead>
                                    <TableHead>MOQ</TableHead>

                                    <TableHead>Share in Stock</TableHead>
                                    <TableHead>Pre-Share Transfer</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : shares.length ? (
                                    shares
                                        .filter((t: any) =>
                                            t.shareName.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((t: any) => (
                                            <TableRow key={t.shareName} className="cursor-pointer"  onClick={()=> route.push(`/${currentRole}/share/${t.id}?owner=true`)}>
                                                <TableCell className="hover:underline">{t.shareName}</TableCell>
                                                <TableCell>{t.quantityAvailable}</TableCell>
                                                <TableCell>{t.price}</TableCell>
                                                <TableCell>{t.fixed ? "Fixed" : "Negotiable"}</TableCell>
                                                <TableCell>{t.deliveryTimeline}</TableCell>
                                                <TableCell>{t.confirmDelivery ? "Yes" : "No"}</TableCell>
                                                <TableCell>{t.moq}</TableCell>

                                                <TableCell>{t.shareInStock ? "Yes" : "No"}</TableCell>
                                                <TableCell>{t.preShareTransfer ? "Yes" : "No"}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditShare(t);
                                                            setIsEditOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            No shares found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            </div>
            ): (
                <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="sticky top-0 z-10">
                                <TableRow>
                                    <TableHead>Share Name</TableHead>
                                    
                                    <TableHead>Price</TableHead>
                                    
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : shares.length ? (
                                    shares
                                        .filter((t: any) =>
                                            t.shareName.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((t: any) => (
                                            <TableRow
                                            key={t.shareName}
                                            className="cursor-pointer"
                                            onClick={()=> route.push(`/${currentRole}/selling/${t.shareName.replace(/ /g, "_")}`)}
                                            >
                                                <TableCell className="p-3 hover:underline">{t.shareName}</TableCell>
                                                <TableCell>{t.price}</TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            No shares found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            </div>
            ) }

            {/* Edit Share model */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update share details</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Enter the partner's email address. An invitation link will be sent
                            to them.
                        </p>
                    </DialogHeader>
                    <form onSubmit={handleUpdateShare}>
                        <div className=" grid gap-4 space-y-4 py-4">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="text">Share Name</Label>
                                <Input
                                    id="share-name"
                                    placeholder="Enter available quantity"
                                    value={editShare?.shareName}
                                    readOnly
                                    className="cursor-not-allowed"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="numeric">Available Quantity</Label>
                                <Input
                                    id="quantity"
                                    placeholder="Enter available quantity"
                                    value={updatedData.quantityAvailable}
                                    type="number"
                                    onChange={(e) => setUpdatedData({ ...updatedData, quantityAvailable: e.target.value })}

                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="numeric">Price</Label>
                                <Input
                                    id="quantity"
                                    placeholder="Enter available quantity"
                                    value={updatedData.price}
                                    type="number"
                                    onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}

                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}

                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                            >
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Share Model */}
            {/* <Dialog open={isAllShareOpen} onOpenChange={setIsAllShareOpen}>
                <DialogContent className="max-w-[450px] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Select Shares</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Select shares from existing ones.
                        </p>
                    </DialogHeader>

                    
                    <div className="flex-1 min-h-0 flex flex-col">
                        
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search Shares..."
                                value={popupSearch}
                                onChange={(e) => setPopupSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                       
                        <ScrollArea className="min-h-0 h-[300px] overflow-y-auto rounded-md border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background">
                                    <TableRow>
                                        <TableHead>Share Name</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center">
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) : shares.length ? (
                                        shares
                                            .filter((t: any) =>
                                                t.shareName.toLowerCase().includes(popupSearch.toLowerCase())
                                            )
                                            .map((t: any) => (
                                                <TableRow key={t.shareName}>
                                                    <TableCell>{t.shareName}</TableCell>
                                                    <TableCell>{t.price}</TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center">
                                                No shares found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAllShareOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                        onClick={() => route.push(`/${currentRole}/selling/addShare`)} 
                        >Add New Share</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}


        </div>
    );
}
