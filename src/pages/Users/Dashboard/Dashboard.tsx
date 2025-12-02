"use client"

import MetricCard from "./MetrixCard/MetrixCard"
import AnalyticChart from "./AnalyticChart/AnalyticChart"
import SessionChart from "./SessionCard/SessionCard"
import TransactionTable from "./TransactionTable/TransactionTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDown, ArrowLeftRight, ArrowUp, BarChart3, Divide, Package, Share2, ShoppingCart, Star, ThumbsDown, ThumbsUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardInfo } from "@/services/Dashboard/dashboardService"
import Loading from "@/app/loading"
import useAuthStore from "@/helpers/authStore"
import { fetchAllFranshisesForAdmin, getPartnerDetailsbyId } from "@/services/Role/partnerServices"
import { closeBuyQuery, discardBuyQuery, getAllBuyQueries } from "@/services/purchase/bookingService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import ApplicationDialog from "../Bookings/ApplicationDialog"
import { cn } from "@/lib/utils"
import QueryDetails from "./QueryDetails/QueryDetails"





export interface DashboardResponse {
  shareCount: number;
  sellCount: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  closedBy: number;
  franchiseId: number;
  sellerId: number;
  buyerId: number;
  shareName: string;
  quantity: number;
  price: string;        // If you want number, tell me & I'll convert it.
  createdAt: string;    // Or Date if you prefer
  updatedAt: string;    // Or Date if you prefer
}

interface CloseDealProp {
  id: number;
  buyerId: number;
  dealQuantity: string;
  price: string;
  shareName: string;
  goodBuyer: string;

}

interface BuyQueryProp {
  id: number;
  userId: number;
  franchiseId: number;
  shareName: string;
  quantity: number;
  price: string; // stored as string ("25.000")
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  buyer: {
    id: number;
    firstName: string;
    lastName: string;
  };
}


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardInfo, setDashboardInfo] = useState<DashboardResponse | null>(null);
  const franchiseId = useAuthStore((state) => state.user?.franchiseId);
  const isSuperAdmin = useAuthStore((state) => state.user?.isSuperAdmin);
  const tier = useAuthStore((state) => state.user?.tier);
  const userId = useAuthStore((state) => state.user?.id);

  const [queries, setQueries] = useState<BuyQueryProp[]>([])
  const [isFetching, setIsFetching] = useState(false);

  const [franchises, setFranchises] = useState<any[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [discardId, setDiscardId] = useState<number>(0);
  const [openCloseDeal, setOpenCloseDeal] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [closeDealDetails, setCloseDealDetails] = useState<CloseDealProp>({
    id: 0,
    buyerId: 0,
    shareName: "",
    price: "",
    dealQuantity: "",
    goodBuyer: "",
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedQueryDetails, setSelectedQueryDetails] = useState<any>(null);
  const [showMore, setShowMore] = useState(false);






  useEffect(() => {
    fetchDashBoardInfo();
  }, [])

  useEffect(() => {
    if (isSuperAdmin || tier === 2) {
      fetchAllFranchises();
    } else if (tier === 3 && franchiseId) {
      setSelectedFranchiseId(franchiseId);
    }
  }, [isSuperAdmin, tier, franchiseId]);

  useEffect(() => {
    if (selectedFranchiseId && typeof tier === "number" && tier <= 3) {
      setQueries([]);
      fetchAllQueries();
    }
  }, [selectedFranchiseId, tier])


  const fetchAllQueries = async () => {
    setIsFetching(true);
    try {
      const response = await getAllBuyQueries(selectedFranchiseId!);
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching all buy queries:", error);
    } finally {
      setIsFetching(false);
    }
  }


  const fetchAllFranchises = async () => {
    try {
      const response = await fetchAllFranshisesForAdmin();
      if (response?.success) {
        setFranchises(response.franchises || []);
        const firstId = response.franchises[0]?.id || null;
        setSelectedFranchiseId(firstId);

      }
    } catch (err) {
      console.error("Error fetching franchises:", err);
    }
  };


  const fetchDashBoardInfo = async () => {
    try {
      const response = await getDashboardInfo();
      setDashboardInfo(response.data);
    } catch (error) {
      console.log("Error in fetching dashboard info", error)
    } finally {
      setLoading(false);
    }

  }


  const handleCloseDeal = async () => {
    try {
      setIsSending(true);
      const response: any = await closeBuyQuery(closeDealDetails);
      toast.success("Buy query closed Successfully");
      setQueries((prev: any) => prev.filter((b: any) => b.id !== closeDealDetails.id));
      setOpenCloseDeal(false);
    } catch (error: any) {
      console.error("Error in closing buy query");
      toast.error(error?.message);
    } finally {
      setIsSending(false);
    }
  }
  const handleDiscardBooking = async (id: string | number) => {
    try {
      setIsSending(true);
      const response: any = await discardBuyQuery(id);
      toast.success("Buy query discarded");
      setQueries((prev: any) => prev.filter((b: any) => b.id !== id));
      setDiscardId(0);
      setOpenDiscard(false);
    } catch (error: any) {
      console.error("Error in discarding buy query");
      toast.error(error?.message)
    } finally {
      setIsSending(false);
    }
  }


  const handleBuyerDetail = (userId: number) => {
    setOpen(true);
    setUserProfile("Buyer");
    fetchPartnersDetailbyId(userId);
  }
  const fetchPartnersDetailbyId = async (userId: number, fid?: number) => {
    setIsFetching(true);
    try {
      const response = await getPartnerDetailsbyId({
        userId: userId,
        franchiseId: fid || franchiseId!,
      });

      // const formatted: PartnerRow[] = data.applications.map((app: any) => ({
      //   id: app.user.id,
      //   userId: app.userId,
      //   name:
      //     app.formData?.step2?.name ||
      //     app.formData?.step1?.fullName ||
      //     `${app.user?.firstName || ""} ${app.user?.lastName || ""}`.trim(),
      //   email: app.user?.email,
      //   state: app.formData?.step2?.state || "N/A",
      //   role: app.requestedRole.name,
      //   registrationStep: app.currentStep || 0,
      //   status: app.status,
      //   createdAt: app.createdAt,
      //   application: app,
      // }));
      setUserDetails(response.applications);
      // setPartners(formatted);
    } catch (err) {
      console.error("Error fetching partners", err);
      // toast.error("Failed to fetch partners");
    } finally {
      setIsFetching(false);
    }
  };


  if (loading) {
    return (
      <div className="h-[calc(100vh-4.5rem)] flex flex-col relative overflow-hidden rounded-md">
        <Loading areaOnly={true} />
      </div>
    );
  }


  return (
    <div className="flex h-[calc(100vh-4.5rem)]  w-full overflow-hidden rounded-lg border-2 max-md:border-none">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-5 max-md:p-3">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-md:gap-3">
              <MetricCard
                title="Total Shares"
                value={String(dashboardInfo?.shareCount)}
                change="+12.95%"
                icon={BarChart3}
                bg="from-blue-500"

              />
              <MetricCard title="Total Trade" value={String(dashboardInfo?.transactions?.length)} change="-8.12%" icon={ArrowLeftRight} bg="from-emerald-500" />
              <MetricCard title="Total Sell" value={String(dashboardInfo?.sellCount)} change="-5.18%" icon={TrendingDown} bg="from-rose-500 " />
              <MetricCard title="Rating" value="NA" change="+28.45%" icon={Star} bg="from-amber-400" />

            </div>

            {/* Charts */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticChart />
              <SessionChart />
            </div> */}

            {/* Transaction Table for desktop */}
            <TransactionTable transactions={dashboardInfo?.transactions!} />

            {/* Transaction Table for mobile */}
            <div className="space-y-3 md:hidden">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className={(dashboardInfo?.transactions?.length ?? 0) > 0 ? `h-[350px] overflow-hidden transition-height duration-300 ease-in-out ${showMore && "h-fit"}` : ""}>

                <div className="grid grid-cols-1 gap-2 py-3">
                  {dashboardInfo?.transactions?.map((tx) => {
                    const isBuy = tx.buyerId === userId;
                    return (
                      <div
                        key={tx.id}
                        className="p-4 rounded-xl border bg-card shadow-sm flex flex-col gap-1"
                      >
                        {/* BUY / SELL tag */}
                        <span
                          className={cn(
                            "text-xs font-medium w-fit px-2 py-0.5 rounded-full",
                            isBuy
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {isBuy ? "Bought" : "Sold"}
                        </span>

                        {/* Share name */}
                        <div className="flex justify-between">
                          <div className="text-base font-semibold">
                            {tx.shareName}
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>

                        {/* Essential details */}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Qty: {tx.quantity}</span>
                          <span>Price: {tx.price}</span>
                        </div>

                      </div>
                    );
                  })}
                  {dashboardInfo?.transactions?.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground">
                      No transactions available.
                    </div>
                  )}
                </div>

              </div>
              {(dashboardInfo?.transactions?.length ?? 0) > 3 && (
                <div className="w-full flex justify-end">
                  <span onClick={() => setShowMore(!showMore)} className="text-sm font-medium cursor-pointer flex items-center text-primary group">{showMore ? "Show less" : "Show more"} <ArrowDown className={`h-4 w-4 duration-300 transition-transform ease-in-out ${showMore ? "rotate-180" : ""}`} /></span>
                </div>
              )}
            </div>



            {(typeof tier === 'number' && tier <= 3) && (
              <div>
                {/* query table desktop version */}
                <div className="h-96 max-md:hidden overflow-x-auto max-md:w-[calc(100vw-1.7rem)]">
                  <Card className="shadow-md h-full max-md:p-3 w-full overflow-auto">
                    <ScrollArea className="h-full">
                      <CardHeader className="flex flex-row max-md:flex-col gap-3 w-full justify-between max-md:p-0">
                        <CardTitle>Buy Queries</CardTitle>
                        {(isSuperAdmin || tier === 2) && (
                          <div className="flex items-center max-md:items-start max-md:flex-col gap-2">
                            <Label className="font-medium">Select Franchise:</Label>
                            <Select
                              value={selectedFranchiseId?.toString() || ""}
                              onValueChange={(val) => {
                                const fid = parseInt(val);
                                setSelectedFranchiseId(fid);
                              }}>
                              <SelectTrigger className="w-64">
                                <SelectValue placeholder="Select Franchise" />
                              </SelectTrigger>
                              <SelectContent>
                                {franchises.map((f) => (
                                  <SelectItem key={f.id} value={f.id.toString()}>
                                    {f.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="max-md:p-0 max-md:mt-2">
                        <div className="min-w-max">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Buyer Id</TableHead>
                                <TableHead>Share Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Buying Quantity</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {queries?.map((query: any) => (
                                <TableRow key={query.id}>
                                  <TableCell className="py-3 cursor-pointer" onClick={() => handleBuyerDetail(query.userId)}>{query.userId}</TableCell>
                                  <TableCell className="py-3">{query.shareName}</TableCell>
                                  <TableCell className="py-3">{query.price}</TableCell>
                                  <TableCell className="py-3">{query.quantity}</TableCell>
                                  <TableCell className="py-3">{new Date(query.createdAt).toLocaleDateString("en-IN")}</TableCell>
                                  <TableCell className="space-x-2">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="cursor-pointer"
                                      disabled={isSending}
                                      onClick={() => {
                                        setCloseDealDetails({ ...closeDealDetails, id: query.id, buyerId: query.userId, shareName: query.shareName })
                                        setOpenCloseDeal(true);
                                      }}
                                    >
                                      Close Deal
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="cursor-pointer"
                                      disabled={isSending}
                                      onClick={() => {
                                        setDiscardId(query.id);
                                        setOpenDiscard(true);
                                      }}
                                    >
                                      Discard
                                    </Button>
                                  </TableCell>
                                </TableRow>

                              ))}
                              {(isFetching && queries.length === 0) && (
                                <TableRow className="h-60">
                                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    <Loading areaOnly />
                                  </TableCell>
                                </TableRow>
                              )}
                              {(queries.length === 0 && !isFetching) && (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                    No query available.
                                  </TableCell>
                                </TableRow>
                              )}


                            </TableBody>
                          </Table>
                        </div>

                      </CardContent>
                    </ScrollArea>
                  </Card>

                </div>

                {/* query table mobile version */}
                <div className="space-y-3 md:hidden">
                  <h2 className="text-xl font-semibold">Queries</h2>
                  {(isSuperAdmin || tier === 2) && (
                    <div className="flex items-center max-md:items-start max-md:flex-col gap-2">
                      <Label className="font-medium">Select Franchise:</Label>
                      <Select
                        value={selectedFranchiseId?.toString() || ""}
                        onValueChange={(val) => {
                          const fid = parseInt(val);
                          setSelectedFranchiseId(fid);
                        }}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select Franchise" />
                        </SelectTrigger>
                        <SelectContent>
                          {franchises.map((f) => (
                            <SelectItem key={f.id} value={f.id.toString()}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className={(queries?.length ?? 0) > 0 ? "h-96" : ""}>
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-1 gap-2 py-3">
                        {queries?.map((tx: any) => {
                          return (
                            <div
                              key={tx.id}
                              className="p-4 rounded-xl border bg-card shadow-sm flex flex-col gap-1"
                              onClick={() => {
                                setSelectedQueryDetails(tx);
                                setIsDrawerOpen(true);
                              }}
                            >
                              {/* Share name */}
                              <div className="flex justify-between">
                                <div className="text-base font-semibold">
                                  {tx.shareName}
                                </div>
                                <span className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("en-IN")}</span>
                              </div>

                              {/* Essential details */}
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Qty: {tx.quantity}</span>
                                <span>Price: {tx.price}</span>
                              </div>

                            </div>
                          );
                        })}
                        {queries.length === 0 && !isFetching && (
                          <div className="py-20 text-center text-muted-foreground">
                            No query available.
                          </div>)
                        }
                        {isFetching && queries.length === 0 && (
                          <div className="py-20 relative text-center text-muted-foreground">
                            <Loading areaOnly />
                          </div>)
                        }
                      </div>
                    </ScrollArea>
                  </div>
                </div>

              </div>
            )}

          </div>
        </ScrollArea>
      </div>


      <ApplicationDialog userProfile={userProfile} isFetching={isFetching} open={open} onClose={setOpen} data={userDetails} />



      <QueryDetails
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        details={selectedQueryDetails}
        isSending={isSending}
        setCloseDealDetails={setCloseDealDetails}
        closeDealDetails={closeDealDetails}
        setOpenCloseDeal={setOpenCloseDeal}
        setOpenDiscard={setOpenDiscard}
        setDiscardId={setDiscardId}
        handleBuyerDetail={handleBuyerDetail}
      />


      {/* close deal dialog */}
      <Dialog open={openCloseDeal} onOpenChange={setOpenCloseDeal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close the Deal</DialogTitle>
            {/* <p className="text-sm text-muted-foreground">
                    Enter your booking quantity below to book this share. <br />
                  </p> */}
          </DialogHeader>
          <div className=" grid gap-4 space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="number">Quantity</Label>
              <Input
                id="quantity"
                placeholder="Enter Quantity"
                // className={`${(selectedSell !== null && Number(bookingData.quantity) <= Number(selectedSell.moq))}`}
                value={closeDealDetails.dealQuantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setCloseDealDetails({ ...closeDealDetails, dealQuantity: value });
                }}
                disabled={isSending}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="number">Price</Label>
              <Input
                id="price"
                placeholder="Enter Price"
                // className={`${(selectedSell !== null && Number(bookingData.quantity) <= Number(selectedSell.moq))}`}
                value={closeDealDetails.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setCloseDealDetails({ ...closeDealDetails, price: value });
                }}
                disabled={isSending}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>What you think about Buyer</Label>
              <div className="flex gap-5 mt-1">
                <ThumbsUp
                  fill={closeDealDetails.goodBuyer === 'yes' ? "white" : "none"}
                  onClick={() => setCloseDealDetails({ ...closeDealDetails, goodBuyer: "yes" })}
                  className='cursor-pointer'
                />
                <ThumbsDown
                  fill={closeDealDetails.goodBuyer === 'no' ? "white" : "none"}
                  onClick={() => setCloseDealDetails({ ...closeDealDetails, goodBuyer: "no" })}
                  className='cursor-pointer'
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCloseDeal(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseDeal}
              disabled={
                isSending ||
                closeDealDetails.dealQuantity === "" ||
                closeDealDetails.price === ""

              }
            >
              {isSending ? "Closing..." : "Close deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Discard dialog */}
      <Dialog open={openDiscard} onOpenChange={setOpenDiscard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <p className="">
              Are you sure?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDiscard(false)}
              disabled={isSending}
            >
              No
            </Button>
            <Button
              onClick={() => handleDiscardBooking(discardId)}
              disabled={
                isSending
              }
            >
              {isSending ? "Discarding..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
