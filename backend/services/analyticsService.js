import { User, Job, Application, Interview, Company } from "../models/index.js";
import { ROLES, APPLICATION_STATUS } from "../constants/index.js";

export const analyticsService = {
  async getPlatformOverview() {
    const [
      totalUsers,
      students,
      recruiters,
      verifiedCompanies,
      pendingCompanies,
      activeJobs,
      totalApplications,
      totalInterviews,
      offers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.STUDENT }),
      User.countDocuments({ role: ROLES.RECRUITER }),
      Company.countDocuments({ verificationStatus: "approved" }),
      Company.countDocuments({ verificationStatus: "pending" }),
      Job.countDocuments({ status: "active" }),
      Application.countDocuments(),
      Interview.countDocuments(),
      Application.countDocuments({ status: APPLICATION_STATUS.OFFERED }),
    ]);

    return {
      totalUsers,
      students,
      recruiters,
      verifiedCompanies,
      pendingCompanies,
      activeJobs,
      totalApplications,
      totalInterviews,
      offers,
    };
  },

  async getUserGrowth() {
    return User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]);
  },

  async getApplicationsTrend() {
    return Application.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          applications: { $sum: 1 },
          hires: {
            $sum: {
              $cond: [{ $eq: ["$status", APPLICATION_STATUS.OFFERED] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]);
  },

  async getUserDistribution() {
    const results = await User.aggregate([
      { $group: { _id: "$role", value: { $sum: 1 } } },
    ]);
    return results.map((r) => ({
      name: r._id.charAt(0).toUpperCase() + r._id.slice(1) + "s",
      value: r.value,
    }));
  },

  async getHiringFunnel() {
    const stages = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Offered",
    ];
    return Promise.all(
      stages.map(async (stage) => ({
        stage,
        count: await Application.countDocuments({ status: stage }),
      })),
    );
  },
};
