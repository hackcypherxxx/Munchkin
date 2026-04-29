import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Plane, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Info,
  Globe,
  ArrowRight
} from 'lucide-react';

const ShippingDelivery = () => {
  const deliveryMethods = [
    {
      title: "Flight Nanny Service",
      icon: <Plane className="text-green-600" />,
      desc: "Our most popular option. A professional nanny hand-carries your kitten in the cabin. They are never in cargo.",
      price: "From $550",
      features: ["In-cabin travel", "Real-time photo updates", "Hand-to-hand delivery"]
    },
    {
      title: "VIP Ground Transport",
      icon: <Truck className="text-green-600" />,
      desc: "Climate-controlled specialized pet transport for regional deliveries (within 500 miles of Portland).",
      price: "From $350",
      features: ["Frequent stretch breaks", "Hydration monitoring", "Door-to-door service"]
    },
    {
      title: "Local Boutique Pickup",
      icon: <MapPin className="text-green-600" />,
      desc: "Visit our facility in person. Meet the parents and pick up your new family member directly.",
      price: "Free",
      features: ["Tour the nursery", "In-person care lesson", "Complimentary carrier"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-[1px] bg-zinc-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Global Safe Passage</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-8">
            Safe <span className="text-green-600 italic">Transit</span> <br />to your door.
          </h1>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            We handle 100% of the travel logistics. Whether you are in New York or London, our priority is a stress-free transition for your Munchkin.
          </p>
        </div>

        {/* --- DELIVERY OPTIONS GRID --- */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {deliveryMethods.map((method, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[48px] bg-zinc-50 border border-zinc-100 flex flex-col h-full hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8">
                {method.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 mb-4">{method.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                {method.desc}
              </p>
              
              <div className="space-y-4 mb-10">
                {method.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <CheckCircle2 size={14} className="text-green-600" /> {f}
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-zinc-200/50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estimated Cost</span>
                <span className="text-xl font-black text-zinc-900 tracking-tighter">{method.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- LOGISTICS TIMELINE --- */}
        <div className="bg-zinc-950 rounded-[64px] p-10 md:p-20 text-white relative overflow-hidden mb-32">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                  The Journey <br /><span className="text-zinc-500">Timeline.</span>
                </h2>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Health Certification", desc: "48 hours before travel, our vet issues a USDA Health Certificate." },
                    { step: "02", title: "Nanny Coordination", desc: "We provide you with the flight number, nanny contact, and ETA." },
                    { step: "03", title: "Final Settlement", desc: "Delivery fees are paid in full to secure the ticket and transport slot." },
                    { step: "04", title: "Home Arrival", desc: "Meet your nanny at the airport or your front door for the hand-off." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <span className="text-green-600 font-black text-xl italic">{item.step}</span>
                      <div>
                        <h4 className="text-lg font-black mb-1">{item.title}</h4>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 w-full aspect-square rounded-[48px] overflow-hidden relative">
                <div className="absolute inset-0 bg-green-600/10 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" 
                  alt="Kitten Travel" 
                  className="w-full h-full object-cover grayscale opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/10 backdrop-blur-xl p-10 rounded-full border border-white/20">
                    <Globe size={64} className="text-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SHIPPING FAQ / IMPORTANT NOTES --- */}
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="text-green-600" size={24} />
              <h3 className="text-2xl font-black tracking-tight">Safety Standards</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <p className="text-zinc-600 font-medium">We do <span className="text-zinc-950 font-black">NEVER</span> ship kittens in the cargo hold of an airplane. Only in-cabin or ground.</p>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <p className="text-zinc-600 font-medium">Delivery is only available once the kitten is <span className="text-zinc-950 font-black">12 weeks old</span> and fully vaccinated.</p>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-zinc-400" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ready to schedule?</h4>
            </div>
            <p className="text-zinc-600 font-bold mb-8">
              Most deliveries are scheduled 14 days in advance. Contact our transport coordinator to get an exact quote.
            </p>
            <button className="w-full py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-3">
              Request Delivery Quote <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* --- FINAL FOOTNOTE --- */}
        <p className="mt-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
          International Shipping available to select UK & EU locations.
        </p>

      </div>
    </div>
  );
};

export default ShippingDelivery;