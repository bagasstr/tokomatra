'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

const RecentOrderDashboard = () => {
  return (
    <Card className={cn('')}>
      <CardHeader>
        <CardTitle>Recent Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pembayaran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
export default RecentOrderDashboard
