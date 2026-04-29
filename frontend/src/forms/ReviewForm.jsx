import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { createReview, clearReviewState } from "../features/review/reviewSlice";

import { 
  X, Star, Camera, Send, CheckCircle2, 
  AlertCircle, ShieldCheck, ArrowRight, Loader2, Image as ImageIcon
} from 'lucide-react';

const ReviewForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // Redux State
  const { loading, success, error } = useSelector((state) => state.review);

  // Local State
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    catName: '',
    breed: 'Standard Munchkin',
    review: ''
  });

  // Handle Redux Response
  useEffect(() => {
    if (success) {
      setStep(2);
      dispatch(clearReviewState());
    }
    if (error) {
      setStep(3);
    }
  }, [success, error, dispatch]);

  // Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please provide a star rating.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("location", formData.location);
    data.append("catName", formData.catName);
    data.append("breed", formData.breed);
    data.append("review", formData.review);
    data.append("rating", rating);

    // Ensure the backend Multer expects the field name "image"
    if (image) {
      data.append("image", image);
    }

    dispatch(createReview(data));
  };

  // Reset form entirely when closed
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setRating(0);
      setImage(null);
      setImagePreview(null);
      setFormData({ name: '', email: '', location: '', catName: '', breed: 'Standard Munchkin', review: '' });
      dispatch(clearReviewState());
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKGROUND BLUR OVERLAY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[200]"
          />

          {/* SLIDE OVER PANEL */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#fcfcfc] z-[210] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col selection:bg-zinc-950 selection:text-white"
          >
            
            {/* HEADER */}
            <div className="p-8 md:p-10 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-1">
                  Public Testimony
                </p>
                <h2 className="text-4xl font-black tracking-tighter text-zinc-950 uppercase italic leading-none">
                  Vouch For Us
                </h2>
              </div>
              <button onClick={handleClose} className="p-4 hover:bg-red-50 hover:text-red-500 rounded-full text-zinc-400 transition-all active:scale-90">
                <X size={24} />
              </button>
            </div>

            {/* BODY SCROLL */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar">

              {/* --- STEP 1: FORM --- */}
              {step === 1 && (
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-10">

                  {/* RATING SECTION */}
                  <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm flex flex-col items-center text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
                      Select Satisfaction Level
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          className="p-2 transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star 
                            size={40}
                            className={star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUT FIELDS */}
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <input 
                        required 
                        placeholder="Full Name"
                        value={formData.name}
                        className="w-full px-8 py-5 bg-white rounded-[24px] border border-zinc-100 focus:border-zinc-950 outline-none font-bold text-sm shadow-sm transition-all"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <input 
                        required 
                        type="email" 
                        placeholder="Email Address"
                        value={formData.email}
                        className="w-full px-8 py-5 bg-white rounded-[24px] border border-zinc-100 focus:border-zinc-950 outline-none font-bold text-sm shadow-sm transition-all"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <input 
                        placeholder="Kitten Name"
                        value={formData.catName}
                        className="w-full px-8 py-5 bg-white rounded-[24px] border border-zinc-100 focus:border-zinc-950 outline-none font-bold text-sm shadow-sm transition-all"
                        onChange={(e) => setFormData({ ...formData, catName: e.target.value })}
                      />
                      <input 
                        placeholder="City, State"
                        value={formData.location}
                        className="w-full px-8 py-5 bg-white rounded-[24px] border border-zinc-100 focus:border-zinc-950 outline-none font-bold text-sm shadow-sm transition-all"
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <textarea 
                      required 
                      rows="5"
                      placeholder="Share your story..."
                      value={formData.review}
                      className="w-full px-8 py-6 bg-white rounded-[32px] border border-zinc-100 focus:border-zinc-950 outline-none font-bold text-sm shadow-sm transition-all resize-none"
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    />
                  </div>

                  {/* IMAGE UPLOAD (WITH PREVIEW) */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Attach Media</p>
                    <label className="block cursor-pointer group">
                      {imagePreview ? (
                        <div className="relative w-full h-64 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white text-zinc-950 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-16 border-2 border-dashed border-zinc-200 rounded-[40px] bg-white text-center flex flex-col items-center justify-center group-hover:border-zinc-950 group-hover:bg-zinc-50 transition-all">
                          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Camera size={24} className="text-zinc-400 group-hover:text-zinc-950" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Upload Companion Photo</span>
                        </div>
                      )}
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button 
                    disabled={loading}
                    className="w-full py-8 bg-zinc-950 text-white rounded-[40px] font-black text-[11px] uppercase tracking-[0.4em] flex justify-center items-center gap-4 hover:bg-green-600 disabled:opacity-50 transition-all shadow-2xl active:scale-[0.98]"
                  >
                    {loading ? (
                      <><Loader2 size={20} className="animate-spin" /> Uploading...</>
                    ) : (
                      <>Submit Vouch <Send size={18} /></>
                    )}
                  </button>
                </motion.form>
              )}

              {/* --- STEP 2: SUCCESS --- */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100">
                    <CheckCircle2 size={64} className="text-green-600" />
                  </div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Vouch Received</h3>
                  <p className="text-zinc-500 font-medium max-w-sm mb-12">Thank you for sharing your journey. Your review will be published after quick admin verification.</p>
                  <button onClick={handleClose} className="px-14 py-6 bg-zinc-950 text-white rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors">
                    Close Portal
                  </button>
                </motion.div>
              )}

              {/* --- STEP 3: ERROR (THE 500 FAIL STATE) --- */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-red-100">
                    <AlertCircle size={64} className="text-red-500" />
                  </div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-zinc-900">Submission Failed</h3>
                  <p className="text-red-500 font-bold text-sm bg-red-50 px-6 py-3 rounded-2xl mb-12 border border-red-100">Server Error: {error || "Check backend connection"}</p>
                  
                  <button 
                    onClick={() => {
                      setStep(1);
                      dispatch(clearReviewState());
                    }}
                    className="px-12 py-5 border-2 border-zinc-200 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-3 hover:border-zinc-950 hover:text-zinc-950 transition-all"
                  >
                    Try Again <ArrowRight size={16}/>
                  </button>
                </motion.div>
              )}

            </div>

            {/* FOOTER BAR */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-center gap-3">
              <ShieldCheck size={16} className="text-green-600" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Verified Client Portal • 256-Bit SSL</span>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewForm;