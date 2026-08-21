import { Job, Application, Interview, Company } from "../models/index.js";
import { APPLICATION_STATUS } from "../constants/index.js";

export const recruiterService = {
  async getDashboardStats(recruiterId) {
    const company = await Company.findOne({ owner: recruiterId });
    const jobs = await Job.find({ postedBy: recruiterId });
    const jobIds = jobs.map((j) => j._id);

    const [totalApplicants, interviews, hires] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Interview.countDocuments({
        recruiter: recruiterId,
        status: { $in: ["Scheduled", "Confirmed", "Rescheduled"] },
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: APPLICATION_STATUS.OFFERED,
      }),
    ]);

    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const hireRate = totalApplicants
      ? Math.round((hires / totalApplicants) * 1000) / 10
      : 0;

    return {
      company,
      activeJobs,
      totalJobs: jobs.length,
      totalApplicants,
      interviewsScheduled: interviews,
      hireRate,
      recentJobs: jobs.slice(0, 5),
    };
  },

  async getAnalytics(recruiterId) {
    const jobs = await Job.find({ postedBy: recruiterId }).select(
      "_id title applicantsCount",
    );
    const jobIds = jobs.map((j) => j._id);

    const pipelineStages = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Offered",
    ];
    const pipelineData = await Promise.all(
      pipelineStages.map(async (stage) => ({
        stage,
        count: await Application.countDocuments({
          job: { $in: jobIds },
          status: stage,
        }),
      })),
    );

    const applicationsTrend = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          applications: { $sum: 1 },
          hires: { $sum: { $cond: [{ $eq: ["$status", "Offered"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]);

    return { pipelineData, applicationsTrend, jobPerformance: jobs };
  },
};
