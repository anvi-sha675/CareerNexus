/** Client-side CSV export — builds a CSV blob from rows + column defs and triggers a download. */
export function exportToCSV(filename, rows, columns) {
  if (!rows || rows.length === 0) return false;

  const escape = (val) => {
    const str = String(val ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const headerLine = columns.map((c) => escape(c.header)).join(",");
  const dataLines = rows.map((row) =>
    columns
      .map((c) =>
        escape(typeof c.value === "function" ? c.value(row) : row[c.key]),
      )
      .join(","),
  );
  const csv = [headerLine, ...dataLines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
