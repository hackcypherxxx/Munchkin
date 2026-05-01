import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard, PlusCircle, Star, Bell, LogOut,
  Settings, PawPrint, X, Trash2, Calendar,
  User, MapPin, Sparkles, Zap, Info, Camera,
  Plus, Minus, ArrowUpRight, Shield, Activity,
  ChevronRight, Layers, Heart, Award, CheckCircle2,
  AlertCircle, RefreshCw, Eye, Image as ImageIcon,
  Stethoscope, Mail, MessageSquare, FileText, Edit3,
  ShieldCheck
} from 'lucide-react';

import { createKitten, getKittens, deleteKitten, updateKitten } from '../features/kitten/kittenSlice';
import { createNotification, getAllNotificationsAdmin, deleteNotification, updateNotification } from '../features/notification/notificationSlice';
import { createRetired, getRetired, deleteRetired, updateRetired } from '../features/retired/retiredSlice';
import { createUpcoming, getUpcoming, deleteUpcoming, updateUpcoming } from '../features/upcoming/upcomingSlice';
import { getAllReviewsAdmin, approveReview, deleteReview, createReview } from '../features/review/reviewSlice';
import { getSettings, updateLocation } from '../features/settings/settingsSlice';
import { getApplications, approveApplication, rejectApplication, deleteApplication } from '../features/application/applicationSlice';
import { sendAdminMessage } from '../features/adminContact/adminContactSlice';

// -------------------------------------------------------
// REUSABLE COMPONENTS – placed outside to prevent re‑mounting
// -------------------------------------------------------

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

const FormLabel = ({ text, icon: Icon }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 flex items-center gap-2 mb-6">
    {Icon && <Icon size={14} />} {text}
  </p>
);

const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center gap-1 transition-all duration-700 px-2 ${active ? 'scale-125 -translate-y-3' : 'opacity-30 hover:opacity-100'}`}>
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

// Stable FormOverlay – now a separate component, never re‑creates while internal state changes
const FormOverlay = ({ title, onClose, children, onSubmit, editMode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[100] overflow-y-auto pt-20 pb-40">
    <div className="max-w-2xl mx-auto px-6">
      <div className="flex justify-between items-center mb-16 sticky top-0 bg-white/95 backdrop-blur-md py-6 z-10 border-b border-zinc-100">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">
          {editMode ? `Edit ${title}` : `New ${title}`}
        </h2>
        <button type="button" onClick={onClose} className="p-4 bg-zinc-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={24} /></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-16">
        {children}
        <button type="submit" className="w-full py-9 bg-zinc-950 text-white rounded-[45px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-zinc-800 transition-all">
          {editMode ? 'Update Records' : 'Commit Records'}
        </button>
      </form>
    </div>
  </motion.div>
);

// HomeView separated to avoid deep nesting
const HomeView = ({ kittens, retiredList, adminReviews, applications, setActiveTab, setShowForm }) => (
  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <SectionHeader title="HQ" subtitle="System Control" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-10 bg-zinc-950 text-white rounded-[50px] shadow-2xl relative overflow-hidden group">
        <Zap size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Network Capacity</p>
        <p className="text-8xl font-black italic tracking-tighter leading-none">{kittens.length + retiredList.length}</p>
      </div>
      <div className="p-10 bg-white border-2 border-zinc-100 rounded-[50px] flex flex-col justify-between group hover:border-zinc-950 transition-all">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Approval Queue</p>
          <p className="text-8xl font-black italic tracking-tighter text-zinc-950 leading-none">{adminReviews.filter(r => !r.isApproved).length}</p>
        </div>
        <button onClick={() => setActiveTab('reviews')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-950 mt-6 group-hover:underline">
          Manage Vouches <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="p-10 bg-white border-2 border-zinc-100 rounded-[50px] flex flex-col justify-between group hover:border-zinc-950 transition-all">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Pending Apps</p>
          <p className="text-8xl font-black italic tracking-tighter text-zinc-950 leading-none">
            {applications?.filter(a => a.status === 'Pending' || !a.status).length || 0}
          </p>
        </div>
        <button onClick={() => setActiveTab('applications')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-950 mt-6 group-hover:underline">
          Review Apps <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 px-4">Fast Access</p>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => setShowForm('notify')} className="p-10 bg-zinc-50 rounded-[40px] flex justify-between items-center group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-zinc-950 shadow-sm"><Bell size={24} /></div>
            <span className="font-black uppercase tracking-[0.2em] text-sm">Create System Alert</span>
          </div>
          <Plus size={24} className="text-zinc-300 group-hover:text-zinc-950" />
        </button>
        <button onClick={() => setActiveTab('message')} className="p-10 bg-zinc-50 rounded-[40px] flex justify-between items-center group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-zinc-950 shadow-sm"><Mail size={24} /></div>
            <span className="font-black uppercase tracking-[0.2em] text-sm">Send Message to User</span>
          </div>
          <ArrowUpRight size={24} className="text-zinc-300 group-hover:text-zinc-950" />
        </button>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------
// MAIN ADMIN DASHBOARD COMPONENT
// -------------------------------------------------------

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(null); // 'kitten', 'upcoming', 'retired', 'notify', 'review'
  const [editItem, setEditItem] = useState(null);

  // Dynamic array states
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [medical, setMedical] = useState([{ event: '', status: '', week: '' }]);
  const [lineage, setLineage] = useState([{ relation: '', name: '', title: '' }]);
  const [features, setFeatures] = useState(['']);
  const [highlights, setHighlights] = useState(['']);

  // Redux selectors
  const { kittens } = useSelector(state => state.kitten);
  const { adminNotifications } = useSelector(state => state.notification);
  const { retiredList } = useSelector(state => state.retired);
  const { upcomingList } = useSelector(state => state.upcoming);
  const { adminReviews } = useSelector(state => state.review);
  const { settings } = useSelector(state => state.settings);
  const { applications } = useSelector(state => state.application);

  useEffect(() => {
    dispatch(getKittens());
    dispatch(getAllNotificationsAdmin());
    dispatch(getRetired());
    dispatch(getUpcoming());
    dispatch(getAllReviewsAdmin());
    dispatch(getSettings());
    dispatch(getApplications());
  }, [dispatch]);

  // Stable array helpers
  const addToArray = useCallback((setter) => setter(prev => [...prev, {}]), []);
  const removeFromArray = useCallback((setter, idx) => setter(prev => prev.filter((_, i) => i !== idx)), []);

  // Pre‑fill dynamic fields when editing
  const openEditForm = useCallback((entity, data) => {
    setEditItem(data);
    if (entity === 'kitten') {
      setSpecs(data.specs?.length ? data.specs : [{ label: '', value: '' }]);
      setMedical(data.medical?.length ? data.medical : [{ event: '', status: '', week: '' }]);
      setLineage(data.lineage?.length ? data.lineage : [{ relation: '', name: '', title: '' }]);
    }
    if (entity === 'upcoming') setFeatures(data.features?.length ? data.features : ['']);
    if (entity === 'retired') setHighlights(data.highlights?.length ? data.highlights : ['']);
    setShowForm(entity);
  }, []);

  // Reset all form state on close
  const closeForm = useCallback(() => {
    setShowForm(null);
    setEditItem(null);
    setSpecs([{ label: '', value: '' }]);
    setMedical([{ event: '', status: '', week: '' }]);
    setLineage([{ relation: '', name: '', title: '' }]);
    setFeatures(['']);
    setHighlights(['']);
  }, []);

  // ========== SUBMISSION HANDLERS ==========

  const handleKittenSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const isFeatured = e.target.isFeatured?.checked ?? false;
    fd.set('isFeatured', isFeatured ? 'true' : 'false');
    const validSpecs = specs.filter(s => s.label && s.value);
    const validMedical = medical.filter(m => m.event);
    const validLineage = lineage.filter(l => l.name);
    fd.set('specs', JSON.stringify(validSpecs));
    fd.set('medical', JSON.stringify(validMedical));
    fd.set('lineage', JSON.stringify(validLineage));

    try {
      if (editItem) {
        await dispatch(updateKitten({ id: editItem._id, formData: fd })).unwrap();
        toast.success('Kitten updated');
      } else {
        await dispatch(createKitten(fd)).unwrap();
        toast.success('Kitten created');
      }
    } catch (err) {
      toast.error(err);
    }
    closeForm();
  };

  const handleUpcomingSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set('features', JSON.stringify(features.filter(f => f)));
    try {
      if (editItem) {
        await dispatch(updateUpcoming({ id: editItem._id, formData: fd })).unwrap();
        toast.success('Litter updated');
      } else {
        await dispatch(createUpcoming(fd)).unwrap();
        toast.success('Litter created');
      }
    } catch (err) {
      toast.error(err);
    }
    closeForm();
  };

  const handleRetiredSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set('highlights', JSON.stringify(highlights.filter(h => h)));
    try {
      if (editItem) {
        await dispatch(updateRetired({ id: editItem._id, formData: fd })).unwrap();
        toast.success('Adult updated');
      } else {
        await dispatch(createRetired(fd)).unwrap();
        toast.success('Adult created');
      }
    } catch (err) {
      toast.error(err);
    }
    closeForm();
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (editItem) {
        await dispatch(updateNotification({ id: editItem._id, formData: fd })).unwrap();
        toast.success('Alert updated');
      } else {
        await dispatch(createNotification(fd)).unwrap();
        toast.success('Alert created');
      }
    } catch (err) {
      toast.error(err);
    }
    closeForm();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set('isApproved', editItem ? (editItem.isApproved ?? true).toString() : 'true');
    if (editItem) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/reviews/${editItem._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error('Update failed');
        await dispatch(getAllReviewsAdmin());
        toast.success('Review updated');
      } catch (err) {
        toast.error('Failed to update review');
      }
    } else {
      await dispatch(createReview(fd)).unwrap();
      toast.success('Review added');
    }
    closeForm();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const payload = {
      to: e.target.to.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };
    try {
      await dispatch(sendAdminMessage(payload)).unwrap();
      toast.success('Email sent');
      e.target.reset();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleUpdateLocation = (e) => {
    e.preventDefault();
    const loc = e.target.mainLocation.value;
    dispatch(updateLocation({ mainLocation: loc }))
      .unwrap()
      .then(() => toast.success('Location updated'))
      .catch(err => toast.error(err));
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white pb-64">
      <Toaster position="top-right" toastOptions={{ style: { background: '#09090b', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '100px', padding: '16px 24px' }}} />

      {/* Header */}
      <header className="px-8 py-10 flex justify-between items-center sticky top-0 bg-white/70 backdrop-blur-2xl z-[90] border-b border-zinc-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-950 rounded-[18px] flex items-center justify-center text-white font-black italic text-xl">B</div>
          <div>
            <h1 className="text-[11px] font-black uppercase tracking-[0.4em] block leading-none">Nursery Control</h1>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Status: Operational</p>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-red-500 hover:text-white transition-all">
          <LogOut size={20}/>
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" kittens={kittens} retiredList={retiredList} adminReviews={adminReviews} applications={applications} setActiveTab={setActiveTab} setShowForm={setShowForm} />}

          {/* KITTENS */}
          {activeTab === 'kittens' && (
            <div key="kittens" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Registry" subtitle="Available Specimens" onAdd={() => { setEditItem(null); setShowForm('kitten'); }} onAddLabel="Add Kitten" />
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
                    <div className="flex gap-2">
                      <button onClick={() => openEditForm('kitten', k)} className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-200 rounded-full transition-all"><Edit3 size={20}/></button>
                      <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteKitten(k._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"><Trash2 size={24}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RETIRED */}
          {activeTab === 'retired' && (
            <div key="retired" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Adults" subtitle="Retired Residents" onAdd={() => { setEditItem(null); setHighlights(['']); setShowForm('retired'); }} onAddLabel="Add Adult" />
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
                    <div className="flex gap-2">
                      <button onClick={() => openEditForm('retired', r)} className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-200 rounded-full transition-all"><Edit3 size={20}/></button>
                      <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteRetired(r._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPCOMING */}
          {activeTab === 'upcoming' && (
            <div key="upcoming" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Future" subtitle="Upcoming Litters" onAdd={() => { setEditItem(null); setFeatures(['']); setShowForm('upcoming'); }} onAddLabel="Add Litter" />
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
                    <div className="flex gap-2">
                      <button onClick={() => openEditForm('upcoming', u)} className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-200 rounded-full transition-all"><Edit3 size={20}/></button>
                      <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteUpcoming(u._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === 'applications' && (
            <div key="applications" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Applications" subtitle="Adoption Requests" />
              <div className="grid grid-cols-1 gap-6">
                {applications?.length > 0 ? applications.map(app => (
                  <div key={app._id} className="p-10 bg-white border border-zinc-100 rounded-[50px] flex flex-col gap-6 group hover:shadow-2xl hover:border-zinc-200 transition-all duration-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black uppercase italic text-3xl tracking-tighter leading-none text-zinc-900">
                          {app.name || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Applicant'}
                        </h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-3">
                          {app.email} {app.phone ? `• ${app.phone}` : ''}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    {(app.about || app.message || app.description) && (
                      <div className="p-6 bg-zinc-50 rounded-[30px]">
                        <p className="text-xs font-bold leading-relaxed text-zinc-600">"{app.about || app.message || app.description}"</p>
                      </div>
                    )}
                    <div className="flex justify-end items-center gap-3 pt-6 border-t border-zinc-100">
                      {app.status !== 'Approved' && (
                        <button onClick={() => dispatch(approveApplication(app._id)).unwrap().then(() => toast.success('Approved')).catch(err => toast.error(err))} className="px-6 py-3 bg-zinc-950 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg active:scale-95">Approve</button>
                      )}
                      {app.status !== 'Rejected' && (
                        <button onClick={() => dispatch(rejectApplication(app._id)).unwrap().then(() => toast.success('Rejected')).catch(err => toast.error(err))} className="px-6 py-3 bg-white border-2 border-zinc-100 text-zinc-950 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95">Reject</button>
                      )}
                      <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteApplication(app._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="w-12 h-12 ml-2 flex items-center justify-center bg-zinc-50 text-zinc-300 hover:bg-red-500 hover:text-white rounded-full transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20">
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-300">No Applications in Queue</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ALERTS */}
          {activeTab === 'alerts' && (
            <div key="alerts" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Alerts" subtitle="Broadcasting" onAdd={() => { setEditItem(null); setShowForm('notify'); }} onAddLabel="New Alert" />
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
                    <div className="flex gap-2">
                      <button onClick={() => openEditForm('notify', n)} className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-200 rounded-full transition-all"><Edit3 size={20}/></button>
                      <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteNotification(n._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="w-14 h-14 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-all"><Trash2 size={24}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div key="reviews" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Vouches" subtitle="Public Testimony" onAdd={() => { setEditItem(null); setShowForm('review'); }} onAddLabel="Add Vouch" />
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
                      <div className="flex gap-4">
                        <button onClick={() => openEditForm('review', rev)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900">Edit</button>
                        <button onClick={() => { if(window.confirm("Delete?")) dispatch(deleteReview(rev._id)).unwrap().then(() => toast.success('Deleted')).catch(err => toast.error(err)); }} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500">Delete</button>
                      </div>
                      {!rev.isApproved && (
                        <button onClick={() => dispatch(approveReview(rev._id)).unwrap().then(() => toast.success('Approved')).catch(err => toast.error(err))} className="px-12 py-4 bg-white text-zinc-950 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all">Authorize Broadcast</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGE */}
          {activeTab === 'message' && (
            <div key="message" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <SectionHeader title="Dispatch" subtitle="Send Email to User" />
              <section className="p-12 bg-white border border-zinc-100 rounded-[60px] shadow-sm">
                <form onSubmit={handleSendMessage} className="space-y-10">
                  <div>
                    <FormLabel text="Recipient" icon={User} />
                    <input name="to" type="email" required className="w-full p-10 bg-zinc-50 rounded-[40px] font-bold text-lg outline-none focus:ring-4 ring-zinc-100 transition-all" placeholder="user@example.com" />
                  </div>
                  <div>
                    <FormLabel text="Subject" icon={Info} />
                    <input name="subject" required className="w-full p-10 bg-zinc-50 rounded-[40px] font-bold text-lg outline-none focus:ring-4 ring-zinc-100 transition-all" placeholder="Subject" />
                  </div>
                  <div>
                    <FormLabel text="Message Body" icon={MessageSquare} />
                    <textarea name="message" required className="w-full p-10 bg-zinc-50 rounded-[40px] font-bold text-lg min-h-[250px] outline-none focus:ring-4 ring-zinc-100 transition-all" placeholder="Your message..." />
                  </div>
                  <button type="submit" className="w-full py-9 bg-zinc-950 text-white rounded-[45px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-zinc-800 transition-all">Send Message</button>
                </form>
              </section>
            </div>
          )}

          {/* SETTINGS */}
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

      {/* ================= ALL FORMS (now stable) ================= */}
      <AnimatePresence>
        {/* KITTEN FORM */}
        {showForm === 'kitten' && (
          <FormOverlay title="Kitten Registry" onClose={closeForm} onSubmit={handleKittenSubmit} editMode={!!editItem}>
            <div className="space-y-20">
              <section>
                <FormLabel text="Identity & Classification" icon={PawPrint} />
                <div className="grid grid-cols-1 gap-6">
                  <input name="name" placeholder="Cat Full Name" defaultValue={editItem?.name || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold text-lg outline-none border-2 border-transparent focus:border-zinc-950 transition-all" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="registryId" placeholder="Registry ID #" defaultValue={editItem?.registryId || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                    <input name="breed" defaultValue={editItem?.breed || 'Munchkin'} placeholder="Breed Class" className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                  </div>
                </div>
              </section>
              
              <section>
                <FormLabel text="Biological Parameters" icon={Activity} />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select name="gender" defaultValue={editItem?.gender || 'Male'} className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input name="ageWeeks" type="number" placeholder="Age (Weeks)" defaultValue={editItem?.ageWeeks || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select name="coat" defaultValue={editItem?.coat || 'Standard'} className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Standard">Standard Coat</option>
                    <option value="Shorthair">Shorthair</option>
                    <option value="Longhair">Longhair</option>
                  </select>
                  <select name="status" defaultValue={editItem?.status || 'Available'} className="w-full p-8 bg-zinc-50 rounded-[35px] font-black uppercase text-xs appearance-none outline-none">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </section>

              <section>
                <FormLabel text="Pricing & Visibility" icon={Zap} />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <input name="price" type="number" placeholder="Price ($)" defaultValue={editItem?.price || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" required />
                  <input name="trait" placeholder="UI Badge (e.g. TICA Reg)" defaultValue={editItem?.trait || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold outline-none" />
                </div>
                <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-[35px]">
                  <span className="text-[10px] font-black uppercase tracking-widest">Mark as Featured (Top of Site)</span>
                  <input type="checkbox" name="isFeatured" defaultChecked={editItem?.isFeatured ?? false} className="w-8 h-8 accent-zinc-950 rounded-xl" />
                </div>
              </section>

              {/* Dynamic Specs */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Detailed Specifications" icon={Layers} />
                  <button type="button" onClick={() => addToArray(setSpecs)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-3">
                  {specs.map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <input placeholder="Label" list="spec-labels" defaultValue={s.label || ''} className="flex-1 p-6 bg-zinc-50 rounded-[25px] text-xs font-bold uppercase" onChange={(e) => { const n = [...specs]; n[i].label = e.target.value; setSpecs(n); }} />
                      <input placeholder="Value" defaultValue={s.value || ''} className="flex-1 p-6 bg-zinc-50 rounded-[25px] text-xs font-bold uppercase" onChange={(e) => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} />
                      <button type="button" onClick={() => removeFromArray(setSpecs, i)} className="p-4 text-red-500"><Minus size={20}/></button>
                    </div>
                  ))}
                  <datalist id="spec-labels">
                    <option value="Eye Color" /><option value="Ear Type" /><option value="Leg Length" /><option value="Coat Color" />
                  </datalist>
                </div>
              </section>

              {/* Dynamic Medical */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Medical Records" icon={Stethoscope} />
                  <button type="button" onClick={() => addToArray(setMedical)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-3">
                  {medical.map((m, i) => (
                    <div key={i} className="flex gap-3 items-center bg-zinc-50 p-4 rounded-[30px]">
                      <input placeholder="Event (e.g. FVRCP)" defaultValue={m.event || ''} className="flex-1 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].event = e.target.value; setMedical(n); }} />
                      <input placeholder="Status" defaultValue={m.status || ''} className="w-24 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].status = e.target.value; setMedical(n); }} />
                      <input placeholder="Week" defaultValue={m.week || ''} className="w-20 p-4 bg-white rounded-2xl text-[10px] font-bold uppercase" onChange={(e) => { const n = [...medical]; n[i].week = e.target.value; setMedical(n); }} />
                      <button type="button" onClick={() => removeFromArray(setMedical, i)} className="p-3 text-red-500"><X size={16}/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dynamic Lineage */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <FormLabel text="Ancestry / Lineage" icon={ShieldCheck} />
                  <button type="button" onClick={() => addToArray(setLineage)} className="p-3 bg-zinc-950 text-white rounded-2xl"><Plus size={18}/></button>
                </div>
                <div className="space-y-4">
                  {lineage.map((l, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-[30px]">
                      <select defaultValue={l.relation || 'Dam'} className="bg-transparent text-[10px] font-black uppercase tracking-widest appearance-none outline-none pl-4" onChange={(e) => { const n = [...lineage]; n[i].relation = e.target.value; setLineage(n); }}>
                        <option value="Dam">Dam</option>
                        <option value="Sire">Sire</option>
                      </select>
                      <input placeholder="Full Name" defaultValue={l.name || ''} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none" onChange={(e) => { const n = [...lineage]; n[i].name = e.target.value; setLineage(n); }} />
                      <div className="flex items-center gap-2">
                        <input placeholder="Title" defaultValue={l.title || ''} className="bg-transparent flex-1 text-[10px] font-black uppercase tracking-widest outline-none" onChange={(e) => { const n = [...lineage]; n[i].title = e.target.value; setLineage(n); }} />
                        <button type="button" onClick={() => removeFromArray(setLineage, i)} className="text-red-400 pr-2"><X size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <FormLabel text="Gallery Assets" icon={ImageIcon} />
                <div className="p-20 border-4 border-dashed border-zinc-100 rounded-[60px] text-center flex flex-col items-center group hover:border-zinc-950 transition-all">
                  <Camera size={48} className="text-zinc-200 group-hover:text-zinc-950 transition-all mb-6" />
                  <input type="file" name="images" multiple className="text-[10px] font-black uppercase tracking-widest cursor-pointer" />
                  <p className="mt-4 text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Supports Multi-select (Up to 5 images)</p>
                </div>
              </section>
            </div>
          </FormOverlay>
        )}

        {/* UPCOMING LITTER FORM */}
        {showForm === 'upcoming' && (
          <FormOverlay title="Upcoming Litter" onClose={closeForm} onSubmit={handleUpcomingSubmit} editMode={!!editItem}>
            <div className="space-y-12">
              <input name="title" placeholder="Pairing (e.g. Luna x Oliver)" defaultValue={editItem?.title || ''} className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl uppercase tracking-tighter" required />
              <input name="expectedArrival" placeholder="Expected Arrival (Month/Year)" defaultValue={editItem?.expectedArrival || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              <textarea name="description" placeholder="Description of traits..." defaultValue={editItem?.description || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Pairing Visual</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" />
              </div>
              <div className="space-y-6">
                <FormLabel text="Features List" icon={Sparkles} />
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input placeholder={`Feature ${i+1}`} defaultValue={f} className="flex-1 p-6 bg-zinc-50 rounded-[25px] font-bold" onChange={(e) => { const n = [...features]; n[i] = e.target.value; setFeatures(n); }} />
                    <button type="button" onClick={() => setFeatures(prev => prev.filter((_, idx) => idx !== i))} className="p-4 text-red-500"><Minus size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => setFeatures([...features, ''])} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors">+ Add Feature</button>
              </div>
            </div>
          </FormOverlay>
        )}

        {/* RETIRED ADULT FORM */}
        {showForm === 'retired' && (
          <FormOverlay title="Retired Adult" onClose={closeForm} onSubmit={handleRetiredSubmit} editMode={!!editItem}>
            <div className="space-y-12">
              <input name="name" placeholder="Full Name" defaultValue={editItem?.name || ''} className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl uppercase tracking-tighter" required />
              <div className="grid grid-cols-2 gap-4">
                <input name="age" placeholder="Age" defaultValue={editItem?.age || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
                <input name="adoptionFee" type="number" placeholder="Fee ($)" defaultValue={editItem?.adoptionFee || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              </div>
              <textarea name="description" placeholder="Short Bio..." defaultValue={editItem?.description || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Legacy Portrait</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" />
              </div>
              <div className="space-y-6">
                <FormLabel text="Highlights" icon={Award} />
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input placeholder={`Highlight ${i+1}`} defaultValue={h} className="flex-1 p-6 bg-zinc-50 rounded-[25px] font-bold" onChange={(e) => { const n = [...highlights]; n[i] = e.target.value; setHighlights(n); }} />
                    <button type="button" onClick={() => setHighlights(prev => prev.filter((_, idx) => idx !== i))} className="p-4 text-red-500"><Minus size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => setHighlights([...highlights, ''])} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors">+ Add Highlight</button>
              </div>
            </div>
          </FormOverlay>
        )}

        {/* NOTIFICATION FORM */}
        {showForm === 'notify' && (
          <FormOverlay title="System Alert" onClose={closeForm} onSubmit={handleNotificationSubmit} editMode={!!editItem}>
            <div className="space-y-8">
              <input name="title" placeholder="Broadcast Headline" defaultValue={editItem?.title || ''} className="w-full p-10 bg-zinc-50 rounded-[40px] font-black text-xl italic tracking-tighter" required />
              <textarea name="description" placeholder="Primary message body content..." defaultValue={editItem?.description || ''} className="w-full p-10 bg-zinc-50 rounded-[40px] font-bold min-h-[250px]" required />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Broadcast Visual</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" />
              </div>
            </div>
          </FormOverlay>
        )}

        {/* REVIEW FORM */}
        {showForm === 'review' && (
          <FormOverlay title="Client Vouch" onClose={closeForm} onSubmit={handleReviewSubmit} editMode={!!editItem}>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Client Name" defaultValue={editItem?.name || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
                <input name="location" placeholder="City, State" defaultValue={editItem?.location || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              </div>
              <input name="email" type="email" placeholder="client@email.com" defaultValue={editItem?.email || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold" required />
              <div className="space-y-2 px-4">
                <label className="text-[10px] font-black uppercase tracking-widest">Rating Tier (1-5)</label>
                <input name="rating" type="range" min="1" max="5" defaultValue={editItem?.rating || 5} className="w-full accent-zinc-950" required />
              </div>
              <textarea name="review" placeholder="Testimonial Body..." defaultValue={editItem?.review || ''} className="w-full p-8 bg-zinc-50 rounded-[35px] font-bold min-h-[200px]" required />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest ml-10">Client Portrait</label>
                <input type="file" name="image" className="text-[10px] font-black uppercase" />
              </div>
            </div>
          </FormOverlay>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-12 inset-x-0 z-[100] px-6">
        <div className="max-w-2xl mx-auto bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[50px] p-4 flex items-center justify-around shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-x-auto no-scrollbar">
          <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutDashboard size={22}/>} label="Home" />
          <NavBtn active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<FileText size={22}/>} label="Apps" />
          <NavBtn active={activeTab === 'kittens'} onClick={() => setActiveTab('kittens')} icon={<PawPrint size={22}/>} label="Nursery" />
          <NavBtn active={activeTab === 'retired'} onClick={() => setActiveTab('retired')} icon={<Heart size={22}/>} label="Adults" />
          <NavBtn active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} icon={<Calendar size={22}/>} label="Future" />
          <NavBtn active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<Bell size={22}/>} label="Alerts" />
          <NavBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<Star size={22}/>} label="Vouches" />
          <NavBtn active={activeTab === 'message'} onClick={() => setActiveTab('message')} icon={<Mail size={22}/>} label="Message" />
          <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22}/>} label="Core" />
        </div>
      </nav>
    </div>
  );
};

export default AdminDashboard;