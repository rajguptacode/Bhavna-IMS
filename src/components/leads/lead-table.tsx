"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, MessageSquare, ArrowRight } from "lucide-react"
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/lib/constants"

interface Lead {
  id: string
  leadCode: string
  fullName: string
  mobile: string
  email: string | null
  source: string
  status: string
  remarks: string | null
  createdAt: Date
  _count: { activities: number }
  activities: { nextFollowUp: Date | null }[]
}

interface LeadTableProps {
  data: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onLogActivity: (lead: Lead) => void
  onStatusChange: (id: string, status: string) => void
}

export function LeadTable({ data, onEdit, onDelete, onLogActivity, onStatusChange }: LeadTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredData = data.filter(
    (lead) =>
      (lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
        lead.leadCode.toLowerCase().includes(search.toLowerCase()) ||
        lead.mobile.includes(search)) &&
      (statusFilter === "ALL" || lead.status === statusFilter)
  )

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "leadCode",
      header: "Code",
    },
    {
      accessorKey: "fullName",
      header: "Name",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const source = row.original.source as keyof typeof LEAD_SOURCE_LABELS
        return <span>{LEAD_SOURCE_LABELS[source] || source}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof LEAD_STATUS_COLORS
        return (
          <Badge className={LEAD_STATUS_COLORS[status] || ""}>
            {LEAD_STATUS_LABELS[status] || status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "_count.activities",
      header: "Activities",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lead = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLogActivity(lead)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Log Activity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(lead)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {lead.status !== "CONVERTED" && lead.status !== "LOST" && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange(lead.id, "CONVERTED")}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Mark Converted
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(lead.id, "LOST")}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Mark Lost
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onDelete(lead.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
