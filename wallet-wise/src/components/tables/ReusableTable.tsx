import React, { useState, useMemo } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  emptyState?: React.ReactNode;
}

export function ReusableTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize = 10,
  emptyState,
}: ReusableTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sorting logic
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aString = String(aVal).toLowerCase();
      const bString = String(bVal).toLowerCase();

      if (aString < bString) return sortOrder === "asc" ? -1 : 1;
      if (aString > bString) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  // If page overflows due to search/filter changes
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  if (data.length === 0) {
    return <>{emptyState || <div className="p-8 text-center text-muted-foreground">No data available</div>}</>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold select-none">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 font-semibold text-foreground/80 cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/75" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/10 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-foreground/90 font-medium">
                    {col.render
                      ? col.render((row as any)[col.key], row)
                      : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 select-none">
          <span className="text-sm text-muted-foreground font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} records
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center text-sm font-semibold px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReusableTable;
