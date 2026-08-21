import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../app.js";
import { setupTestDB } from "../setupTestDB.js";
import { Company } from "../../models/index.js";

const app = createApp();
setupTestDB();

async function registerAndLogin(role, email) {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ name: `Test ${role}`, email, password: "Password123!", role });
  return { token: res.body.data.accessToken, user: res.body.data.user };
}

async function createVerifiedCompanyForRecruiter(recruiterId) {
  return Company.create({
    name: "Test Co",
    owner: recruiterId,
    verificationStatus: "approved",
  });
}

describe("Jobs API", () => {
  it("GET /api/v1/jobs is publicly accessible without auth", async () => {
    const res = await request(app).get("/api/v1/jobs");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("a recruiter cannot post a job before their company is verified", async () => {
    const { token, user } = await registerAndLogin(
      "recruiter",
      "unverified@test.com",
    );
    await Company.create({
      name: "Unverified Co",
      owner: user._id,
      verificationStatus: "pending",
    });

    const res = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Frontend Engineer",
        location: "Remote",
        salaryMin: 500000,
        salaryMax: 900000,
        description:
          "A sufficiently long job description for validation purposes.",
      });
    expect(res.status).toBe(403);
  });

  it("a verified recruiter can post, edit, and delete a job", async () => {
    const { token, user } = await registerAndLogin(
      "recruiter",
      "verified@test.com",
    );
    await createVerifiedCompanyForRecruiter(user._id);

    const create = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Backend Engineer",
        location: "Bengaluru",
        salaryMin: 600000,
        salaryMax: 1000000,
        description:
          "A sufficiently long job description for validation purposes.",
        tags: ["Node.js"],
      });
    expect(create.status).toBe(201);
    const jobId = create.body.data._id;

    const update = await request(app)
      .patch(`/api/v1/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Senior Backend Engineer" });
    expect(update.status).toBe(200);
    expect(update.body.data.title).toBe("Senior Backend Engineer");

    const del = await request(app)
      .delete(`/api/v1/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(200);
  });

  it("a student cannot post a job", async () => {
    const { token } = await registerAndLogin("student", "student-job@test.com");
    const res = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Should Fail",
        location: "Remote",
        salaryMin: 1,
        salaryMax: 2,
        description: "x".repeat(40),
      });
    expect(res.status).toBe(403);
  });

  it("student can apply to a job exactly once", async () => {
    const recruiter = await registerAndLogin(
      "recruiter",
      "apply-recruiter@test.com",
    );
    await createVerifiedCompanyForRecruiter(recruiter.user._id);
    const job = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${recruiter.token}`)
      .send({
        title: "QA Engineer",
        location: "Remote",
        salaryMin: 400000,
        salaryMax: 700000,
        description:
          "A sufficiently long job description for validation purposes.",
        tags: ["Cypress"],
      });

    const student = await registerAndLogin("student", "applicant@test.com");
    const firstApply = await request(app)
      .post(`/api/v1/jobs/${job.body.data._id}/apply`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(firstApply.status).toBe(201);
    expect(firstApply.body.data.matchScore).toBeGreaterThanOrEqual(0);

    const secondApply = await request(app)
      .post(`/api/v1/jobs/${job.body.data._id}/apply`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(secondApply.status).toBe(409);
  });
});
