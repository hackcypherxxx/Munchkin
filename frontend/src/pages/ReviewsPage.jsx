import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReviews,
  getReviewStats,
  createReview,
  clearReviewState,
} from '../features/review/reviewSlice';
import PageMeta from '../components/PageMeta';
import {
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  Upload,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function ReviewsPage() {
  const dispatch = useDispatch();
  const { reviews, stats, loading, success, error } = useSelector((state) => state.review);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    rating: 5,
    text: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getReviews());
    dispatch(getReviewStats());
    return () => dispatch(clearReviewState());
  }, [dispatch]);

  const approvedReviews = Array.isArray(reviews) ? reviews : [];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('location', formData.location);
    fd.append('rating', String(formData.rating));
    fd.append('review', formData.text);
    fd.append('text', formData.text);
    if (imageFile) {
      fd.append('image', imageFile);
    }
    dispatch(createReview(fd));
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Verified Adopter Stories & Reviews"
        description="Read verified stories and see real photos from families who adopted their Munchkin kittens from MunchkinKittie."
      />

      {/* Editorial Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#181615]">
              <div className="flex items-center gap-0.5 text-[#c58b38]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="fill-[#c58b38]" />
                ))}
              </div>
              <span>
                {stats?.avgRating ? `${Number(stats.avgRating).toFixed(1)} / 5.0` : '5.0 / 5.0'}{' '}
                Average Rating ({stats?.totalReviews || approvedReviews.length || 3} Verified Reviews)
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Verified Family Stories
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed">
              Real experiences and home photographs shared by families who welcomed a MunchkinKittie
              companion into their lives.
            </p>
          </div>

          <a
            href="#share-story"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors self-start lg:self-end"
          >
            <Sparkles size={14} /> Submit Your Adoption Story
          </a>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {approvedReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {approvedReviews.map((review) => (
              <article
                key={review._id}
                className="flex flex-col justify-between rounded-[24px] bg-white border border-[#181615]/10 overflow-hidden editorial-shadow"
              >
                <div>
                  {review.image && (
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#f3efea]">
                      <img
                        src={review.image}
                        alt={`Kitten adopted by ${review.name}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181615]/75 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                        <CheckCircle2 size={11} className="text-[#8fc4a6]" />
                        Verified Family Photo
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-0.5 text-[#c58b38]">
                        {Array.from({ length: Number(review.rating) || 5 }).map((_, i) => (
                          <Star key={i} size={14} className="fill-[#c58b38]" />
                        ))}
                      </div>
                      <Quote size={18} className="text-[#9e5a3c]/35" />
                    </div>
                    <p className="text-sm sm:text-[15px] text-[#181615] leading-relaxed">
                      “{String(review.review || review.text || '').trim()}”
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#faf8f5] border-t border-[#181615]/8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#181615]">{review.name}</p>
                    <p className="text-xs text-[#575049] inline-flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#9e5a3c]" />
                      {review.location || 'United States'}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#8a8075]">
                    {review.date ||
                      (review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                        : '')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Submit Review Form Section */}
        <div
          id="share-story"
          className="mt-20 pt-16 border-t border-[#181615]/10 max-w-3xl mx-auto"
        >
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-10 editorial-shadow">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
              Adopted From MunchkinKittie?
            </span>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
              Share your kitten’s story & photo
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#575049]">
              We love seeing how our kittens grow in their new homes. Submitted reviews are verified
              by our nursery team before appearing publicly.
            </p>

            {success ? (
              <div className="mt-6 p-6 rounded-2xl bg-[#ebf1ee] border border-[#263b30]/20 text-center space-y-2">
                <CheckCircle2 size={28} className="mx-auto text-[#263b30]" />
                <p className="font-serif text-2xl font-semibold text-[#181615]">
                  Thank You for Sharing Your Story!
                </p>
                <p className="text-xs text-[#575049]">
                  Your review and photo have been received and will appear once approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="reviewer-name"
                      className="block text-xs font-semibold text-[#181615] mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="reviewer-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sarah & Mark"
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer-email"
                      className="block text-xs font-semibold text-[#181615] mb-1.5"
                    >
                      Your Email (Private) *
                    </label>
                    <input
                      id="reviewer-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., sarah@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer-location"
                      className="block text-xs font-semibold text-[#181615] mb-1.5"
                    >
                      Your City & State *
                    </label>
                    <input
                      id="reviewer-location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Boston, MA"
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#181615] mb-1.5">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={
                              star <= formData.rating
                                ? 'text-[#c58b38] fill-[#c58b38]'
                                : 'text-[#8a8075]/40'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181615] mb-1.5">
                      Upload Kitten Photo *
                    </label>
                    <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-dashed border-[#181615]/25 cursor-pointer hover:border-[#9e5a3c] text-xs font-medium text-[#575049]">
                      <Upload size={15} className="text-[#9e5a3c]" />
                      <span className="truncate">
                        {imageFile ? imageFile.name : 'Choose a photo of your kitten...'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {imagePreview && (
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border border-[#181615]/10">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reviewer-text"
                    className="block text-xs font-semibold text-[#181615] mb-1.5"
                  >
                    Your Experience *
                  </label>
                  <textarea
                    id="reviewer-text"
                    rows={4}
                    required
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Tell future families about your kitten and adoption experience..."
                    className="w-full p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Submitting Story...
                    </>
                  ) : (
                    'Submit Review for Verification'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
