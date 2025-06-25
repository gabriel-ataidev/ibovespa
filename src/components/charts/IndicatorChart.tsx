"use client";

import { Line, LineChart, XAxis, YAxis } from "recharts";

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

export type IndicatorType =
  | "dolar_med_mensal"
  | "ipca_acumulado"
  | "selic_mensal";

type Props = {
  type: IndicatorType;
  indicators: any;
};

type AssetKey = (typeof assetKeys)[number];

const assetKeys = [
  "dolar_med_mensal",
  "ipca_acumulado",
  "selic_mensal",
  "ibovespa",
];

const chartConfig: Record<AssetKey, { label: string; color: string }> = {
  ibovespa: {
    label: "IBOVESPA",
    color: "#000",
  },
  dolar_med_mensal: {
    label: "Dólar",
    color: "#EA580C",
  },
  ipca_acumulado: {
    label: "IPCA Acumulado",
    color: "#0730a3",
  },
  selic_mensal: {
    label: "SELIC",
    color: "#10B981",
  },
};

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
    value: "240",
    name: "20 anos",
  },
];

export function IndicatorChart({ indicators, type }: Props) {
  const [timeRange, setTimeRange] = useState<string>("120");
  const filteredIndicators = Array.isArray(indicators)
    ? indicators.slice(-timeRange)
    : [];

  const getIndicators = () => {
    const currentIndicators = filteredIndicators[filteredIndicators.length - 1];
    const oldIndicators = filteredIndicators[0];

    const indicators = ["ibovespa", type].map((item: AssetKey) => {
      const value = currentIndicators[
        item as keyof typeof chartConfig
      ] as number;

      const currentValue =
        item === "ibovespa"
          ? formatNumberBR(value)
          : item === "dolar_med_mensal"
            ? formatToBRL(value)
            : `${Number(value).toFixed(2)}\u00A0%`;

      const division =
        (currentIndicators[item as keyof typeof chartConfig] as number) /
        (oldIndicators[item as keyof typeof chartConfig] as number);

      const variation =
        division > 0 ? ((division - 1) * 100).toFixed(2) : (1 - division) * 100;

      return {
        stock: item == "ibovespa" ? "IBOVESPA" : formatTypeName(),
        value: currentValue,
        variation: variation as number,
      };
    });

    return indicators;
  };

  const typeReference = {
    dolar_med_mensal: "Dólar",
    ipca_acumulado: "IPCA Acumulado",
    selic_mensal: "Selic",
  };

  const formatTypeName = () => {
    return typeReference[type];
  };

  return (
    <Card className="w-full bg-white border-none shadow-none p-5">
      <CardHeader className="flex items-center pb-5 justify-between px-0 flex-row gap-3">
        <CardTitle className="text-xl lg:text-2xl leading-none text-start">
          IBOVESPA x {formatTypeName()}
        </CardTitle>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="rounded-md cursor-pointer flex min-h-10 w-[110px]"
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
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="w-full h-[250px] md:h-[300px]">
          <LineChart
            accessibilityLayer
            data={filteredIndicators}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="data"
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
              yAxisId="ibovespa"
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
                if (type == "dolar_med_mensal") {
                  return formatToBRL(value);
                }
                return `${Number(value).toFixed(2)} %`;
              }}
              allowDataOverflow
              yAxisId="INDICATOR"
              label={{
                value: formatTypeName(),
                angle: -90,
                dx: -30,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => {
                    const formattedValue =
                      name === "ibovespa"
                        ? formatNumberBR(Number(value))
                        : name === "dolar_med_mensal"
                          ? formatToBRL(Number(value))
                          : `${Number(value).toFixed(2)} %`;

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
              dataKey="ibovespa"
              type="linear"
              stroke={chartConfig["ibovespa"]?.color}
              strokeWidth={2}
              dot={false}
              yAxisId="ibovespa"
            />

            <Line
              dataKey={type}
              type="linear"
              stroke={chartConfig[type]?.color}
              strokeWidth={2}
              dot={false}
              yAxisId="INDICATOR"
            />
            <ChartLegend
              className="flex flex-wrap gap-y-1"
              content={<ChartLegendContent />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="px-0 flex items-center justify-center">
        {getIndicators()?.map((item: any) => (
          <div
            key={item.stock}
            className="flex gap-1 px-3 md:gap-3 md:px-5 border-r-2 border-r-[#807f7f] text-xs xl:text-sm last:border-0 first:pl-0 last:pr-0"
          >
            <span className="font-semibold text-start">{item.stock}</span>
            <span>{item.value}</span>
            <span
              className={cn(
                "font-medium",
                item.variation > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {item.variation > 0 && "+"}
              {item.variation}{`\u00A0`}%
            </span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
