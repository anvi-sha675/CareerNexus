import {
  StudentProfile,
  Skill,
  Education,
  Experience,
  Project,
  Certification,
  User,
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { renderPdfToBuffer, sectionHeading } from "../utils/pdfBuilder.js";

export const resumeBuilderService = {
  async getBuilderData(studentId) {
    const [
      profile,
      user,
      skills,
      education,
      experience,
      projects,
      certifications,
    ] = await Promise.all([
      StudentProfile.findOne({ user: studentId }),
      User.findById(studentId),
      Skill.find({ student: studentId }),
      Education.find({ student: studentId }).sort({ createdAt: -1 }),
      Experience.find({ student: studentId }).sort({ createdAt: -1 }),
      Project.find({ student: studentId }).sort({ createdAt: -1 }),
      Certification.find({ student: studentId }).sort({ createdAt: -1 }),
    ]);

    return {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      summary: profile?.resumeSummary || "",
      template: profile?.resumeTemplate || "classic",
      updatedAt: profile?.resumeBuilderUpdatedAt || null,
      skills,
      education,
      experience,
      projects,
      certifications,
    };
  },

  async updateMeta(studentId, { summary, template }) {
    const patch = { resumeBuilderUpdatedAt: new Date() };
    if (summary !== undefined) patch.resumeSummary = summary;
    if (template !== undefined) patch.resumeTemplate = template;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: studentId },
      patch,
      { new: true, upsert: true, runValidators: true },
    );
    return profile;
  },

  async exportPdf(studentId) {
    const data = await this.getBuilderData(studentId);
    if (!data.name) throw ApiError.notFound("Student profile not found");

    return renderPdfToBuffer((doc) => {
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .fillColor("#0F172A")
        .text(data.name);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#475569")
        .text([data.email, data.phone].filter(Boolean).join("   ·   "));

      if (data.summary) {
        sectionHeading(doc, "Summary");
        doc.fontSize(10).text(data.summary, { align: "left" });
      }

      if (data.experience.length) {
        sectionHeading(doc, "Experience");
        data.experience.forEach((e) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(10.5)
            .text(`${e.role} — ${e.company}`);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#64748B")
            .text(e.period || "");
          if (e.description)
            doc.fillColor("#1E293B").fontSize(9.5).text(e.description);
          doc.moveDown(0.4);
        });
      }

      if (data.education.length) {
        sectionHeading(doc, "Education");
        data.education.forEach((e) => {
          doc.font("Helvetica-Bold").fontSize(10.5).text(e.degree);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#64748B")
            .text(
              [e.institution, e.period, e.grade].filter(Boolean).join(" · "),
            );
          doc.moveDown(0.4);
        });
      }

      if (data.projects.length) {
        sectionHeading(doc, "Projects");
        data.projects.forEach((p) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(10.5)
            .fillColor("#1E293B")
            .text(p.title);
          if (p.stack)
            doc
              .font("Helvetica")
              .fontSize(9)
              .fillColor("#2563EB")
              .text(p.stack);
          if (p.description)
            doc.fillColor("#1E293B").fontSize(9.5).text(p.description);
          doc.moveDown(0.4);
        });
      }

      if (data.skills.length) {
        sectionHeading(doc, "Skills");
        doc
          .fontSize(9.5)
          .fillColor("#1E293B")
          .text(data.skills.map((s) => s.name).join("  ·  "));
      }

      if (data.certifications.length) {
        sectionHeading(doc, "Certifications");
        data.certifications.forEach((c) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor("#1E293B")
            .text(c.name);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#64748B")
            .text([c.issuer, c.date].filter(Boolean).join(" · "));
          doc.moveDown(0.3);
        });
      }
    });
  },
};
