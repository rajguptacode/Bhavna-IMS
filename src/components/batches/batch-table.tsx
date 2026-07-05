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
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { BATCH_STATUS_COLORS, BATCH_STATUS_LABELS } from "@/lib/constants"

interface Batch {
  id: string
  batchCode: string
  batchName: string
  courseId: string
  trainerId: string | null
  startDate: Date
  endDate: Date | null
  capacity: number
  classroom: string | null
  status: string
  course: {
    name: string
  }
  trainer: {
    fullName: string
  } | null
  _count: {
    enrollments: number
  }
}

interface BatchTableProps {
  data: Batch[]
  onEdit: (batch: Batch) => void
  onDelete: (id: string) => void
}

export function BatchTable({ data, onEdit, onDelete }: BatchTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter(
    (batch) =>
      batch.batchName.toLowerCase().includes(search.toLowerCase()) ||
      batch.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      batch.course.name.toLowerCase().includes(search.toLowerCase())
  )

  const columns: ColumnDef<Batch>[] = [
    {
      accessorKey: "batchCode",
      header: "Code",
    },
    {
      accessorKey: "batchName",
      header: "Batch Name",
    },
    {
      accessorKey: "course.name",
      header: "Course",
    },
    {
      accessorKey: "trainer.fullName",
      header: "Trainer",
      cell: ({ row }) => {
        return <span>{row.original.trainer?.fullName || "Not assigned"}</span>
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        return new Date(row.original.startDate).toLocaleDateString()
      },
    },
    {
      accessorKey: "_count.enrollments",
      header: "Students",
      cell: ({ row }) => {
        const batch = row.original
        return (
          <span>
            {batch._count.enrollments}/{batch.capacity}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof BATCH_STATUS_COLORS
        return (
          <Badge className={BATCH_STATUS_COLORS[status] || ""}>
            {BATCH_STATUS_LABELS[status] || status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const batch = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(batch)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(batch.id)}>
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
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
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
                  No batches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
