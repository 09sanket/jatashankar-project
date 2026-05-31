"use client";

/**
 * DataTable — Enterprise-level reusable table with search, sort, pagination,
 * loading skeletons, and empty state.
 *
 * Usage:
 *   <DataTable
 *     columns={[
 *       { key: "name", label: "Name", sortable: true, render: (row) => <span>{row.name}</span> },
 *       { key: "email", label: "Email" },
 *     ]}
 *     data={items}
 *     isLoading={isLoading}
 *     searchValue={query}
 *     onSearchChange={setQuery}
 *     searchPlaceholder="Search records..."
 *     pageSize={10}
 *     emptyTitle="No Records"
 *     emptyDescription="Try adjusting your search."
 *   />
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";
import EmptyState from "./EmptyState";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
  /** Unique column key — used for sorting */
  key: string;
  /** Header label */
  label: string;
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (row: T, index: number) => React.ReactNode;
  /** Header alignment */
  headerAlign?: "left" | "center" | "right";
  /** Cell alignment */
  cellAlign?: "left" | "center" | "right";
  /** Optional width class */
  width?: string;
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Data array */
  data: T[];
  /** Loading state */
  isLoading?: boolean;
  /** Row key extractor — defaults to row.id */
  rowKey?: (row: T) => string;

  // ── Search ──────────────────────────────────────────────────────────────
  /** Controlled search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show search bar */
  showSearch?: boolean;

  // ── Pagination ──────────────────────────────────────────────────────────
  /** Page size — set to 0 to disable pagination */
  pageSize?: number;

  // ── Empty State ─────────────────────────────────────────────────────────
  /** Custom empty icon */
  emptyIcon?: React.ReactNode;
  /** Custom empty title */
  emptyTitle?: string;
  /** Custom empty description */
  emptyDescription?: string;
  /** Custom empty action */
  emptyAction?: { label: string; onClick: () => void };

  // ── Skeleton ────────────────────────────────────────────────────────────
  /** Number of skeleton rows */
  skeletonRows?: number;

  // ── Extras ──────────────────────────────────────────────────────────────
  /** Render element above the table (filters, stats, etc.) */
  toolbar?: React.ReactNode;
  /** Additional className for the outermost wrapper */
  className?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Row class name generator */
  rowClassName?: (row: T) => string;
}

// ── Animation variants ─────────────────────────────────────────────────────────
const tableCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

// ── Component ──────────────────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  rowKey,

  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  showSearch = true,

  pageSize = 10,

  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,

  skeletonRows = 5,

  toolbar,
  className = "",
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  // ── Sort State ────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // ── Pagination State ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ── Sorting Logic ─────────────────────────────────────────────────────────
  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Cycle: asc → desc → null
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // ── Sorted Data ───────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Handle Firestore Timestamps
      const aTime = aVal?.toDate ? aVal.toDate().getTime() : null;
      const bTime = bVal?.toDate ? bVal.toDate().getTime() : null;
      if (aTime !== null && bTime !== null) {
        return sortDir === "asc" ? aTime - bTime : bTime - aTime;
      }

      // Handle numbers
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle strings (case-insensitive)
      const aStr = String(aVal ?? "").toLowerCase();
      const bStr = String(bVal ?? "").toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  // ── Paginated Data ────────────────────────────────────────────────────────
  const isPaginated = pageSize > 0;
  const totalPages = isPaginated ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;

  // Reset to page 1 when data changes and current page is out of bounds
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const paginatedData = isPaginated
    ? sortedData.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sortedData;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getKey = (row: T, idx: number) => (rowKey ? rowKey(row) : (row as any).id ?? `row-${idx}`);

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600" />;
    if (sortDir === "asc") return <ArrowUp className="w-3 h-3 text-[#9B111E]" />;
    return <ArrowDown className="w-3 h-3 text-[#9B111E]" />;
  };

  const alignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-5 ${className}`}>
      {/* ── Search + Toolbar ── */}
      {(showSearch || toolbar) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {showSearch && onSearchChange && (
            <TableSearch
              value={searchValue ?? ""}
              onChange={(val) => {
                onSearchChange(val);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full sm:max-w-sm"
            />
          )}
          {toolbar && <div className="flex-1 flex justify-end">{toolbar}</div>}
        </div>
      )}

      {/* ── Table Card ── */}
      <motion.div
        className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden text-left"
        variants={tableCardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* ── Head ── */}
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none whitespace-nowrap ${alignClass(
                      col.headerAlign
                    )} ${col.width ?? ""} ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${
                      col.sortable ? "cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" : ""
                    }`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && getSortIcon(col.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  /* Skeleton rows */
                  Array.from({ length: skeletonRows }).map((_, idx) => (
                    <tr key={`skel-${idx}`} className="animate-pulse">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-6 py-4 ${col.hideOnMobile ? "hidden md:table-cell" : ""}`}
                        >
                          <div
                            className={`h-4 rounded bg-slate-100 dark:bg-slate-800 ${
                              col.cellAlign === "right" ? "ml-auto w-12" : "w-24"
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  /* Empty State */
                  <tr>
                    <td colSpan={columns.length}>
                      <EmptyState
                        icon={emptyIcon}
                        title={emptyTitle}
                        description={emptyDescription}
                        action={emptyAction}
                      />
                    </td>
                  </tr>
                ) : (
                  /* Data rows */
                  paginatedData.map((row, idx) => (
                    <motion.tr
                      key={getKey(row, idx)}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors text-xs text-slate-700 dark:text-slate-300 ${
                        onRowClick ? "cursor-pointer" : ""
                      } ${rowClassName ? rowClassName(row) : ""}`}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-6 py-4 ${alignClass(col.cellAlign)} ${col.width ?? ""} ${
                            col.hideOnMobile ? "hidden md:table-cell" : ""
                          }`}
                        >
                          {col.render
                            ? col.render(row, (safePage - 1) * pageSize + idx)
                            : (row[col.key] as React.ReactNode) ?? (
                                <span className="text-slate-400">—</span>
                              )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {isPaginated && !isLoading && paginatedData.length > 0 && (
          <TablePagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </motion.div>
    </div>
  );
}
