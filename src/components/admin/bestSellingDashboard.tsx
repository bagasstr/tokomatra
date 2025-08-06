'use client'

import { cn } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BestSellingDashboardProps {
  data: {
    name: string
    price: number
    stock: number
    sold: number
  }[]
}
const BestSellingDashboard = ({ data }: BestSellingDashboardProps) => {
  return (
    <Card className={cn('')}>
      <CardHeader className=''>
        <CardTitle className=''>Produk Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Terjual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
export default BestSellingDashboard
