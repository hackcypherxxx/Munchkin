import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createContact, clearContactState } from '../features/contact/contactSlice';
import { getSettings } from '../features/settings/settingsSlice';
import PageMeta from '../components/PageMeta';
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Loader2,
  Send,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export default function ContactUs() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.settings);
  const { loading, success, error, lastEnquiryReference } = useSelector((state) => state.contact);

  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';
  const catteryPhone = activeSettings?.phoneNumber || '+1 (607) 223-4177';
  const catteryEmail = activeSettings?.contactEmail || 'info@munchkinkittie.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'New Kitten Interest',
    message: '',
  });

  useEffect(() => {
    dispatch(getSettings());
    return () => {
      dispatch(clearContactState());
    };
  }, [dispatch]);

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.includes('@') &&
    formData.message.trim().length > 5;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(createContact(formData));
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] pb-24">
      <PageMeta
        title={`Contact Our ${catteryLocation} Cattery`}
        description={`Reach out directly to MunchkinKittie in ${catteryLocation} with questions about available kittens, upcoming litters, or Flight Nanny delivery.`}
      />

      <section className="bg-[#f3efea] border-b border-[#181615]/10 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#181615]/10 text-xs font-semibold text-[#9e5a3c]">
              <MessageSquare size={13} /> Direct Breeder Communication
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#181615] tracking-tight leading-[1.05]">
              Get in touch with our {catteryLocation} nursery.
            </h1>
            <p className="text-base sm:text-lg text-[#575049] leading-relaxed">
              Have a question about a specific kitten, upcoming litter dates, or Flight Nanny
              delivery? Send us a message below and we will reply personally within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-8 space-y-6 editorial-shadow">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                Nursery Details
              </h2>

              <div className="space-y-4">
                {catteryPhone && (
                  <a
                    href={`tel:${catteryPhone.replace(/[^\d+]/g, '')}`}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/8 hover:border-[#9e5a3c] transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-[#181615] text-[#e8b496] flex items-center justify-center shrink-0">
                      <Phone size={17} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075] block">
                        Direct Phone &amp; SMS
                      </span>
                      <span className="text-sm font-semibold text-[#181615]">
                        {catteryPhone}
                      </span>
                    </div>
                  </a>
                )}

                <a
                  href={`mailto:${catteryEmail}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/8 hover:border-[#9e5a3c] transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#181615] text-[#e8b496] flex items-center justify-center shrink-0">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075] block">
                      Direct Email
                    </span>
                    <span className="text-sm font-semibold text-[#181615]">
                      {catteryEmail}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/8">
                  <div className="h-10 w-10 rounded-xl bg-[#181615] text-[#e8b496] flex items-center justify-center shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075] block">
                      Cattery Location
                    </span>
                    <span className="text-sm font-semibold text-[#181615]">
                      {catteryLocation} (By Appointment & Nationwide Delivery)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/8">
                  <div className="h-10 w-10 rounded-xl bg-[#181615] text-[#e8b496] flex items-center justify-center shrink-0">
                    <Clock size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8075] block">
                      Response Hours
                    </span>
                    <span className="text-sm font-semibold text-[#181615]">
                      Monday – Sunday · 9:00 AM – 8:00 PM EST
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-10 editorial-shadow">
              {success ? (
                <div className="py-10 text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-[#ebf1ee] text-[#263b30] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="font-serif text-3xl font-semibold text-[#181615]">
                    Message Sent
                  </h2>
                  {lastEnquiryReference && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#faf8f5] border border-[#181615]/15 text-xs font-mono font-semibold text-[#263b30]">
                      Enquiry Reference: {lastEnquiryReference}
                    </div>
                  )}
                  <p className="text-sm text-[#575049] max-w-md mx-auto">
                    Thank you for reaching out to MunchkinKittie. We have received your enquiry and
                    sent a confirmation to <strong className="text-[#181615]">{formData.email}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181615]">
                    Send Us a Message
                  </h2>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#181615] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-[#181615] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiryType"
                      className="block text-xs font-semibold text-[#181615] mb-1.5"
                    >
                      Topic *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                    >
                      <option value="New Kitten Interest">Available Kitten Question</option>
                      <option value="Upcoming Litter Waitlist">Upcoming Litter Waitlist</option>
                      <option value="Shipping & Delivery">
                        Flight Nanny / {catteryLocation} Pickup Question
                      </option>
                      <option value="General Inquiry">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#181615] mb-1.5"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Let us know which kitten you are interested in or any questions you have..."
                      className="w-full p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm text-[#181615]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#181615] hover:bg-[#9e5a3c] disabled:opacity-40 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
