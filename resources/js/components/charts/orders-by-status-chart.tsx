"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export interface OrderStatusChartPoint {
    status: string
    label: string
    count: number
}

const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
] as const

export interface OrdersByStatusChartProps {
    data: OrderStatusChartPoint[]
    title?: string
    description?: string
}

export function OrdersByStatusChart({
    data,
    title = "Orders by Status",
    description = "Distribution of orders by status",
}: OrdersByStatusChartProps) {
    const chartConfig = data.reduce<ChartConfig>((acc, item, index) => {
        acc[item.status] = {
            label: item.label,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }
        return acc
    }, {})

    const total = data.reduce((sum, d) => sum + d.count, 0)
    const displayData = data.filter((d) => d.count > 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent nameKey="status" hideLabel />}
                        />
                        <Pie
                            data={displayData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={2}
                        >
                            {displayData.map((entry) => (
                                <Cell
                                    key={entry.status}
                                    fill={`var(--color-${entry.status})`}
                                    stroke={`var(--color-${entry.status})`}
                                />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                    </PieChart>
                </ChartContainer>
                {total === 0 && (
                    <p className="text-muted-foreground text-center text-sm">No orders yet</p>
                )}
            </CardContent>
        </Card>
    )
}
