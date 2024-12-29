import React, { useEffect } from "react";
import AdminLayout from "@/admin/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAdminStore from "@/store/adminStore/useAdminStore";

const Dashboard: React.FC = () => {
  const { users, posts, fetchUsers, fetchPosts } = useAdminStore();

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, [fetchUsers, fetchPosts]);

  const activeUsers = users.filter((user) => user.status === "active").length;
  const bannedUsers = users.filter((user) => user.status === "banned").length;
  const activePosts = posts.filter((post) => post.status === "active").length;
  const deletedPosts = posts.filter((post) => post.status === "deleted").length;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active, {bannedUsers} banned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePosts} active, {deletedPosts} deleted
            </p>
          </CardContent>
        </Card>
        {/* Add more cards for engagement metrics */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
