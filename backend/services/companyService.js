import { Company, RecruiterProfile } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { COMPANY_VERIFICATION_STATUS } from "../constants/index.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";

export const companyService = {
  async getForRecruiter(recruiterId) {
    let company = await Company.findOne({ owner: recruiterId });
    return company;
  },

  async createOrUpdate(recruiterId, payload) {
    let company = await Company.findOne({ owner: recruiterId });
    if (!company) {
      company = await Company.create({ ...payload, owner: recruiterId });
      await RecruiterProfile.findOneAndUpdate(
        { user: recruiterId },
        { company: company._id },
      );
    } else {
      Object.assign(company, payload);
      await company.save();
    }
    return company;
  },

  async addGalleryImage(recruiterId, imageUrl) {
    const company = await Company.findOneAndUpdate(
      { owner: recruiterId },
      { $push: { gallery: imageUrl } },
      { new: true },
    );
    if (!company) throw ApiError.notFound("Company profile not found");
    return company;
  },

  async removeGalleryImage(recruiterId, imageUrl) {
    const company = await Company.findOneAndUpdate(
      { owner: recruiterId },
      { $pull: { gallery: imageUrl } },
      { new: true },
    );
    if (!company) throw ApiError.notFound("Company profile not found");
    return company;
  },

  async adminList(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.verificationStatus = query.status;
    if (query.search) filter.name = { $regex: query.search, $options: "i" };

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments(filter),
    ]);
    return { companies, meta: buildMeta({ page, limit, total }) };
  },

  async verify(adminId, companyId, { status, notes }) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound("Company not found");

    company.verificationStatus = status;
    if (status === COMPANY_VERIFICATION_STATUS.APPROVED) {
      company.verifiedAt = new Date();
      company.verifiedBy = adminId;
    }
    await company.save();

    await RecruiterProfile.findOneAndUpdate(
      { user: company.owner },
      {
        status:
          status === COMPANY_VERIFICATION_STATUS.APPROVED
            ? "approved"
            : status === COMPANY_VERIFICATION_STATUS.REJECTED
              ? "suspended"
              : "pending",
        verificationNotes: notes || "",
        approvedAt:
          status === COMPANY_VERIFICATION_STATUS.APPROVED ? new Date() : null,
        approvedBy:
          status === COMPANY_VERIFICATION_STATUS.APPROVED ? adminId : null,
      },
    );

    return company;
  },
};
