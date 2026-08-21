import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../app.js";
import { setupTestDB } from "../setupTestDB.js";
import { User } from "../../models/index.js";

const app = createApp();
setupTestDB();

describe("Auth API", () => {
  describe("POST /api/v1/auth/register", () => {
    it("registers a new student and returns a token", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test Student",
        email: "student@test.com",
        password: "Password123!",
        role: "student",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("student@test.com");
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("rejects a duplicate email with 409", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "A",
          email: "dupe@test.com",
          password: "Password123!",
          role: "student",
        });
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "B",
          email: "dupe@test.com",
          password: "Password123!",
          role: "student",
        });
      expect(res.status).toBe(409);
    });

    it("rejects an invalid email with a 400 validation error", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "A", email: "not-an-email", password: "Password123!" });
      expect(res.status).toBe(400);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it("rejects a short password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "A", email: "short@test.com", password: "short" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Login Test",
          email: "login@test.com",
          password: "Password123!",
          role: "student",
        });
    });

    it("logs in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@test.com", password: "Password123!" });
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("rejects an incorrect password with 401", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@test.com", password: "WrongPassword" });
      expect(res.status).toBe(401);
    });

    it("rejects a suspended account with 403", async () => {
      await User.findOneAndUpdate(
        { email: "login@test.com" },
        { status: "suspended" },
      );
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@test.com", password: "Password123!" });
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns the current user when authenticated", async () => {
      const register = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Me Test",
          email: "me@test.com",
          password: "Password123!",
          role: "student",
        });
      const token = register.body.data.accessToken;

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe("me@test.com");
    });
  });
});
