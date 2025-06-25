import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumberBR(value: number) {
  if (typeof value !== "number") return "";

  const intPart = Math.trunc(value).toString();

  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
