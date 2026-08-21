import { describe, it, expect } from "@jest/globals";
import { ApiError } from "../../utils/ApiError.js";

describe("ApiError", () => {
  it("badRequest produces a 400", () => {
    const err = ApiError.badRequest("Bad input", [
      { field: "email", message: "invalid" },
    ]);
    expect(err.statusCode).toBe(400);
    expect(err.errors).toHaveLength(1);
  });

  it("unauthorized defaults to a sensible message", () => {
    const err = ApiError.unauthorized();
    expect(err.statusCode).toBe(401);
    expect(err.message).toMatch(/not authorized/i);
  });

  it("notFound produces a 404", () => {
    expect(ApiError.notFound().statusCode).toBe(404);
  });

  it("is an instance of Error with a stack trace", () => {
    const err = ApiError.internal("boom");
    expect(err).toBeInstanceOf(Error);
    expect(err.stack).toBeDefined();
  });
});
