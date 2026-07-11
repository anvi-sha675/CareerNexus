import Card from "../common/Card";
import Checkbox from "../forms/Checkbox";
import Button from "../common/Button";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "../../utils/constants";

export default function FilterPanel({ filters, onChange, onReset }) {
  const toggle = (group, value) => {
    const current = filters[group] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [group]: next });
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Job Type
        </legend>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <Checkbox
              key={type}
              name={type}
              label={type}
              checked={filters.type?.includes(type) || false}
              onChange={() => toggle("type", type)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Experience
        </legend>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <Checkbox
              key={level}
              name={level}
              label={level}
              checked={filters.experience?.includes(level) || false}
              onChange={() => toggle("experience", level)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Work Mode
        </legend>
        <Checkbox
          name="remote"
          label="Remote only"
          checked={!!filters.remote}
          onChange={() => onChange({ ...filters, remote: !filters.remote })}
        />
      </fieldset>
    </Card>
  );
}
