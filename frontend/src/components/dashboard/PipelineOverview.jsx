import Card from "../common/Card";
import FunnelBarChart from "../charts/FunnelBarChart";

export default function PipelineOverview({ data = [] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Hiring pipeline
      </h3>
      <div style={{ height: 240 }}>
        <FunnelBarChart data={data} />
      </div>
    </Card>
  );
}
