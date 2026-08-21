import mongoose from "mongoose";
import { env } from "../config/env.js";

export function setupTestDB() {
  beforeAll(async () => {
    await mongoose.connect(env.mongoUri);
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}
