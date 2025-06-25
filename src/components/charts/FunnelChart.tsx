"use client";

import { Funnel, FunnelChart, LabelList, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
import { formatNumberBR, formatToBRL } from "@/lib/utils";
import { useState } from "react";

export const description = "A multiple line chart";

type AssetKey = (typeof assetKeys)[number];

const chartConfig: Record<AssetKey, { label: string; color: string }> = {
  // Setor de Commodities
  VALE3: {
    label: "Vale (VALE3)",
    color: "#EA580C",
  },
  PETR3: {
    label: "Petrobras (PETR3)",
    color: "#FB923C",
  },
  SUZB3: {
    label: "Suzano (SUZB3)",
    color: "#C2410C",
  },
  // Setor Financeiro
  ITUB4: {
    label: "Itaú Unibanco (ITUB4)",
    color: "#3B82F6",
  },
  BBDC4: {
    label: "Bradesco (BBDC4)",
    color: "#2563EB",
  },
  BBAS3: {
    label: "Banco do Brasil (BBAS3)",
    color: "#0730a3",
  },
  // Setor Energético
  ELET3: {
    label: "Eletrobras (ELET3)",
    color: "#10B981",
  },
  EGIE3: {
    label: "Engie Brasil (EGIE3)",
    color: "#047857",
  },
  TAEE11: {
    label: "Taesa (TAEE11)",
    color: "#065F46",
  },
};

const assetKeys = [
  "PETR3",
  "VALE3",
  "SUZB3",
  "ITUB4",
  "BBDC4",
  "BBAS3",
  "ELET3",
  "EGIE3",
  "TAEE11",
];

export function StockFunnelChart({ stocks }: any) {
  const [timeRange, setTimeRange] = useState<string>("06-2025");
  const filteredStocks = stocks.find((item: any) => item.month == timeRange);

  const filteredMonths = stocks.map((item: any) => item.month);
  const chartData = Object.keys(filteredStocks)
    .map((key) => {
      if (!["IBOVESPA", "month", "B3SA3"].includes(key)) {
        return {
          value: filteredStocks[key],
          name: key,
          fill: chartConfig[key]?.color,
          label: `${key} - ${formatToBRL(filteredStocks[key])}`,
        };
      }
      return null;
    })
    .filter((item) => item != null)
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="w-full bg-transparent border-none shadow-none p-5">
      <CardHeader className="flex items-center pb-5 justify-between px-0 flex-row gap-3">
        <CardTitle className="text-xl lg:text-2xl leading-none text-start">
          Preço das ações
        </CardTitle>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="rounded-md cursor-pointer flex min-h-10 w-[110px]"
            aria-label="Selecione um período"
          >
            <SelectValue placeholder="Selecione um período" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {filteredMonths.map((item: string) => (
              <SelectItem
                key={item}
                value={item}
                className="rounded-lg cursor-pointer"
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="w-full h-[400px] pl-3">
          <FunnelChart accessibilityLayer>
            <Funnel dataKey="value" data={chartData} isAnimationActive>
              <LabelList
                position="insideTop"
                fill="#fff"
                stroke="none"
                style={{ fontWeight: "700", fontSize: 12 }}
                dataKey="label"
              />
            </Funnel>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => {
                    const formattedValue = formatToBRL(Number(value));

                    return (
                      <div className="text-muted-foreground flex min-w-[160px] w-full gap-2 justify-between items-center text-xs">
                        <div
                          className="h-3 w-1 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: chartConfig[name]?.color }}
                        ></div>
                        <div>
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                        </div>
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {formattedValue}
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
          </FunnelChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
