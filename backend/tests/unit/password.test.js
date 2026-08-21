import { describe, it, expect } from "@jest/globals";
import bcrypt from "bcryptjs";

describe("password hashing (bcrypt, as used by the User model)", () => {
  it("produces a hash that verifies against the original password", async () => {
    const hash = await bcrypt.hash("Password123!", 12);
    expect(await bcrypt.compare("Password123!", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await bcrypt.hash("Password123!", 12);
    expect(await bcrypt.compare("WrongPassword", hash)).toBe(false);
  });

  it("never stores the password in plain text", async () => {
    const hash = await bcrypt.hash("Password123!", 12);
    expect(hash).not.toBe("Password123!");
    expect(hash.startsWith("$2")).toBe(true);
  });
});
