import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: string, row: T) => React.ReactNode;
}

export interface OverviewTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
}

export const OverviewTable = <T extends Record<string, unknown>>({
  columns,
  data,
  className = "",
}: OverviewTableProps<T>) => {
  return (
    <div className={cn("w-full rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            {columns.map((column, columnIndex) => (
              <TableHead
                key={`header-${columnIndex}-${column.key}`}
                className="text-xs font-medium uppercase tracking-wider text-primary-foreground"
                style={{
                  width: column.width || "auto",
                  textAlign: column.align || "left",
                }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={`row-${index}`}
              className={cn(
                "border-b transition-colors hover:bg-muted/50",
                index % 2 === 0 ? "bg-background" : "bg-muted/20",
              )}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${index}-${column.key}`}
                  className="text-sm"
                  style={{ textAlign: column.align || "left" }}
                >
                  {column.render
                    ? column.render(row[column.key] as string, row)
                    : (row[column.key] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
