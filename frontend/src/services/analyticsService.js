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
    () => api.get("/recruiter/analytics"),
    { applicationsTrend, pipelineData },
    500,
  );
}

export async function getPlatformAnalytics() {
  const data = await withFallback(
    () => api.get("/admin/analytics"),
    { revenueByMonth, applicationsTrend, userDistribution, pipelineData },
    500,
  );
  if (data && data.hiringFunnel && !data.pipelineData) {
    return {
      ...data,
      pipelineData: data.hiringFunnel,
      revenueByMonth: data.revenueByMonth || [],
    };
  }
  return data;
}
