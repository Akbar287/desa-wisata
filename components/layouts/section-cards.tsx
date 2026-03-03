import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    totalTours: number;
    totalDestinations: number;
    revenueGrowth: number;
    bookingGrowth: number;
}

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export function SectionCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Pendapatan</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {fmt(stats.totalRevenue)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            {stats.revenueGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                            {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {stats.revenueGrowth >= 0 ? 'Pendapatan naik bulan ini' : 'Pendapatan turun bulan ini'}
                        {stats.revenueGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                    <div className="text-muted-foreground">
                        Dari semua pemesanan yang terkonfirmasi
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Pemesanan</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalBookings.toLocaleString('id-ID')}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            {stats.bookingGrowth >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                            {stats.bookingGrowth >= 0 ? '+' : ''}{stats.bookingGrowth.toFixed(1)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {stats.bookingGrowth >= 0 ? 'Pemesanan meningkat' : 'Pemesanan menurun'}
                        {stats.bookingGrowth >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                    <div className="text-muted-foreground">
                        Dibanding bulan sebelumnya
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Paket Wisata</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalTours}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            Aktif
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Paket wisata tersedia <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Grup & Privat</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Destinasi</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalDestinations}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            Aktif
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Destinasi terdaftar <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Di seluruh Indonesia</div>
                </CardFooter>
            </Card>
        </div>
    )
}
