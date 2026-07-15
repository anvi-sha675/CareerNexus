import api from "./api";
import { withFallback } from "./helpers";
import {
  revenueByMonth,
  applicationsTrend,
  pipelineData,
  userDistribution,
} from "./mock/mockData";

export async function getRecruiterAnalytics() {
  return withFallback(
    () => api.get("/analytics/recruiter"),
    { applicationsTrend, pipelineData },
    500,
  );
}

export async function getPlatformAnalytics() {
  return withFallback(
    () => api.get("/analytics/platform"),
    { revenueByMonth, applicationsTrend, userDistribution, pipelineData },
    500,
  );
}
