"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, Check, X, Users } from "lucide-react";
import {
  getApplications,
  updateApplicationStatus,
} from "@/services/Role/partnerServices";
import { toast } from "sonner";

type PartnerRow = {
  id: number;
  name: string;
  email: string;
  state: string;
  role: string;
  registrationStep: number;
  status: string;
  createdAt: string;
};

export default function Partners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, [statusFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getApplications({
        status: statusFilter,
        page: 1,
        limit: 20,
      });

      // 🔑 Map backend data to table-friendly shape
      const formatted: PartnerRow[] = data.applications.map((app: any) => ({
        id: app.user.id,
        name:
          app.formData?.step2?.name ||
          `${app.user?.firstName || ""} ${app.user?.lastName || ""}`,
        email: app.user?.email,
        state: app.formData?.step2?.state || "N/A",
        role: app.requestedRole.name,
        registrationStep: app.currentStep || 0,
        status: app.status,
        createdAt: app.createdAt,
      }));

      setPartners(formatted);
    } catch (err) {
      console.error("Error fetching partners", err);
    } finally {
      setLoading(false);
    }
  };
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getStepBadge = (step: number) => (
    <Badge variant={step === 5 ? "default" : "outline"}>Step {step}/5</Badge>
  );

  const approvePartner = async (applicationId: number) => {
    try {
      await updateApplicationStatus(applicationId, "approved");
      toast.success("Partner approved!");
      // Refresh list after update
      await fetchPartners();
      // setPartners(refreshed.applications);
    } catch (error) {
      toast.error("Failed to approve partner");
    }
  };

  const rejectPartner = async (applicationId: number) => {
    try {
      await updateApplicationStatus(
        applicationId,
        "rejected",
        "Rejected by admin"
      );
      toast.success("Partner rejected!");
      // Refresh list after update
      await fetchPartners();
      // setPartners(refreshed.applications);
    } catch (error) {
      toast.error("Failed to reject partner");
    }
  };

  const totalPartners = partners.length;
  const approvedPartners = partners.filter(
    (p) => p.status === "approved"
  ).length;
  const pendingPartners = partners.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Partner Management
          </h2>
          <p className="text-muted-foreground">
            Manage partner registrations and approvals
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Partners
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPartners}</div>
            <p className="text-xs text-muted-foreground">Registered partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Partners
            </CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedPartners}
            </div>
            <p className="text-xs text-muted-foreground">Active partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <X className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingPartners}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resquesting Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.state}</TableCell>
                  <TableCell>
                    {getStepBadge(partner.registrationStep)}
                  </TableCell>
                  <TableCell>{getStatusBadge(partner.status)}</TableCell>
                  <TableCell>{partner.role}</TableCell>
                  <TableCell>
                    {new Date(partner.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {partner.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approvePartner(partner.id)}
                            className="text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectPartner(partner.id)}
                            className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No partners found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
