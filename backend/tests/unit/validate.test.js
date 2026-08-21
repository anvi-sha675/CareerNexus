import { describe, it, expect, jest } from "@jest/globals";
import { body, validationResult } from "express-validator";
import { validate } from "../../middleware/validate.js";

async function runValidator(validators, body_) {
  const req = { body: body_ };
  for (const v of validators) await v.run(req);
  return req;
}

describe("validate middleware", () => {
  it("calls next() with no error when validation passes", async () => {
    const validators = [body("email").isEmail()];
    const req = await runValidator(validators, { email: "test@example.com" });
    const next = jest.fn();
    validate(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("calls next(err) with a 400 ApiError when validation fails", async () => {
    const validators = [body("email").isEmail()];
    const req = await runValidator(validators, { email: "not-an-email" });
    const next = jest.fn();
    validate(req, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
    expect(err.errors[0].field).toBe("email");
  });
});
