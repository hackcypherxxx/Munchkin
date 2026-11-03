import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '../features/auth/authSlice';
import PageMeta from '../components/PageMeta';
import { CATTERY_PHOTOS } from '../utils/kittenFormatters';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin, token, loading, error } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (admin && token) {
      navigate('/admin-dashboard');
    }
  }, [admin, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      loginAdmin({
        email,
        password,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] grid grid-cols-1 lg:grid-cols-12">
      <PageMeta
        title="Cattery Administration Portal"
        description="Authorized administrator sign-in for MunchkinKittie nursery management."
      />

      {/* Left Editorial Photography Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#181615] text-white p-12 flex-col justify-between overflow-hidden">
        <img
          src={CATTERY_PHOTOS.heroPrimary}
          alt="MunchkinKittie Nursery"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-[#181615]/60 to-[#181615]/40" />

        <div className="relative z-10">
          <span className="font-serif text-3xl font-semibold tracking-[-0.02em] text-white leading-none">
            Munchkin<span className="text-[#e8b496]">Kittie</span>
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8b496] mt-1.5">
            Nursery Management Suite
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#e8b496] text-xs font-semibold">
            <ShieldCheck size={14} /> {catteryLocation} Operations
          </span>
          <h2 className="font-serif text-4xl font-medium leading-tight">
            Manage available kittens, adoption applications, and family reviews in one place.
          </h2>
          <p className="text-xs text-white/70 leading-relaxed">
            Connected directly to the live MunchkinKittie inventory, Cloudinary media storage, and
            Resend email dispatch.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} MunchkinKittie · Authorized Staff Only
        </div>
      </div>

      {/* Right Sign-In Column */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-14">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#575049] hover:text-[#181615] transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Return to Public Website
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615]">
              Cattery Portal Sign In
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#575049]">
              Enter your administrator credentials to manage the nursery.
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-[#181615]/10 p-7 sm:p-9 editorial-shadow">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#181615] mb-1.5"
                >
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                    size={16}
                  />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@munchkinkittie.com"
                    className="w-full py-3 pl-10 pr-4 rounded-xl border border-[#181615]/15 bg-[#faf8f5] text-sm text-[#181615] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#181615] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8075]"
                    size={16}
                  />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full py-3 pl-10 pr-10 rounded-xl border border-[#181615]/15 bg-[#faf8f5] text-sm text-[#181615] focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8075] hover:text-[#181615] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#181615] hover:bg-[#9e5a3c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Nursery Dashboard</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
