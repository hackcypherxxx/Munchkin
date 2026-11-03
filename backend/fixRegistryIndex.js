// fixRegistryIndex.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB:", mongoose.connection.name);

    const kittensCollection = mongoose.connection.collection("kittens");
    const indexes = await kittensCollection.indexes();
    console.log("Existing indexes on kittens collection:", indexes.map((i) => i.name));

    const legacyIndex = indexes.find((idx) => idx.name === "registryId_1");
    if (legacyIndex) {
      console.log("Found legacy registryId_1 index (sparse:", Boolean(legacyIndex.sparse), ")");
      await kittensCollection.dropIndex("registryId_1");
      console.log("✅ Successfully dropped legacy registryId_1 index!");
    } else {
      console.log("Legacy registryId_1 index not found or already dropped.");
    }

    // Backfill any kitten records that have null, missing, or empty registryId
    const nullKittens = await kittensCollection
      .find({
        $or: [
          { registryId: null },
          { registryId: { $exists: false } },
          { registryId: "" },
        ],
      })
      .toArray();

    console.log(`Found ${nullKittens.length} kitten(s) with null/missing registryId. Backfilling...`);
    for (const k of nullKittens) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const year = new Date().getFullYear();
      const generatedRegId = `MK-${year}-${randomPart}`;
      await kittensCollection.updateOne(
        { _id: k._id },
        { $set: { registryId: generatedRegId } }
      );
      console.log(`Assigned registryId ${generatedRegId} to kitten "${k.name || k._id}"`);
    }

    // Create safe sparse unique index
    console.log("Creating safe sparse unique index on registryId...");
    await kittensCollection.createIndex({ registryId: 1 }, { unique: true, sparse: true });
    console.log("✅ Successfully created sparse unique index on registryId!");

    console.log("🎉 Complete: Kitten creation will no longer encounter E11000 duplicate key error.");
  } catch (err) {
    console.error("🔥 Error executing fix:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();

