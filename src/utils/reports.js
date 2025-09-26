// Format a date to ISO string (yyyy-mm-dd)
export function formatDateISO(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

// Format a date nicely (dd MMM yyyy)
export function formatDateNice(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Download CSV from array of objects
export function downloadCSV(filename, rows) {
  const headers = Object.keys(rows[0] || {}).join(",");
  const csv = [
    headers,
    ...rows.map((r) => Object.values(r).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Open printable view in new tab
export function openPrintView(title, htmlContent) {
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>${title}</title></head><body>${htmlContent}</body></html>`);
  w.document.close();
  w.print();
}
