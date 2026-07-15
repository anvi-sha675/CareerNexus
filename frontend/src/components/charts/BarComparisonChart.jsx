import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarComparisonChart({
  data,
  bars = [
    { key: "applications", color: "#2563EB" },
    { key: "hires", color: "#14B8A6" },
  ],
  xKey = "month",
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E2E8F0"
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            fontSize: 13,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            fill={b.color}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
