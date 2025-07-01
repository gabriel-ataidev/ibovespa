"use server";

import { StockFunnelChart } from "@/components/charts/FunnelChart";
import { IndicatorChart, IndicatorType } from "@/components/charts/IndicatorChart";
import { StockChart } from "@/components/charts/StockChart";
import { StockPortfolio } from "@/components/StockPortofolio";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const stocks = await supabase.from("ticker_per_month").select();
  const indicators = await supabase.from("indices_ibovespa").select();
  return (
    <section className="w-full max-w-[2000px] flex items-center justify-center gap-5 flex-col p-5">
      <div className="flex w-full items-center justify-center bg-white rounded-md text-center">
        <StockChart stocks={stocks?.data} />
      </div>
      <div className="xl:grid flex w-full flex-col xl:grid-cols-3 items-center gap-5 justify-center bg-gray-100 rounded-md text-center">
        {["dolar_med_mensal", "ipca_acumulado", "selic_mensal"].map((item) => (
          <IndicatorChart
            indicators={indicators?.data}
            type={item as IndicatorType}
            key={item}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-center bg-white rounded-md text-center">
        <StockFunnelChart stocks={stocks?.data} />
      </div>
      <div className="flex w-full items-center justify-center bg-white rounded-md text-center p-3 md:p-5">
        <StockPortfolio stocks={stocks?.data || []}/>
      </div>
    </section>
  );
}
