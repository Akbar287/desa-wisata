"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { IconDownload } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface MonthlyRevenue {
  month: string;
  pendapatan: number;
  pemesanan: number;
}

export interface PopularItem {
  name: string;
  bookings: number;
  totalPax: number;
  totalRevenue: number;
}

export interface BookingStatusData {
  name: string;
  value: number;
  color: string;
}

const revenueConfig = {
  pendapatan: { label: "Pendapatan", color: "var(--primary)" },
  pemesanan: { label: "Pemesanan", color: "hsl(200, 80%, 50%)" },
} satisfies ChartConfig;

const topItemConfig = {
  bookings: { label: "Pemesanan", color: "var(--primary)" },
} satisfies ChartConfig;

const statusConfig = {
  value: { label: "Jumlah" },
} satisfies ChartConfig;

function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

function truncateLabel(v: string, max = 24): string {
  if (v.length <= max) return v;
  return `${v.slice(0, max - 3)}...`;
}

function downloadTopItemsExcel(params: {
  items: PopularItem[];
  title: string;
  fileNamePrefix: string;
}) {
  const { items, title, fileNamePrefix } = params;
  if (items.length === 0) return;

  const rows = items.map((item, idx) => ({
    No: idx + 1,
    "Nama Destinasi": item.name,
    "Total Booking": item.bookings,
    "Total Pax": item.totalPax,
    "Total Revenue": item.totalRevenue,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  const sheetName = title.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const dateTag = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileNamePrefix}-${dateTag}.xlsx`);
}

function downloadRevenueExcel(params: {
  data: MonthlyRevenue[];
  fileNamePrefix: string;
}) {
  const { data, fileNamePrefix } = params;
  if (data.length === 0) return;

  const rows = data.map((item, idx) => ({
    No: idx + 1,
    Bulan: item.month,
    Pendapatan: item.pendapatan,
    "Jumlah Pemesanan": item.pemesanan,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pendapatan");
  const dateTag = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileNamePrefix}-${dateTag}.xlsx`);
}

function TopSellingCard({
  title,
  description,
  items,
  fileNamePrefix,
}: {
  title: string;
  description: string;
  items: PopularItem[];
  fileNamePrefix: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length === 0}
          onClick={() =>
            downloadTopItemsExcel({
              items,
              title,
              fileNamePrefix,
            })
          }
        >
          <IconDownload className="mr-1 size-4" />
          Unduh Excel
        </Button>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ChartContainer config={topItemConfig} className="h-[250px] w-full">
            <BarChart data={items} layout="vertical" margin={{ right: 14 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={150}
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) => truncateLabel(value)}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => String(v)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="bookings" fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            Belum ada data pemesanan
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ChartAreaInteractive({
  monthlyRevenue,
  popularTours,
  popularDestinations,
  popularWahanas,
  bookingStatus,
}: {
  monthlyRevenue: MonthlyRevenue[];
  popularTours: PopularItem[];
  popularDestinations: PopularItem[];
  popularWahanas: PopularItem[];
  bookingStatus: BookingStatusData[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("12m");

  const filteredData = React.useMemo(() => {
    const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;
    return monthlyRevenue.slice(-months);
  }, [monthlyRevenue, timeRange]);

  React.useEffect(() => {
    if (isMobile) setTimeRange("3m");
  }, [isMobile]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <Card className="@container/chart">
        <CardHeader className="flex flex-col gap-2 @lg/chart:flex-row @lg/chart:items-center">
          <div className="flex-1 space-y-1">
            <CardTitle>Grafik Pendapatan</CardTitle>
            <CardDescription>
              Tren pendapatan dan jumlah pemesanan per bulan
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/chart:flex"
            >
              <ToggleGroupItem value="12m">12 bulan</ToggleGroupItem>
              <ToggleGroupItem value="6m">6 bulan</ToggleGroupItem>
              <ToggleGroupItem value="3m">3 bulan</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/chart:hidden"
                aria-label="Pilih periode"
              >
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12m">12 bulan</SelectItem>
                <SelectItem value="6m">6 bulan</SelectItem>
                <SelectItem value="3m">3 bulan</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={filteredData.length === 0}
              onClick={() =>
                downloadRevenueExcel({
                  data: filteredData,
                  fileNamePrefix: `pendapatan-${timeRange}`,
                })
              }
            >
              <IconDownload className="mr-1 size-4" />
              Unduh Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={revenueConfig} className="aspect-auto h-[260px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPendapatan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(v) => v} indicator="dot" />}
              />
              <Area
                dataKey="pendapatan"
                type="natural"
                fill="url(#fillPendapatan)"
                stroke="var(--primary)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:gap-6">
        <TopSellingCard
          title="Paket Tour Paling Laku"
          description="Nama paket tour dan jumlah pemesanan"
          items={popularTours}
          fileNamePrefix="top-tour"
        />
        <TopSellingCard
          title="Destinasi Paling Laku"
          description="Nama destinasi dan jumlah pemesanan"
          items={popularDestinations}
          fileNamePrefix="top-destinasi"
        />
        <TopSellingCard
          title="Wahana Paling Laku"
          description="Nama wahana dan jumlah pemesanan"
          items={popularWahanas}
          fileNamePrefix="top-wahana"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Pemesanan</CardTitle>
          <CardDescription>Distribusi status semua pemesanan</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingStatus.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <ChartContainer config={statusConfig} className="h-[200px] w-full max-w-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={bookingStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    strokeWidth={2}
                  >
                    {bookingStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-3">
                {bookingStatus.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-semibold">{formatCompactNumber(s.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
              Belum ada data pemesanan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
