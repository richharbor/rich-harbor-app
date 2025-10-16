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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, User, Shield, Trash2, Settings, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "zod/v4/locales";
// import {
//   getAllTeamMembers,
//   inviteTeamMember,
//   updateUserRole,
//   deactivateUser,
// } from "@/services/Role/teamServices";




interface Role {
  name: string;
  access: string[];
}

const availableAccess = [
  {
    id: "view_dashboard",
    label: "Access Dashboard",
    description: "View and interact with the main dashboard and its metrics",
  },
  {
    id: "place_orders",
    label: "Buying",
    description: "Create and place customer orders",
  },
  {
    id: "manage_orders",
    label: "Buying",
    description: "Manage and track all customer orders",
  },
  {
    id: "view_products",
    label: "Best Deals",
    description: "View product listings, deals, and promotions",
  },
  {
    id: "manage_products",
    label: "Products",
    description: "Add, edit, and manage product inventory",
  },
  {
    id: "manage_users",
    label: "Users",
    description: "Manage leads, contacts, and team members",
  },
  {
    id: "view_reports",
    label: "Reports",
    description: "Generate and view business and performance reports",
  },
  {
    id: "manage_franchise",
    label: "Franchises",
    description: "Add, remove, and manage franchise members",
  },
  {
    id: "manage_partners",
    label: "Partners",
    description: "Add, remove, and manage partner accounts",
  },
];

export default function Teams() {
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      //   const data = await getAllTeamMembers();
      //   setTeams(data);
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return toast.error("Enter an email");
    try {
      //   await inviteTeamMember(inviteEmail);
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      setIsInviteOpen(false);
      fetchTeams();
    } catch {
      toast.error("Failed to send invite");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      //   await deactivateUser(id);
      toast.success("User deactivated");
      fetchTeams();
    } catch {
      toast.error("Failed to deactivate user");
    }
  };

  // const filteredTeams = teams.filter(
  //   (u: any) =>
  //     u.name.toLowerCase().includes(search.toLowerCase()) ||
  //     u.email.toLowerCase().includes(search.toLowerCase())
  // );
  const filteredTeams = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Manager",
      franchiseName: "Franchise A",
      isActive: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      role: "Agent",
      franchiseName: "Franchise B",
      isActive: false,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "Supervisor",
      franchiseName: null, // will show "Global"
      isActive: true,
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.prince@example.com",
      role: "Agent",
      franchiseName: "Franchise C",
      isActive: false,
    },
    {
      id: 5,
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      role: "Manager",
      franchiseName: "Franchise A",
      isActive: true,
    },
  ];

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleAccessChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccess([...selectedAccess, permissionId]);
    } else {
      setSelectedAccess(selectedAccess.filter((id) => id !== permissionId));
    }
  };


  const handleCreateRole = async () => {
    // console.log("Before:", customRoles);
    // setSaveLoading(true);

    if (newRoleName && selectedAccess.length > 0) {
      const value = {
        name: newRoleName.toLowerCase().replace(/\s+/g, "-"),
        access: selectedAccess,
      };
      console.log(value);

      setCustomRoles((prev) => [...prev, value]);

      // try {
      //   await createRole(value);

      //   await fetchAllRoles();

      //   console.log("New Role Added:", value);
      //   toast.success(`Role "${newRoleName}" created successfully`);
      // } catch (error) {
      //   toast.error("Error in creating role");
      //   console.error("Error creating role:", error);
      // }

      // setSaveLoading(false);

      // Reset UI
      setNewRoleName("");
      setSelectedAccess([]);
      setCreateRoleModalOpen(false);
    } else {
      setNewRoleName("");
      setSelectedAccess([]);
      setCreateRoleModalOpen(false);
      toast.error(
        "Please provide a role name and select at least one permission."
      );
    }
  };

  const handleRoleDelete = async (name: string) => {
    // try {
    //   const response = await deleteRole(name);

    //   // Check if the deleted role was part of current user's roles
    //   const roleWasAssigned = currentUserRoles.includes(name);

    //   if (roleWasAssigned) {
    //     toast.info("Your assigned role was deleted. Redirecting...");
    //     router.push("/"); // redirect to home
    //     return;
    //   }
    //   await getAllUsers();
    //   // Otherwise, just delete the role
    //   toast.success(`Role "${name}" removed.`);
    //   await fetchAllRoles();
    // } catch (err) {
    //   console.error(err);
    //   toast.error(`Failed to remove role "${name}".`);
    // }
  };
  const handleToggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };
  const invitePartner = async () => {
    // if (!inviteEmail) {
    //   toast.error("Please enter an email address");
    //   return;
    // }

    // try {
    //   setIsInviting(true);

    //   await invitePartnerUsingEmail(inviteEmail);

    //   console.log(inviteEmail);
    //   toast.success(`Invitation sent to ${inviteEmail}`);
    //   setInviteEmail("");
    //   setIsInviteDialogOpen(false);
    //   // fetchPartners(); // refresh table
    // } catch (error) {
    //   console.error("Error inviting partner:", error);
    //   toast.error("Failed to send invitation");
    // } finally {
    //   setIsInviting(false);
    // }
  };

  return (
    <div className=" relative space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground">
            Manage super admin and admin users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setRolesModalOpen(true)}
            className="flex items-center gap-2"
          >
            Roles
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsInviteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Invite Team Member
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTeams.length ? (
              filteredTeams.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>
                    <Badge>{t.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.isActive ? "default" : "destructive"}>
                      {t.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No team members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      {/* Invite Partner Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite a Partner</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter the partner's email address. An invitation link will be sent
              to them.
            </p>
          </DialogHeader>
          <div className=" grid gap-4 space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Partner Email</Label>
              <Input
                id="email"
                placeholder="partner@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              // disabled={isInviting}
              />
            </div>
            <div className="relative grid gap-2">
              <Label htmlFor="roles">Roles</Label>
              <div className="relative w-full" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="flex w-full items-center justify-between border rounded-md px-3 py-2 text-sm bg-background hover:bg-muted transition-colors"
                >
                  {selectedRoles.length > 0 ? selectedRoles.join(", ") : "Select roles"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </button>

                {/* Dropdown Content */}
                {open && (
                  <div className="absolute left-0 top-full mt-2 w-full rounded-md border bg-background shadow-lg z-10 p-2 space-y-1">
                    {customRoles.length > 0 ? (
                      customRoles.map((role) => (
                        <div
                          key={role.name}
                          onClick={() => handleToggleRole(role.name)}
                          className={cn(
                            "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                            selectedRoles.includes(role.name) && "bg-muted"
                          )}
                        >
                          <div className="mr-2">
                            {selectedRoles.includes(role.name) ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <div className="h-4 w-4 border rounded-sm" />
                            )}
                          </div>
                          <span>{role.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center p-2 rounded-md text-sm text-muted-foreground">
                        No roles available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteOpen(false)}
            // disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              onClick={invitePartner}
            //  disabled={isInviting}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog
        open={createRoleModalOpen}
        onOpenChange={setCreateRoleModalOpen}
      >
        <DialogContent className="sm:max-w-5xl max-w-[90vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Create New Role
            </DialogTitle>
            <DialogDescription>
              Create a custom role with specific permissions for your team
              members.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Role name */}
            <div className="grid gap-2">
              <Label htmlFor="roleName">Role name</Label>
              <Input
                id="roleName"
                placeholder="Enter role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>

            {/* Access section */}
            <div className="grid gap-3">
              <Label>Access</Label>

              {/* ✅ Added grid layout (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableAccess.map((access) => (
                  <div
                    key={access.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={access.id}
                      checked={selectedAccess.includes(access.id)}
                      onCheckedChange={(checked) =>
                        handleAccessChange(access.id, checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={access.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {access.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {access.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={
                !newRoleName || selectedAccess.length === 0 || saveLoading
              }
            >
              {saveLoading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Roles Modal */}

      <Dialog open={rolesModalOpen} onOpenChange={setRolesModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Roles</DialogTitle>
            <DialogDescription>
              Manage roles and permissions for your team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {customRoles.map((role) => {

              return (
                <div
                  key={role.name}
                  className="flex justify-between items-center p-2 rounded-md border hover:bg-muted"
                >
                  <span>{role.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleRoleDelete(role.name)}

                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setRolesModalOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // setRolesModalOpen(false);
                setCreateRoleModalOpen(true); // open Create Role modal
              }}
            >
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
