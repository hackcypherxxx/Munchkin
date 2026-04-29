import Review from "../models/Review.js";
import { sendReviewEmail } from "../utils/sendEmail.js";

export const createReview = async (req, res) => {
  try {
    let { name, location, email, review, rating } = req.body;

    // ✅ validate all fields
    if (!name || !location || !email || !review || !rating) {
      return res.status(400).json({ error: "All fields required" });
    }

    email = email.toLowerCase().trim();

    // 🔒 30-day rule
    const lastReview = await Review.findOne({ email }).sort({ createdAt: -1 });

    if (lastReview) {
      const diffDays =
        (Date.now() - new Date(lastReview.createdAt)) /
        (1000 * 60 * 60 * 24);

      if (diffDays < 30) {
        return res.status(403).json({
          error: `You can review again in ${Math.ceil(30 - diffDays)} days`,
        });
      }
    }

    // 🖼️ image from multer
    const image = req.file?.path || null;

    // 📝 create review
    await Review.create({
      name,
      location,
      email,
      review,
      rating,
      image,
      isApproved: false,
    });

    // 📧 send email
    sendReviewEmail(email);

    res.status(201).json({
      message: "Review submitted and awaiting approval",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};



// 🌍 GET ONLY APPROVED REVIEWS (PUBLIC)
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};



// ⭐ GET STATS (ONLY APPROVED REVIEWS)
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: { isApproved: true }, // 🔥 IMPORTANT
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({
      avgRating: stats[0]?.avgRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};



// 👑 ADMIN: GET ALL REVIEWS (INCLUDING UNAPPROVED)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};



// ✅ ADMIN: APPROVE REVIEW
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.isApproved = true;
    await review.save();

    res.json({ message: "Review approved successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to approve review" });
  }
};



// ❌ ADMIN: DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};