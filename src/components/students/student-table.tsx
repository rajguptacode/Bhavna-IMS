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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { STUDENT_STATUS_COLORS, STUDENT_STATUS_LABELS, GENDER_LABELS } from "@/lib/constants"

interface Student {
  id: string
  studentCode: string
  fullName: string
  fatherName: string | null
  motherName: string | null
  mobile: string
  email: string | null
  gender: string | null
  dob: Date | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  admissionDate: Date
  remarks: string | null
  status: string
  _count: {
    enrollments: number
    payments: number
  }
}

interface StudentTableProps {
  data: Student[]
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
  onView: (student: Student) => void
}

export function StudentTable({ data, onEdit, onDelete, onView }: StudentTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter(
    (student) =>
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      student.mobile.includes(search)
  )

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentCode",
      header: "Code",
    },
    {
      accessorKey: "fullName",
      header: "Name",
    },
    {
      accessorKey: "fatherName",
      header: "Father",
      cell: ({ row }) => {
        return <span>{row.original.fatherName || "-"}</span>
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.original.gender as keyof typeof GENDER_LABELS
        return <span>{GENDER_LABELS[gender] || "-"}</span>
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => {
        return <span>{row.original.city || "-"}</span>
      },
    },
    {
      accessorKey: "_count.enrollments",
      header: "Courses",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof STUDENT_STATUS_COLORS
        return (
          <Badge className={STUDENT_STATUS_COLORS[status] || ""}>
            {STUDENT_STATUS_LABELS[status] || status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(student)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(student)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(student.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate
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
          placeholder="Search students by name, code, or mobile..."
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
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
