import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import {
  getKittens,
  createKitten,
  updateKitten,
  deleteKitten,
} from "../features/kitten/kittenSlice";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../features/application/applicationSlice";
import {
  getContacts,
  updateContact,
  deleteContact,
} from "../features/contact/contactSlice";
import {
  getUpcoming,
  createUpcoming,
  deleteUpcoming,
} from "../features/upcoming/upcomingSlice";
import {
  getRetired,
  createRetired,
  deleteRetired,
} from "../features/retired/retiredSlice";
import {
  getAllReviewsAdmin,
  approveReview,
  deleteReview,
} from "../features/review/reviewSlice";
import {
  getAllNotificationsAdmin,
  createNotification,
  deleteNotification,
} from "../features/notification/notificationSlice";
import {
  getSettings,
  updateLocation,
} from "../features/settings/settingsSlice";
import {
  fetchAiHealthThunk,
  updateAiConfigThunk,
} from "../features/ai/aiSlice";
import {
  fetchEmailTemplatesThunk,
  fetchEmailLogsThunk,
} from "../features/email/emailSlice";
import { logout } from "../features/auth/authSlice";

import {
  LayoutDashboard,
  Cat,
  Sparkles,
  FileText,
  MessageSquare,
  Mail,
  History,
  Globe,
  Cpu,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Search,
  Upload,
  Star,
  ArrowLeft,
  ArrowRight,
  Send,
  Copy,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Check,
  Menu,
  X,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

const DYNAMIC_VARIABLES = [
  "{{customerName}}",
  "{{kittenName}}",
  "{{applicationReference}}",
  "{{applicationDate}}",
  "{{applicationStatus}}",
  "{{adminName}}",
  "{{businessName}}",
  "{{contactEmail}}",
  "{{contactPhone}}",
  "{{reservationReference}}",
  "{{nextSteps}}",
];

const APPLICATION_STATUSES = [
  "New",
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
  "Completed",
];

const KITTEN_STATUSES = [
  "Draft",
  "Available",
  "Reserved",
  "Adopted",
  "Unavailable",
];

const ENQUIRY_STATUSES = ["New", "In Progress", "Replied", "Archived"];

const PROVENANCE_BADGE_MAP = {
  admin_input: {
    label: "Admin Input",
    cls: "bg-[#ebf1ee] text-[#263b30] border-[#263b30]/20",
  },
  visual_observation: {
    label: "Photo Observation",
    cls: "bg-[#eff4fa] text-[#284b63] border-[#284b63]/20",
  },
  ai_generated_wording: {
    label: "AI Editorial Copy",
    cls: "bg-[#f6efe9] text-[#9e5a3c] border-[#9e5a3c]/25",
  },
  requires_confirmation: {
    label: "Requires Confirmation",
    cls: "bg-[#fdf4e7] text-[#b45309] border-[#b45309]/30",
  },
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { kittens } = useSelector((state) => state.kitten);
  const { applications } = useSelector((state) => state.application);
  const { contacts } = useSelector((state) => state.contact);
  const { upcomingList: upcoming } = useSelector((state) => state.upcoming);
  const { retiredList: retired } = useSelector((state) => state.retired);
  const { adminReviews } = useSelector((state) => state.review);
  const { adminNotifications: notifications } = useSelector(
    (state) => state.notification
  );
  const { settings } = useSelector((state) => state.settings);

  const [activeSection, setActiveSection] = useState("overview");
  const [contentSubTab, setContentSubTab] = useState("upcoming");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  useEffect(() => {
    dispatch(getKittens({ includeAll: true }));
    dispatch(getApplications());
    dispatch(getContacts());
    dispatch(getUpcoming());
    dispatch(getRetired());
    dispatch(getAllReviewsAdmin());
    dispatch(getAllNotificationsAdmin());
    dispatch(getSettings());
    dispatch(fetchAiHealthThunk());
    dispatch(fetchEmailTemplatesThunk());
    dispatch(fetchEmailLogsThunk());
    fetchEmailTemplates();
    fetchEmailLogs();
    fetchAiHealth();
  }, [dispatch]);

  // ======================================================
  // 1. KITTEN INVENTORY STATE (Up to 10 Photos + Reorder + Primary)
  // ======================================================
  const [kittenSearch, setKittenSearch] = useState("");
  const [kittenStatusFilter, setKittenStatusFilter] = useState("All");
  const [showKittenModal, setShowKittenModal] = useState(false);
  const [editingKitten, setEditingKitten] = useState(null);
  const [kittenForm, setKittenForm] = useState({
    name: "",
    breed: "Standard Munchkin",
    gender: "Female",
    ageWeeks: 10,
    dob: "",
    coat: "",
    status: "Available",
    price: 1800,
    Shipping: 0,
    trait: "",
    shortDescription: "",
    description: "",
    coatType: "Plush Velvet",
    eyeColor: "Sapphire Blue",
    weight: "1.8 lbs",
    hypoallergenic: "Low-Shedding Standard",
    vaccinated: true,
    dewormed: true,
    vetChecked: true,
    microchipped: true,
    healthGuarantee: "1-Year Genetic Guarantee",
    sire: "",
    dam: "",
    registry: "",
    registryId: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [kittenUploadError, setKittenUploadError] = useState("");
  const [savingKitten, setSavingKitten] = useState(false);

  const openCreateKittenModal = () => {
    setEditingKitten(null);
    setKittenForm({
      name: "",
      breed: "Standard Munchkin",
      gender: "Female",
      ageWeeks: 10,
      dob: "",
      coat: "",
      status: "Available",
      price: 1800,
      Shipping: 0,
      trait: "Affectionate & Well-Socialised",
      shortDescription: "",
      description: "",
      coatType: "Plush Velvet",
      eyeColor: "Sapphire Blue",
      weight: "1.8 lbs",
      hypoallergenic: "Low-Shedding Standard",
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: true,
      healthGuarantee: "1-Year Genetic Guarantee",
      sire: "",
      dam: "",
      registry: "",
      registryId: "",
      seoTitle: "",
      seoDescription: "",
    });
    setExistingImageUrls([]);
    setNewImageFiles([]);
    setKittenUploadError("");
    setShowKittenModal(true);
  };

  const openEditKittenModal = (k) => {
    setEditingKitten(k);
    setKittenForm({
      name: k.name || "",
      breed: k.breed || "Standard Munchkin",
      gender: k.gender || "Female",
      ageWeeks: k.ageWeeks ?? 10,
      dob: k.dob || "",
      coat: k.coat || "",
      status: k.status || "Available",
      price: k.price ?? 1800,
      Shipping: k.Shipping ?? 0,
      trait: k.trait || "",
      shortDescription: k.shortDescription || "",
      description: k.description || "",
      coatType: k.specs?.coatType || "",
      eyeColor: k.specs?.eyeColor || "",
      weight: k.specs?.weight || "",
      hypoallergenic: k.specs?.hypoallergenic || "Low-Shedding Standard",
      vaccinated: k.medical?.vaccinated ?? true,
      dewormed: k.medical?.dewormed ?? true,
      vetChecked: k.medical?.vetChecked ?? true,
      microchipped: k.medical?.microchipped ?? true,
      healthGuarantee:
        k.medical?.healthGuarantee || "1-Year Genetic Guarantee",
      sire: k.lineage?.sire || "",
      dam: k.lineage?.dam || "",
      registry: k.lineage?.registry || "",
      registryId: k.registryId || "",
      seoTitle: k.seoTitle || "",
      seoDescription: k.seoDescription || "",
    });
    setExistingImageUrls(Array.isArray(k.images) ? [...k.images] : []);
    setNewImageFiles([]);
    setKittenUploadError("");
    setShowKittenModal(true);
  };

  const handleKittenFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const totalCount =
      existingImageUrls.length + newImageFiles.length + selected.length;
    if (totalCount > 10) {
      setKittenUploadError(
        `Maximum 10 photographs allowed per kitten listing (you selected ${totalCount}).`
      );
      return;
    }
    setKittenUploadError("");
    setNewImageFiles((prev) => [...prev, ...selected]);
  };

  const moveExistingImage = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= existingImageUrls.length) return;
    const copy = [...existingImageUrls];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    setExistingImageUrls(copy);
  };

  const setPrimaryExistingImage = (idx) => {
    if (idx === 0) return;
    const copy = [...existingImageUrls];
    const [selected] = copy.splice(idx, 1);
    copy.unshift(selected);
    setExistingImageUrls(copy);
  };

  const handleSaveKitten = async (e) => {
    e.preventDefault();
    const totalPhotos = existingImageUrls.length + newImageFiles.length;
    if (totalPhotos === 0) {
      setKittenUploadError("At least 1 photograph is required.");
      return;
    }
    if (totalPhotos > 10) {
      setKittenUploadError("Maximum 10 photographs allowed per kitten listing.");
      return;
    }

    setSavingKitten(true);
    try {
      const fd = new FormData();
      fd.append("name", kittenForm.name);
      fd.append("breed", kittenForm.breed);
      fd.append("gender", kittenForm.gender);
      fd.append("ageWeeks", String(kittenForm.ageWeeks));
      fd.append("dob", kittenForm.dob);
      fd.append("coat", kittenForm.coat);
      fd.append("status", kittenForm.status);
      fd.append("price", String(kittenForm.price));
      fd.append("Shipping", String(kittenForm.Shipping || 0));
      fd.append("trait", kittenForm.trait);
      fd.append("shortDescription", kittenForm.shortDescription);
      fd.append("description", kittenForm.description);
      if (kittenForm.registryId) {
        fd.append("registryId", kittenForm.registryId);
      }
      fd.append("seoTitle", kittenForm.seoTitle);
      fd.append("seoDescription", kittenForm.seoDescription);
      fd.append(
        "specs",
        JSON.stringify({
          coatType: kittenForm.coatType,
          eyeColor: kittenForm.eyeColor,
          weight: kittenForm.weight,
          hypoallergenic: kittenForm.hypoallergenic,
        })
      );
      fd.append(
        "medical",
        JSON.stringify({
          vaccinated: Boolean(kittenForm.vaccinated),
          dewormed: Boolean(kittenForm.dewormed),
          vetChecked: Boolean(kittenForm.vetChecked),
          microchipped: Boolean(kittenForm.microchipped),
          healthGuarantee: kittenForm.healthGuarantee,
        })
      );
      fd.append(
        "lineage",
        JSON.stringify({
          sire: kittenForm.sire,
          dam: kittenForm.dam,
          registry: kittenForm.registry,
        })
      );
      fd.append("existingImages", JSON.stringify(existingImageUrls));
      if (existingImageUrls[0]) {
        fd.append("primaryImage", existingImageUrls[0]);
      }
      newImageFiles.forEach((file) => {
        fd.append("images", file);
      });

      if (editingKitten) {
        await dispatch(
          updateKitten({ id: editingKitten._id, formData: fd })
        ).unwrap();
        showToast(`Updated ${kittenForm.name} successfully.`);
      } else {
        await dispatch(createKitten(fd)).unwrap();
        showToast(`Created ${kittenForm.name} successfully.`);
      }
      setShowKittenModal(false);
      dispatch(getKittens({ includeAll: true }));
    } catch (err) {
      setKittenUploadError(
        typeof err === "string" ? err : "Failed to save kitten"
      );
    } finally {
      setSavingKitten(false);
    }
  };

  // ======================================================
  // 2. AI LISTING ASSISTANT (5-STEP WORKFLOW + HUMAN REVIEW)
  // ======================================================
  const [aiStep, setAiStep] = useState(1);
  const [aiFiles, setAiFiles] = useState([]);
  const [aiUploadedUrls, setAiUploadedUrls] = useState([]);
  const [aiDescription, setAiDescription] = useState("");
  const [aiKnownDetails, setAiKnownDetails] = useState({
    name: "",
    breed: "",
    gender: "",
    ageWeeks: "",
    price: "",
  });
  const [aiSimPrimaryFail, setAiSimPrimaryFail] = useState(false);
  const [aiSimAllFail, setAiSimAllFail] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiTelemetry, setAiTelemetry] = useState(null);
  const [aiDraft, setAiDraft] = useState(null);
  const [aiPublishing, setAiPublishing] = useState(false);

  const handleAiPhotoAdd = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (aiFiles.length + aiUploadedUrls.length + incoming.length > 10) {
      setAiError(
        `Maximum 10 photographs allowed per kitten listing. You currently have ${
          aiFiles.length + aiUploadedUrls.length
        } and tried to add ${incoming.length}.`
      );
      return;
    }
    setAiError("");
    const mapped = incoming.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setAiFiles((prev) => [...prev, ...mapped]);
  };

  const removeAiFile = (idx) => {
    setAiFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveAiFile = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= aiFiles.length) return;
    const copy = [...aiFiles];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    setAiFiles(copy);
  };

  const makePrimaryAiFile = (idx) => {
    if (idx === 0) return;
    const copy = [...aiFiles];
    const [item] = copy.splice(idx, 1);
    copy.unshift(item);
    setAiFiles(copy);
  };

  const handleGenerateAiListing = async () => {
    if (
      aiFiles.length === 0 &&
      aiUploadedUrls.length === 0 &&
      !aiDescription.trim()
    ) {
      setAiError(
        "Please upload at least 1 photograph or enter breeder notes in Step 2."
      );
      return;
    }
    setAiGenerating(true);
    setAiError("");
    try {
      const fd = new FormData();
      fd.append("description", aiDescription);
      fd.append("knownDetails", JSON.stringify(aiKnownDetails));
      fd.append("simulatePrimaryFailure", String(aiSimPrimaryFail));
      fd.append("simulateAllModelsFailure", String(aiSimAllFail));
      if (aiUploadedUrls.length > 0) {
        fd.append("imageUrls", JSON.stringify(aiUploadedUrls));
      }
      if (aiUploadedUrls.length === 0) {
        aiFiles.forEach((item) => fd.append("images", item.file));
      }

      const res = await api.post("/ai/generate-listing", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (
        Array.isArray(res.data.uploadedImageUrls) &&
        res.data.uploadedImageUrls.length > 0
      ) {
        setAiUploadedUrls(res.data.uploadedImageUrls);
      }
      setAiDraft(res.data.listing);
      setAiTelemetry(res.data.telemetry);
      setAiStep(4);
      fetchAiHealth();
      showToast(
        `AI Draft generated using ${
          res.data.telemetry?.modelUsed || "Gemini Flash"
        }. Please review all fields before saving.`
      );
    } catch (error) {
      const data = error.response?.data;
      if (data?.allModelsFailed) {
        if (
          Array.isArray(data.uploadedImageUrls) &&
          data.uploadedImageUrls.length > 0
        ) {
          setAiUploadedUrls(data.uploadedImageUrls);
        }
        setAiDraft(data.preservedDraft || null);
        setAiTelemetry(data.telemetry || null);
        setAiError(data.error);
        fetchAiHealth();
      } else {
        setAiError(
          data?.error ||
            "Failed to generate AI listing. Your inputs are preserved."
        );
      }
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishOrSaveAiDraft = async (targetStatus = "Available") => {
    if (!aiDraft) return;
    if (aiUploadedUrls.length === 0 && aiFiles.length === 0) {
      setAiError(
        "At least 1 photograph is required to save or publish a kitten listing. Upload a photo in Step 1 first."
      );
      return;
    }

    setAiPublishing(true);
    setAiError("");
    try {
      const fd = new FormData();
      fd.append("name", aiDraft.name || "Untitled Kitten");
      fd.append("breed", aiDraft.breed || "Standard Munchkin");
      fd.append("gender", aiDraft.gender || "Female");
      fd.append("ageWeeks", String(aiDraft.ageWeeks || 10));
      fd.append("dob", aiDraft.dob || "");
      fd.append("coat", aiDraft.coat || "Warm Cream Plush");
      fd.append("status", targetStatus);
      fd.append("price", String(aiDraft.price || 1800));
      fd.append("Shipping", String(aiDraft.Shipping || 0));
      fd.append("trait", aiDraft.trait || "");
      fd.append("shortDescription", aiDraft.shortDescription || "");
      fd.append("description", aiDraft.description || "");
      fd.append("seoTitle", aiDraft.seoTitle || "");
      fd.append("seoDescription", aiDraft.seoDescription || "");
      fd.append("specs", JSON.stringify(aiDraft.specs || {}));
      fd.append("medical", JSON.stringify(aiDraft.medical || {}));
      fd.append("lineage", JSON.stringify(aiDraft.lineage || {}));
      fd.append(
        "aiMetadata",
        JSON.stringify({
          generatedByAi: true,
          modelUsed: aiTelemetry?.modelUsed || "gemini-3.8-flash",
          fallbackUsed: Boolean(aiTelemetry?.fallbackUsed),
          generatedAt: aiTelemetry?.generatedAt || new Date().toISOString(),
          rawAdminDescription: aiDescription,
          fieldSources: aiDraft.fieldSources || {},
          requiresConfirmation: aiDraft.requiresConfirmation || [],
          visualObservations: aiDraft.visualObservations || {},
          imageRecommendations: aiDraft.imageRecommendations || {},
        })
      );

      if (aiUploadedUrls.length > 0) {
        fd.append("existingImages", JSON.stringify(aiUploadedUrls));
        fd.append("primaryImage", aiUploadedUrls[0]);
      } else {
        aiFiles.forEach((item) => fd.append("images", item.file));
      }

      await dispatch(createKitten(fd)).unwrap();
      dispatch(getKittens({ includeAll: true }));
      showToast(
        targetStatus === "Draft"
          ? `Saved "${aiDraft.name}" as Draft (hidden from public catalogue until published).`
          : `Approved & Published "${aiDraft.name}" to the live MunchkinKittie catalogue!`
      );
      setAiStep(1);
      setAiFiles([]);
      setAiUploadedUrls([]);
      setAiDescription("");
      setAiDraft(null);
      setAiTelemetry(null);
      setActiveSection("kittens");
    } catch (err) {
      setAiError(
        typeof err === "string" ? err : "Failed to save kitten listing"
      );
    } finally {
      setAiPublishing(false);
    }
  };

  // ======================================================
  // 3. ADOPTION APPLICATIONS & ENQUIRIES STATE
  // ======================================================
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [appStatusNote, setAppStatusNote] = useState("");
  const [appSendStatusEmail, setAppSendStatusEmail] = useState(true);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("All");

  // ======================================================
  // 4. EMAIL TEMPLATES & EMAIL LOGS STATE
  // ======================================================
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templatePreviewHtml, setTemplatePreviewHtml] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("All");
  const [emailLogSearch, setEmailLogSearch] = useState("");

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerData, setComposerData] = useState({
    to: "",
    recipientName: "",
    templateSlug: "application-under-review",
    subject: "",
    message: "",
    relatedType: "Manual",
    relatedId: null,
    relatedReference: "",
    variables: {
      customerName: "",
      kittenName: "",
      applicationReference: "",
      applicationStatus: "",
      nextSteps: "",
    },
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchEmailTemplates = async () => {
    try {
      const res = await api.get("/emails/templates");
      const list = Array.isArray(res.data) ? res.data : [];
      setEmailTemplates(list);
      if (list.length > 0 && !selectedTemplate) {
        setSelectedTemplate(list[0]);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      const res = await api.get("/emails/logs");
      setEmailLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch email logs:", err);
    }
  };

  const openEmailComposerForApp = (
    app,
    defaultSlug = "application-under-review"
  ) => {
    const tpl =
      emailTemplates.find((t) => t.slug === defaultSlug) || emailTemplates[0];
    const kittenName =
      app.kittenSnapshot?.name ||
      app.itemId?.name ||
      app.itemId?.title ||
      "your selected Munchkin companion";
    const ref =
      app.applicationReference ||
      `MK-APP-${String(app._id).slice(-6).toUpperCase()}`;

    const vars = {
      customerName: app.fullName,
      kittenName,
      applicationReference: ref,
      applicationStatus: app.status || "Under Review",
      nextSteps:
        "Our placement coordinator has reviewed your household profile and is available to schedule your video introduction and handover timeline.",
    };

    setComposerData({
      to: app.email,
      recipientName: app.fullName,
      templateId: tpl?._id || null,
      templateSlug: tpl?.slug || "custom",
      templateName: tpl?.name || "Application Correspondence",
      subject: tpl?.subject || `Update Regarding Your Application (${ref})`,
      message: tpl?.htmlBody || "",
      relatedType: "Application",
      relatedId: app._id,
      relatedReference: ref,
      variables: vars,
    });
    setComposerOpen(true);
  };

  const openEmailComposerForEnquiry = (enq) => {
    const tpl =
      emailTemplates.find((t) => t.slug === "thank-you-enquiry") ||
      emailTemplates[0];
    const ref =
      enq.enquiryReference ||
      `MK-ENQ-${String(enq._id).slice(-5).toUpperCase()}`;
    const vars = {
      customerName: enq.name,
      kittenName: enq.inquiryType || "our available Munchkin kittens",
      applicationReference: ref,
      nextSteps:
        "We would be delighted to share additional videos and veterinary records for our current litter.",
    };
    setComposerData({
      to: enq.email,
      recipientName: enq.name,
      templateId: tpl?._id || null,
      templateSlug: tpl?.slug || "thank-you-enquiry",
      templateName: tpl?.name || "Enquiry Response",
      subject:
        tpl?.subject || `Response to Your MunchkinKittie Enquiry (${ref})`,
      message: tpl?.htmlBody || "",
      relatedType: "Contact",
      relatedId: enq._id,
      relatedReference: ref,
      variables: vars,
    });
    setComposerOpen(true);
  };

  const handleComposerTemplateChange = (slug) => {
    const tpl = emailTemplates.find((t) => t.slug === slug);
    if (!tpl) return;
    setComposerData((prev) => ({
      ...prev,
      templateId: tpl._id,
      templateSlug: tpl.slug,
      templateName: tpl.name,
      subject: tpl.subject,
      message: tpl.htmlBody,
    }));
  };

  const handleDispatchComposerEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      const res = await api.post("/emails/send", composerData);
      showToast(res.data?.message || "Email sent and logged.");
      setComposerOpen(false);
      fetchEmailLogs();
      dispatch(getContacts());
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to dispatch email",
        "error"
      );
    } finally {
      setSendingEmail(false);
    }
  };

  // ======================================================
  // 5. AI CONFIGURATION & HEALTH STATE
  // ======================================================
  const [aiHealth, setAiHealth] = useState(null);

  const fetchAiHealth = async () => {
    try {
      const res = await api.get("/ai/health");
      setAiHealth(res.data);
    } catch (err) {
      console.error("Failed to load AI health:", err);
    }
  };

  const handleUpdateAiConfig = async (updates) => {
    try {
      const res = await api.put("/ai/config", updates);
      setAiHealth(res.data);
      dispatch(updateAiConfigThunk(updates));
      showToast("AI & Model Fallback Configuration saved.");
    } catch {
      showToast("Failed to update AI configuration", "error");
    }
  };

  // ======================================================
  // 6. WEBSITE CONTENT FORMS (Upcoming, Retired, Bulletins, Settings)
  // ======================================================
  const [upcomingForm, setUpcomingForm] = useState({
    title: "",
    parents: "",
    expectedArrival: "",
    expectedColors: "",
    priceRange: "$1,800 - $2,400",
    totalSpots: 4,
    reservedSpots: 1,
    status: "Accepting Waitlist",
    description: "",
  });
  const [upcomingFile, setUpcomingFile] = useState(null);

  const [retiredForm, setRetiredForm] = useState({
    name: "",
    breed: "Standard Munchkin",
    ageYears: 3,
    gender: "Female",
    fee: 650,
    personality: "",
    spayedNeutered: true,
    vaccinated: true,
    story: "",
  });
  const [retiredFile, setRetiredFile] = useState(null);

  const [bulletinMsg, setBulletinMsg] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [contactEmailInput, setContactEmailInput] = useState(
    "info@munchkinkittie.com"
  );
  const [adminTestEmailInput, setAdminTestEmailInput] = useState(
    "info@munchkinkittie.com"
  );
  const [autoSendStatusEmailsInput, setAutoSendStatusEmailsInput] =
    useState(true);

  useEffect(() => {
    const activeSettings = Array.isArray(settings) ? settings[0] : settings;
    if (activeSettings?.mainLocation) {
      setLocationInput(activeSettings.mainLocation);
    }
    if (activeSettings?.phoneNumber !== undefined) {
      setPhoneInput(activeSettings.phoneNumber || "");
    }
    if (activeSettings?.contactEmail) {
      setContactEmailInput(activeSettings.contactEmail);
    }
    if (activeSettings?.adminTestEmail) {
      setAdminTestEmailInput(activeSettings.adminTestEmail);
    }
    if (typeof activeSettings?.autoSendStatusEmails === "boolean") {
      setAutoSendStatusEmailsInput(activeSettings.autoSendStatusEmails);
    }
  }, [settings]);

  // Live preview update for selected email template
  useEffect(() => {
    if (!selectedTemplate) return;
    let active = true;
    api
      .post("/emails/preview", {
        subject: selectedTemplate.subject,
        htmlBody: selectedTemplate.htmlBody,
        variables: {
          customerName: "Eleanor Vance",
          kittenName: "Milo (Cream Tabby Munchkin)",
          applicationReference: "MK-APP-2026-8F4A",
          reservationReference: "MK-RES-2026-09B",
          applicationStatus: "Approved",
          nextSteps:
            "Our placement coordinator is ready to confirm your Flight Nanny itinerary for this Friday.",
        },
      })
      .then((res) => {
        if (active && res.data?.fullHtml) {
          setTemplatePreviewHtml(res.data.fullHtml);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [selectedTemplate]);

  // Filtered collections
  const filteredKittens = useMemo(() => {
    return (kittens || []).filter((k) => {
      const matchesStatus =
        kittenStatusFilter === "All" || k.status === kittenStatusFilter;
      const matchesSearch =
        !kittenSearch.trim() ||
        `${k.name} ${k.breed} ${k.coat}`
          .toLowerCase()
          .includes(kittenSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [kittens, kittenStatusFilter, kittenSearch]);

  const filteredApplications = useMemo(() => {
    return (applications || []).filter((app) => {
      const matchesStatus =
        appStatusFilter === "All" || app.status === appStatusFilter;
      const matchesSearch =
        !appSearch.trim() ||
        `${app.fullName} ${app.email} ${app.applicationReference || ""} ${
          app.itemId?.name || app.kittenSnapshot?.name || ""
        }`
          .toLowerCase()
          .includes(appSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, appStatusFilter, appSearch]);

  const filteredContacts = useMemo(() => {
    return (contacts || []).filter((c) => {
      if (enquiryStatusFilter === "All") return true;
      return (c.status || "New") === enquiryStatusFilter;
    });
  }, [contacts, enquiryStatusFilter]);

  const filteredTemplates = useMemo(() => {
    return (emailTemplates || []).filter((t) => {
      const matchesCat =
        templateCategoryFilter === "All" ||
        t.category === templateCategoryFilter;
      const matchesSearch =
        !templateSearch.trim() ||
        `${t.name} ${t.subject} ${t.slug}`
          .toLowerCase()
          .includes(templateSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [emailTemplates, templateCategoryFilter, templateSearch]);

  const filteredEmailLogs = useMemo(() => {
    return (emailLogs || []).filter((log) => {
      if (!emailLogSearch.trim()) return true;
      return `${log.recipientEmail} ${log.subject} ${log.templateName} ${log.relatedReference}`
        .toLowerCase()
        .includes(emailLogSearch.toLowerCase());
    });
  }, [emailLogs, emailLogSearch]);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "kittens",
      label: "Kitten Inventory",
      icon: Cat,
      badge: kittens?.length || 0,
    },
    {
      id: "ai-assistant",
      label: "AI Listing Assistant",
      icon: Sparkles,
      badge: "NEW",
    },
    {
      id: "applications",
      label: "Adoption Applications",
      icon: FileText,
      badge:
        applications?.filter((a) =>
          ["New", "Pending", "Under Review"].includes(a.status)
        ).length || 0,
    },
    {
      id: "enquiries",
      label: "Customer Enquiries",
      icon: MessageSquare,
      badge: contacts?.filter((c) => c.status === "New").length || 0,
    },
    {
      id: "email-templates",
      label: "Email Templates",
      icon: Mail,
      badge: emailTemplates?.length || 12,
    },
    {
      id: "email-history",
      label: "Email History",
      icon: History,
      badge: emailLogs?.length || 0,
    },
    { id: "website-content", label: "Website Content", icon: Globe },
    { id: "ai-config", label: "AI Configuration", icon: Cpu },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#181615] flex flex-col lg:flex-row">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md px-5 py-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            toast.type === "error"
              ? "bg-[#9e2a2b] text-white border-[#9e2a2b]"
              : "bg-[#181615] text-[#faf8f5] border-[#181615]/20"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-[#84b59f] shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Left Executive Sidebar (Desktop: Sticky Left Nav; Mobile: Hidden in favor of responsive mobile bar) */}
      <aside className="hidden lg:flex lg:w-72 bg-[#181615] text-[#faf8f5] shrink-0 flex-col justify-between border-r border-white/10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b88f] font-semibold block">
                MunchkinKittie Sanctuary
              </span>
              <h1 className="font-serif text-2xl font-semibold text-white mt-0.5">
                Executive Suite
              </h1>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white/80 transition-colors"
            >
              Live Site <ExternalLink size={12} />
            </Link>
          </div>

          <nav className="mt-7 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#9e5a3c] text-white shadow-sm"
                      : "text-white/75 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? "bg-white text-[#9e5a3c]"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="px-3.5 py-2.5 rounded-xl bg-white/5 text-xs text-white/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/50">Active AI Engine</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#84b59f] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#84b59f]" />
                Ready
              </span>
            </div>
            <p className="font-mono text-xs text-white mt-1 truncate">
              {aiHealth?.config?.primaryModel || "gemini-3.8-flash"}
            </p>
          </div>

          <button
            onClick={() => {
              dispatch(logout());
              navigate("/admin-only-login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#9e2a2b] text-white text-xs font-semibold transition-colors"
          >
            <LogOut size={14} /> Sign Out of Sanctuary
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Executive Top Bar + Fast Horizontal Rail (Mobile only) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#181615] text-[#faf8f5] border-b border-white/10 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center shrink-0 text-white relative transition-colors"
              aria-label="Open Sanctuary Menu"
            >
              <Menu size={18} />
              {((applications?.filter((a) =>
                ["New", "Pending", "Under Review"].includes(a.status)
              ).length || 0) +
                (contacts?.filter((c) => c.status === "New").length || 0)) >
                0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#9e5a3c] ring-2 ring-[#181615]" />
              )}
            </button>
            <div className="min-w-0">
              <span className="block font-serif text-lg font-semibold tracking-tight text-white truncate leading-none">
                Munchkin<span className="text-[#e8b496]">Kittie</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#d9b88f] font-semibold block mt-0.5 truncate">
                Executive Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveSection("ai-assistant");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#263b30] hover:bg-[#1e2f26] text-white text-[11px] font-semibold transition-colors"
            >
              <Sparkles size={12} className="text-[#84b59f]" /> AI
            </button>
            <button
              onClick={openCreateKittenModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#9e5a3c] hover:bg-[#b87354] text-white text-[11px] font-semibold transition-colors"
            >
              <Plus size={13} /> Listing
            </button>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors"
              title="Live Site"
            >
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Fast Horizontal Touch Navigation Rail */}
        <div className="px-3 py-2 bg-[#201d1c] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#9e5a3c] text-white shadow-xs"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={12} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge !== 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive
                        ? "bg-white text-[#9e5a3c]"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Navigation Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-[#181615] text-[#faf8f5] h-full flex flex-col justify-between z-10 shadow-2xl border-r border-white/10 overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#d9b88f] font-semibold block">
                    MunchkinKittie
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-white">
                    Executive Suite
                  </h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="mt-5 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#9e5a3c] text-white font-semibold shadow-xs"
                          : "text-white/75 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} />
                        {item.label}
                      </span>
                      {item.badge !== undefined && item.badge !== 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-white text-[#9e5a3c]"
                              : "bg-white/15 text-white/90"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-5 border-t border-white/10 space-y-3 bg-[#131110]">
              <div className="px-3 py-2 rounded-xl bg-white/5 text-[11px] text-white/70">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Gemini Engine</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#84b59f] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#84b59f]" /> Active
                  </span>
                </div>
                <p className="font-mono text-[11px] text-white mt-0.5 truncate">
                  {aiHealth?.config?.primaryModel || "gemini-3.8-flash"}
                </p>
              </div>

              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                <ExternalLink size={13} /> View Public Website
              </Link>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/admin-only-login");
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#9e2a2b]/80 hover:bg-[#9e2a2b] text-white text-xs font-semibold transition-colors"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-10 pb-28 lg:pb-10 overflow-y-auto min-w-0">
        {/* ======================================================
            SECTION 1: OVERVIEW
           ====================================================== */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Sanctuary Command Center
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615] mt-1">
                  Operations &amp; Placement Overview
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveSection("ai-assistant")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#263b30] text-white text-xs sm:text-sm font-semibold hover:bg-[#1e2f26]"
                >
                  <Sparkles size={15} /> Create Listing with AI
                </button>
                <button
                  onClick={openCreateKittenModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#181615]/15 text-[#181615] text-xs sm:text-sm font-semibold hover:bg-[#f3efea]"
                >
                  <Plus size={15} /> Manual Kitten Listing
                </button>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="rounded-2xl bg-white border border-[#181615]/10 p-4 sm:p-6">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#8c837a]">
                  Kitten Catalogue
                </span>
                <p className="font-serif text-2xl sm:text-4xl font-semibold text-[#181615] mt-1 sm:mt-2">
                  {kittens?.filter((k) => k.status === "Available").length || 0}
                </p>
                <p className="text-[11px] sm:text-xs text-[#5c554e] mt-1 leading-snug">
                  Available now &bull;{" "}
                  {kittens?.filter((k) => k.status === "Draft").length || 0}{" "}
                  Drafts &bull; {kittens?.length || 0} Total
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#181615]/10 p-4 sm:p-6">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#8c837a]">
                  Applications
                </span>
                <p className="font-serif text-2xl sm:text-4xl font-semibold text-[#181615] mt-1 sm:mt-2">
                  {applications?.length || 0}
                </p>
                <p className="text-[11px] sm:text-xs text-[#5c554e] mt-1 leading-snug">
                  {applications?.filter((a) =>
                    ["New", "Pending", "Under Review"].includes(a.status)
                  ).length || 0}{" "}
                  pending review
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#181615]/10 p-4 sm:p-6">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#8c837a]">
                  Dispatched Logs
                </span>
                <p className="font-serif text-2xl sm:text-4xl font-semibold text-[#181615] mt-1 sm:mt-2">
                  {emailLogs?.length || 0}
                </p>
                <p className="text-[11px] sm:text-xs text-[#5c554e] mt-1 leading-snug">
                  {emailTemplates?.length || 12} templates &bull; Resend
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#181615]/10 p-4 sm:p-6">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#8c837a]">
                  Gemini Router
                </span>
                <p className="font-mono text-xs sm:text-base font-bold text-[#263b30] mt-1 sm:mt-3 truncate">
                  {aiHealth?.config?.primaryModel || "gemini-3.8-flash"}
                </p>
                <p className="text-[11px] sm:text-xs text-[#5c554e] mt-1 leading-snug">
                  Auto-fallback (
                  {aiHealth?.config?.fallbackModels?.length || 6} models)
                </p>
              </div>
            </div>

            {/* Recent Applications & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white border border-[#181615]/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-semibold text-[#181615]">
                    Recent Adoption Applications
                  </h3>
                  <button
                    onClick={() => setActiveSection("applications")}
                    className="text-xs font-semibold text-[#9e5a3c] hover:underline"
                  >
                    View All Applications &rarr;
                  </button>
                </div>
                <div className="divide-y divide-[#181615]/10">
                  {(applications || []).slice(0, 5).map((app) => (
                    <div
                      key={app._id}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#181615]">
                            {app.fullName}
                          </span>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#f3efea] text-[#5c554e]">
                            {app.applicationReference ||
                              `MK-APP-${String(app._id).slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <p className="text-xs text-[#5c554e]">
                          {app.email} &bull; Applied for{" "}
                          <strong>
                            {app.kittenSnapshot?.name ||
                              app.itemId?.name ||
                              app.applicationType}
                          </strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f3efea] text-[#181615]">
                          {app.status}
                        </span>
                        <button
                          onClick={() => openEmailComposerForApp(app)}
                          className="px-3 py-1.5 rounded-full bg-[#181615] text-white text-xs font-medium hover:bg-[#263b30]"
                        >
                          Email
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!applications || applications.length === 0) && (
                    <p className="py-6 text-sm text-[#8c837a]">
                      No adoption applications recorded yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4">
                <h3 className="font-serif text-xl font-semibold text-[#181615]">
                  Executive Shortcuts
                </h3>
                <button
                  onClick={() => setActiveSection("ai-assistant")}
                  className="w-full p-4 rounded-xl bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/10 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#263b30]">
                    <Sparkles size={16} /> AI Listing Assistant
                  </div>
                  <p className="text-xs text-[#5c554e] mt-1">
                    Upload up to 10 photos + breeder notes to auto-draft a
                    verified listing.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection("email-templates")}
                  className="w-full p-4 rounded-xl bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/10 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#9e5a3c]">
                    <Mail size={16} /> 12-Template Email Library
                  </div>
                  <p className="text-xs text-[#5c554e] mt-1">
                    Preview, customize, and send branded Resend correspondence.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection("ai-config")}
                  className="w-full p-4 rounded-xl bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/10 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#181615]">
                    <Cpu size={16} /> Gemini Fallback Telemetry
                  </div>
                  <p className="text-xs text-[#5c554e] mt-1">
                    Inspect model health, cooldown state, and automatic fallback
                    events.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 2: KITTEN INVENTORY (Max 10 Photos + Reorder + Drafts)
           ====================================================== */}
        {activeSection === "kittens" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Feline Catalogue Management
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  Kitten Inventory ({filteredKittens.length})
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveSection("ai-assistant")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                >
                  <Sparkles size={14} /> Create with AI Assistant
                </button>
                <button
                  onClick={openCreateKittenModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#181615] text-white text-xs font-semibold"
                >
                  <Plus size={14} /> Add Kitten Manually (Up to 10 Photos)
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#181615]/10">
              <div className="relative flex-1 min-w-[220px]">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c837a]"
                />
                <input
                  type="text"
                  value={kittenSearch}
                  onChange={(e) => setKittenSearch(e.target.value)}
                  placeholder="Search by name, breed, or coat..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
                {["All", ...KITTEN_STATUSES].map((st) => (
                  <button
                    key={st}
                    onClick={() => setKittenStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      kittenStatusFilter === st
                        ? "bg-[#181615] text-white"
                        : "bg-[#faf8f5] text-[#5c554e] hover:bg-[#f3efea]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Kitten Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredKittens.map((k) => (
                <div
                  key={k._id}
                  className="rounded-2xl bg-white border border-[#181615]/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 bg-[#f3efea]">
                      <img
                        src={k.primaryImage || k.images?.[0]}
                        alt={k.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                            k.status === "Available"
                              ? "bg-[#263b30] text-white"
                              : k.status === "Draft"
                              ? "bg-[#b45309] text-white"
                              : "bg-[#181615]/85 text-white"
                          }`}
                        >
                          {k.status}
                        </span>
                        {k.aiMetadata?.generatedByAi && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-[#9e5a3c]">
                            AI Assisted ({k.aiMetadata?.modelUsed || "Gemini"})
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 text-white">
                        {k.images?.length || 1} / 10 Photos
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                          {k.name}
                        </h3>
                        <span className="font-semibold text-base text-[#263b30]">
                          ${Number(k.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#5c554e] mt-1">
                        {k.breed} &bull; {k.gender} &bull; {k.ageWeeks} Weeks
                        &bull; {k.coat}
                      </p>
                      <p className="text-xs text-[#8c837a] mt-2 line-clamp-2">
                        {k.shortDescription || k.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-[#faf8f5] border-t border-[#181615]/10 flex items-center justify-between">
                    <button
                      onClick={() => openEditKittenModal(k)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181615] hover:text-[#9e5a3c]"
                    >
                      <Edit3 size={14} /> Edit &amp; Manage Photos
                    </button>
                    <button
                      onClick={async () => {
                        await dispatch(deleteKitten(k._id));
                        showToast(`Removed ${k.name} from inventory.`);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#9e2a2b] hover:underline"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 3: INTELLIGENT AI LISTING ASSISTANT (5-STEP WIZARD)
           ====================================================== */}
        {activeSection === "ai-assistant" && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  <Sparkles size={14} /> Multimodal Gemini AI Studio
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#181615] mt-1">
                  Intelligent AI Kitten Listing Creation
                </h2>
                <p className="text-sm text-[#5c554e] mt-1">
                  Upload up to 10 kitten photographs and type a natural-language
                  description. Gemini analyzes visible traits and populates a
                  structured draft for your mandatory human review.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border border-[#181615]/10 text-xs">
                <span className="text-[#8c837a]">Primary Model: </span>
                <strong className="font-mono text-[#263b30]">
                  {aiHealth?.config?.primaryModel || "gemini-3.8-flash"}
                </strong>
              </div>
            </div>

            {/* 5-Step Progress Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-5">
              {[
                { step: 1, title: "1. Photos (10 Max)" },
                { step: 2, title: "2. Description" },
                { step: 3, title: "3. Multimodal AI" },
                { step: 4, title: "4. Audit Checklist" },
                { step: 5, title: "5. Review & Save" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setAiStep(s.step)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left shrink-0 min-w-[135px] sm:min-w-0 transition-all ${
                    aiStep === s.step
                      ? "bg-[#181615] text-white border-[#181615]"
                      : aiStep > s.step
                      ? "bg-[#ebf1ee] text-[#263b30] border-[#263b30]/20"
                      : "bg-white text-[#5c554e] border-[#181615]/10"
                  }`}
                >
                  <span className="text-xs font-semibold block whitespace-nowrap sm:whitespace-normal">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>

            {aiError && (
              <div className="p-4 rounded-2xl bg-[#fdf4e7] border border-[#b45309]/30 text-[#92400e] flex items-start gap-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold">AI Assistant Notice</p>
                  <p className="mt-0.5">{aiError}</p>
                </div>
              </div>
            )}

            {/* STEP 1 & 2 & 3 INPUT CARD */}
            <div className="rounded-3xl bg-white border border-[#181615]/10 p-6 sm:p-8 space-y-8">
              {/* STEP 1: Upload Up to 10 Photographs */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#181615]">
                      Step 1 — Upload Kitten Photographs (Up to 10 Images)
                    </h3>
                    <p className="text-xs text-[#5c554e]">
                      Supports JPG, PNG, and WEBP. Reorder thumbnails or select
                      which photograph should be the Primary Cover Image.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#faf8f5] border border-[#181615]/10 text-xs font-semibold">
                    {aiUploadedUrls.length || aiFiles.length} / 10 Photos
                    Selected
                  </span>
                </div>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#181615]/20 hover:border-[#9e5a3c] rounded-2xl p-6 cursor-pointer bg-[#faf8f5] transition-colors">
                  <Upload size={24} className="text-[#9e5a3c]" />
                  <span className="text-sm font-semibold text-[#181615] mt-2">
                    Click to select or drag &amp; drop up to 10 photographs
                  </span>
                  <span className="text-xs text-[#8c837a] mt-1">
                    First photograph is used as the Primary Cover Image
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleAiPhotoAdd}
                    className="hidden"
                  />
                </label>

                {aiFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {aiFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 ${
                          idx === 0
                            ? "border-[#263b30]"
                            : "border-[#181615]/10"
                        } bg-[#faf8f5]`}
                      >
                        <img
                          src={item.previewUrl}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-28 object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#263b30] text-white text-[10px] font-semibold">
                            Primary Cover
                          </span>
                        )}
                        <div className="p-1.5 flex items-center justify-between bg-white text-xs">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveAiFile(idx, -1)}
                              className="p-1 hover:bg-[#f3efea] rounded"
                              title="Move Left"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveAiFile(idx, 1)}
                              className="p-1 hover:bg-[#f3efea] rounded"
                              title="Move Right"
                            >
                              <ArrowRight size={12} />
                            </button>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => makePrimaryAiFile(idx)}
                                className="p-1 text-[#9e5a3c] hover:bg-[#f3efea] rounded"
                                title="Set as Primary Cover"
                              >
                                <Star size={12} />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAiFile(idx)}
                            className="p-1 text-[#9e2a2b] hover:bg-[#f3efea] rounded"
                            title="Remove Photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 2: Natural-Language Breeder Description + Optional Known Details */}
              <div className="space-y-4 pt-4 border-t border-[#181615]/10">
                <h3 className="font-serif text-xl font-semibold text-[#181615]">
                  Step 2 — Natural-Language Kitten Description &amp; Optional
                  Known Details
                </h3>
                <p className="text-xs text-[#5c554e]">
                  Describe the kitten naturally in your own words. Any medical,
                  lineage, age, or gender details not explicitly mentioned will
                  be flagged as{" "}
                  <span className="font-semibold text-[#b45309]">
                    Requires Confirmation
                  </span>{" "}
                  rather than invented.
                </p>
                <textarea
                  rows={4}
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="Example: This is Biscuit, a 10-week-old female cream and white Scottish Kilt Munchkin kitten. She is very playful, affectionate, litter-trained, raised around children, vaccinated and vet-checked. Asking $2,100."
                  className="w-full p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/15 text-sm leading-relaxed"
                />

                {/* Optional Pre-Filled Known Facts */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  <input
                    type="text"
                    value={aiKnownDetails.name}
                    onChange={(e) =>
                      setAiKnownDetails({
                        ...aiKnownDetails,
                        name: e.target.value,
                      })
                    }
                    placeholder="Optional: Name"
                    className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs"
                  />
                  <input
                    type="text"
                    value={aiKnownDetails.breed}
                    onChange={(e) =>
                      setAiKnownDetails({
                        ...aiKnownDetails,
                        breed: e.target.value,
                      })
                    }
                    placeholder="Optional: Breed"
                    className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs"
                  />
                  <select
                    value={aiKnownDetails.gender}
                    onChange={(e) =>
                      setAiKnownDetails({
                        ...aiKnownDetails,
                        gender: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs"
                  >
                    <option value="">Optional: Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                  <input
                    type="number"
                    value={aiKnownDetails.ageWeeks}
                    onChange={(e) =>
                      setAiKnownDetails({
                        ...aiKnownDetails,
                        ageWeeks: e.target.value,
                      })
                    }
                    placeholder="Optional: Age (Wks)"
                    className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs"
                  />
                  <input
                    type="number"
                    value={aiKnownDetails.price}
                    onChange={(e) =>
                      setAiKnownDetails({
                        ...aiKnownDetails,
                        price: e.target.value,
                      })
                    }
                    placeholder="Optional: Price ($)"
                    className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs"
                  />
                </div>
              </div>

              {/* STEP 3: Generate Button & Fallback Simulation Controls */}
              <div className="pt-4 border-t border-[#181615]/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#5c554e]">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSimPrimaryFail}
                      onChange={(e) => setAiSimPrimaryFail(e.target.checked)}
                    />
                    Simulate Primary Model Rate-Limit (Test Automatic Fallback)
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSimAllFail}
                      onChange={(e) => setAiSimAllFail(e.target.checked)}
                    />
                    Simulate All-Model Outage (Test Graceful Recovery)
                  </label>
                </div>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleGenerateAiListing}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#263b30] hover:bg-[#1e2f26] text-white text-sm font-semibold shadow-sm disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Analyzing
                      Photos &amp; Generating Draft...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Kitten Listing with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* STEP 4 & 5: HUMAN-IN-THE-LOOP REVIEW, PROVENANCE AUDIT & APPROVAL */}
            {aiDraft && (
              <div className="rounded-3xl bg-white border-2 border-[#263b30]/25 p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#181615]/10 pb-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf1ee] text-[#263b30] text-xs font-semibold">
                      <ShieldCheck size={14} /> Step 4 &amp; 5 — Mandatory Human
                      Review &amp; Approval
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-[#181615] mt-2">
                      Verify AI-Populated Listing Fields Before Saving
                    </h3>
                    <p className="text-xs text-[#5c554e] mt-0.5">
                      AI never publishes automatically. Review every field below,
                      pay special attention to amber{" "}
                      <strong>Requires Confirmation</strong> badges, and choose{" "}
                      <strong>Save as Draft</strong> or{" "}
                      <strong>Approve and Publish</strong>.
                    </p>
                  </div>

                  {aiTelemetry && (
                    <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#181615]/10 text-xs space-y-1">
                      <div>
                        <span className="text-[#8c837a]">Active Model: </span>
                        <strong className="font-mono text-[#263b30]">
                          {aiTelemetry.modelUsed || "Deterministic Rescue"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#8c837a]">Fallback Used: </span>
                        <strong>
                          {aiTelemetry.fallbackUsed
                            ? "Yes (Auto-Switched)"
                            : "No (Primary Succeeded)"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Observations & Photo Assessment Card */}
                {aiDraft.visualObservations && (
                  <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[#8c837a] block">
                        Observed Coat Colour
                      </span>
                      <strong className="text-[#181615]">
                        {aiDraft.visualObservations.coatColorObserved ||
                          aiDraft.coat}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8c837a] block">
                        Observed Pattern
                      </span>
                      <strong className="text-[#181615]">
                        {aiDraft.visualObservations.coatPatternObserved ||
                          aiDraft.specs?.pattern ||
                          "Standard"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8c837a] block">
                        Observed Fur Texture
                      </span>
                      <strong className="text-[#181615]">
                        {aiDraft.visualObservations.furLengthObserved ||
                          aiDraft.specs?.coatType ||
                          "Plush"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8c837a] block">
                        Gallery Assessment
                      </span>
                      <strong className="text-[#263b30]">
                        {aiDraft.imageRecommendations?.sameKittenConfidence ||
                          "Ready for Review"}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Uncertain Fields Warning Box */}
                {aiDraft.requiresConfirmation?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#fdf4e7] border border-[#b45309]/30 text-xs sm:text-sm text-[#92400e]">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertTriangle size={16} /> Fields Requiring Explicit
                      Breeder Confirmation ({aiDraft.requiresConfirmation.length}
                      ):
                    </p>
                    <p className="mt-1">
                      The following fields were not explicitly confirmed in your
                      written notes and will not be invented from photos alone:{" "}
                      <span className="font-mono font-semibold">
                        {aiDraft.requiresConfirmation.join(", ")}
                      </span>
                      . Please verify their values below before publishing.
                    </p>
                  </div>
                )}

                {/* Editable Review Form with Field-Level Provenance Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { key: "name", label: "Kitten Name", type: "text" },
                    { key: "breed", label: "Breed / Variety", type: "text" },
                    {
                      key: "gender",
                      label: "Gender",
                      type: "select",
                      options: ["Female", "Male"],
                    },
                    { key: "ageWeeks", label: "Age (Weeks)", type: "number" },
                    {
                      key: "coat",
                      label: "Coat Colour & Pattern",
                      type: "text",
                    },
                    { key: "price", label: "Adoption Fee ($)", type: "number" },
                  ].map((field) => {
                    const sourceKey =
                      aiDraft.fieldSources?.[field.key] ||
                      "ai_generated_wording";
                    const badge =
                      PROVENANCE_BADGE_MAP[sourceKey] ||
                      PROVENANCE_BADGE_MAP.ai_generated_wording;
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#181615]">
                            {field.label}
                          </label>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        {field.type === "select" ? (
                          <select
                            value={aiDraft[field.key] || "Female"}
                            onChange={(e) =>
                              setAiDraft({
                                ...aiDraft,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                          >
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={aiDraft[field.key] ?? ""}
                            onChange={(e) =>
                              setAiDraft({
                                ...aiDraft,
                                [field.key]:
                                  field.type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Physical Specs & Lineage Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Coat Texture
                    </label>
                    <input
                      type="text"
                      value={aiDraft.specs?.coatType || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          specs: {
                            ...(aiDraft.specs || {}),
                            coatType: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Eye Colour
                    </label>
                    <input
                      type="text"
                      value={aiDraft.specs?.eyeColor || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          specs: {
                            ...(aiDraft.specs || {}),
                            eyeColor: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Sire (Father)
                    </label>
                    <input
                      type="text"
                      value={aiDraft.lineage?.sire || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          lineage: {
                            ...(aiDraft.lineage || {}),
                            sire: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Dam (Mother)
                    </label>
                    <input
                      type="text"
                      value={aiDraft.lineage?.dam || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          lineage: {
                            ...(aiDraft.lineage || {}),
                            dam: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                </div>

                {/* Temperament, Short Summary & Full Editorial Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615]">
                      Temperament / Personality Highlights
                    </label>
                    <input
                      type="text"
                      value={aiDraft.trait || ""}
                      onChange={(e) =>
                        setAiDraft({ ...aiDraft, trait: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615]">
                      Short Card Summary
                    </label>
                    <input
                      type="text"
                      value={aiDraft.shortDescription || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#181615]">
                      Full Luxury Editorial Description
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f6efe9] text-[#9e5a3c]">
                      AI Editorial Copy — Editable
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={aiDraft.description || ""}
                    onChange={(e) =>
                      setAiDraft({ ...aiDraft, description: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm leading-relaxed"
                  />
                </div>

                {/* Medical Confirmation Checkboxes */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#181615]">
                      Veterinary &amp; Health Verification (Never Assumed from
                      Photos)
                    </span>
                    <span className="text-[11px] text-[#b45309] font-medium">
                      Confirm each item before publishing
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-xs sm:text-sm">
                    {[
                      { key: "vaccinated", label: "Vaccinated" },
                      { key: "dewormed", label: "Dewormed" },
                      { key: "vetChecked", label: "Vet Checked" },
                      { key: "microchipped", label: "Microchipped" },
                    ].map((m) => (
                      <label
                        key={m.key}
                        className="inline-flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(aiDraft.medical?.[m.key])}
                          onChange={(e) =>
                            setAiDraft({
                              ...aiDraft,
                              medical: {
                                ...(aiDraft.medical || {}),
                                [m.key]: e.target.checked,
                              },
                            })
                          }
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* SEO Title & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615]">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={aiDraft.seoTitle || ""}
                      onChange={(e) =>
                        setAiDraft({ ...aiDraft, seoTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615]">
                      SEO Meta Description
                    </label>
                    <input
                      type="text"
                      value={aiDraft.seoDescription || ""}
                      onChange={(e) =>
                        setAiDraft({
                          ...aiDraft,
                          seoDescription: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                </div>

                {/* Step 5 Approval Actions */}
                <div className="pt-5 border-t border-[#181615]/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleGenerateAiListing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#faf8f5] border border-[#181615]/15 text-xs font-semibold hover:bg-[#f3efea]"
                  >
                    <RefreshCw size={14} /> Regenerate AI Suggestions
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={aiPublishing}
                      onClick={() => handlePublishOrSaveAiDraft("Draft")}
                      className="px-6 py-3 rounded-full bg-white border border-[#181615]/20 text-[#181615] text-xs sm:text-sm font-semibold hover:bg-[#f3efea]"
                    >
                      Save as Draft (Do Not Publish Yet)
                    </button>
                    <button
                      type="button"
                      disabled={aiPublishing}
                      onClick={() => handlePublishOrSaveAiDraft("Available")}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#263b30] hover:bg-[#1e2f26] text-white text-xs sm:text-sm font-semibold shadow-sm"
                    >
                      <Check size={16} /> Approve &amp; Publish Listing
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            SECTION 4: ADOPTION APPLICATIONS
           ====================================================== */}
        {activeSection === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Placement Concierge Workflow
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  Adoption Applications ({filteredApplications.length})
                </h2>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#181615]/10">
              <div className="relative flex-1 min-w-[220px]">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c837a]"
                />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search applicant name, email, MK-APP reference, or kitten..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
                {["All", ...APPLICATION_STATUSES].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      appStatusFilter === st
                        ? "bg-[#181615] text-white"
                        : "bg-[#faf8f5] text-[#5c554e] hover:bg-[#f3efea]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const ref =
                  app.applicationReference ||
                  `MK-APP-${String(app._id).slice(-6).toUpperCase()}`;
                const kittenTitle =
                  app.kittenSnapshot?.name ||
                  app.itemId?.name ||
                  app.itemId?.title ||
                  app.applicationType;

                return (
                  <div
                    key={app._id}
                    className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                            {app.fullName}
                          </h3>
                          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#f3efea] text-[#263b30] font-semibold">
                            {ref}
                          </span>
                          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#181615] text-white">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5c554e] mt-1">
                          {app.email} &bull; {app.phone || "No phone"} &bull;{" "}
                          {app.location || "Location N/A"} &bull; Applied{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3.5 py-2 rounded-full bg-[#faf8f5] border border-[#181615]/15 text-xs font-semibold hover:bg-[#f3efea]"
                        >
                          Inspect &amp; Update Status
                        </button>
                        <button
                          onClick={() => openEmailComposerForApp(app)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#263b30] text-white text-xs font-semibold hover:bg-[#1e2f26]"
                        >
                          <Mail size={13} /> Send Template Email
                        </button>
                        <button
                          onClick={() => dispatch(deleteApplication(app._id))}
                          className="p-2 rounded-full text-[#9e2a2b] hover:bg-[#faf8f5]"
                          title="Delete Application"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#181615]/10 text-xs">
                      <div>
                        <span className="text-[#8c837a] block">
                          Kitten / Placement Type
                        </span>
                        <strong className="text-[#181615] text-sm">
                          {kittenTitle} ({app.applicationType})
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#8c837a] block">
                          Payment Preference
                        </span>
                        <strong className="text-[#181615] uppercase">
                          {app.paymentMethod === "other"
                            ? app.paymentMethodOther
                            : app.paymentMethod}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#8c837a] block">
                          Household &amp; Experience
                        </span>
                        <span className="text-[#181615]">
                          {app.homeDescription}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Detail & Status Update Modal */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-[#9e5a3c] font-semibold">
                        {selectedApp.applicationReference}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                        Update Application — {selectedApp.fullName}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="text-xs font-semibold text-[#8c837a]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Full Household Details Summary */}
                  <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#181615]/10 text-xs space-y-1.5">
                    <p>
                      <strong>Applicant:</strong> {selectedApp.fullName} (
                      {selectedApp.email} &bull; {selectedApp.phone || "N/A"})
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedApp.location || "Not specified"}
                    </p>
                    <p>
                      <strong>Existing Pets:</strong>{" "}
                      {String(selectedApp.hasPets || "None")} &bull;{" "}
                      <strong>Experience:</strong>{" "}
                      {selectedApp.experience || "Not specified"}
                    </p>
                    <p>
                      <strong>Home Environment:</strong>{" "}
                      {selectedApp.homeDescription}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#181615] block">
                      Select Application Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {APPLICATION_STATUSES.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() =>
                            setSelectedApp({ ...selectedApp, status: st })
                          }
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                            selectedApp.status === st
                              ? "bg-[#263b30] text-white border-[#263b30]"
                              : "bg-[#faf8f5] text-[#181615] border-[#181615]/10"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615] block">
                      Internal Administrator Notes
                    </label>
                    <textarea
                      rows={3}
                      value={selectedApp.adminNotes || ""}
                      onChange={(e) =>
                        setSelectedApp({
                          ...selectedApp,
                          adminNotes: e.target.value,
                        })
                      }
                      placeholder="Private breeder notes regarding applicant screening, deposit status, or Flight Nanny dates..."
                      className="w-full p-3 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#181615] block">
                      Customer Status Update Note (Included in Email if
                      checked)
                    </label>
                    <input
                      type="text"
                      value={appStatusNote}
                      onChange={(e) => setAppStatusNote(e.target.value)}
                      placeholder="Optional custom next-steps message for the applicant..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#181615] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSendStatusEmail}
                      onChange={(e) => setAppSendStatusEmail(e.target.checked)}
                    />
                    Automatically send branded status notification email via
                    Resend
                  </label>

                  <div className="pt-4 border-t border-[#181615]/10 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="px-5 py-2.5 rounded-full bg-[#faf8f5] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await dispatch(
                          updateApplicationStatus({
                            id: selectedApp._id,
                            status: selectedApp.status,
                            adminNotes: selectedApp.adminNotes,
                            note: appStatusNote,
                            sendEmailNotification: appSendStatusEmail,
                          })
                        );
                        showToast(
                          `Application ${selectedApp.applicationReference} updated to ${selectedApp.status}.`
                        );
                        setSelectedApp(null);
                        setAppStatusNote("");
                        fetchEmailLogs();
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                    >
                      Save Status &amp; Update Application
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            SECTION 5: CUSTOMER ENQUIRIES
           ====================================================== */}
        {activeSection === "enquiries" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Concierge Desk Inbox
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  Customer Enquiries ({filteredContacts.length})
                </h2>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
                {["All", ...ENQUIRY_STATUSES].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      enquiryStatusFilter === st
                        ? "bg-[#181615] text-white"
                        : "bg-white text-[#5c554e] border border-[#181615]/10"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredContacts.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl bg-white border border-[#181615]/10 p-6 flex flex-wrap items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif text-xl font-semibold text-[#181615]">
                        {c.name}
                      </h3>
                      {c.enquiryReference && (
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#faf8f5] border border-[#181615]/10 text-[#263b30]">
                          {c.enquiryReference}
                        </span>
                      )}
                      <select
                        value={c.status || "New"}
                        onChange={async (e) => {
                          await dispatch(
                            updateContact({
                              id: c._id,
                              status: e.target.value,
                              adminNotes: c.adminNotes,
                            })
                          );
                          showToast(`Enquiry status updated to ${e.target.value}.`);
                        }}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f3efea] text-[#263b30] border-0"
                      >
                        {ENQUIRY_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-[#8c837a]">
                        {c.inquiryType}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c554e]">
                      {c.email} &bull; {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-[#181615] pt-1">{c.message}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEmailComposerForEnquiry(c)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                    >
                      <Mail size={13} /> Reply with Template
                    </button>
                    <button
                      onClick={() => dispatch(deleteContact(c._id))}
                      className="p-2 text-[#9e2a2b] hover:bg-[#faf8f5] rounded-full"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="rounded-2xl bg-white border border-[#181615]/10 p-8 text-center text-sm text-[#8c837a]">
                  No customer enquiries in this filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 6: ADMIN EMAIL TEMPLATE LIBRARY (12 Default Templates)
           ====================================================== */}
        {activeSection === "email-templates" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Branded Resend Correspondence System
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  Admin Email Template Library ({emailTemplates.length})
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={async () => {
                    const res = await api.post(
                      "/emails/templates/restore-defaults"
                    );
                    setEmailTemplates(res.data?.templates || []);
                    showToast("Restored all 12 default email templates.");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold hover:bg-[#f3efea]"
                >
                  <RefreshCw size={13} /> Restore 12 Defaults
                </button>
                <button
                  onClick={async () => {
                    const res = await api.post("/emails/templates", {
                      name: "Custom Sanctuary Correspondence",
                      category: "General",
                      subject:
                        "Personal Update from {{businessName}} — {{kittenName}}",
                      htmlBody:
                        "<p>Dear <strong>{{customerName}}</strong>,</p><p>{{nextSteps}}</p><p>Warm regards,<br/><strong>{{adminName}}</strong></p>",
                    });
                    await fetchEmailTemplates();
                    setSelectedTemplate(res.data);
                    showToast("Created new custom email template.");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181615] text-white text-xs font-semibold"
                >
                  <Plus size={14} /> New Custom Template
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Template Selector List */}
              <div className="lg:col-span-4 space-y-3">
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Search 12+ templates..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#181615]/10 text-xs"
                />
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 max-w-full">
                  {[
                    "All",
                    "Enquiry",
                    "Application",
                    "Reservation",
                    "Follow-Up",
                    "General",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        templateCategoryFilter === cat
                          ? "bg-[#181615] text-white"
                          : "bg-white text-[#5c554e]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                        selectedTemplate?._id === t._id
                          ? "bg-[#181615] text-white border-[#181615]"
                          : "bg-white text-[#181615] border-[#181615]/10 hover:bg-[#f3efea]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{t.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15">
                          {t.category}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-1 truncate ${
                          selectedTemplate?._id === t._id
                            ? "text-white/75"
                            : "text-[#5c554e]"
                        }`}
                      >
                        {t.subject}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Template Editor & Live Branded Preview */}
              {selectedTemplate && (
                <div className="lg:col-span-8 space-y-6">
                  <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                          {selectedTemplate.name}
                        </h3>
                        <label className="inline-flex items-center gap-2 text-xs text-[#5c554e] mt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTemplate.isActive !== false}
                            onChange={(e) =>
                              setSelectedTemplate({
                                ...selectedTemplate,
                                isActive: e.target.checked,
                              })
                            }
                          />
                          Template Active
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={async () => {
                            const res = await api.post("/emails/templates", {
                              name: `${selectedTemplate.name} (Copy)`,
                              category: selectedTemplate.category,
                              subject: selectedTemplate.subject,
                              htmlBody: selectedTemplate.htmlBody,
                            });
                            await fetchEmailTemplates();
                            setSelectedTemplate(res.data);
                            showToast("Duplicated template.");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#faf8f5] border border-[#181615]/15 text-xs font-semibold"
                        >
                          <Copy size={12} /> Duplicate
                        </button>
                        {!selectedTemplate.isDefault && (
                          <button
                            onClick={async () => {
                              await api.delete(
                                `/emails/templates/${selectedTemplate._id}`
                              );
                              await fetchEmailTemplates();
                              setSelectedTemplate(emailTemplates[0] || null);
                              showToast("Deleted custom template.");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fde8e8] text-[#9e2a2b] text-xs font-semibold"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            const res = await api.post("/emails/test", {
                              adminTestEmail: adminTestEmailInput,
                              subject: selectedTemplate.subject,
                              htmlBody: selectedTemplate.htmlBody,
                              templateName: selectedTemplate.name,
                            });
                            showToast(res.data?.message || "Test email sent.");
                            fetchEmailLogs();
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#9e5a3c] text-white text-xs font-semibold"
                        >
                          <Send size={12} /> Send Test to Admin (
                          {adminTestEmailInput})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#181615]">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={selectedTemplate.subject || ""}
                        onChange={(e) =>
                          setSelectedTemplate({
                            ...selectedTemplate,
                            subject: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                      />
                    </div>

                    {/* Dynamic Variable Pills */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#5c554e] block">
                        Click a Dynamic Variable to Insert into Template Body:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {DYNAMIC_VARIABLES.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              setSelectedTemplate({
                                ...selectedTemplate,
                                htmlBody: `${selectedTemplate.htmlBody} ${v}`,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#faf8f5] hover:bg-[#f3efea] border border-[#181615]/15 font-mono text-[11px] text-[#263b30]"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#181615]">
                        Template Body (HTML + Dynamic Variables)
                      </label>
                      <textarea
                        rows={6}
                        value={selectedTemplate.htmlBody || ""}
                        onChange={(e) =>
                          setSelectedTemplate({
                            ...selectedTemplate,
                            htmlBody: e.target.value,
                          })
                        }
                        className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 font-mono text-xs leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={async () => {
                          const res = await api.put(
                            `/emails/templates/${selectedTemplate._id}`,
                            selectedTemplate
                          );
                          setSelectedTemplate(res.data);
                          fetchEmailTemplates();
                          showToast(`Saved "${selectedTemplate.name}".`);
                        }}
                        className="px-6 py-2.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                      >
                        Save Template Changes
                      </button>
                    </div>
                  </div>

                  {/* Live Branded Email Preview */}
                  <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9e5a3c] block">
                      Live Rendered Luxury Email Preview
                    </span>
                    <div className="rounded-xl border border-[#181615]/10 overflow-hidden bg-[#faf8f5]">
                      <iframe
                        title="Email Template Preview"
                        srcDoc={templatePreviewHtml}
                        className="w-full h-[420px] border-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 7: EMAIL ACTIVITY HISTORY LOG
           ====================================================== */}
        {activeSection === "email-history" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Resend Delivery Audit Trail
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  Email Activity History ({filteredEmailLogs.length})
                </h2>
              </div>
              <button
                onClick={fetchEmailLogs}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold"
              >
                <RefreshCw size={13} /> Refresh Log
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#181615]/10">
              <input
                type="text"
                value={emailLogSearch}
                onChange={(e) => setEmailLogSearch(e.target.value)}
                placeholder="Search by recipient email, subject, template, or reference ID..."
                className="w-full px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/10 text-xs sm:text-sm"
              />
            </div>

            <div className="rounded-2xl bg-white border border-[#181615]/10 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#181615]/10 bg-[#faf8f5] text-[11px] uppercase tracking-wider text-[#8c837a]">
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Subject &amp; Template</th>
                    <th className="py-3.5 px-4">Reference</th>
                    <th className="py-3.5 px-4">Provider ID</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181615]/10">
                  {filteredEmailLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#faf8f5]/60">
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#5c554e]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#181615]">
                          {log.recipientName || "Recipient"}
                        </div>
                        <div className="text-xs text-[#5c554e]">
                          {log.recipientEmail}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#181615]">
                          {log.subject}
                        </div>
                        <div className="text-xs text-[#8c837a]">
                          Template: {log.templateName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#263b30]">
                        {log.relatedReference || log.relatedType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#8c837a]">
                        {log.providerMessageId
                          ? log.providerMessageId.slice(0, 18)
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            log.status === "Accepted by provider" ||
                            log.status === "Delivered"
                              ? "bg-[#ebf1ee] text-[#263b30]"
                              : log.status === "Failed"
                              ? "bg-[#fde8e8] text-[#9e2a2b]"
                              : "bg-[#f3efea] text-[#5c554e]"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredEmailLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-sm text-[#8c837a]"
                      >
                        No email activity logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 8: WEBSITE CONTENT (Upcoming, Retired, Reviews, Bulletins)
           ====================================================== */}
        {activeSection === "website-content" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                Editorial Content &amp; Social Proof
              </span>
              <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                Website Content Management
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
              {[
                {
                  id: "upcoming",
                  label: `Upcoming Litters (${upcoming?.length || 0})`,
                },
                {
                  id: "retired",
                  label: `Retired Adults (${retired?.length || 0})`,
                },
                {
                  id: "reviews",
                  label: `Guardian Reviews (${adminReviews?.length || 0})`,
                },
                {
                  id: "bulletins",
                  label: `Top Bar Bulletins (${notifications?.length || 0})`,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setContentSubTab(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold ${
                    contentSubTab === t.id
                      ? "bg-[#181615] text-white"
                      : "bg-white text-[#5c554e] border border-[#181615]/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {contentSubTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(adminReviews || []).map((r) => (
                  <div
                    key={r._id}
                    className="p-5 rounded-2xl bg-white border border-[#181615]/10 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-[#181615]">
                          {r.name} ({r.location || "US"})
                        </strong>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.isApproved || r.verified
                              ? "bg-[#ebf1ee] text-[#263b30]"
                              : "bg-[#fdf4e7] text-[#b45309]"
                          }`}
                        >
                          {r.isApproved || r.verified
                            ? "Verified Public"
                            : "Pending Approval"}
                        </span>
                      </div>
                      <p className="text-xs text-[#5c554e] mt-2">
                        &ldquo;{r.review || r.text}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {!(r.isApproved || r.verified) && (
                        <button
                          onClick={() => dispatch(approveReview(r._id))}
                          className="px-3 py-1.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                        >
                          Approve Review
                        </button>
                      )}
                      <button
                        onClick={() => dispatch(deleteReview(r._id))}
                        className="px-3 py-1.5 rounded-full bg-[#faf8f5] text-[#9e2a2b] text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {contentSubTab === "upcoming" && (
              <div className="space-y-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData();
                    Object.entries(upcomingForm).forEach(([k, v]) =>
                      fd.append(k, String(v))
                    );
                    if (upcomingFile) fd.append("image", upcomingFile);
                    await dispatch(createUpcoming(fd));
                    showToast("Created upcoming litter announcement.");
                    setUpcomingForm({
                      ...upcomingForm,
                      title: "",
                      parents: "",
                      expectedArrival: "",
                      description: "",
                    });
                  }}
                  className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4"
                >
                  <h3 className="font-serif text-xl font-semibold">
                    Publish New Upcoming Litter
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={upcomingForm.title}
                      onChange={(e) =>
                        setUpcomingForm({
                          ...upcomingForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="Litter Title (e.g. Autumn Cashmere Pairing)"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                    <input
                      type="text"
                      required
                      value={upcomingForm.parents}
                      onChange={(e) =>
                        setUpcomingForm({
                          ...upcomingForm,
                          parents: e.target.value,
                        })
                      }
                      placeholder="Sire & Dam Pairing"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                    <input
                      type="text"
                      required
                      value={upcomingForm.expectedArrival}
                      onChange={(e) =>
                        setUpcomingForm({
                          ...upcomingForm,
                          expectedArrival: e.target.value,
                        })
                      }
                      placeholder="Expected Arrival (e.g. December 2026)"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setUpcomingFile(e.target.files?.[0] || null)
                      }
                      className="text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                    >
                      Add Upcoming Litter
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(upcoming || []).map((u) => (
                    <div
                      key={u._id}
                      className="p-5 rounded-2xl bg-white border border-[#181615]/10 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-serif text-lg font-semibold">
                          {u.title || u.litterName}
                        </h4>
                        <p className="text-xs text-[#5c554e]">
                          Expected: {u.expectedArrival || u.dueDate} &bull;{" "}
                          {u.status}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(deleteUpcoming(u._id))}
                        className="text-xs font-semibold text-[#9e2a2b]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contentSubTab === "retired" && (
              <div className="space-y-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData();
                    Object.entries(retiredForm).forEach(([k, v]) =>
                      fd.append(k, String(v))
                    );
                    if (retiredFile) fd.append("image", retiredFile);
                    await dispatch(createRetired(fd));
                    showToast("Published retired adult listing.");
                    setRetiredForm({ ...retiredForm, name: "", story: "" });
                  }}
                  className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4"
                >
                  <h3 className="font-serif text-xl font-semibold">
                    Add Retired Adult Companion
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={retiredForm.name}
                      onChange={(e) =>
                        setRetiredForm({ ...retiredForm, name: e.target.value })
                      }
                      placeholder="Adult Cat Name"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                    <input
                      type="text"
                      required
                      value={retiredForm.breed}
                      onChange={(e) =>
                        setRetiredForm({
                          ...retiredForm,
                          breed: e.target.value,
                        })
                      }
                      placeholder="Breed"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                    <input
                      type="number"
                      required
                      value={retiredForm.fee}
                      onChange={(e) =>
                        setRetiredForm({
                          ...retiredForm,
                          fee: Number(e.target.value),
                        })
                      }
                      placeholder="Placement Fee ($)"
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setRetiredFile(e.target.files?.[0] || null)
                      }
                      className="text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                    >
                      Add Retired Adult
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(retired || []).map((r) => (
                    <div
                      key={r._id}
                      className="p-5 rounded-2xl bg-white border border-[#181615]/10 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-serif text-lg font-semibold">
                          {r.name}
                        </h4>
                        <p className="text-xs text-[#5c554e]">
                          {r.breed} &bull; ${r.fee || r.price}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(deleteRetired(r._id))}
                        className="text-xs font-semibold text-[#9e2a2b]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contentSubTab === "bulletins" && (
              <div className="space-y-4 max-w-2xl">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!bulletinMsg.trim()) return;
                    await dispatch(createNotification({ message: bulletinMsg }));
                    setBulletinMsg("");
                    showToast("Published new sanctuary bulletin.");
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={bulletinMsg}
                    onChange={(e) => setBulletinMsg(e.target.value)}
                    placeholder="Enter announcement banner text..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#181615]/15 text-xs sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#181615] text-white text-xs font-semibold"
                  >
                    Publish
                  </button>
                </form>
                <div className="space-y-2">
                  {(notifications || []).map((n) => (
                    <div
                      key={n._id}
                      className="p-4 rounded-xl bg-white border border-[#181615]/10 flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm">{n.message}</span>
                      <button
                        onClick={() => dispatch(deleteNotification(n._id))}
                        className="text-xs text-[#9e2a2b] font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            SECTION 9: AI CONFIGURATION & MODEL FALLBACK HEALTH
           ====================================================== */}
        {activeSection === "ai-config" && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                  Gemini Multimodal Router &amp; Quota Protection
                </span>
                <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                  AI Configuration &amp; Automatic Fallback Health
                </h2>
              </div>
              <button
                onClick={fetchAiHealth}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#181615]/15 text-xs font-semibold"
              >
                <RefreshCw size={13} /> Refresh Telemetry
              </button>
            </div>

            {/* Routing Mode Selector */}
            <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-5">
              <h3 className="font-serif text-xl font-semibold text-[#181615]">
                Model Routing &amp; Cost Protection Policy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    mode: "free_only",
                    title: "Free Models Only + Auto-Fallback (Default)",
                    desc: "Routes gemini-3.8-flash → gemini-3.6-flash → gemini-3.5-flash-lite → active free Flash models. Paid models disabled.",
                  },
                  {
                    mode: "specific_free_model",
                    title: "Prioritize Specific Free Model",
                    desc: "Uses your chosen free model first and falls back down the free chain if rate-limited.",
                  },
                  {
                    mode: "paid_enabled",
                    title: "Allow Optional Paid Flagship (gemini-4-argon)",
                    desc: "Enables gemini-4-argon only if all free models are exhausted or for complex multimodal tasks.",
                  },
                ].map((m) => (
                  <button
                    key={m.mode}
                    onClick={() =>
                      handleUpdateAiConfig({
                        mode: m.mode,
                        paidModelEnabled: m.mode === "paid_enabled",
                      })
                    }
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      aiHealth?.config?.mode === m.mode
                        ? "bg-[#181615] text-white border-[#181615]"
                        : "bg-[#faf8f5] text-[#181615] border-[#181615]/10"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold">{m.title}</p>
                    <p
                      className={`text-xs mt-1.5 ${
                        aiHealth?.config?.mode === m.mode
                          ? "text-white/75"
                          : "text-[#5c554e]"
                      }`}
                    >
                      {m.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Model Priority & Health Cards */}
            <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-[#181615]">
                Configured Model Priority &amp; Live Cooldown Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(aiHealth?.models || []).map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-[#faf8f5] border border-[#181615]/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#181615]">
                        #{idx + 1} {m.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          m.status === "healthy"
                            ? "bg-[#ebf1ee] text-[#263b30]"
                            : m.status === "cooldown"
                            ? "bg-[#fdf4e7] text-[#b45309]"
                            : m.status === "disabled"
                            ? "bg-[#181615]/10 text-[#8c837a]"
                            : "bg-white text-[#5c554e]"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c554e]">{m.role}</p>
                    <div className="text-[11px] text-[#8c837a] flex items-center justify-between pt-1 border-t border-[#181615]/10">
                      <span>Success: {m.successCount}</span>
                      <span>Fallbacks: {m.failureCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Fallback Events Log */}
            <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-[#181615]">
                Recent Automatic Fallback Events
              </h3>
              <div className="divide-y divide-[#181615]/10">
                {(aiHealth?.recentFallbackEvents || []).map((ev) => (
                  <div
                    key={ev.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono font-semibold text-[#9e2a2b]">
                        {ev.fromModel}
                      </span>{" "}
                      &rarr;{" "}
                      <span className="font-mono font-semibold text-[#263b30]">
                        {ev.toModel}
                      </span>
                      <p className="text-[#5c554e] mt-0.5">{ev.reason}</p>
                    </div>
                    <span className="text-[#8c837a]">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {(!aiHealth?.recentFallbackEvents ||
                  aiHealth.recentFallbackEvents.length === 0) && (
                  <p className="py-4 text-xs text-[#8c837a]">
                    No fallback events triggered in this session.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 10: SETTINGS
           ====================================================== */}
        {activeSection === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9e5a3c]">
                Sanctuary Configuration
              </span>
              <h2 className="font-serif text-3xl font-semibold text-[#181615] mt-1">
                Nursery &amp; Email Settings
              </h2>
            </div>

            <div className="rounded-2xl bg-white border border-[#181615]/10 p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#181615]">
                  Primary Cattery Location (Displayed Across Public Pages)
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#181615]">
                  Nursery Contact Phone / SMS (Displayed Across Public Pages &amp; Direct Call Links)
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. +1 (607) 223-4177"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
                <p className="text-[11px] text-[#8c837a]">
                  This phone number dynamically feeds into your public header, footer, contact page, and kitten profiles for direct calling and SMS texting.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#181615]">
                  Public Cattery Contact Email (Displayed Across Public Pages &amp; Footer)
                </label>
                <input
                  type="email"
                  value={contactEmailInput}
                  onChange={(e) => setContactEmailInput(e.target.value)}
                  placeholder="e.g. info@munchkinkittie.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
                <p className="text-[11px] text-[#8c837a]">
                  This official email address feeds dynamically into your public footer, contact page, and direct mailto links.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#181615]">
                  Designated Administrator Test Email Address (For Safe Template
                  Testing)
                </label>
                <input
                  type="email"
                  value={adminTestEmailInput}
                  onChange={(e) => setAdminTestEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
              </div>

              <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#181615] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSendStatusEmailsInput}
                  onChange={(e) =>
                    setAutoSendStatusEmailsInput(e.target.checked)
                  }
                />
                Automatically send branded status emails when application status
                changes
              </label>

              <div>
                <button
                  onClick={async () => {
                    await dispatch(
                      updateLocation({
                        mainLocation: locationInput,
                        phoneNumber: phoneInput,
                        contactEmail: contactEmailInput,
                      })
                    );
                    await handleUpdateAiConfig({
                      adminTestEmail: adminTestEmailInput,
                      autoSendStatusEmails: autoSendStatusEmailsInput,
                    });
                    showToast("Sanctuary settings updated.");
                  }}
                  className="px-6 py-3 rounded-full bg-[#263b30] text-white text-xs sm:text-sm font-semibold"
                >
                  Save Sanctuary Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================
          MODAL 1: CREATE / EDIT KITTEN (Up to 10 Photos + Reorder)
         ====================================================== */}
      {showKittenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-7 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#181615]/10 pb-4">
              <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                {editingKitten
                  ? `Edit Kitten — ${editingKitten.name}`
                  : "Create New Kitten Listing (Up to 10 Photos)"}
              </h3>
              <button
                onClick={() => setShowKittenModal(false)}
                className="text-xs font-semibold text-[#8c837a]"
              >
                Close
              </button>
            </div>

            {kittenUploadError && (
              <div className="p-3.5 rounded-xl bg-[#fde8e8] text-[#9e2a2b] text-xs font-semibold">
                {kittenUploadError}
              </div>
            )}

            <form onSubmit={handleSaveKitten} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={kittenForm.name}
                    onChange={(e) =>
                      setKittenForm({ ...kittenForm, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Breed *
                  </label>
                  <input
                    type="text"
                    required
                    value={kittenForm.breed}
                    onChange={(e) =>
                      setKittenForm({ ...kittenForm, breed: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Status *
                  </label>
                  <select
                    value={kittenForm.status}
                    onChange={(e) =>
                      setKittenForm({ ...kittenForm, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  >
                    {KITTEN_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Gender
                  </label>
                  <select
                    value={kittenForm.gender}
                    onChange={(e) =>
                      setKittenForm({ ...kittenForm, gender: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Age (Weeks)
                  </label>
                  <input
                    type="number"
                    required
                    value={kittenForm.ageWeeks}
                    onChange={(e) =>
                      setKittenForm({
                        ...kittenForm,
                        ageWeeks: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Coat
                  </label>
                  <input
                    type="text"
                    required
                    value={kittenForm.coat}
                    onChange={(e) =>
                      setKittenForm({ ...kittenForm, coat: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Adoption Fee ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={kittenForm.price}
                    onChange={(e) =>
                      setKittenForm({
                        ...kittenForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Registry ID <span className="text-[#8c837a] font-normal">(Optional — auto-generated if left blank)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MK-2026-000123 or TICA #..."
                  value={kittenForm.registryId || ""}
                  onChange={(e) =>
                    setKittenForm({ ...kittenForm, registryId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={kittenForm.description}
                  onChange={(e) =>
                    setKittenForm({
                      ...kittenForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
              </div>

              {/* Photo Gallery Manager (Max 10) */}
              <div className="space-y-3 pt-2 border-t border-[#181615]/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">
                    Photographs ({existingImageUrls.length + newImageFiles.length}{" "}
                    / 10 Max)
                  </label>
                  <label className="px-3.5 py-1.5 rounded-full bg-[#181615] text-white text-xs font-semibold cursor-pointer">
                    + Add Photos
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleKittenFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {existingImageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {existingImageUrls.map((url, idx) => (
                      <div
                        key={url}
                        className="relative rounded-xl overflow-hidden border border-[#181615]/15 bg-[#faf8f5]"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-24 object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#263b30] text-white text-[9px] font-semibold">
                            Primary
                          </span>
                        )}
                        <div className="p-1 flex items-center justify-between bg-white">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveExistingImage(idx, -1)}
                              className="p-0.5 hover:bg-[#f3efea] rounded"
                            >
                              <ArrowLeft size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveExistingImage(idx, 1)}
                              className="p-0.5 hover:bg-[#f3efea] rounded"
                            >
                              <ArrowRight size={11} />
                            </button>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => setPrimaryExistingImage(idx)}
                                className="p-0.5 text-[#9e5a3c]"
                                title="Set Primary"
                              >
                                <Star size={11} />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExistingImageUrls(
                                existingImageUrls.filter((_, i) => i !== idx)
                              )
                            }
                            className="p-0.5 text-[#9e2a2b]"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#181615]/10">
                <button
                  type="button"
                  onClick={() => setShowKittenModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#faf8f5] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKitten}
                  className="px-6 py-2.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                >
                  {savingKitten ? "Saving..." : "Save Kitten Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL 2: ONE-CLICK TEMPLATE EMAIL COMPOSER
         ====================================================== */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#181615]/10 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9e5a3c]">
                  Resend Concierge Dispatch
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#181615]">
                  Send Template Email to {composerData.recipientName}
                </h3>
              </div>
              <button
                onClick={() => setComposerOpen(false)}
                className="text-xs font-semibold text-[#8c837a]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleDispatchComposerEmail} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    required
                    value={composerData.to}
                    onChange={(e) =>
                      setComposerData({ ...composerData, to: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Select Professional Template
                  </label>
                  <select
                    value={composerData.templateSlug}
                    onChange={(e) =>
                      handleComposerTemplateChange(e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm"
                  >
                    {emailTemplates.map((t) => (
                      <option key={t._id} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={composerData.subject}
                  onChange={(e) =>
                    setComposerData({
                      ...composerData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Personalized Next Steps ({"{{nextSteps}}"})
                </label>
                <input
                  type="text"
                  value={composerData.variables?.nextSteps || ""}
                  onChange={(e) =>
                    setComposerData({
                      ...composerData,
                      variables: {
                        ...(composerData.variables || {}),
                        nextSteps: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#181615]/15 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Message Content (Variables Auto-Filled on Send)
                </label>
                <textarea
                  rows={6}
                  required
                  value={composerData.message}
                  onChange={(e) =>
                    setComposerData({
                      ...composerData,
                      message: e.target.value,
                    })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-[#181615]/15 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#181615]/10">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#faf8f5] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#263b30] text-white text-xs font-semibold"
                >
                  <Send size={13} />{" "}
                  {sendingEmail
                    ? "Dispatching via Resend..."
                    : "Send Branded Email & Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Fixed Mobile Bottom App Dock */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#181615]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.35)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <button
          onClick={() => {
            setActiveSection("overview");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            activeSection === "overview"
              ? "text-[#e8b496]"
              : "text-white/60 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveSection("kittens");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium relative transition-colors ${
            activeSection === "kittens"
              ? "text-[#e8b496]"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Cat size={18} />
          <span>Kittens</span>
          {kittens?.length > 0 && (
            <span className="absolute top-0 right-1.5 h-3 min-w-[12px] px-0.5 rounded-full bg-[#9e5a3c] text-white text-[8px] font-bold flex items-center justify-center">
              {kittens.length}
            </span>
          )}
        </button>

        {/* Central AI Studio Pill Button */}
        <button
          onClick={() => {
            setActiveSection("ai-assistant");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`-mt-3 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl border transition-all ${
            activeSection === "ai-assistant"
              ? "bg-[#9e5a3c] text-white border-[#e8b496]/40 shadow-lg scale-105"
              : "bg-[#263b30] text-white border-white/10 hover:bg-[#1e2f26]"
          }`}
        >
          <Sparkles size={16} className="text-[#e8b496]" />
          <span className="text-[10px] font-bold tracking-tight">AI Studio</span>
        </button>

        <button
          onClick={() => {
            setActiveSection("applications");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium relative transition-colors ${
            activeSection === "applications"
              ? "text-[#e8b496]"
              : "text-white/60 hover:text-white"
          }`}
        >
          <FileText size={18} />
          <span>Apps</span>
          {applications?.filter((a) =>
            ["New", "Pending", "Under Review"].includes(a.status)
          ).length > 0 && (
            <span className="absolute top-0 right-1.5 h-3 min-w-[12px] px-0.5 rounded-full bg-[#9e5a3c] text-white text-[8px] font-bold flex items-center justify-center">
              {
                applications.filter((a) =>
                  ["New", "Pending", "Under Review"].includes(a.status)
                ).length
              }
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-white/60 hover:text-white transition-colors"
        >
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>
      </div>
    </div>
  );
}
