import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUpcoming } from '../features/upcoming/upcomingSlice';
import PageMeta from '../components/PageMeta';
import { Calendar, Sparkles, ArrowUpRight, Bell, Heart } from 'lucide-react';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function UpcomingLitters() {
  const dispatch = useDispatch();
  const { upcomingList, loading } = useSelector((state) => state.upcoming);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';

  useEffect(() => {
    dispatch(getUpcoming());
  }, [dispatch]);

  const litters = Array.isArray(upcomingList) ? upcomingList : [];

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Upcoming Munchkin Litters & Priority Waitlist"
        description={`View confirmed upcoming Munchkin litters${catteryLocation ? ` in ${catteryLocation}` : ''} and join our priority waitlist for early selection.`}
      />

      {/* Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <Calendar size={13} /> {catteryLocation ? `Planned Pairings · ${catteryLocation}` : 'Planned Pairings'}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Upcoming Litters & Waitlist
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed">
              Explore our confirmed upcoming pairings below. Joining the priority waitlist gives you
              early notifications when new kittens are born and ready for reservation.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {loading && litters.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="rounded-[28px] bg-white border border-[#181615]/8 h-96 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && litters.length === 0 && (
          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-12 text-center max-w-2xl mx-auto space-y-4">
            <Calendar size={28} className="mx-auto text-[#9e5a3c]" />
            <h2 className="font-serif text-3xl font-semibold text-[#181615]">
              Our Current Litter is Already Here
            </h2>
            <p className="text-sm text-[#575049] leading-relaxed">
              We currently have available kittens ready in our nursery! Browse our available kittens
              or submit a general waitlist application for our next planned pairing.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/available-kittens"
                className="px-6 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold"
              >
                View Available Kittens
              </Link>
              <Link
                to="/apply?type=upcoming"
                className="px-6 py-3 rounded-full bg-[#f3efea] text-[#181615] text-xs font-semibold"
              >
                Join General Waitlist
              </Link>
            </div>
          </div>
        )}

        {litters.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {litters.map((litter) => {
              const title = litter.title || litter.pairing || 'Confirmed Pairing';
              const arrival = litter.expectedArrival || litter.dueDate || 'Coming Soon';
              const photo = litter.image || litter.img || CATTERY_PHOTOS.editorialLounge;
              return (
                <div
                  key={litter._id}
                  className="lg:col-span-12 rounded-[28px] bg-white border border-[#181615]/10 overflow-hidden editorial-shadow grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-5 relative min-h-[280px] bg-[#f3efea]">
                    <img
                      src={photo}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#263b30] text-xs font-semibold uppercase tracking-wider shadow-xs">
                        <Sparkles size={12} className="text-[#9e5a3c]" />
                        {litter.status || 'Confirmed Pairing'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                        Upcoming Nursery Arrival
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
                        {title}
                      </h2>
                      {litter.description && (
                        <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
                          {litter.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                            Expected Arrival
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#181615]">
                            {arrival}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                            Estimated Litter Size
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#181615]">
                            {litter.expectedCount || '4 - 6 Kittens'}
                          </p>
                        </div>
                        {catteryLocation && (
                          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                              Nursery Location
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#181615]">
                              {catteryLocation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#181615]/8 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs text-[#575049]">
                        Reserve a priority notification spot for this litter.
                      </p>
                      <Link
                        to={`/apply?id=${litter._id}&type=upcoming&name=${encodeURIComponent(
                          title
                        )}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold transition-colors"
                      >
                        <Bell size={14} /> Join Waitlist for This Litter <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
