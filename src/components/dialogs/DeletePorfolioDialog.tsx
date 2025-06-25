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
import toast from "react-hot-toast";

type Props = {
  portfolio: any;
  children: React.ReactNode;
  updatePortfolio: () => void;
};

export function DeletePortfolioDialog({
  portfolio,
  children,
  updatePortfolio,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const deletePortfolio = () => {
    toast.dismiss();

    const localPortfolio =
      typeof window !== "undefined" ? localStorage?.getItem("portfolio") : "";
    const currentPortfolio = localPortfolio ? JSON.parse(localPortfolio) : [];

    const filteredPortfolio = currentPortfolio.filter(
      (item: any) => item.month != portfolio.name && item.name != portfolio.name
    );

    localStorage.setItem("portfolio", JSON.stringify(filteredPortfolio));

    toast.success("Carteira excluída.");
    updatePortfolio();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="w-[90%] sm:max-w-[400px] overflow-auto max-h-[90%] pt-0">
        <DialogHeader className="sticky top-0 bg-white pb-4 pt-6">
          <DialogTitle className="sticky top-0 flex flex-col">
            <span className="text-xl">Excluir carteira</span>
            <span className="text-sm font-normal leading-tight">
              Essa ação não poderá ser desfeita.
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex items-center">
          <Button
            type="button"
            size="lg"
            variant="default"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => deletePortfolio()}
          >
            Apagar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
