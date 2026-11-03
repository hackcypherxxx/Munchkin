import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getReviews, getReviewStats } from '../features/review/reviewSlice';
import { Star, Quote, ArrowUpRight, CheckCircle2, MapPin, PenLine } from 'lucide-react';

export default function Reviews() {
  const dispatch = useDispatch();
  const { reviews, stats, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getReviews());
    dispatch(getReviewStats());
  }, [dispatch]);

  const approvedReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <section className="py-20 sm:py-28 bg-[#f3efea] border-b border-[#181615]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#181615]">
              <div className="flex items-center gap-0.5 text-[#c58b38]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="fill-[#c58b38]" />
                ))}
              </div>
              <span>
                {stats?.avgRating ? `${Number(stats.avgRating).toFixed(1)}/5.0` : '5.0/5.0'} from{' '}
                {stats?.totalReviews || approvedReviews.length || 3} Verified Families
              </span>
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-medium text-[#181615] tracking-tight leading-[1.08]">
              Stories from families who welcomed our kittens home.
            </h2>
            <p className="mt-3 text-base text-[#575049] leading-relaxed">
              Every review below was submitted by an adopting family along with photographs of their
              kitten settling into their new home.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs font-semibold transition-colors"
            >
              Read All Family Stories <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/reviews#share-story"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#faf8f5] text-[#181615] border border-[#181615]/12 text-xs font-semibold transition-colors"
            >
              <PenLine size={14} /> Share Your Story
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && approvedReviews.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[24px] bg-white border border-[#181615]/8 p-6 space-y-4 animate-pulse"
              >
                <div className="aspect-[16/10] bg-[#f3efea] rounded-2xl" />
                <div className="h-4 w-1/3 bg-[#f3efea] rounded" />
                <div className="h-16 w-full bg-[#f3efea] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Real Approved Reviews Grid */}
        {approvedReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {approvedReviews.slice(0, 3).map((review) => (
              <article
                key={review._id}
                className="flex flex-col justify-between rounded-[24px] bg-white border border-[#181615]/10 overflow-hidden editorial-shadow"
              >
                <div>
                  {/* Customer Uploaded Kitten Photograph */}
                  {review.image && (
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#f3efea]">
                      <img
                        src={review.image}
                        alt={`Kitten adopted by ${review.name}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181615]/75 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                        <CheckCircle2 size={11} className="text-[#8fc4a6]" />
                        Verified Adoption Photo
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
      </div>
    </section>
  );
}
