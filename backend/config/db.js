// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 🛡️ Auto-reconcile legacy problematic registryId_1 index
    try {
      const kittensCollection = mongoose.connection.collection("kittens");
      const indexes = await kittensCollection.indexes();
      const legacyRegIndex = indexes.find((idx) => idx.name === "registryId_1");

      if (legacyRegIndex && !legacyRegIndex.sparse) {
        await kittensCollection.dropIndex("registryId_1");
        console.log("✅ Successfully dropped problematic legacy non-sparse registryId_1 index from kittens collection");
      }

      // Ensure sparse index is active so null values never collide
      await kittensCollection.createIndex({ registryId: 1 }, { unique: true, sparse: true });
    } catch (idxErr) {
      // Non-fatal if index doesn't exist yet or connection is in test environment
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;