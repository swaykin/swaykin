import { Box } from "@/infra/baseweb/Box";
import { useCreditHistory } from "../../hooks/useCreditHistory";

const HEADER_CELL =
  "border-b border-border px-5 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-text-tertiary";
const BODY_CELL = "border-b border-border px-5 py-2.5 text-[12.5px]";

export const CreditHistoryTable = () => {
  const { history } = useCreditHistory();

  return (
    <Box className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <Box className="px-5 pb-2.5 pt-4 text-[14px] font-bold text-text">
        Credit history
      </Box>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={HEADER_CELL}>Date</th>
            <th className={HEADER_CELL}>Activity</th>
            <th className={`${HEADER_CELL} text-right`}>Change</th>
            <th className={`${HEADER_CELL} text-right`}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={`${entry.date}-${entry.activity}-${index}`}>
              <td className={`${BODY_CELL} text-text-secondary`}>{entry.date}</td>
              <td className={`${BODY_CELL} font-semibold text-text`}>
                {entry.activity}
              </td>
              <td
                className={`${BODY_CELL} text-right font-bold`}
                style={{
                  color:
                    entry.delta >= 0 ? "var(--green-700)" : "var(--red-600)",
                }}
              >
                {entry.delta >= 0 ? "+" : ""}
                {entry.delta.toLocaleString()}
              </td>
              <td className={`${BODY_CELL} text-right text-text-secondary`}>
                {entry.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};
