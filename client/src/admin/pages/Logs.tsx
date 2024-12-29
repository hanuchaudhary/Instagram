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
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  status: "success" | "failure";
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch logs from API
    const fetchLogs = async () => {
      const response = await fetch("/api/admin/logs");
      const data = await response.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">System Logs</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.userId}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={log.status === "success" ? "default" : "destructive"}
                >
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
};

export default SystemLogs;
