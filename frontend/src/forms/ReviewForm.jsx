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
  
  const { loading, success, error } = useSelector((state) => state.review);

  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(5);
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

  useEffect(() => {
    if (success) {
      setStep(2);
      dispatch(clearReviewState());
    }
    if (error) {
      setStep(3);
    }
  }, [success, error, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

    if (image) {
      data.append("image", image);
    }

    dispatch(createReview(data));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setRating(5);
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
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Slide-in drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#FAFAF8] z-[210] shadow-2xl flex flex-col text-[#0F2D25] selection:bg-[#0F2D25] selection:text-white"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-[#E2E6DF] flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
                  Adopter Testimonial
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2D25]">
                  Share Your Story
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl bg-[#F4F5F0] hover:bg-[#E2E6DF] text-[#0F2D25] flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Rating Selector */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E2E6DF] text-center shadow-sm">
                    <span className="text-xs font-bold text-[#0F2D25]/70 block mb-3 uppercase tracking-wider">
                      Adoption Satisfaction Score
                    </span>
                    <div className="flex justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          className="p-1.5 transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star 
                            size={28}
                            className={star <= (hover || rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#E2E6DF]"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0F2D25]">Your Name *</label>
                      <input 
                        required 
                        placeholder="e.g. Rachel Thorne"
                        value={formData.name}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E6DF] bg-white text-sm text-[#0F2D25] focus:outline-none focus:border-[#0F2D25] transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0F2D25]">Email Address *</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="rachel@example.com"
                        value={formData.email}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E6DF] bg-white text-sm text-[#0F2D25] focus:outline-none focus:border-[#0F2D25] transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0F2D25]">Companion Name</label>
                      <input 
                        placeholder="e.g. Sir Oliver"
                        value={formData.catName}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E6DF] bg-white text-sm text-[#0F2D25] focus:outline-none focus:border-[#0F2D25] transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, catName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0F2D25]">Location</label>
                      <input 
                        placeholder="e.g. Austin, Texas"
                        value={formData.location}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E6DF] bg-white text-sm text-[#0F2D25] focus:outline-none focus:border-[#0F2D25] transition-all font-medium"
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0F2D25]">Your Adoption Review *</label>
                    <textarea 
                      required 
                      rows={5}
                      placeholder="Share your experience with our nursery, pediatric care, flight nanny travel, and your companion's personality..."
                      value={formData.review}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E6DF] bg-white text-sm text-[#0F2D25] focus:outline-none focus:border-[#0F2D25] transition-all font-medium resize-none"
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#0F2D25] block">Companion Photo (Optional)</span>
                    <label className="block cursor-pointer">
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-[#0F2D25] shadow-sm">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="bg-white text-[#0F2D25] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-[#E2E6DF] rounded-2xl bg-white text-center flex flex-col items-center justify-center hover:border-[#0F2D25] transition-colors">
                          <Camera size={24} className="text-[#0F2D25]/40 mb-2" />
                          <span className="text-xs font-bold text-[#0F2D25]/70">Attach High-Res Photo</span>
                        </div>
                      )}
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#0F2D25] hover:bg-[#163E32] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#C5A059]" />
                        <span>Transmitting Story...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Adopter Review</span>
                        <Send size={14} className="text-[#C5A059]" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0F2D25]">
                    Testimonial Received
                  </h3>
                  <p className="text-xs text-[#0F2D25]/70 max-w-sm mx-auto leading-relaxed">
                    Thank you for sharing your experience. Our registry team will review and display your story on our verified adopter wall.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 bg-[#0F2D25] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#163E32] transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 bg-rose-50 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-rose-200">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0F2D25]">
                    Submission Failed
                  </h3>
                  <p className="text-xs text-rose-600 max-w-sm mx-auto leading-relaxed">
                    {error || "Unable to connect to registry server. Please verify your connection."}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-2.5 bg-[#0F2D25] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#163E32] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E2E6DF] bg-white flex items-center justify-center gap-2 text-[11px] text-[#0F2D25]/50">
              <ShieldCheck size={14} className="text-[#C5A059]" />
              <span>Verified Adopter Review Guarantee</span>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewForm;
