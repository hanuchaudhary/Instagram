import React, { useEffect, useState } from 'react'
import AdminLayout from '@/admin/components/layout/AdminLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useAdminStore from '@/store/adminStore/useAdminStore'

const ContentModeration: React.FC = () => {
  const { reports, fetchReports, resolveReport, deletePost } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const filteredReports = reports.filter(
    (report) =>
      report.reporterId.includes(searchTerm) ||
      report.targetId.includes(searchTerm)
  )

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reporter</TableHead>
            <TableHead>Target Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.reporterId}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.reason}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mr-2"
                  onClick={() => deletePost(report.targetId)}
                >
                  Delete Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveReport(report.id)}
                >
                  Mark as Resolved
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  )
}

export default ContentModeration

