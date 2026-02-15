"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A simple area chart for stats over time"

/** Data point for the chart: period for X axis, optional label for display, and one numeric key (valueKey) for the area. */
export type StatsChartPoint = { period: string; label?: string } & Record<string, string | number | undefined>

export interface StatsChartProps {
  title: string
  description: string
  data: StatsChartPoint[]
  valueKey: string
  valueLabel: string
  chartColor?: "var(--chart-1)" | "var(--chart-2)" | "var(--chart-3)" | "var(--chart-4)" | "var(--chart-5)"
  /** Format value in tooltip (e.g. currency) */
  valueFormatter?: (value: number) => string
  footerTrend?: string
  footerPeriod?: string
}

export function StatsChart({
  title,
  description,
  data,
  valueKey,
  valueLabel,
  chartColor = "var(--chart-1)",
  valueFormatter,
  footerTrend,
  footerPeriod,
}: StatsChartProps) {
  const chartConfig = {
    [valueKey]: {
      label: valueLabel,
      color: chartColor,
    },
  } satisfies ChartConfig

  const computedFooterPeriod =
    footerPeriod ?? (data.length > 0 ? `${data[0].label ?? data[0].period} - ${data[data.length - 1].label ?? data[data.length - 1].period}` : null)

  const showFooter = footerTrend != null || computedFooterPeriod != null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                if (!Number.isNaN(date.getTime())) {
                  return `${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}`
                }
                const point = data.find((d) => d.period === value)
                return (point?.label ?? value) as string
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    if (!Number.isNaN(date.getTime())) {
                      return `${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}`
                    }
                    const point = data.find((d) => d.period === value)
                    return (point?.label ?? value) as string
                  }}
                  formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey={valueKey}
              type="natural"
              fill={`var(--color-${valueKey})`}
              fillOpacity={0.4}
              stroke={`var(--color-${valueKey})`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {showFooter && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {footerTrend != null && (
                <div className="flex items-center gap-2 leading-none font-medium">
                  {footerTrend} <TrendingUp className="h-4 w-4" />
                </div>
              )}
              {computedFooterPeriod != null && (
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  {computedFooterPeriod}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
