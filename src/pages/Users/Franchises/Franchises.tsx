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
import { Search, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import {
//   getFranchiseMembers,
//   inviteFranchiseUser,
// } from "@/services/Franchise/franchiseService";

export default function Franchises() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    franchiseName: "",
    name:"",
    inviteEmail: ""
  })

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // const data = await getFranchiseMembers();
      // setUsers(data);
    } catch (err) {
      toast.error("Failed to load franchise users");
    } finally {
      setLoading(false);
    }
  };

  // const filtered = users.filter(
  //   (u: any) =>
  //     u.name.toLowerCase().includes(search.toLowerCase()) ||
  //     u.email.toLowerCase().includes(search.toLowerCase())
  // );
  const filtered = [
    {
      id: 1,
      franchiseName:"Franchise 1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Manager",
      onboarding: {
        currentStep: 3,
        status: "approved",
      },
    },
    {
      id: 2,
      name: "Bob Smith",
      franchiseName:"Franchise 1",
      email: "bob.smith@example.com",
      role: "Agent",
      onboarding: {
        currentStep: 2,
        status: "pending",
      },
    },
    {
      id: 3,
      name: "Charlie Brown",
      franchiseName:"Franchise 2",
      email: "charlie.brown@example.com",
      role: "Supervisor",
      onboarding: {
        currentStep: 1,
        status: "rejected",
      },
    },
    {
      id: 4,
      name: "Diana Prince",
      franchiseName:"Franchise 1",
      email: "diana.prince@example.com",
      role: "Agent",
      onboarding: {
        currentStep: 4,
        status: "approved",
      },
    },
    {
      id: 5,
      name: "Ethan Hunt",
      franchiseName:"Franchise 2",
      email: "ethan.hunt@example.com",
      role: "Manager",
      onboarding: {
        currentStep: 5,
        status: "pending",
      },
    },
  ];



  const inviteFranchises = () => {

    console.log(formData);
    setIsInviteDialogOpen(false);

  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Franchise Members
          </h2>
          <p className="text-muted-foreground">
            Manage your franchise team and onboarding users
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Invite User
        </Button>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Franchise Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.franchiseName}</TableCell>
                  <TableCell>{u.email}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        u.onboarding?.status === "approved"
                          ? "default"
                          : u.onboarding?.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }>
                      {u.onboarding?.status || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invite Franchises Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a Partner</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter the partner's email address. An invitation link will be sent
              to them.
            </p>
          </DialogHeader>
          <div className=" grid gap-4 space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="text">Franchise Name</Label>
              <Input
                id="text"
                placeholder="Enter Franchise Name"
                value={formData.franchiseName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    franchiseName: e.target.value,
                  }))
                }
              // disabled={isInviting}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="text">Full Name</Label>
              <Input
                id="text"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              // disabled={isInviting}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Partner Email</Label>
              <Input
                id="email"
                placeholder="partner@example.com"
                value={formData.inviteEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    inviteEmail: e.target.value,
                  }))
                }
              // disabled={isInviting}
              />
            </div>

          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            // disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              onClick={inviteFranchises}
            //  disabled={isInviting}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
