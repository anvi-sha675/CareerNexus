import PDFDocument from "pdfkit";

export function renderPdfToBuffer(drawFn) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    try {
      drawFn(doc);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export function sectionHeading(doc, text) {
  doc.moveDown(0.6);
  doc
    .fontSize(12)
    .fillColor("#2563EB")
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc
    .moveTo(doc.x, doc.y + 2)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
    .strokeColor("#E2E8F0")
    .stroke();
  doc.moveDown(0.4);
  doc.fillColor("#1E293B").font("Helvetica");
}
