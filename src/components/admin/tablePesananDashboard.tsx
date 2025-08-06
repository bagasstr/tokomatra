'use client'

import { cn } from '@/lib/utils'
import { Table, TableHead, TableHeader, TableRow } from '../ui/table'

const TablePesananDashboard = () => {
  return (
    <div className={cn('')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Pelanggan</TableHead>
            <TableHead>Tanggal Pesan</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  )
}
export default TablePesananDashboard
