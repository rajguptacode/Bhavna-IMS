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
import { STAFF_DESIGNATION_LABELS, STAFF_DESIGNATION_COLORS } from "@/lib/constants"

interface Staff {
  id: string
  employeeCode: string
  fullName: string
  designation: string
  mobile: string
  email: string | null
  joiningDate: Date
  salary: number | null
  status: string
}

interface StaffTableProps {
  data: Staff[]
  onEdit: (staff: Staff) => void
  onDelete: (id: string) => void
}

export function StaffTable({ data, onEdit, onDelete }: StaffTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter(
    (staff) =>
      staff.fullName.toLowerCase().includes(search.toLowerCase()) ||
      staff.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      staff.mobile.includes(search)
  )

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "employeeCode",
      header: "Code",
    },
    {
      accessorKey: "fullName",
      header: "Name",
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => {
        const designation = row.original.designation as keyof typeof STAFF_DESIGNATION_LABELS
        return (
          <Badge className={STAFF_DESIGNATION_COLORS[designation] || ""}>
            {STAFF_DESIGNATION_LABELS[designation] || designation}
          </Badge>
        )
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <span>{row.original.email || "-"}</span>
      },
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => {
        return row.original.salary ? `₹${row.original.salary.toLocaleString()}` : "-"
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const staff = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(staff)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(staff.id)}>
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
          placeholder="Search staff..."
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
                  No staff found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
