import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowRight
} from 'lucide-react';

const PricingDeposit = () => {
  const steps = [
    {
      title: "Initial Deposit",
      amount: "$500",
      desc: "Secures your position on our waiting list or reserves a specific kitten.",
      icon: <Wallet className="text-green-600" />
    },
    {
      title: "Half-Point Payment",
      amount: "50% Balance",
      desc: "Paid once the kitten reaches 8 weeks and passes initial vet screening.",
      icon: <CreditCard className="text-green-600" />
    },
    {
      title: "Final Settlement",
      amount: "Remaining Balance",
      desc: "Paid in full 72 hours prior to the scheduled delivery or pickup date.",
      icon: <ShieldCheck className="text-green-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* --- SECTION 1: HEADER --- */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 mb-6"
          >
            <FileText size={12} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Transparent Pricing Policy</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-950 tracking-tighter mb-6">
            Investment <span className="text-zinc-400">&</span> Terms.
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">
            Our pricing reflects the high standard of care, genetic testing, and socialization each Munchkin receives in our home.
          </p>
        </div>

        {/* --- SECTION 2: THE PRICE BOXES --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 rounded-[40px] bg-zinc-950 text-white relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Standard Munchkin</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black tracking-tighter">$400 - $800</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              Pricing varies based on coat rarity, eye color, and physical characteristics. Includes all vaccinations and TICA registration.
            </p>
            <ul className="space-y-4">
              {['Microchipped', '2-Year Health Guarantee', 'Starter Kit'].map(item => (
                <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={16} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-600/20 rounded-full blur-[60px]" />
          </div>

          <div className="p-10 rounded-[40px] border-2 border-zinc-100 flex flex-col justify-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Retired Adults</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black tracking-tighter text-zinc-900">$400 - $800</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Occasional opportunities to adopt our retired breeding cats into loving, permanent pet homes.
            </p>
            <button className="w-full py-4 border-2 border-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
              Inquire for Availability
            </button>
          </div>
        </div>

        {/* --- SECTION 3: THE DEPOSIT JOURNEY --- */}
        <div className="mb-32">
          <h2 className="text-3xl font-black tracking-tighter mb-12 text-center md:text-left">The Payment Roadmap</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-8 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h4 className="text-lg font-black text-zinc-900 mb-2">{step.title}</h4>
                <p className="text-green-600 font-black text-sm mb-4">{step.amount}</p>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                {i < 2 && <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-zinc-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 4: DELIVERY LOGISTICS (CRITICAL FOR LEGITIMACY) --- */}
        <div className="bg-zinc-50 rounded-[48px] p-8 md:p-16 border border-zinc-100">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-100 mb-6">
                <Truck size={14} className="text-zinc-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Delivery Information</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-6">Safe & Reliable <br /><span className="text-zinc-400">Transit.</span></h2>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                We offer professional flight nanny services and ground transport to ensure your kitten arrives stress-free.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700">Delivery fees range from <span className="text-zinc-950 font-black">$100 - $650</span> depending on location.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={18} className="text-zinc-900" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700 italic">CRITICAL: Delivery fees must be paid in full 7 days before the departure date.</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 bg-white p-8 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50">
              <Calendar className="text-zinc-200 mb-6" size={40} />
              <h4 className="text-lg font-black text-zinc-900 mb-4">Waitlist Priority</h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">
                Our waitlist averages 2-4 months. Deposits are non-refundable but transferable to future litters.
              </p>
              <button className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* --- FOOTNOTE --- */}
        <p className="mt-12 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
          All payments are processed via secure invoice • Licensed Breeder
        </p>

      </div>
    </div>
  );
};

export default PricingDeposit;