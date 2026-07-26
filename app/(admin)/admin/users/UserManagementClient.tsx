"use client";

import { useActionState } from "react";
import { Power, PowerOff, UserPlus } from "lucide-react";
import { createManagedUser, setUserActive } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type RoleOption = {
  id: string;
  label: string;
};

const initialState = { ok: false, message: "" };

export function UserManagementClient({ users, roles }: { users: UserRow[]; roles: RoleOption[] }) {
  const [state, formAction, pending] = useActionState(createManagedUser, initialState);

  return (
    <div className="grid gap-6">
      <form action={formAction} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="roleId">Role</Label>
          <Select name="roleId" required>
            <SelectTrigger id="roleId">
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={state.ok ? "text-sm text-emerald-800" : "text-sm text-stone-600"}>{state.message || "Create officers and administrators directly."}</p>
          <Button type="submit" disabled={pending}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {pending ? "Creating" : "Create user"}
          </Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Toggle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium text-stone-950">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "success" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <form action={setUserActive}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="isActive" value={String(!user.isActive)} />
                  <Button type="submit" size="sm" variant="outline">
                    {user.isActive ? <PowerOff className="h-4 w-4" aria-hidden="true" /> : <Power className="h-4 w-4" aria-hidden="true" />}
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
