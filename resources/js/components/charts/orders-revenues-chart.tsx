"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart for orders over time"

const chartConfig = {
    ordersCount: {
        label: "Orders",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export interface OrdersAndRevenuesOverTimePoint {
    date: string;
    orders_count: number;
    revenue?: number;
}

export function OrdersAndRevenuesOverTimeChart({ chartData1 }: { chartData1: OrdersAndRevenuesOverTimePoint[] }) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const referenceDate = React.useMemo(() => {
        if (!chartData1.length) return new Date()
        const dates = chartData1.map((item) => new Date(item.date).getTime())
        return new Date(Math.max(...dates))
    }, [chartData1])

    const filteredData = React.useMemo(() => {
        const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return chartData1.filter((item) => new Date(item.date) >= startDate)
    }, [chartData1, referenceDate, timeRange])

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Orders over time</CardTitle>
                    <CardDescription>
                        Orders for the selected period
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select time range"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillOrdersCount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-ordersCount)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-ordersCount)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return `${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}`
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return `${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}`
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="orders_count"
                            type="natural"
                            fill="url(#fillOrdersCount)"
                            stroke="var(--color-ordersCount)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
