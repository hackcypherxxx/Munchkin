import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- ICONS (Lucide) ---
import {
  LayoutDashboard, PlusCircle, Star, Bell, LogOut,
  Settings, PawPrint, X, Trash2, Calendar,
  User, MapPin, Sparkles, Zap, Info, Camera,
  Plus, Minus, ArrowUpRight, ShieldCheck, Activity,
  ChevronRight, Layers, Heart, Shield, Award, CheckCircle2,
  AlertCircle, RefreshCw, Eye, Image as ImageIcon,
  Stethoscope, Mail, MessageSquare, ClipboardList, Check, Octagon
} from 'lucide-react';

// --- REDUX ACTIONS ---
import { createKitten, getKittens, deleteKitten } from '../features/kitten/kittenSlice';
import { createNotification, getAllNotificationsAdmin, deleteNotification } from '../features/notification/notificationSlice';
import { createRetired, getRetired, deleteRetired } from '../features/retired/retiredSlice';
import { createUpcoming, getUpcoming, deleteUpcoming } from '../features/upcoming/upcomingSlice';
import { getAllReviewsAdmin, approveReview, deleteReview, createReview } from '../features/review/reviewSlice';
import { getSettings, updateLocation } from '../features/settings/settingsSlice';
import { getApplications, approveApplication, rejectApplication, deleteApplication } from '../features/application/applicationSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // --- NAVIGATION & UI CONTROL ---
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(null);

  // --- DYNAMIC FORM STATES (The "Everything" Model) ---
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [medical, setMedical] = useState([{ event: '', status: '', week: '' }]);
  const [lineage, setLineage] = useState([{ relation: '', name: '', title: '' }]);
  // Upcoming/Retired extras
  const [features, setFeatures] = useState(['']);
  const [highlights, setHighlights] = useState(['']);

  // --- REDUX DATA ---
  const { kittens } = useSelector(state => state.kitten);
  const { adminNotifications } = useSelector(state => state.notification);
  const { retiredList } = useSelector(state => state.retired);
  const { upcomingList } = useSelector(state => state.upcoming);
  const { adminReviews } = useSelector(state => state.review);
  const { settings } = useSelector(state => state.settings);
  // NEW: Application Data
  const { applications } = useSelector(state => state.application);

  useEffect(() => {
    dispatch(getKittens());
    dispatch(getAllNotificationsAdmin());
    dispatch(getRetired());
    dispatch(getUpcoming());
    dispatch(getAllReviewsAdmin());
    dispatch(getSettings());
    dispatch(getApplications()); // Fetch applications on load
  }, [dispatch]);

  // --- REUSABLE HANDLERS ---
  const addNested = (setter) => setter(prev => [...prev, {}]);
  const removeNested = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  // --- SUBMISSION LOGIC (Fixing the "Cast to Boolean" and "Embedded" Errors) ---
  const handleKittenSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // FIX 1: Convert checkbox to string for Mongoose Boolean casting
    formData.set('isFeatured', e.target.isFeatured.checked ? 'true' : 'false');

    // FIX 2: Filter out empty nested rows to prevent ObjectParameterError
    const validSpecs = specs.filter(s => s.label && s.value);
    const validMedical = medical.filter(m => m.event);
    const validLineage = lineage.filter(l => l.name);

    formData.set('specs', JSON.stringify(validSpecs));
    formData.set('medical', JSON.stringify(validMedical));
    formData.set('lineage', JSON.stringify(validLineage));
    toast.promise(dispatch(createKitten(formData)).unwrap(), {
      loading: 'Uploading Kitten Data...',
      success: 'Kitten Logged to Registry',
      error: 'Failed to create Kitten'
    });
    setShowForm(null);
    resetKittenForms();
  };

  const handleUpcomingSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set('features', JSON.stringify(features.filter(f => f)));
    toast.promise(dispatch(createUpcoming(formData)).unwrap(), {
      loading: 'Syncing Litter...',
      success: 'Upcoming Litter Saved',
      error: 'Failed to save'
    });
    setShowForm(null);
    setFeatures(['']);
  };

  const handleRetiredSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set('highlights', JSON.stringify(highlights.filter(h => h)));
    toast.promise(dispatch(createRetired(formData)).unwrap(), {
      loading: 'Saving Record...',
      success: 'Adult Legacy Saved',
      error: 'Failed to save'
    });
    setShowForm(null);
    setHighlights(['']);
  };

  const handleAdminReviewSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set('isApproved', 'true'); // Pre-approved because admin created it
    toast.promise(dispatch(createReview(formData)).unwrap(), {
      loading: 'Posting Vouch...',
      success: 'Review Published Live',
      error: 'Failed to publish'
    });
    setShowForm(null);
  };

  // --- APPLICATION HANDLERS ---
  const handleApproveApp = (id) => {
    toast.promise(dispatch(approveApplication(id)).unwrap(), {
      loading: 'Approving...',
      success: 'Application Approved',
      error: 'Failed to approve'
    });
  };

  const handleRejectApp = (id) => {
    toast.promise(dispatch(rejectApplication(id)).unwrap(), {
      loading: 'Rejecting...',
      success: 'Application Rejected',
      error: 'Failed to reject'
    });
  };

  const handleDeleteApp = (id) => {
    if (window.confirm("Delete this application permanently?")) {
      toast.promise(dispatch(deleteApplication(id)).unwrap(), {
        loading: 'Deleting...',
        success: 'Application Deleted',
        error: 'Failed to delete'
      });
    }
  };

  const handleUpdateLocation = (e) => {
    e.preventDefault();
    const newLoc = e.target.mainLocation.value;
    toast.promise(dispatch(updateLocation({ mainLocation: newLoc })).unwrap(), {
      loading: 'Updating...',
      success: 'Coordinates Updated',
      error: 'Failed to update location'
    });
  };

  const resetKittenForms = () => {
    setSpecs([{ label: '', value: '' }]);
    setMedical([{ event: '', status: '', week: '' }]);
    setLineage([{ relation: '', name: '', title: '' }]);
  };

  // --- UI ATOMS (BRUTALIST FASHION) ---

  const SectionHeader = ({ title, subtitle, onAdd, onAddLabel }) => (
    <div className="flex justify-between items-end mb-16 px-2">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-3">{subtitle}</p>
        <h2 className="text-7xl font-black tracking-tighter italic uppercase leading-[0.8]">{title}</h2>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="bg-zinc-950 text-white px-6 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl active:scale-95 transition-all">
          {onAddLabel || <Plus size={24} strokeWidth={3} />}
        </button>
      )}
    </div>
  );

  const FormOverlay = ({ title, onClose, children, onSubmit }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[100] overflow-y-auto pt-20 pb-40">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-16 sticky top-0 bg-white/95 backdrop-blur-md py-6 z-10 border-b border-zinc-100">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h2>
          <button type="button" onClick={onClose} className="p-4 bg-zinc-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={24}/></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-16">
          {children}
          <button type="submit" className="w-full py-9 bg-zinc-950 text-white rounded-[45px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-zinc-800 transition-all">
            Commit Records
          </button>
        </form>
      </div>
    </motion.div>
  );

  const FormLabel = ({ text, icon: Icon }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 flex items-center gap-2 mb-6">
      {Icon && <Icon size={14}/>} {text}
    </p>
  );

  // --- VIEWS ---

  const HomeView = () => (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <SectionHeader title="HQ" subtitle="System Control" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-10 bg-zinc-950 text-white rounded-[50px] shadow-2xl relative overflow-hidden group">
          <Zap size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Network Capacity</p>
          <p className="text-8xl font-black italic tracking-tighter leading-none">{kittens.length + retiredList.length}</p>
        </div>
        <div className="p-10 bg-white border-2 border-zinc-100 rounded-[50px] flex flex-col justify-between group hover:border-zinc-950 transition-all">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Pending Leads</p>
            <p className="text-8xl font-black italic tracking-tighter text-zinc-950 leading-none">{applications?.filter(a => a.status === 'Pending').length || 0}</p>
          </div>
          <button onClick={() => setActiveTab('applications')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-950 mt-6 group-hover:underline">
            Manage Applications <ArrowUpRight size={14}/>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 px-4">Fast Access</p>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => setShowForm('notify')} className="p-10 bg-zinc-50 rounded-[40px] flex justify-between items-center group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-zinc-950 shadow-sm"><Bell size={24}/></div>
              <span className="font-black uppercase tracking-[0.2em] text-sm">Create System Alert</span>
            </div>
            <Plus size={24} className="text-zinc-300 group-hover:text-zinc-950" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white pb-64">
      <Toaster position="top-right" toastOptions={{ style: { background: '#09090b', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '100px', padding: '16px 24px' }}} />

      {/* HEADER STICKY */}
      <header className="px-8 py-10 flex justify-between items-center sticky top-0 bg-white/70 backdrop-blur-2xl z-[90] border-b border-zinc-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-950 rounded-[18px] flex items-center justify-center text-white font-black italic text-xl">B</div>
          <div>
            <h1 className="text-[11px] font-black uppercase tracking-[0.4em] block leading-none">Nursery Control</h1>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Status: Operational</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><LogOut size={20}/></button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER */}
      <main className="max-w-2xl mx-auto px-6 pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" />}

          {/* NEW APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div key="applications" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Leads" subtitle="Client Submissions" />
              <div className="grid grid-cols-1 gap-6">
                {applications.map(app => (
                  <div key={app._id} className="p-8 bg-white border border-zinc-100 rounded-[50px] shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black uppercase italic text-2xl tracking-tighter leading-none">{app.name}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{app.email}</p>
                      </div>
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-[30px] mb-8">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Inquiry Type: {app.inquiryType}</p>
                      <p className="text-sm font-medium text-zinc-800 leading-relaxed italic">"{app.message}"</p>
                    </div>
                    <div className="flex gap-3">
                      {app.status === 'Pending' && (
                        <>
                          <button onClick={() => handleApproveApp(app._id)} className="flex-1 py-4 bg-zinc-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all"><Check size={14}/> Approve</button>
                          <button onClick={() => handleRejectApp(app._id)} className="flex-1 py-4 bg-white border border-zinc-200 text-zinc-950 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all"><Octagon size={14}/> Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDeleteApp(app._id)} className="p-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kittens' && (
            <div key="kittens" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Registry" subtitle="Available Specimens" onAdd={() => setShowForm('kitten')} onAddLabel="Add Kitten" />
              <div className="grid grid-cols-1 gap-6">
                {kittens.map(k => (
                  <div key={k._id} className="p-8 bg-white border border-zinc-100 rounded-[50px] flex items-center gap-8 group hover:shadow-2xl hover:border-zinc-200 transition-all duration-500">
                    <div className="w-28 h-28 bg-zinc-100 rounded-[35px] overflow-hidden">
                      <img src={k.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={k.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-black uppercase italic text-2xl tracking-tighter leading-none">{k.name}</h4>
                        {k.isFeatured && <div className="p-1.5 bg-amber-100 text-amber-500 rounded-full"><Sparkles size={14}/></div>}
                      </div>
                      <div className="flex gap-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${k.status === 'Available' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-400'}`}>{k.status}</span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] self-center">${k.price}</span>
                      </div>
                    </div>
                    <button onClick={() => {
                      if(window.confirm("Delete this kitten?")) {
                        toast.promise(dispatch(deleteKitten(k._id)).unwrap(), {
                          loading: 'Deleting...', success: 'Kitten Deleted', error: 'Failed to delete'
                        });
                      }
                    }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"><Trash2 size={24}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'retired' && (
            <div key="retired" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Adults" subtitle="Retired Residents" onAdd={() => setShowForm('retired')} onAddLabel="Add Adult" />
              <div className="grid grid-cols-1 gap-6">
                {retiredList.map(r => (
                  <div key={r._id} className="p-8 bg-white border border-zinc-100 rounded-[50px] flex items-center gap-8 group hover:shadow-xl transition-all">
                    <div className="w-28 h-28 bg-zinc-100 rounded-[35px] overflow-hidden">
                      <img src={r.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={r.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black uppercase italic text-2xl tracking-tighter">{r.name}</h4>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Retired Legacy Member</p>
                    </div>
                    <button onClick={() => {
                      if(window.confirm("Delete this adult?")) {
                        toast.promise(dispatch(deleteRetired(r._id)).unwrap(), {
                          loading: 'Deleting...', success: 'Adult Deleted', error: 'Failed to delete'
                        });
                      }
                    }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div key="upcoming" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Future" subtitle="Upcoming Litters" onAdd={() => setShowForm('upcoming')} onAddLabel="Add Litter" />
              <div className="grid grid-cols-1 gap-6">
                {upcomingList.map(u => (
                  <div key={u._id} className="p-8 bg-white border border-zinc-100 rounded-[50px] flex items-center gap-8 group hover:shadow-xl transition-all">
                    <div className="w-28 h-28 bg-zinc-100 rounded-[35px] overflow-hidden relative">
                      <img src={u.image} className="w-full h-full object-cover" alt={u.title} />
                      <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black uppercase italic text-2xl tracking-tighter">{u.title}</h4>
                      <div className="flex items-center gap-2 text-zinc-400 mt-1">
                        <Calendar size={12}/>
                        <p className="text-[10px] font-black uppercase tracking-widest">{u.expectedArrival}</p>
                      </div>
                    </div>
                    <button onClick={() => {
                      if(window.confirm("Delete this litter?")) {
                        toast.promise(dispatch(deleteUpcoming(u._id)).unwrap(), {
                          loading: 'Deleting...', success: 'Litter Deleted', error: 'Failed to delete'
                        });
                      }
                    }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div key="alerts" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Alerts" subtitle="Broadcasting" onAdd={() => setShowForm('notify')} onAddLabel="New Alert" />
              <div className="grid grid-cols-1 gap-6">
                {adminNotifications.map(n => (
                  <div key={n._id} className="p-8 bg-white border border-zinc-100 rounded-[50px] flex items-center gap-8">
                    <div className="w-28 h-28 bg-zinc-100 rounded-[35px] overflow-hidden">
                      <img src={n.image} className="w-full h-full object-cover" alt={n.title} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black uppercase italic text-lg leading-tight mb-2">{n.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 line-clamp-2">{n.description}</p>
                    </div>
                    <button onClick={() => {
                      if(window.confirm("Delete this alert?")) {
                        toast.promise(dispatch(deleteNotification(n._id)).unwrap(), {
                          loading: 'Deleting...', success: 'Alert Deleted', error: 'Failed to delete'
                        });
                      }
                    }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div key="reviews" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Vouches" subtitle="Public Testimony" onAdd={() => setShowForm('adminReview')} onAddLabel="Add Vouch" />
              <div className="grid grid-cols-1 gap-8">
                {adminReviews.map(rev => (
                  <div key={rev._id} className={`p-10 rounded-[60px] border transition-all ${rev.isApproved ? 'bg-white border-zinc-100' : 'bg-zinc-950 text-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] scale-[1.02]'}`}>
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl">
                          <img src={rev.image} className="w-full h-full object-cover" alt={rev.name} />
                        </div>
                        <div>
                          <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{rev.name}</h4>
                          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${rev.isApproved ? 'text-zinc-400' : 'text-zinc-500'}`}>{rev.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 bg-white/5 p-2 rounded-full">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"} />)}
                      </div>
                    </div>
                    <p className={`text-xl font-bold leading-relaxed italic mb-10 ${rev.isApproved ? 'text-zinc-800' : 'text-zinc-200'}`}>"{rev.review}"</p>
                    <div className="flex justify-between items-center border-t border-white/10 pt-8">
                      <button onClick={() => {
                        if(window.confirm("Delete this review permanently?")) {
                          toast.promise(dispatch(deleteReview(rev._id)).unwrap(), {
                            loading: 'Deleting...', success: 'Review Deleted', error: 'Failed to delete'
                          });
                        }
                      }} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500">Delete Permanently</button>
                      {!rev.isApproved && (
                        <button onClick={() => {
                          toast.promise(dispatch(approveReview(rev._id)).unwrap(), {
                            loading: 'Approving...', success: 'Review Approved', error: 'Failed to approve'
                          });
                        }} className="px-12 py-4 bg-white text-zinc-950 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all">Authorize Broadcast</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div key="settings" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Core" subtitle="Global Variables" />
              <section className="p-12 bg-white border border-zinc-100 rounded-[60px] shadow-sm">
                <FormLabel text="Primary Geolocation" icon={MapPin} />
                <form onSubmit={handleUpdateLocation} className="space-y-8">
                  <div className="relative">
                    <input name="mainLocation" defaultValue={settings?.mainLocation} className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl uppercase tracking-tighter outline-none focus:ring-4 ring-zinc-100 transition-all" placeholder="e.g. ATLANTA, GEORGIA" />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-zinc-950 text-white rounded-2xl shadow-xl"><MapPin size={24}/></div>
                  </div>
                  <button type="submit" className="w-full py-7 bg-zinc-950 text-white rounded-[35px] font-black text-[10px] uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all">Push Coordinates to System</button>
                </form>
              </section>

              <section className="p-12 bg-zinc-50 rounded-[60px] border border-zinc-100">
                <FormLabel text="Maintenance Logs" icon={Activity} />
                <div className="space-y-4">
                  <div className="flex justify-between py-4 border-b border-zinc-200 items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Environment</span>
                    <span className="text-[10px] font-black uppercase">Production 1.0.4</span>
                  </div>
                  <div className="flex justify-between py-4 items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Redux Status</span>
                    <span className="text-[10px] font-black uppercase text-green-500">Connected</span>
                  </div>
                </div>
              </section>
            </div>
          )}

        </AnimatePresence>
      </main>

      {/* --- ALL COMPLEX FORMS (PATIENTLY REBUILT) --- */}
      <AnimatePresence>
        {/* KITTEN CREATION FORM */}
        {showForm === 'kitten' && (
          <FormOverlay title="New Specimen" onClose={() => setShowForm(null)} onSubmit={handleKittenSubmit}>
            <div className="space-y-20">
              <section>
                <FormLabel text="Identity & Classification" icon={Fingerprint} />
                <div className="grid grid-cols-1 gap-6">
                  <input name="name" placeholder="Cat Full Name" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold text-lg outline-none border-2 border-transparent focus:border-zinc-950 transition-all" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="registryId" placeholder="Registry ID #" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                    <input name="breed" defaultValue="Munchkin" placeholder="Breed Class" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                  </div>
                </div>
              </section>

              <section>
                <FormLabel text="Biological Parameters" icon={Activity} />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select name="gender" className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input name="ageWeeks" type="number" placeholder="Age (Weeks)" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select name="coat" className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Standard">Standard Coat</option>
                    <option value="Shorthair">Shorthair</option>
                    <option value="Longhair">Longhair</option>
                  </select>
                  <select name="status" className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </section>

              <section>
                <FormLabel text="Pricing & Visibility" icon={Zap} />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <input name="price" type="number" placeholder="Price ($)" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" required />
                  <input name="trait" placeholder="UI Badge (e.g. TICA Reg)" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                </div>
                <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-[35px]">
                  <span className="text-[10px] font-black uppercase tracking-widest">Mark as Featured (Top of Site)</span>
                  <input type="checkbox" name="isFeatured" className="w-8 h-8 accent-zinc-950 rounded-xl" />
                </div>
              </section>

              {/* DYNAMIC ARRAYS: SPECS */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Detailed Specifications" icon={Layers} />
                  <button type="button" onClick={() => addNested(setSpecs)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-3">
                  {specs.map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <input placeholder="Label" list="spec-labels" className="flex-1 p-6 bg-zinc-50 rounded-[25px] text-xs font-bold uppercase" onChange={(e) => { const n = [...specs]; n[i].label = e.target.value; setSpecs(n); }} />
                      <input placeholder="Value" className="flex-1 p-6 bg-zinc-50 rounded-[25px] text-xs font-bold uppercase" onChange={(e) => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} />
                      <button type="button" onClick={() => removeNested(setSpecs, i)} className="p-4 text-red-500"><Minus size={20}/></button>
                    </div>
                  ))}
                  <datalist id="spec-labels">
                    <option value="Eye Color" /><option value="Ear Type" /><option value="Leg Length" /><option value="Coat Color" />
                  </datalist>
                </div>
              </section>

              {/* DYNAMIC ARRAYS: MEDICAL */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Medical Records" icon={Stethoscope} />
                  <button type="button" onClick={() => addNested(setMedical)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-3">
                  {medical.map((m, i) => (
                    <div key={i} className="flex gap-3 items-center bg-zinc-50 p-4 rounded-[30px]">
                      <input placeholder="Event (e.g. FVRCP)" className="flex-1 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].event = e.target.value; setMedical(n); }} />
                      <input placeholder="Status" className="w-24 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].status = e.target.value; setMedical(n); }} />
                      <input placeholder="Week" className="w-20 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].week = e.target.value; setMedical(n); }} />
                      <button type="button" onClick={() => removeNested(setMedical, i)} className="p-3 text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* DYNAMIC ARRAYS: LINEAGE */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Ancestry / Lineage" icon={ShieldCheck} />
                  <button type="button" onClick={() => addNested(setLineage)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-4">
                  {lineage.map((l, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-[30px]">
                      <select className="bg-transparent text-[10px] font-black uppercase tracking-widest appearance-none outline-none pl-4" onChange={(e) => { const n = [...lineage]; n[i].relation = e.target.value; setLineage(n); }}>
                        <option value="Dam">Dam</option>
                        <option value="Sire">Sire</option>
                      </select>
                      <input placeholder="Full Name" className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none" onChange={(e) => { const n = [...lineage]; n[i].name = e.target.value; setLineage(n); }} />
                      <div className="flex items-center gap-2">
                        <input placeholder="Title" className="bg-transparent flex-1 text-[10px] font-black uppercase tracking-widest outline-none" onChange={(e) => { const n = [...lineage]; n[i].title = e.target.value; setLineage(n); }} />
                        <button type="button" onClick={() => removeNested(setLineage, i)} className="text-red-400 pr-2"><X size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <FormLabel text="Gallery Assets" icon={ImageIcon} />
                <div className="p-20 border-4 border-dashed border-zinc-100 rounded-[60px] text-center flex flex-col items-center group hover:border-zinc-950 transition-all">
                  <Camera size={48} className="text-zinc-200 group-hover:text-zinc-950 transition-all mb-6" />
                  <input type="file" name="images" multiple className="text-[10px] font-black uppercase tracking-widest cursor-pointer" required />
                  <p className="mt-4 text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Supports Multi-select (Up to 5 images)</p>
                </div>
              </section>
            </div>
          </FormOverlay>
        )}

        {/* UPCOMING LITTER FORM */}
        {showForm === 'upcoming' && (
          <FormOverlay title="New Litter Sync" onClose={() => setShowForm(null)} onSubmit={handleUpcomingSubmit}>
            <div className="space-y-12">
              <input name="title" placeholder="Pairing (e.g. Luna x Oliver)" className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl uppercase tracking-tighter" required />
              <input name="expectedArrival" placeholder="Expected Arrival (Month/Year)" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              <textarea name="description" placeholder="Description of traits..." className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Pairing Visual</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" required />
              </div>
            </div>
          </FormOverlay>
        )}

        {/* RETIRED ADULT FORM */}
        {showForm === 'retired' && (
          <FormOverlay title="Registry: Adult Legacy" onClose={() => setShowForm(null)} onSubmit={handleRetiredSubmit}>
            <div className="space-y-12">
              <input name="name" placeholder="Full Name" className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl uppercase tracking-tighter" required />
              <div className="grid grid-cols-2 gap-4">
                <input name="age" placeholder="Age" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
                <input name="adoptionFee" type="number" placeholder="Fee ($)" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              </div>
              <textarea name="description" placeholder="Short Bio..." className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Legacy Portrait</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" required />
              </div>
            </div>
          </FormOverlay>
        )}

        {/* ALERT/NOTIFICATION FORM */}
        {showForm === 'notify' && (
          <FormOverlay title="New System Broadcast" onClose={() => setShowForm(null)} onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            toast.promise(dispatch(createNotification(fd)).unwrap(), { loading: 'Broadcasting...', success: 'Alert Created', error: 'Failed to broadcast' });
            setShowForm(null);
          }}>
            <div className="space-y-8">
              <input name="title" placeholder="Broadcast Headline" className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl italic tracking-tighter" required />
              <textarea name="description" placeholder="Primary message body content..." className="w-full p-10 bg-zinc-50 rounded-[40px] font-bold min-h-[250px]" required />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Broadcast Visual</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" required />
              </div>
            </div>
          </FormOverlay>
        )}

        {/* ADMIN REVIEW CREATION FORM */}
        {showForm === 'adminReview' && (
          <FormOverlay title="New Direct Vouch" onClose={() => setShowForm(null)} onSubmit={handleAdminReviewSubmit}>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Client Name" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
                <input name="location" placeholder="City, State" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              </div>
              <input name="email" type="email" placeholder="client@email.com" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              <div className="space-y-2 px-4">
                <label className="text-[10px] font-black uppercase tracking-widest">Rating Tier (1-5)</label>
                <input name="rating" type="range" min="1" max="5" defaultValue="5" className="w-full accent-zinc-950" required />
              </div>
              <textarea name="review" placeholder="Testimonial Body..." className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" required />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Client Portrait</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" required />
              </div>
            </div>
          </FormOverlay>
        )}
      </AnimatePresence>

      {/* --- DOCK NAVIGATION --- */}
      <nav className="fixed bottom-12 inset-x-0 z-[100] px-6">
        <div className="max-w-4xl mx-auto bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[50px] p-4 flex items-center justify-around shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={22}/>} label="Home" />
          <NavBtn active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<ClipboardList size={22}/>} label="Leads" />
          <NavBtn active={activeTab === 'kittens'} onClick={() => setActiveTab('kittens')} icon={<PawPrint size={22}/>} label="Nursery" />
          <NavBtn active={activeTab === 'retired'} onClick={() => setActiveTab('retired')} icon={<Heart size={22}/>} label="Adults" />
          <NavBtn active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} icon={<Calendar size={22}/>} label="Future" />
          <NavBtn active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<Bell size={22}/>} label="Alerts" />
          <NavBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<Star size={22}/>} label="Vouches" />
          <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22}/>} label="Core" />
        </div>
      </nav>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center gap-1 transition-all duration-700 ${active ? 'scale-125 -translate-y-3' : 'opacity-30 hover:opacity-100'}`}>
    <div className={`p-3 rounded-[22px] transition-all ${active ? 'bg-white text-zinc-950 shadow-2xl shadow-white/20' : 'text-white'}`}>
      {icon}
    </div>
    {active && (
      <motion.span layoutId="navLabel" className="text-[7px] font-black uppercase tracking-[0.3em] text-white absolute -bottom-5 whitespace-nowrap">
        {label}
      </motion.span>
    )}
  </button>
);

const Fingerprint = (props) => <Shield {...props} />;

export default AdminDashboard;