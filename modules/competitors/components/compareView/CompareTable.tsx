import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type {
  CompareCell as CompareCellType,
  ColoredBrandMetrics,
  CompareRow,
} from "../../types";

type CompareTableProps = {
  compareCols: ColoredBrandMetrics[];
  compareRows: CompareRow[];
};

const CompareHeaderCell = ({ col }: { col: ColoredBrandMetrics }) => (
  <th className="border-b border-border bg-sunken px-3 py-3.5 text-center">
    <Box className="flex flex-col items-center gap-1">
      <Box
        className="h-[9px] w-[9px] rounded-full"
        style={{ background: col.color }}
      />
      <Box className="whitespace-nowrap text-xs font-bold text-text">
        {col.name}
      </Box>
    </Box>
  </th>
);

const CompareCell = ({ cell }: { cell: CompareCellType }) => (
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

const CompareBodyRow = ({ row }: { row: CompareRow }) => (
  <tr>
    <td className="whitespace-nowrap border-b border-border px-5 py-3 text-[12.5px] font-semibold text-text-secondary">
      {row.label}
    </td>
    {row.cells.map((cell, i) => (
      <CompareCell key={i} cell={cell} />
    ))}
  </tr>
);

export const CompareTable = ({
  compareCols,
  compareRows,
}: CompareTableProps) => (
  <Box className="overflow-hidden overflow-x-auto rounded-2xl border border-border bg-surface">
    <table className="w-full min-w-[640px] border-collapse">
      <thead>
        <tr>
          <th className="border-b border-border bg-sunken px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-text-tertiary">
            Metric
          </th>
          {compareCols.map((col) => (
            <CompareHeaderCell key={col.key} col={col} />
          ))}
        </tr>
      </thead>
      <tbody>
        {compareRows.map((row) => (
          <CompareBodyRow key={row.label} row={row} />
        ))}
      </tbody>
    </table>
  </Box>
);
