"use client";

import { cn, formatToBRL } from "@/lib/utils";
import StockTable from "./tables/StockTable";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeletePortfolioDialog } from "./dialogs/DeletePorfolioDialog";
import { PortfolioForm } from "./forms/PortfolioForm";

export function StockPortfolio({ stocks }: any) {
  const [portfolios, setPortfolios] = useState<any[]>([]);

  const updatePortfolio = () => {
    const localPortfolio =
      typeof window !== "undefined" ? localStorage?.getItem("portfolio") : "";
    const currentPortfolio = localPortfolio ? JSON.parse(localPortfolio) : [];
    const currrentStocks = stocks[stocks?.length - 1];

    const portfolio = currentPortfolio?.map((item: any) => {
      return {
        ...item,
        stocks: item?.stocks?.map((stock: any) => {
          const newPrice = currrentStocks[stock.stock];

          const division = newPrice / stock.price;

          const variation = (
            division > 0
              ? ((division - 1) * 100).toFixed(2)
              : (1 - division) * 100
          ) as number;
          return { ...stock, variation, newPrice };
        }),
      };
    });

    const formattedPortfolio = portfolio.map((item: any) => {
      const newTotal = item.stocks.reduce((total: number, value: any) => {
        return total + value.newPrice * value.amount;
      }, 0);
      const division = newTotal / item.total;

      const variation = (
        division > 0 ? ((division - 1) * 100).toFixed(2) : (1 - division) * 100
      ) as number;
      return { ...item, newTotal, variation };
    });

    setPortfolios(formattedPortfolio);
  };

  useEffect(() => {
    updatePortfolio();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between mb-5">
        <h1 className="text-xl text-start md:text-2xl font-semibold">
          Simulador de carteira de ações
        </h1>
        <PortfolioForm updatePortfolio={updatePortfolio} stocks={stocks} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {portfolios?.map((item: any, index: number) => (
          <div
            key={index}
            className="relative overflow-hidden group place-self-stretch flex-col shadow-xs rounded-md bg-gradient-to-tr from-gray-50 to-gray-100 p-5 pt-1 gap-4 flex"
          >
            <DeletePortfolioDialog
              updatePortfolio={updatePortfolio}
              portfolio={item}
            >
              <div className="p-2 bg-black cursor-pointer hover:opacity-80 rounded-full absolute top-8 -translate-x-15 group-hover:translate-x-0 transition-all duration-500 ease-in-out">
                <TrashIcon className="text-white w-4 h-4" />
              </div>
            </DeletePortfolioDialog>

            <div className="flex justify-between w-full items-center gap-3">
              <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-10 transition-all duration-300 ease-in-out">
                <h1 className="font-bold text-xl leading-none text-start">
                  {item.name}
                </h1>
                <span className="text-[#797979] font-semibold">
                  {item.month}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-2xl md:text-3xl font-bold">
                  {formatToBRL(item.newTotal)}
                </span>
                <span
                  className={cn(
                    " px-3 rounded-full text-sm font-semibold",
                    item.variation > 0
                      ? "text-green-700 bg-green-200"
                      : "text-red-700 bg-red-200"
                  )}
                >
                  {item.variation > 0 ? "+" : ""}
                  {formatToBRL(item.newTotal - item.total)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#797979] text-sm">Valor investido</span>
              <span className="font-semibold">{formatToBRL(item.total)}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#797979] text-sm">
                Variação percentual
              </span>
              <span
                className={cn(
                  "rounded-full  font-semibold",
                  item.variation > 0 ? "text-green-700" : "text-red-700"
                )}
              >
                {item.variation > 0 ? "+" : ""}
                {item.variation}%
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#797979] text-sm">
                Composição da carteira
              </span>
              <StockTable data={item.stocks} />
            </div>
          </div>
        ))}
      </div>
      {!portfolios?.length && (
        <p className="text-center text-[#666666] mb-5">
          Crie sua primeira carteira agora!
        </p>
      )}
    </div>
  );
}
