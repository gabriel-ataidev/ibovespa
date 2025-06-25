"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AssetKey, assetList, months } from "@/data/stock_data";
import { formatToBRL } from "@/lib/utils";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

const initialStocks = {
  PETR3: 0,
  VALE3: 0,
  SUZB3: 0,
  ITUB4: 0,
  BBDC4: 0,
  BBAS3: 0,
  ELET3: 0,
  EGIE3: 0,
  TAEE11: 0,
};

type Props = {
  stocks: any[];
  updatePortfolio: () => void;
};

export function PortfolioForm({ stocks, updatePortfolio }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [month, setMonth] = useState<string>("01-2024");
  const [selectedStocks, setSelectedStocks] =
    useState<Record<AssetKey, number>>(initialStocks);

  const handleSubmit = (e: any) => {
    toast.dismiss();
    e.preventDefault();

    if (totalPrice < 1) {
      return toast.error("Selecione pelo menos uma ação.");
    }

    if (!portfolioName) {
      return toast.error("Defina um nome para sua carteira.");
    }

    const localPortfolio = localStorage?.getItem("portfolio") || "";
    const currentPortfolio = localPortfolio ? JSON.parse(localPortfolio) : [];

    if (currentPortfolio.find((item: any) => item.name == portfolioName)) {
      return toast.error("Já existe uma carteira com esse nome.");
    }

    const newPortfolio = {
      month: month,
      name: portfolioName,
      stocks: portfolio(),
      total: totalPrice,
    };

    const porfolioUpdated = [...currentPortfolio, newPortfolio];

    localStorage.setItem("portfolio", JSON.stringify(porfolioUpdated));

    setPortfolioName("");
    setSelectedStocks(initialStocks);
    setIsOpen(false);
    updatePortfolio();
    toast.success("Carteira criada.");
  };

  const stockPrices = Array.isArray(stocks)
    ? stocks?.find((item: any) => item.month == month)
    : [];

  const updateSelectedStocks = (id: string, value: number) => {
    if (value < 0) return 0;
    const newObject = { ...selectedStocks, [`${id}`]: value };
    setSelectedStocks(newObject);
  };

  const portfolio = () => {
    return Object.keys(selectedStocks)
      .map((key) => {
        const data = {
          stock: key,
          amount: selectedStocks[key as AssetKey],
          price: stockPrices[key],
        };
        return data;
      })
      ?.filter((item) => item.amount >= 1);
  };

  const totalPrice = portfolio()?.reduce((total, item) => {
    return total + item.amount * item.price;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex gap-2 px-3 cursor-pointer py-2 items-center shadow-xs justify-center rounded-md border border-input">
        <PlusCircle className="w-4 h-4" />{" "}
        <span className="hidden md:block">Adicionar carteira</span>
      </DialogTrigger>

      <DialogContent className="w-[90%] sm:max-w-[400px] overflow-auto max-h-[90%] pt-0">
        <DialogHeader className="sticky top-0 bg-white pb-4 pt-6">
          <DialogTitle className="sticky top-0 flex flex-col">
            <span className="text-xl">Carteira de ações</span>
            <span className="text-sm font-normal leading-tight">
              Simule os rendimentos de uma carteira.
            </span>
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex w-full flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Nome da carteira"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="px-3 py-2 max-h-10 border border-input shadow-xs w-full rounded-md"
          ></input>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger
              className="rounded-md cursor-pointer flex min-h-10 h-fit w-full py-3"
              aria-label="Selecione um período"
            >
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {months.map((item) => (
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

          <div className="flex flex-col gap-3">
            {assetList.map((item) => (
              <div
                key={item.value}
                className="flex justify-between items-center gap-3"
              >
                <span>
                  {formatToBRL(stockPrices?.[item.value])} - {item.label}{" "}
                </span>
                <input
                  type="number"
                  placeholder="Qtd."
                  value={selectedStocks[item.value as AssetKey]}
                  onChange={(e) =>
                    updateSelectedStocks(item.value, Number(e.target.value))
                  }
                  className="px-3 py-2 border border-input shadow-xs w-[70px] rounded-md"
                ></input>
              </div>
            ))}
          </div>

          <DialogFooter className="flex items-center">
            {totalPrice > 0 && <span>Total: {formatToBRL(totalPrice)}</span>}

            <Button
              type="submit"
              size="lg"
              variant="default"
              className="cursor-pointer"
            >
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
