import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      {page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${page - 1}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            上一頁
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="mr-1 h-4 w-4" />
          上一頁
        </Button>
      )}

      <span className="text-sm text-slate-500">
        第 {page} 頁，共 {totalPages} 頁
      </span>

      {page < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${page + 1}`}>
            下一頁
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          下一頁
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
