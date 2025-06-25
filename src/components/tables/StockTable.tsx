import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatToBRL } from "@/lib/utils";

export default function StockTable({ data }: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Ação</TableHead>
          <TableHead className="text-center">Quantidade</TableHead>
          <TableHead className="text-center">Preço</TableHead>
          <TableHead className="text-center">Variação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: any, index: number) => (
          <TableRow key={index}>
            <TableCell >{item.stock}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{formatToBRL(item.price)}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "rounded-full  font-semibold",
                  item.variation > 0 ? "text-green-700" : "text-red-700"
                )}
              >
                {item.variation > 0 ? "+" : ""}
                {item.variation}
                %
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
