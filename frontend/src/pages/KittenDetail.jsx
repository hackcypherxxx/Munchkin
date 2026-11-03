import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKittenById, getKittens } from '../features/kitten/kittenSlice';
import KittenCard from '../components/KittenCard';
import PageMeta from '../components/PageMeta';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ShieldCheck,
  Stethoscope,
  MapPin,
  Plane,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { getKittenPresentation } from '../utils/kittenFormatters';

export default function KittenDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { kitten: selectedKitten, kittens, loading } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const defaultLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActivePhotoIndex(0);
    setLightboxOpen(false);
    if (id) {
      dispatch(getKittenById(id));
    }
    if (!kittens || kittens.length === 0) {
      dispatch(getKittens());
    }
  }, [id, dispatch]);

  // Resolve kitten from either selectedKitten or cached list
  const kitten =
    (selectedKitten && selectedKitten._id === id ? selectedKitten : null) ||
    (Array.isArray(kittens) ? kittens.find((k) => k._id === id) : null);

  const presentation = getKittenPresentation(kitten);
  const images = presentation.images;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  if (loading && !kitten) {
    return (
      <main className="min-h-screen bg-[#faf8f5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="h-5 w-48 bg-[#f3efea] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 aspect-[4/4.3] bg-[#f3efea] rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-12 w-2/3 bg-[#f3efea] rounded-xl" />
              <div className="h-6 w-1/2 bg-[#f3efea] rounded-xl" />
              <div className="h-48 w-full bg-[#f3efea] rounded-3xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!kitten) {
    return (
      <main className="min-h-screen bg-[#faf8f5] py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="rounded-3xl bg-white border border-[#181615]/10 p-10 space-y-4">
            <h1 className="font-serif text-3xl font-semibold text-[#181615]">
              Kitten Profile Not Found
            </h1>
            <p className="text-sm text-[#575049]">
              This kitten may have recently been adopted or moved. Browse our current available
              kittens in the nursery below.
            </p>
            <Link
              to="/available-kittens"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold"
            >
              <ArrowLeft size={14} /> Back to Available Kittens
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isAvailable = kitten.status === 'Available';
  const catteryLocation = kitten.location || defaultLocation;

  const biologicalSpecs = [
    { label: 'Gender', value: kitten.gender || 'Munchkin' },
    { label: 'Current Age', value: presentation.ageLabel },
    { label: 'Coat Variety', value: kitten.coat || 'Standard' },
    ...(presentation.specs.all.length > 0
      ? presentation.specs.all
      : [
          { label: 'Litter Box Trained', value: 'Yes (100%)' },
          { label: 'Upbringing', value: `Indoor Family Home (${catteryLocation})` },
        ]),
  ];

  const medicalRecords =
    Array.isArray(kitten.medical) && kitten.medical.length > 0
      ? kitten.medical.map((m) => ({
          title: m.title || m.event || 'Veterinary Procedure',
          status: m.status || 'Completed',
          date:
            m.date ||
            (m.week
              ? /week/i.test(String(m.week))
                ? String(m.week).trim()
                : `Week ${String(m.week).trim()}`
              : ''),
        }))
      : [
          {
            title: 'Core FVRCP Vaccination',
            status:
              kitten.medical?.vaccinated === false
                ? 'Scheduled / Age-Appropriate'
                : 'Completed & Logged',
            date: presentation.ageLabel,
          },
          {
            title: 'Broad-Spectrum Deworming Protocol',
            status:
              kitten.medical?.dewormed === false
                ? 'Scheduled Prior to Departure'
                : 'Completed (2, 4, 6, 8 Wks)',
            date: 'Up to Date',
          },
          {
            title: 'Licensed Veterinarian Physical Exam',
            status:
              kitten.medical?.vetChecked === false
                ? 'Scheduled Prior to Departure'
                : 'Passed (Heart, Lungs, Eyes, Coat)',
            date: kitten.medical?.healthGuarantee || 'Certified',
          },
          {
            title: 'Microchip Identification',
            status:
              kitten.medical?.microchipped === false
                ? 'Optional Upon Request'
                : 'Included Prior to Departure',
            date: kitten.lineage?.registry || kitten.registryId || 'Registered',
          },
        ];

  const relatedKittens = Array.isArray(kittens)
    ? kittens
        .filter((k) => k._id !== kitten._id && k.status === 'Available')
        .slice(0, 3)
    : [];

  const applyUrl = `/apply?id=${kitten._id}&type=kitten&name=${encodeURIComponent(kitten.name)}`;

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-28">
      <PageMeta
        title={
          kitten.seoTitle ||
          `${kitten.name} — ${kitten.gender || ''} ${kitten.coat || 'Munchkin'} Kitten ($${
            kitten.price
          })`
        }
        description={kitten.seoDescription || presentation.description}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-[#f3efea] border-b border-[#181615]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#575049]">
            <Link to="/" className="hover:text-[#181615] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/available-kittens" className="hover:text-[#181615] transition-colors">
              Available Kittens
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#181615]">{kitten.name}</span>
          </nav>

          <Link
            to="/available-kittens"
            className="inline-flex items-center gap-1.5 font-semibold text-[#181615] hover:text-[#9e5a3c] transition-colors"
          >
            <ArrowLeft size={13} /> All Kittens
          </Link>
        </div>
      </div>

      {/* Main Profile Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Multi-Photo Gallery + Detailed Documentation (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <div className="relative aspect-[4/4.3] w-full rounded-[28px] overflow-hidden bg-[#f3efea] border border-[#181615]/10 editorial-shadow group">
                <img
                  src={images[activePhotoIndex] || images[0]}
                  alt={`${kitten.name} — photo ${activePhotoIndex + 1} of ${images.length}`}
                  onClick={() => setLightboxOpen(true)}
                  className="h-full w-full object-cover cursor-zoom-in transition-transform duration-500"
                />

                {/* Top Status & Registry Overlay */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs ${
                      isAvailable
                        ? 'bg-white/95 text-[#263b30]'
                        : 'bg-[#fbf6f3]/95 text-[#84472c]'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAvailable ? 'bg-[#2e7d52] animate-pulse' : 'bg-[#c57b38]'
                      }`}
                    />
                    {kitten.status || 'Available'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181615]/75 hover:bg-[#181615] backdrop-blur-md text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Maximize2 size={13} />
                    Expand ({activePhotoIndex + 1}/{images.length})
                  </button>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length)
                      }
                      aria-label="Previous photo"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-[#181615] flex items-center justify-center shadow-md transition-all cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIndex((prev) => (prev + 1) % images.length)}
                      aria-label="Next photo"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-[#181615] flex items-center justify-center shadow-md transition-all cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3.5 grid grid-cols-5 gap-2.5">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      aria-label={`Select photo ${idx + 1}`}
                      className={`relative aspect-square rounded-2xl overflow-hidden border transition-all cursor-pointer ${
                        idx === activePhotoIndex
                          ? 'border-[#9e5a3c] ring-2 ring-[#9e5a3c]/30'
                          : 'border-[#181615]/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${kitten.name} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About This Kitten Bio */}
            <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Individual Temperament & Notes
                </span>
                {kitten.registryId && (
                  <span className="font-mono text-xs text-[#8a8075]">
                    Registry ID: {kitten.registryId}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                Meet {kitten.name}
              </h2>
              <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
                {presentation.description}
              </p>
            </div>

            {/* Biological Specifications Table */}
            <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                Physical & Conformation Profile
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                Kitten Specifications
              </h2>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {biologicalSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#181615]">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Veterinary & Vaccination Record */}
            <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#263b30]">
                    Veterinary Protocol
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                    Medical & Vaccination Log
                  </h2>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[#ebf1ee] text-[#263b30] flex items-center justify-center shrink-0">
                  <Stethoscope size={20} />
                </div>
              </div>

              <div className="mt-6 divide-y divide-[#181615]/8 border-t border-b border-[#181615]/8">
                {medicalRecords.map((med, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={17} className="text-[#263b30] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-[#181615]">{med.title}</p>
                        <p className="text-xs text-[#575049]">{med.status}</p>
                      </div>
                    </div>
                    {med.date && (
                      <span className="font-mono text-xs font-medium text-[#8a8075] bg-[#faf8f5] px-3 py-1 rounded-full self-start sm:self-center">
                        {med.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Lineage Section */}
            {Array.isArray(kitten.lineage) && kitten.lineage.length > 0 && (
              <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Pedigree & Parents
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                  Parental Lineage
                </h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {kitten.lineage.map((parent, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#faf8f5] border border-[#181615]/8 p-5 space-y-1.5"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9e5a3c]">
                        {parent.role || parent.relation || 'Parent Lineage'}
                      </span>
                      <p className="font-serif text-xl font-semibold text-[#181615]">
                        {parent.name}
                      </p>
                      {parent.title && (
                        <p className="text-xs font-medium text-[#575049]">{parent.title}</p>
                      )}
                      {parent.reg && (
                        <p className="font-mono text-[11px] text-[#8a8075]">{parent.reg}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Adoption & Reservation Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="rounded-[28px] bg-white border border-[#181615]/12 p-7 sm:p-8 editorial-shadow space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#181615]/8 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9e5a3c]">
                      <MapPin size={13} />
                      {catteryLocation}
                    </span>
                    {presentation.badgeLabel && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f3efea] text-[11px] font-medium text-[#575049]">
                        {presentation.badgeLabel}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[#181615] tracking-tight leading-none">
                    {kitten.name}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-[#575049]">
                    {presentation.subtitle}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8a8075]">
                    Adoption Fee
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-semibold text-[#181615]">
                    ${kitten.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {isAvailable ? (
                  <Link
                    to={applyUrl}
                    className="w-full py-4 px-6 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    Reserve {kitten.name} Today
                    <ArrowUpRight size={17} />
                  </Link>
                ) : (
                  <Link
                    to={applyUrl}
                    className="w-full py-4 px-6 rounded-full bg-[#9e5a3c] hover:bg-[#84472c] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {kitten.name} is Reserved — Enquire for Similar Kittens
                    <ArrowUpRight size={16} />
                  </Link>
                )}

                <Link
                  to="/contact"
                  className="w-full py-3.5 px-6 rounded-full bg-[#f3efea] hover:bg-[#e8e1d5] text-[#181615] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare size={15} />
                  Ask Our Breeder About {kitten.name}
                </Link>

                {catteryPhone && (
                  <a
                    href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                    className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-[#faf8f5] border border-[#181615]/15 text-[#181615] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone size={15} className="text-[#9e5a3c]" />
                    Call or Text Nursery: {catteryPhone}
                  </a>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a8075]">
                  Included With {kitten.name}’s Adoption
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#181615]">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-[#263b30] shrink-0" />
                    <span>72-Hour General Health & 2-Year Genetic Guarantee</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Stethoscope size={16} className="text-[#263b30] shrink-0" />
                    <span>Licensed Veterinarian Health Certificate & FVRCP Vaccines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#9e5a3c] shrink-0" />
                    <span>Microchip Identification & Starter Transition Kit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Plane size={16} className="text-[#9e5a3c] shrink-0" />
                    <span>Free Owego, NY Pickup or Nationwide Flight Nanny Delivery</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#181615]/8 grid grid-cols-2 gap-3 text-xs">
                <Link
                  to="/shipping"
                  className="p-3 rounded-2xl bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/8 font-semibold text-[#181615] flex items-center justify-between"
                >
                  <span>Delivery Options</span>
                  <ArrowUpRight size={13} className="text-[#9e5a3c]" />
                </Link>
                <Link
                  to="/health"
                  className="p-3 rounded-2xl bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/8 font-semibold text-[#181615] flex items-center justify-between"
                >
                  <span>Health Warranty</span>
                  <ArrowUpRight size={13} className="text-[#9e5a3c]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Kittens Section */}
        {relatedKittens.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#181615]/10">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e5a3c]">
                  More Nursery Companions
                </span>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#181615]">
                  Other available kittens you may love
                </h2>
              </div>
              <Link
                to="/available-kittens"
                className="text-xs sm:text-sm font-semibold text-[#181615] hover:text-[#9e5a3c] inline-flex items-center gap-1"
              >
                View All Kittens <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {relatedKittens.map((rel) => (
                <KittenCard key={rel._id} kitten={rel} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#181615]/12 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-xl font-semibold text-[#181615] leading-none">
            {kitten.name}
          </p>
          <p className="text-xs font-mono font-semibold text-[#9e5a3c] mt-0.5">
            ${kitten.price} · {kitten.status}
          </p>
        </div>
        <Link
          to={applyUrl}
          className="px-6 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold inline-flex items-center gap-1.5"
        >
          {isAvailable ? `Reserve ${kitten.name}` : 'Enquire Now'}
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${kitten.name} photo gallery`}
          className="fixed inset-0 z-50 bg-[#181615]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="font-serif text-2xl font-semibold">{kitten.name}</p>
              <p className="text-xs text-white/60">
                Photograph {activePhotoIndex + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={images[activePhotoIndex] || images[0]}
              alt={`${kitten.name} fullscreen portrait`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-6 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-6 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-14 w-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    idx === activePhotoIndex
                      ? 'border-[#e8b496] scale-105'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
