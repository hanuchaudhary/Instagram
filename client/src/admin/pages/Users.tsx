import React, { useEffect, useState } from "react";
import AdminLayout from "@/admin/components/layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useAdminStore from "@/store/adminStore/useAdminStore";

const UserManagement: React.FC = () => {
  const {
    users,
    fetchUsers,
    updateUserStatus,
    updateUserVerification,
    resetPassword,
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <Switch
                  checked={user.status === "active"}
                  onCheckedChange={(checked) =>
                    updateUserStatus(user.id, checked ? "active" : "banned")
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={user.isVerifiedAccount}
                  onCheckedChange={(checked) => {
                    console.log(checked);
                    updateUserVerification(user.id, checked);
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => resetPassword(user.email)}
                  variant="outline"
                  size="sm"
                >
                  Reset Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
};

export default UserManagement;
