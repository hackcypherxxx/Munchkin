import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRetired } from '../features/retired/retiredSlice';
import PageMeta from '../components/PageMeta';
import { Heart, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function RetiredAdults() {
  const dispatch = useDispatch();
  const { retiredList, loading } = useSelector((state) => state.retired);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  useEffect(() => {
    dispatch(getRetired());
  }, [dispatch]);

  const cats = Array.isArray(retiredList) ? retiredList : [];

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Retired Breeding Queens & Sires"
        description={`Learn about our retired adult Munchkin cats in ${catteryLocation} and how to apply for a gentle adult companion.`}
      />

      {/* Editorial Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <Heart size={13} /> Gentle Adult Companions · {catteryLocation}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Retired Breeding Adults
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed">
              To ensure every parent cat in our {catteryLocation} home enjoys a peaceful life as a
              cherished pet, we retire our breeding queens and sires at a young adult age (typically
              2–4 years old), spayed or neutered and up to date on all veterinary care.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {loading && cats.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[24px] bg-white border border-[#181615]/8 h-96 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && cats.length === 0 && (
          <div className="rounded-[28px] bg-white border border-[#181615]/10 overflow-hidden editorial-shadow grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ebe6] text-[#84472c] text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} /> All Retired Adults Currently Placed
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615] leading-tight">
                No retired adults are currently seeking placement.
              </h2>
              <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
                All of our recently retired queens and sires have already settled into their forever
                homes. If you prefer a calm, affectionate young adult cat, you can register on our
                Retired Adult Waitlist below—or explore our currently available Munchkin kittens.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/available-kittens"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  Browse Available Kittens <ArrowUpRight size={15} />
                </Link>
                <Link
                  to="/apply?type=retired&name=Retired%20Adult%20Waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#f3efea] hover:bg-[#e8e1d5] text-[#181615] text-xs sm:text-sm font-semibold transition-colors"
                >
                  Join Retired Adult Waitlist
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 h-full min-h-[280px] bg-[#f3efea]">
              <img
                src={CATTERY_PHOTOS.editorialWhite}
                alt={`Munchkin cat in ${catteryLocation}`}
                className="h-full w-full object-cover max-h-[380px]"
              />
            </div>
          </div>
        )}

        {cats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {cats.map((cat) => (
              <Link
                key={cat._id}
                to={`/apply?id=${cat._id}&type=retired&name=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col bg-white rounded-[24px] border border-[#181615]/10 overflow-hidden editorial-card-hover"
              >
                <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#f3efea]">
                  <img
                    src={cat.image || cat.img || CATTERY_PHOTOS.editorialWhite}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-[#263b30] text-[11px] font-semibold uppercase tracking-wider">
                      {cat.status || 'Available'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-serif text-2xl font-semibold text-[#181615] group-hover:text-[#9e5a3c]">
                        {cat.name}
                      </h2>
                      <span className="font-mono text-lg font-semibold text-[#181615]">
                        ${cat.adoptionFee ?? cat.fee}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#575049]">
                      {[cat.gender, cat.age, cat.breed || 'Munchkin'].filter(Boolean).join(' · ')}
                    </p>
                    {(cat.description || cat.personality) && (
                      <p className="mt-3 text-xs text-[#575049] leading-relaxed">
                        {cat.description || cat.personality}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-[#181615]/8 flex items-center justify-between text-xs font-semibold text-[#181615]">
                    <span className="inline-flex items-center gap-1 text-[#263b30]">
                      <ShieldCheck size={14} /> Spayed/Neutered & Vet Checked
                    </span>
                    <span className="inline-flex items-center gap-1 group-hover:text-[#9e5a3c]">
                      Apply <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
