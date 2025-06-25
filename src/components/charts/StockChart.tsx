"use client";

import {  Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { cn, formatNumberBR, formatToBRL } from "@/lib/utils";
import { useState } from "react";
import { MultiSelect } from "../ui/multi-select";
import Marquee from "react-fast-marquee";
import { assetList } from "@/data/stock_data";

export const description = "A multiple line chart";

type AssetKey = (typeof assetKeys)[number];

const chartConfig: Record<AssetKey, { label: string; color: string }> = {
  // Índice de referência
  IBOVESPA: {
    label: "IBOVESPA",
    color: "#000",
  },
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

const timeRanges = [
  {
    value: "12",
    name: "1 ano",
  },
  {
    value: "60",
    name: "5 anos",
  },
  {
    value: "120",
    name: "10 anos",
  },
  {
    value: "204",
    name: "17 anos",
  },
];

export function StockChart({ stocks }: any) {
  const [timeRange, setTimeRange] = useState<string>("120");
  const [selectedStocks, setSelectedStocks] = useState<AssetKey[]>(assetKeys);
  const filteredStocks = Array.isArray(stocks) ? stocks.slice(-timeRange) : [];

  const getIndicators = () => {
    const currentIndicators = filteredStocks[filteredStocks.length - 1];
    const oldIndicators = filteredStocks[0];

    const indicators = selectedStocks.map((item: AssetKey) => {
      const currentValue = formatToBRL(
        currentIndicators[item as keyof typeof chartConfig] as number
      );

      const division =
        (currentIndicators[item as keyof typeof chartConfig] as number) /
        (oldIndicators[item as keyof typeof chartConfig] as number);

      const variation =
        division > 0 ? ((division - 1) * 100).toFixed(2) : (1 - division) * 100;

      return {
        stock: item,
        value: currentValue,
        variation: variation as number,
      };
    });

    return indicators;
  };

  const getIbovVariation = () => {
    const currentIndicators = filteredStocks[filteredStocks.length - 1];
    const oldIndicators = filteredStocks[0];

    const currentValue = formatNumberBR(
      currentIndicators["IBOVESPA"] as number
    );

    const division =
      (currentIndicators["IBOVESPA"] as number) /
      (oldIndicators["IBOVESPA"] as number);

    const variation =
      division > 0 ? ((division - 1) * 100).toFixed(2) : (1 - division) * 100;

    return {
      stock: "IBOVESPA",
      value: currentValue,
      variation: variation as number,
    };
  };

  return (
    <Card className="w-full bg-transparent border-none shadow-none p-5">
      <CardHeader className="flex items-center pb-5 justify-between px-0 flex-col md:flex-row gap-3">
        <div className="flex flex-col items-center md:items-start gap-1">
          <CardTitle className="text-xl lg:text-2xl leading-none text-start">
            IBOVESPA x Ações
          </CardTitle>
          {getIbovVariation() && (
            <div
              key={getIbovVariation()?.stock}
              className="flex gap-3 text-sm "
            >
              <span className="font-semibold">{getIbovVariation()?.stock}</span>
              <span>{getIbovVariation()?.value}</span>
              <span
                className={cn(
                  "font-medium",
                  getIbovVariation()?.variation > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {getIbovVariation()?.variation > 0 && "+"}
                {getIbovVariation()?.variation}%
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 flex-col w-full md:w-fit md:flex-row ">
          <MultiSelect
            options={assetList}
            onValueChange={setSelectedStocks}
            defaultValue={selectedStocks}
            placeholder="Selecione ações"
            variant="default"
            animation={0}
            maxCount={1}
            className="w-full md:w-fit"
          />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="rounded-md cursor-pointer flex min-h-10 w-full md:w-[110px]"
              aria-label="Selecione um período"
            >
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRanges.map((item) => (
                <SelectItem
                  key={item.name}
                  value={item.value}
                  className="rounded-lg cursor-pointer"
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          <LineChart
            accessibilityLayer
            data={filteredStocks}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              domain={[0, "dataMax"]}
              tickFormatter={(value) => {
                return formatNumberBR(value);
              }}
              allowDataOverflow
              yAxisId="IBOVESPA"
              orientation="right"
              label={{
                value: "IBOVESPA",
                angle: 90,
                dx: 30,
              }}
            />
            <YAxis
              domain={[0, "dataMax"]}
              tickFormatter={(value) => {
                return formatToBRL(value);
              }}
              allowDataOverflow
              yAxisId="STOCK"
              label={{
                value: "Ações",
                angle: -90,
                dx: -40,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => {
                    const formattedValue =
                      name == "IBOVESPA"
                        ? formatNumberBR(Number(value))
                        : formatToBRL(Number(value));

                    const bgColor = `bg-[${chartConfig[name]?.color}]`;

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

            <Line
              dataKey="IBOVESPA"
              type="linear"
              stroke={chartConfig["IBOVESPA"]?.color}
              yAxisId="IBOVESPA"
              strokeWidth={2}
              dot={false}
            />

            {selectedStocks?.map((item) => (
              <Line
                key={item}
                dataKey={item}
                type="linear"
                stroke={chartConfig[item]?.color}
                strokeWidth={2}
                dot={false}
                yAxisId="STOCK"
              />
            ))}
            <ChartLegend
              className="flex flex-wrap gap-y-1"
              content={<ChartLegendContent />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="px-0">
        <Marquee pauseOnHover autoFill gradient gradientWidth={10}>
          {getIndicators()?.map((item: any) => (
            <div
              key={item.stock}
              className="flex gap-3 px-5 border-x-1 border-x-[#807f7f] text-sm "
            >
              <span className="font-semibold">{item.stock}</span>
              <span>{item.value}</span>
              <span
                className={cn(
                  "font-medium",
                  item.variation > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {item.variation > 0 && "+"}
                {item.variation}%
              </span>
            </div>
          ))}
        </Marquee>
      </CardFooter>
    </Card>
  );
}
