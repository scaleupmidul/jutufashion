import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  itemLabel = 'items',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
      
      {/* Left: Summary information */}
      <div className="text-xs text-stone-600 font-medium flex items-center space-x-1.5">
        <span>Showing</span>
        <span className="font-bold text-stone-950 font-mono">{startItem}–{endItem}</span>
        <span>of</span>
        <span className="font-bold text-stone-950 font-mono">{totalItems}</span>
        <span className="lowercase">{itemLabel}</span>
        {totalPages > 1 && (
          <span className="text-stone-400 font-mono text-[11px] ml-1">
            (Page {currentPage} of {totalPages})
          </span>
        )}
      </div>

      {/* Right: Page Buttons (only if more than 1 page) */}
      {totalPages > 1 ? (
        <div className="flex items-center space-x-1 sm:space-x-1.5 self-center sm:self-auto">
          
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
            className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
            className="px-2.5 h-8 rounded-xl border border-stone-200 flex items-center space-x-1 text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 text-xs font-bold font-mono"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-xs scale-105'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next Page"
            className="px-2.5 h-8 rounded-xl border border-stone-200 flex items-center space-x-1 text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-[11px]">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
            className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>

        </div>
      ) : (
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
          Single Page View
        </div>
      )}

    </div>
  );
};
