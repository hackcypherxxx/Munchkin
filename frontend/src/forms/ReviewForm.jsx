import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Camera, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const ReviewForm = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Success, 3: Error (Already Sent)
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    catName: '',
    breed: 'Standard Munchkin',
    review: ''
  });

  // MOCK DATABASE: In a real app, you'd check your database here
  const existingEmails = ['test@example.com', 'user@munchkin.com'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if email already exists
    if (existingEmails.includes(formData.email.toLowerCase())) {
      setStep(3); // Show "Already Sent" state
      return;
    }

    // Simulate API Call to Admin Panel
    console.log("Sending to Admin Panel:", { ...formData, rating, date: new Date() });
    setStep(2); // Show Success state
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[200]"
          />

          {/* Form Side-Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[210] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">Share Your Experience</h2>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Nursery Feedback Portal</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Rating Selector */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Overall Satisfaction</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            size={32} 
                            className={star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:border-green-600 focus:ring-0 outline-none font-bold text-sm"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:border-green-600 focus:ring-0 outline-none font-bold text-sm"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Kitten's Name</label>
                      <input 
                        type="text" 
                        placeholder="Mochi"
                        className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:border-green-600 focus:ring-0 outline-none font-bold text-sm"
                        onChange={(e) => setFormData({...formData, catName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Location</label>
                      <input 
                        type="text" 
                        placeholder="Dallas, TX"
                        className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:border-green-600 focus:ring-0 outline-none font-bold text-sm"
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Story</label>
                    <textarea 
                      required
                      rows="4" 
                      placeholder="Share your journey with us..."
                      className="w-full px-6 py-6 bg-zinc-50 rounded-3xl border border-zinc-100 focus:border-green-600 focus:ring-0 outline-none font-bold text-sm resize-none"
                      onChange={(e) => setFormData({...formData, review: e.target.value})}
                    />
                  </div>

                  {/* Photo Upload Zone */}
                  <div className="p-8 border-2 border-dashed border-zinc-100 rounded-[32px] bg-zinc-50/50 flex flex-col items-center justify-center text-center group hover:border-green-600 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
                      <Camera size={20} />
                    </div>
                    <p className="text-sm font-black text-zinc-950 uppercase tracking-tight">Upload a Photo</p>
                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest italic">JPG, PNG under 5MB</p>
                  </div>

                  <button 
                    disabled={rating === 0}
                    type="submit"
                    className="w-full py-6 bg-zinc-950 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-2xl shadow-zinc-200 disabled:opacity-50 disabled:bg-zinc-300"
                  >
                    Submit to Admin Panel <Send size={16} />
                  </button>
                </form>
              )}

              {/* Step 2: Success */}
              {step === 2 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center text-green-600 mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter text-zinc-950 mb-4 italic">Thank You!</h3>
                  <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-10">
                    Your review has been sent to our admin panel for verification. It will appear on the wall shortly!
                  </p>
                  <button 
                    onClick={onClose}
                    className="px-10 py-4 bg-zinc-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest"
                  >
                    Close Portal
                  </button>
                </div>
              )}

              {/* Step 3: Already Exists */}
              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center text-zinc-300 mb-8">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-zinc-950 mb-4">One Review Per Family</h3>
                  <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-10">
                    It looks like you've already shared your experience with this email address. We truly appreciate your support!
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    Try another email <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-zinc-50 bg-zinc-50/30">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-zinc-400" />
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Verified Submission Protocol v2.0</p>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewForm;