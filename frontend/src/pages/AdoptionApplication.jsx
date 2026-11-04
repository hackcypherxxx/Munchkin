import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { createApplication, clearApplicationState } from '../features/application/applicationSlice';
import { getKittens } from '../features/kitten/kittenSlice';
import PageMeta from '../components/PageMeta';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Heart,
  Stethoscope,
  Plane,
  ArrowUpRight,
} from 'lucide-react';
import { CATTERY_PHOTOS, formatKittenAge } from '../utils/kittenFormatters';

export default function AdoptionApplication() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loading, success, error, lastSubmittedReference } = useSelector((state) => state.application);
  const { kittens } = useSelector((state) => state.kitten);
  const { settings } = useSelector((state) => state.settings);

  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation?.trim() || '';

  const preSelectedId = searchParams.get('id');
  const preSelectedType = searchParams.get('type') || 'kitten';
  const preSelectedName = searchParams.get('name');

  const [activeStep, setActiveStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    applicationType: preSelectedType,
    itemId: preSelectedId || null,
    applicationTypeModel:
      preSelectedType === 'kitten'
        ? 'Kitten'
        : preSelectedType === 'retired'
        ? 'RetiredKitten'
        : 'Upcoming',
    homeDescription: '',
    hasPets: false,
    experience: '',
    paymentMethod: '',
    paymentMethodOther: '',
  });

  useEffect(() => {
    if (!kittens || kittens.length === 0) {
      dispatch(getKittens());
    }
    return () => dispatch(clearApplicationState());
  }, [dispatch]);

  const matchedKitten =
    preSelectedId && Array.isArray(kittens)
      ? kittens.find((k) => k._id === preSelectedId)
      : null;

  const handleTypeChange = (val) => {
    if (preSelectedId) return;
    let model = 'Kitten';
    if (val === 'retired') model = 'RetiredKitten';
    if (val === 'upcoming') model = 'Upcoming';
    setFormData({ ...formData, applicationType: val, applicationTypeModel: model });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePaymentMethodChange = (val) => {
    setFormData({
      ...formData,
      paymentMethod: val,
      paymentMethodOther: val === 'other' ? formData.paymentMethodOther : '',
    });
  };

  const isStep1Valid =
    formData.fullName.trim().length >= 3 &&
    formData.email.includes('@') &&
    formData.phone.trim().length >= 7 &&
    formData.location.trim().length >= 2;

  const isStep2Valid = formData.homeDescription.trim().length >= 10;

  const isStep3Valid =
    formData.paymentMethod !== '' &&
    (formData.paymentMethod !== 'other' || formData.paymentMethodOther.trim() !== '');

  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isFormValid) {
      const validEnums = ['apple pay', 'cash app', 'zelle', 'chime', 'giftcard', 'other'];
      const isDirectEnum = validEnums.includes(formData.paymentMethod);
      const submissionData = {
        ...formData,
        paymentMethod: isDirectEnum ? formData.paymentMethod : 'other',
        paymentMethodOther:
          formData.paymentMethod === 'other'
            ? formData.paymentMethodOther
            : !isDirectEnum
            ? formData.paymentMethod
            : undefined,
      };
      dispatch(createApplication(submissionData));
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title={preSelectedName ? `Adopt ${preSelectedName} — Application` : 'Adoption Application'}
        description={`Submit your MunchkinKittie adoption application. Reviewed personally within 24 hours by our${catteryLocation ? ` ${catteryLocation}` : ''} cattery team.`}
      />

      {/* Editorial Header */}
      <section className="bg-[#f3efea] border-b border-[#181615]/10 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#263b30]">
              <ShieldCheck size={13} /> {catteryLocation ? `${catteryLocation} Home Cattery Placement` : 'Home Cattery Placement'}
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              {preSelectedName ? `Application for ${preSelectedName}` : 'Kitten Adoption Application'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#575049] leading-relaxed">
              We review every application personally within 24 hours to ensure a thoughtful match
              for both your household and our home-raised kittens.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {success ? (
          <div className="max-w-2xl mx-auto rounded-[28px] bg-white border border-[#181615]/12 p-8 sm:p-12 text-center editorial-shadow space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#ebf1ee] text-[#263b30] flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
              Application Received
            </h2>
            {lastSubmittedReference && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm font-mono font-semibold text-[#263b30]">
                Reference ID: {lastSubmittedReference}
              </div>
            )}
            <p className="text-sm sm:text-base text-[#575049] leading-relaxed">
              Thank you, <strong className="text-[#181615]">{formData.fullName}</strong>. Your
              application{preSelectedName ? ` for ${preSelectedName}` : ''} has been logged with our{catteryLocation ? ` ${catteryLocation}` : ''} nursery. A confirmation email with your reference has been dispatched to{' '}
              <strong className="text-[#181615]">{formData.email}</strong>, and our placement specialist will review your profile within 24 hours.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/available-kittens"
                className="px-6 py-3.5 rounded-full bg-[#181615] text-white text-xs sm:text-sm font-semibold"
              >
                Return to Available Kittens
              </Link>
              <Link
                to="/"
                className="px-6 py-3.5 rounded-full bg-[#f3efea] text-[#181615] text-xs sm:text-sm font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: 3-Step Form (8 cols) */}
            <div className="lg:col-span-8">
              {/* Step Indicator Bar */}
              <div className="mb-8 grid grid-cols-3 gap-3">
                {[
                  { step: 1, title: '01. Your Details', valid: isStep1Valid },
                  { step: 2, title: '02. Home Environment', valid: isStep2Valid },
                  { step: 3, title: '03. Reservation Preferences', valid: isStep3Valid },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (s.step === 1) setActiveStep(1);
                      if (s.step === 2 && isStep1Valid) setActiveStep(2);
                      if (s.step === 3 && isStep1Valid && isStep2Valid) setActiveStep(3);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      activeStep === s.step
                        ? 'bg-[#181615] text-white border-[#181615]'
                        : s.valid
                        ? 'bg-white text-[#263b30] border-[#263b30]/25'
                        : 'bg-white text-[#8a8075] border-[#181615]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{s.title}</span>
                      {s.valid && activeStep !== s.step && (
                        <CheckCircle2 size={14} className="text-[#263b30]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2.5">
                  <AlertCircle size={17} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="rounded-[28px] bg-white border border-[#181615]/10 p-6 sm:p-10 editorial-shadow space-y-6"
              >
                {/* STEP 1 */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                        Step 1 of 3
                      </span>
                      <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                        Applicant Contact Information
                      </h2>
                    </div>

                    {!preSelectedId && (
                      <div>
                        <label className="block text-xs font-semibold text-[#181615] mb-2">
                          What are you applying for?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { id: 'kitten', label: 'Available Kitten' },
                            { id: 'upcoming', label: 'Upcoming Litter Waitlist' },
                            { id: 'retired', label: 'Retired Adult Cat' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleTypeChange(t.id)}
                              className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                formData.applicationType === t.id
                                  ? 'bg-[#181615] text-white border-[#181615]'
                                  : 'bg-[#faf8f5] text-[#575049] border-[#181615]/10 hover:text-[#181615]'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-semibold text-[#181615] mb-1.5"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <User
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                          />
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-[#181615] mb-1.5"
                        >
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                          />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jane@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-[#181615] mb-1.5"
                        >
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                          />
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 234-5678"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="block text-xs font-semibold text-[#181615] mb-1.5"
                        >
                          Your City & State *
                        </label>
                        <div className="relative">
                          <MapPin
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                          />
                          <input
                            id="location"
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Syracuse, NY or Dallas, TX"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={!isStep1Valid}
                        onClick={() => setActiveStep(2)}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#181615] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        Continue to Home Environment <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                        Step 2 of 3
                      </span>
                      <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                        Household & Pet Experience
                      </h2>
                    </div>

                    <div>
                      <label
                        htmlFor="homeDescription"
                        className="block text-xs font-semibold text-[#181615] mb-1.5"
                      >
                        Tell us about your home environment (min. 10 characters) *
                      </label>
                      <textarea
                        id="homeDescription"
                        name="homeDescription"
                        rows={4}
                        required
                        value={formData.homeDescription}
                        onChange={handleChange}
                        placeholder="Share a bit about your living space, family members, and daily schedule..."
                        className="w-full p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                      />
                    </div>

                    <label className="flex items-center gap-3 p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/10 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasPets"
                        checked={formData.hasPets}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#9e5a3c]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#181615]">
                        I currently have other cats, dogs, or pets in my home
                      </span>
                    </label>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-xs font-semibold text-[#181615] mb-1.5"
                      >
                        Previous experience with cats or kittens (optional)
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={3}
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Let us know if you are a first-time cat owner or have raised cats before..."
                        className="w-full p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#f3efea] text-[#181615] text-xs font-semibold cursor-pointer"
                      >
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button
                        type="button"
                        disabled={!isStep2Valid}
                        onClick={() => setActiveStep(3)}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#181615] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        Continue to Final Step <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                        Step 3 of 3
                      </span>
                      <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                        Preferred Payment Method (Upon Approval)
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#575049]">
                        No payment is collected today. Select how you prefer to complete your
                        reservation once your application is approved.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'zelle', label: 'Zelle' },
                        { id: 'apple pay', label: 'Apple Pay' },
                        { id: 'chime', label: 'Chime' },
                        { id: 'cash app', label: 'Cash App' },
                        { id: 'Venmo', label: 'Venmo' },
                        { id: 'Bank Wire / Transfer', label: 'Bank Wire / Transfer' },
                        { id: 'PayPal', label: 'PayPal' },
                        { id: 'giftcard', label: 'Gift Card' },
                        { id: 'other', label: 'Other Method' },
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => handlePaymentMethodChange(pm.id)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                            formData.paymentMethod === pm.id
                              ? 'bg-[#181615] text-white border-[#181615]'
                              : 'bg-[#faf8f5] text-[#181615] border-[#181615]/10 hover:border-[#9e5a3c]'
                          }`}
                        >
                          <span>{pm.label}</span>
                          <CreditCard size={14} className="opacity-60" />
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'other' && (
                      <div>
                        <label
                          htmlFor="paymentMethodOther"
                          className="block text-xs font-semibold text-[#181615] mb-1.5"
                        >
                          Specify Preferred Payment Method *
                        </label>
                        <input
                          id="paymentMethodOther"
                          name="paymentMethodOther"
                          type="text"
                          required
                          value={formData.paymentMethodOther}
                          onChange={handleChange}
                          placeholder={catteryLocation ? `e.g., Cash on ${catteryLocation} local pickup` : 'e.g., Cash on local pickup'}
                          className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                        />
                      </div>
                    )}

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#f3efea] text-[#181615] text-xs font-semibold cursor-pointer"
                      >
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#9e5a3c] hover:bg-[#84472c] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            Submit Adoption Application <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Selected Kitten Card & Cattery Assurances (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {matchedKitten ? (
                <div className="rounded-[24px] bg-white border border-[#181615]/10 overflow-hidden editorial-shadow">
                  <div className="aspect-[4/3.5] w-full overflow-hidden bg-[#f3efea]">
                    <img
                      src={matchedKitten.images?.[0] || matchedKitten.img || CATTERY_PHOTOS.heroPrimary}
                      alt={matchedKitten.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9e5a3c]">
                      Selected Kitten
                    </span>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                        {matchedKitten.name}
                      </h3>
                      <span className="font-mono text-lg font-semibold text-[#181615]">
                        ${matchedKitten.price}
                      </span>
                    </div>
                    <p className="text-xs text-[#575049]">
                      {matchedKitten.gender} · {formatKittenAge(matchedKitten)} · {matchedKitten.coat}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] bg-[#181615] text-white p-6 space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#e8b496]">
                    <Heart size={12} /> What Happens Next
                  </span>
                  <h3 className="font-serif text-2xl font-medium">
                    24-Hour Personal Review
                  </h3>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Once you submit this form, our{catteryLocation ? ` ${catteryLocation}` : ''} cattery team reviews your home
                    details and replies directly by email or phone to coordinate your reservation.
                  </p>
                </div>
              )}

              <div className="rounded-[24px] bg-white border border-[#181615]/10 p-6 space-y-4">
                <h3 className="font-serif text-xl font-semibold text-[#181615]">
                  Every Adoption Includes
                </h3>
                <ul className="space-y-3 text-xs text-[#575049]">
                  <li className="flex items-start gap-2.5">
                    <Stethoscope size={15} className="text-[#263b30] shrink-0 mt-0.5" />
                    <span>Licensed Veterinarian Health Exam & FVRCP Vaccination Log</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck size={15} className="text-[#263b30] shrink-0 mt-0.5" />
                    <span>Written 72-Hour General & 2-Year Genetic Health Guarantee</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Plane size={15} className="text-[#9e5a3c] shrink-0 mt-0.5" />
                    <span>{catteryLocation ? `Free ${catteryLocation} Pickup` : 'Free Local Pickup'} or Nationwide Flight Nanny Delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
