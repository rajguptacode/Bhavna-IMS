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
import { PAYMENT_MODE_LABELS } from "@/lib/constants"

interface Payment {
  id: string
  amount: number
  paymentDate: Date
  paymentMode: string
  transactionReference: string | null
  remarks: string | null
  student: {
    fullName: string
    studentCode: string
    mobile: string
  }
  enrollment: {
    course: { name: string }
    batch: { batchName: string }
  }
}

interface PaymentTableProps {
  data: Payment[]
}

const PAYMENT_MODE_COLORS: Record<string, string> = {
  CASH: "bg-green-100 text-green-800",
  UPI: "bg-blue-100 text-blue-800",
  BANK_TRANSFER: "bg-purple-100 text-purple-800",
  CARD: "bg-orange-100 text-orange-800",
  CHEQUE: "bg-yellow-100 text-yellow-800",
}

export function PaymentTable({ data }: PaymentTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter(
    (payment) =>
      payment.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      payment.student.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      payment.student.mobile.includes(search)
  )

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "student.studentCode",
      header: "Student Code",
      cell: ({ row }) => row.original.student.studentCode,
    },
    {
      accessorKey: "student.fullName",
      header: "Student",
    },
    {
      accessorKey: "enrollment.course.name",
      header: "Course",
      cell: ({ row }) => row.original.enrollment.course.name,
    },
    {
      accessorKey: "enrollment.batch.batchName",
      header: "Batch",
      cell: ({ row }) => row.original.enrollment.batch.batchName,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
    },
    {
      accessorKey: "paymentDate",
      header: "Date",
      cell: ({ row }) => new Date(row.original.paymentDate).toLocaleDateString(),
    },
    {
      accessorKey: "paymentMode",
      header: "Mode",
      cell: ({ row }) => {
        const mode = row.original.paymentMode
        return (
          <Badge className={PAYMENT_MODE_COLORS[mode] || ""}>
            {PAYMENT_MODE_LABELS[mode as keyof typeof PAYMENT_MODE_LABELS] || mode}
          </Badge>
        )
      },
    },
    {
      accessorKey: "transactionReference",
      header: "Reference",
      cell: ({ row }) => row.original.transactionReference || "-",
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
          placeholder="Search payments..."
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
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
