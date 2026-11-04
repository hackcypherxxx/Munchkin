import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight, Camera, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { getKittenPresentation } from '../utils/kittenFormatters';

/**
 * Entire card is a single semantic <Link> to `/kitten/${kitten._id}`.
 * Zero nested interactive elements to guarantee 100% accessible full-card clickability.
 */
export default function KittenCard({ kitten, priority = false }) {
  if (!kitten || !kitten._id) return null;

  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = (kitten.location || activeSettings?.mainLocation || '').trim();

  const {
    ageLabel,
    badgeLabel,
    specs,
    primaryImage,
    secondaryImage,
    images,
  } = getKittenPresentation(kitten);

  const isAvailable = kitten.status === 'Available';
  const isReserved = kitten.status === 'Reserved';
  const isFeatured = Boolean(kitten.isFeatured || kitten.featured);

  return (
    <Link
      to={`/kitten/${kitten._id}`}
      aria-label={`View ${kitten.name}, ${kitten.gender || ''} ${kitten.coat || 'Munchkin'} kitten — $${kitten.price}`}
      className="group relative flex flex-col bg-white rounded-[24px] border border-[#181615]/10 overflow-hidden editorial-card-hover focus-visible:ring-2 focus-visible:ring-[#9e5a3c]"
    >
      {/* 4:5 Portrait Image Stage */}
      <div className="relative aspect-[4/4.7] w-full overflow-hidden bg-[#f3efea]">
        <img
          src={primaryImage}
          alt={`${kitten.name} — ${kitten.gender || ''} Munchkin kitten${catteryLocation ? ` in ${catteryLocation}` : ''}`}
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${
            secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${kitten.name} alternate portrait`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
          />
        )}

        {/* Subtle lower vignette for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#181615]/45 via-[#181615]/10 to-transparent" />

        {/* Top Bar: Availability Pill & Photo Count */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs ${
              isAvailable
                ? 'bg-white/95 text-[#263b30] border border-[#263b30]/15'
                : isReserved
                ? 'bg-[#fbf6f3]/95 text-[#84472c] border border-[#9e5a3c]/25'
                : 'bg-[#181615]/85 text-white'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAvailable
                  ? 'bg-[#2e7d52] animate-pulse'
                  : isReserved
                  ? 'bg-[#c57b38]'
                  : 'bg-stone-400'
              }`}
            />
            {kitten.status || 'Available'}
          </span>

          <div className="flex items-center gap-1.5">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181615]/80 backdrop-blur-md text-[#f5ebe6] text-[10px] font-semibold tracking-wider uppercase">
                <Sparkles size={10} className="text-[#d99b78]" /> Featured
              </span>
            )}
            {images.length > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181615]/70 backdrop-blur-md text-white text-[11px] font-medium">
                <Camera size={11} />
                {images.length}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Overlay inside photo: Registry ID + Location */}
        <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between text-white/95 text-[11px] font-medium">
          {catteryLocation ? (
            <span className="inline-flex items-center gap-1 bg-[#181615]/55 backdrop-blur-md px-2.5 py-1 rounded-full">
              <MapPin size={11} className="text-[#e8b496]" />
              {catteryLocation}
            </span>
          ) : <span />}
          {kitten.registryId && (
            <span className="font-mono text-[10px] tracking-wider bg-[#181615]/55 backdrop-blur-md px-2.5 py-1 rounded-full">
              {kitten.registryId}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Name & Price Row */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[26px] sm:text-[28px] font-semibold text-[#181615] tracking-tight leading-none group-hover:text-[#9e5a3c] transition-colors">
              {kitten.name}
            </h3>
            <div className="text-right shrink-0">
              <span className="font-mono text-lg sm:text-xl font-semibold text-[#181615]">
                ${kitten.price}
              </span>
            </div>
          </div>

          {/* Primary Metadata Row */}
          <p className="mt-2 text-xs sm:text-[13px] font-medium text-[#575049]">
            {[kitten.gender, ageLabel, `${kitten.coat || 'Standard'} Coat`].filter(Boolean).join('  ·  ')}
          </p>

          {/* Attribute Chips */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {specs.color && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#181615]/8 text-[11px] font-medium text-[#575049]">
                {specs.color}
              </span>
            )}
            {specs.eyeColor && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#181615]/8 text-[11px] font-medium text-[#575049]">
                {specs.eyeColor} Eyes
              </span>
            )}
            {specs.earType && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#181615]/8 text-[11px] font-medium text-[#575049]">
                {specs.earType} Ears
              </span>
            )}
            {!specs.color && !specs.eyeColor && badgeLabel && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#181615]/8 text-[11px] font-medium text-[#575049]">
                {badgeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-[#181615]/8 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#575049]">
            <ShieldCheck size={14} className="text-[#263b30]" />
            Vet Checked & Vaccinated
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#181615] group-hover:text-[#9e5a3c] transition-colors">
            View Profile
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
