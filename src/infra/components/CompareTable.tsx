import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { StickyColumnDivider } from "./StickyColumnDivider";

export type CompareTableColumn = {
  key: string;
  header: ReactNode;
};

export type CompareTableCell = {
  value: string;
  isBest: boolean;
};

export type CompareTableRow = {
  label: string;
  cells: CompareTableCell[];
};

type CompareTableProps = {
  columns: CompareTableColumn[];
  rows: CompareTableRow[];
  minWidth?: string;
};

const CompareCell = ({ cell }: { cell: CompareTableCell }) => (
  <td
    className="border-b border-border px-3 py-3 text-center"
    style={{
      background: cell.isBest ? "var(--sk-accent-subtle)" : "transparent",
    }}
  >
    <Box
      className="inline-flex items-center gap-1 text-[13px]"
      style={{
        fontWeight: cell.isBest ? 800 : 600,
        color: cell.isBest ? "var(--sk-accent-strong)" : "var(--sk-text)",
      }}
    >
      {cell.isBest && (
        <Icon
          name="ph-crown-simple"
          weight="fill"
          size={12}
          color="var(--sk-accent-strong)"
        />
      )}
      {cell.value}
    </Box>
  </td>
);

const CompareBodyRow = ({ row }: { row: CompareTableRow }) => (
  <tr>
    <td className="sticky left-0 z-[1] whitespace-nowrap border-b border-border bg-surface px-5 py-3 text-[12.5px] font-semibold text-text-secondary">
      {row.label}
      <StickyColumnDivider />
    </td>
    {row.cells.map((cell, i) => (
      <CompareCell key={i} cell={cell} />
    ))}
  </tr>
);

/** Generic "metric rows × entity columns" comparison table — header content is caller-supplied
 * (a color dot for Competitors, an avatar for Discovery's compare-creators modal) since that's
 * the only part that differs between the two; the cell/best-value chrome is shared. */
export const CompareTable = ({ columns, rows, minWidth = "640px" }: CompareTableProps) => (
  <Box className="overflow-hidden overflow-x-auto rounded-2xl border border-border bg-surface">
    <table className="w-full border-collapse" style={{ minWidth }}>
      <thead>
        <tr>
          <th className="sticky left-0 z-[2] border-b border-border bg-sunken px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-text-tertiary">
            Metric
            <StickyColumnDivider />
          </th>
          {columns.map((col) => (
            <th
              key={col.key}
              className="border-b border-border bg-sunken px-3 py-3.5 text-center"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <CompareBodyRow key={row.label} row={row} />
        ))}
      </tbody>
    </table>
  </Box>
);
