import { reportService } from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const generateReport = asyncHandler(async (req, res) => {
  const report = await reportService.generate(req.user._id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Report generated",
    data: report,
  });
});

export const listReports = asyncHandler(async (req, res) => {
  const reports = await reportService.list();
  sendSuccess(res, { data: reports });
});

export const downloadReportCsv = asyncHandler(async (req, res) => {
  const csv = await reportService.toCsv(req.params.id);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="report-${req.params.id}.csv"`,
  );
  res.send(csv);
});

export const downloadReportPdf = asyncHandler(async (req, res) => {
  const pdf = await reportService.toPdf(req.params.id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="report-${req.params.id}.pdf"`,
  );
  res.send(pdf);
});
