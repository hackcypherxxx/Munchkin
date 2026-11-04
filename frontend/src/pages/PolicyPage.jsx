import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageMeta from '../components/PageMeta';
import { ShieldCheck, FileText, Lock, Heart } from 'lucide-react';

export default function PolicyPage() {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title="Adoption Terms & Privacy Policy"
        description="Review MunchkinKittie's adoption contract standards, non-declawing policy, 72-hour & 2-year health warranty terms, and applicant privacy policy."
      />

      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
            <FileText size={13} /> Policies & Ethical Standards
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#181615] tracking-tight">
            Adoption Terms & Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
            Clear, ethical policies designed to protect the lifelong wellbeing of our kittens and
            the privacy of our adopting families.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="rounded-[24px] bg-white border border-[#181615]/10 p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2.5 text-[#263b30]">
            <ShieldCheck size={20} />
            <h2 className="font-serif text-2xl font-semibold text-[#181615]">
              1. Indoor-Only & Non-Declawing Welfare Covenant
            </h2>
          </div>
          <p className="text-sm text-[#575049] leading-relaxed">
            All kittens adopted from MunchkinKittie are placed strictly as indoor family companions.
            Adopters agree never to declaw their kitten (surgicalonychectomy), as declawing is
            harmful to feline joint health and mobility. Regular nail trimming and scratching posts
            are required instead.
          </p>
        </div>

        <div className="rounded-[24px] bg-white border border-[#181615]/10 p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2.5 text-[#9e5a3c]">
            <Heart size={20} />
            <h2 className="font-serif text-2xl font-semibold text-[#181615]">
              2. Health Guarantee & Rehoming Safeguard
            </h2>
          </div>
          <p className="text-sm text-[#575049] leading-relaxed">
            Every kitten is covered by a 72-hour general health guarantee and a 2-year genetic
            warranty against life-threatening congenital defects. Furthermore, a MunchkinKittie cat
            must never be surrendered to a shelter or humane society; if an adopter can no longer
            care for their cat at any point in the cat’s life, our{catteryLocation ? ` ${catteryLocation}` : ''} cattery will assist in
            receiving or safely rehoming the cat.
          </p>
        </div>

        <div className="rounded-[24px] bg-white border border-[#181615]/10 p-7 sm:p-9 space-y-4">
          <div className="flex items-center gap-2.5 text-[#181615]">
            <Lock size={20} />
            <h2 className="font-serif text-2xl font-semibold text-[#181615]">
              3. Applicant Privacy & Data Protection
            </h2>
          </div>
          <p className="text-sm text-[#575049] leading-relaxed">
            Information submitted through our Adoption Application or Contact forms (including your
            name, email address, phone number, and household description) is used solely by
            MunchkinKittie to evaluate adoption compatibility and communicate with you regarding
            your kitten. We never sell, rent, or share applicant personal data with third-party
            marketers.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            to="/available-kittens"
            className="px-6 py-3 rounded-full bg-[#181615] text-white text-xs font-semibold"
          >
            Browse Available Kittens
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-[#f3efea] text-[#181615] text-xs font-semibold"
          >
            Contact Us With Questions
          </Link>
        </div>
      </section>
    </main>
  );
}
