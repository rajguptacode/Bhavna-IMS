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
import { DURATION_TYPE_LABELS } from "@/lib/constants"

interface Course {
  id: string
  courseCode: string
  name: string
  description: string | null
  duration: number
  durationType: string
  fees: number
  isActive: boolean
  _count: {
    batches: number
    enrollments: number
  }
}

interface CourseTableProps {
  data: Course[]
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
}

export function CourseTable({ data, onEdit, onDelete }: CourseTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter(
    (course) =>
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(search.toLowerCase())
  )

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "courseCode",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const course = row.original
        return (
          <span>
            {course.duration} {DURATION_TYPE_LABELS[course.durationType as keyof typeof DURATION_TYPE_LABELS]}
          </span>
        )
      },
    },
    {
      accessorKey: "fees",
      header: "Fees",
      cell: ({ row }) => {
        return <span>₹{row.original.fees.toLocaleString()}</span>
      },
    },
    {
      accessorKey: "_count.batches",
      header: "Batches",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original._count.batches}</Badge>
      },
    },
    {
      accessorKey: "_count.enrollments",
      header: "Students",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original._count.enrollments}</Badge>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(course)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(course.id)}>
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
          placeholder="Search courses..."
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
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
