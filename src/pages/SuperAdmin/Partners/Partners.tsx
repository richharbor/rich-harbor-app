"use client";

import { useState } from "react";
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
import { Partner } from "@/types";

// Mock partners data
const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    state: "Maharashtra",
    aadharCard: "1234-5678-9012",
    panCard: "ABCDE1234F",
    email: "rajesh@example.com",
    mobile: "+91 9876543210",
    bankName: "HDFC Bank",
    accountNumber: "12345678901",
    ifscCode: "HDFC0001234",
    address: {
      country: "India",
      state: "Maharashtra",
      addressLine1: "123 Main Street",
      addressLine2: "Andheri West",
      city: "Mumbai",
      zipCode: "400058",
    },
    documents: {
      cmlCopy: "uploaded",
      panCard: "uploaded",
      cancelCheque: "uploaded",
      signature: "uploaded",
      agreement: "uploaded",
    },
    registrationStep: 5,
    status: "approved",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Priya Sharma",
    state: "Delhi",
    aadharCard: "2345-6789-0123",
    panCard: "BCDEF2345G",
    email: "priya@example.com",
    mobile: "+91 9765432109",
    bankName: "SBI",
    accountNumber: "23456789012",
    ifscCode: "SBIN0001235",
    address: {
      country: "India",
      state: "Delhi",
      addressLine1: "456 Park Avenue",
      addressLine2: "Connaught Place",
      city: "New Delhi",
      zipCode: "110001",
    },
    documents: {
      cmlCopy: "uploaded",
      panCard: "uploaded",
      cancelCheque: "uploaded",
      signature: "uploaded",
    },
    registrationStep: 4,
    status: "pending",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Amit Patel",
    state: "Gujarat",
    aadharCard: "3456-7890-1234",
    panCard: "CDEFG3456H",
    email: "amit@example.com",
    mobile: "+91 9654321098",
    bankName: "ICICI Bank",
    accountNumber: "34567890123",
    ifscCode: "ICIC0001236",
    address: {
      country: "India",
      state: "Gujarat",
      addressLine1: "789 Business District",
      addressLine2: "Satellite",
      city: "Ahmedabad",
      zipCode: "380015",
    },
    documents: {
      cmlCopy: "uploaded",
      panCard: "uploaded",
    },
    registrationStep: 3,
    status: "pending",
    createdAt: "2024-01-14",
  },
];

export default function Partners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partners] = useState<Partner[]>(mockPartners);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || partner.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const getStepBadge = (step: number) => {
    const isComplete = step === 5;
    return (
      <Badge variant={isComplete ? "default" : "outline"}>Step {step}/5</Badge>
    );
  };

  const approvePartner = (partnerId: string) => {
    console.log("Approving partner:", partnerId);
  };

  const rejectPartner = (partnerId: string) => {
    console.log("Rejecting partner:", partnerId);
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>{partner.email}</TableCell>
                <TableCell>{partner.state}</TableCell>
                <TableCell>{getStepBadge(partner.registrationStep)}</TableCell>
                <TableCell>{getStatusBadge(partner.status)}</TableCell>
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
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectPartner(partner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
