import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, Minus, Trash2, Sparkles, Check, ShoppingBag, 
  Award, AlertCircle, ChevronRight, RefreshCw, X, Save, Eye,
  Star, Landmark, ShieldCheck, Mail, MapPin, CreditCard,
  Printer, ArrowRight, ArrowLeft, HelpCircle, Calendar, FileText, CheckCircle, Users,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_SERVICES } from "./data/servicesData";
import { ServiceItem, CartItem, SavedOrder } from "./types";
import { BrandedProposal } from "./components/BrandedProposal";
import { BrandoraLogo } from "./components/BrandoraLogo";

export default function App() {
  // Store Settings (Global)
  const [currency, setCurrency] = useState<"AED" | "SAR" | "USD" | "EGP">("SAR");
  const [lang, setLang] = useState<"en" | "ar">("ar");
  const isRtl = lang === "ar";

  // Curated workspace translations
  const workspaceTranslations = {
    en: {
      studioTitle: "CO-CREATION DESK",
      currencyLabel: "Currency:",
      briefBag: "Brief Bag",
      storefrontTab: "Creative Storefront",
      ledgerTab: "Archived Strategy Proposals",
      searchPlaceholder: "Search for premium services (e.g. video, branding)...",
      allCategory: "All Categories",
      totalInvestment: "TOTAL INVESTMENT",
      viewStrategyOffer: "View Strategy Offer",
      noBlueprints: "No blueprints archived yet",
      createConfigPrompt: "Create customized client configurations or process test briefs from the storefront to archive strategy proposals.",
      customScopeNarrativeLabel: "Bespoke AI Campaign Scope Directive (Optional)",
      brandNameLabel: "Client Brand Name",
      brandEthosLabel: "Brand Ethos & Core Values",
      durationLabel: "Duration Discount Model",
      monthsLabel: "Months",
      oneTime: "One-Time Project",
      addonsLabel: "Bespoke Strategic Add-ons",
      addToBrief: "Configure & Add to Brief",
      configureService: "Configure & Customize Service",
      backToStore: "Back to Storefront",
      checkout: "Finalize Creative Proposal",
      emptyCart: "Your campaign bag is empty",
      emptyCartDesc: "Select and co-create bespoke creative services retainers on the co-creation desk.",
      strategySubtotal: "Strategy Subtotal",
      vatAmount: "Regional VAT",
      completeCheckoutTitle: "Execute Certified Creative Charter",
      completeCheckoutDesc: "Finalize the commercial parameters, client correspondence, and regional scope below to generate your official, high-fidelity co-branded proposal.",
      customerName: "Representative / Client Name",
      customerEmail: "Direct Corporate Correspondence Email",
      nationalAddress: "National Address / Strategic Scope (Emirates or KSA National Address)",
      paymentMethod: "Settlement Basis / Method",
      generateProposal: "Generate Strategic Proposal",
      cancel: "Cancel",
      toastAdded: "Added {name} to campaign brief",
      toastRemoved: "Removed {name} from campaign brief",
      toastCleared: "Campaign brief has been cleared",
      toastRestored: "Restored campaign brief",
      toastOpening: "Opening strategy proposal for {name}",
      toastSaved: "Strategy blueprint saved successfully"
    },
    ar: {
      studioTitle: "منصة الإنتاج المشترك",
      currencyLabel: "العملة:",
      briefBag: "حقيبة العرض الإستراتيجي",
      storefrontTab: "المعرض الإبداعي",
      ledgerTab: "مسودات العروض الإستراتيجية المؤرشفة",
      searchPlaceholder: "ابحث عن الخدمات المميزة (مثال: فيديو، هوية)...",
      allCategory: "جميع الفئات",
      totalInvestment: "إجمالي قيمة الاستثمار",
      viewStrategyOffer: "عرض مستند العرض الإستراتيجي",
      noBlueprints: "لا توجد عروض مؤرشفة حتى الآن",
      createConfigPrompt: "قم بإنشاء وتخصيص باقات الخدمات لعملائك أو قم بتجربة إضافة خدمات في المعرض لإصدار العروض الإستراتيجية وأرشفتها.",
      customScopeNarrativeLabel: "توجيهات مخصصة لنطاق الحملة بالذكاء الاصطناعي (اختياري)",
      brandNameLabel: "اسم العلامة التجارية / الشريك",
      brandEthosLabel: "قيم وهوية العلامة التجارية الأساسية",
      durationLabel: "نموذج خصم فترة العقد والخدمات المستمرة",
      monthsLabel: "أشهر",
      oneTime: "مشروع لمرة واحدة",
      addonsLabel: "الخدمات الإضافية الإستراتيجية المخصصة",
      addToBrief: "تخصيص وإضافة للعرض",
      configureService: "تهيئة وتخصيص الخدمة الإبداعية",
      backToStore: "العودة إلى المعرض الرئيسي",
      checkout: "توليد مستند العرض والاتفاق التجاري",
      emptyCart: "حقيبة العرض الإستراتيجي فارغة حالياً",
      emptyCartDesc: "يرجى تحديد وتخصيص الخدمات الإبداعية وحملات الخدمات في منصة الإنتاج المشترك لتفعيل العرض.",
      strategySubtotal: "المجموع الفرعي للإستراتيجية",
      vatAmount: "ضريبة القيمة المضافة الإقليمية",
      completeCheckoutTitle: "تفعيل ميثاق العمل الإبداعي الرقمي المعتمد",
      completeCheckoutDesc: "يرجى ملء البيانات التجارية، بيانات الاتصال والمراسلات، ونطاق العمل الوطني لإصدار وتوثيق العرض الإستراتيجي التجاري النهائي.",
      customerName: "اسم الشريك / ممثل الجهة المستفيدة",
      customerEmail: "البريد الإلكتروني الرسمي للمراسلات التجارية",
      nationalAddress: "العنوان الوطني أو النطاق الجغرافي للعمل (المملكة العربية السعودية أو الإمارات)",
      paymentMethod: "طريقة التسوية والالتزام المالي",
      generateProposal: "توليد وإصدار العرض الإستراتيجي",
      cancel: "إلغاء",
      toastAdded: "تمت إضافة {name} إلى حقيبة العرض بنجاح",
      toastRemoved: "تمت إزالة {name} من حقيبة العرض",
      toastCleared: "تم إخلاء حقيبة العرض بالكامل",
      toastRestored: "تم استرجاع باقة العمل بنجاح",
      toastOpening: "جاري فتح العرض الإستراتيجي المعتمد لصالح {name}",
      toastSaved: "تمت أرشفة مخطط الإستراتيجية بنجاح في سجلات الاستشارات"
    }
  };

  const t = workspaceTranslations[lang];

  const getCategoryTranslation = (cat: string) => {
    if (lang === "en") return cat;
    switch (cat) {
      case "All": return "الكل";
      case "Social Media & Video": return "وسائل التواصل والإنتاج المرئي";
      case "Brand & Identity": return "الهوية التجارية والرموز";
      case "Web & Technology": return "الويب والتقنية الرقمية";
      case "Growth & Strategy": return "النمو والإستراتيجية";
      default: return cat;
    }
  };

  const getServiceTranslation = (id: string, field: "name" | "tagline" | "description") => {
    const translations: Record<string, { name: string; tagline: string; description: string }> = {
      "serv-social-media": {
        name: "إدارة وسائل التواصل الاجتماعي",
        tagline: "تنظيم وإشراف متكامل على الحسابات",
        description: "إستراتيجية محتوى شاملة، تخطيط الحسابات، مصفوفات تحليل رباعي (SWOT)، ومراقبة الأداء لضمان الصدارة الإقليمية."
      },
      "serv-media-buying": {
        name: "إدارة الإعلانات الممولة",
        tagline: "حملات إعلانية مدفوعة بعائد استثمار مرتفع",
        description: "إعداد وتحسين مستمر للحملات الإعلانية المدفوعة على منصات البحث والتواصل الاجتماعي (الميزانية مستثناة)."
      },
      "serv-moderation": {
        name: "خدمة إدارة وتعديل الحسابات",
        tagline: "حماية سمعة العلامة وسرعة استجابة فائقة",
        description: "الرد على الرسائل الخاصة، وإدارة التعليقات، والمتابعة النشطة لتفاعل الجمهور والعملاء."
      },
      "serv-logo-branding": {
        name: "تصميم الشعار والهوية البصرية",
        tagline: "بناء أسس الهوية التجارية المميزة",
        description: "شعار مبتكر مخصص، واختيار ألوان تتناسب مع ذوق الخليج العربي، ونظام خطوط متكامل لفرض حضور علامتك."
      },
      "serv-landing-page": {
        name: "تصميم وإنشاء صفحة الهبوط",
        tagline: "مواقع مصغرة سريعة لزيادة المبيعات",
        description: "صفحة هبوط متجاوبة بالكامل لجمع العملاء المحتملين مزودة بنماذج اتصال سريعة وتهيئة محركات البحث (SEO)."
      },
      "serv-crm-setup": {
        name: "إعداد وتركيب أنظمة الـ CRM",
        tagline: "أتمتة وإدارة عمليات المبيعات",
        description: "تركيب متقن لنظام إدارة علاقات العملاء، مسارات مبيعات مرئية، وتدفقات عمل تلقائية لمتابعة الصفقات والتقارير."
      },
      "serv-motion-graphics": {
        name: "باقة تصاميم موشن جرافيكس",
        tagline: "فيديوهات إبداعية تضمن أطول بقاء للمشاهد",
        description: "خمسة مقاطع فيديو قصيرة ومخصصة للموشن جرافيكس مع تعليق صوتي محترف لشبكات التواصل الاجتماعي."
      },
      "serv-creative-design": {
        name: "باقة التصاميم والمنشورات الإبداعية",
        tagline: "منشورات مخصصة للهويات الرقمية",
        description: "تصميم ١٥ منشوراً مميزاً لحسابات التواصل الاجتماعي لزيادة التفاعل وبناء طابع بصري منسجم."
      }
    };
    if (lang === "en" || !translations[id]) {
      const original = INITIAL_SERVICES.find(s => s.id === id);
      return original ? original[field] : "";
    }
    return translations[id][field];
  };

  const getAddonTranslation = (id: string, field: "name" | "description") => {
    const translations: Record<string, { name: string; description: string }> = {
      "addon-manager": {
        name: "مدير الهوية الإستراتيجي المخصص للخليج العربي",
        description: "متابعة وتوجيه مباشر مرتين في الأسبوع مع قناة تواصل ذات أولوية قصوى على واتساب."
      },
      "addon-sprint": {
        name: "حملة الإنتاج فائقة السرعة",
        description: "تسريع جميع خطوات التسليم وتقليص الجدول الزمني بمقدار ١٤ يوم عمل كاملة."
      },
      "addon-locale": {
        name: "أقلمة اللهجات والتعريب لدول الخليج",
        description: "تكييف وصياغة النصوص والرسائل التجارية لتناسب اللهجات السعودية والإماراتية والكويتية."
      }
    };
    if (lang === "en" || !translations[id]) {
      const original = addonsOptions.find(a => a.id === id);
      return original ? original[field] : "";
    }
    return translations[id][field];
  };

  const getDurationLabelTranslation = (label: string) => {
    if (lang === "en") return label;
    switch (label) {
      case "Starter Trial": return "عقد تجريبي للمبتدئين";
      case "Quaterly Plan": return "خطة ربع سنوية متكاملة";
      case "Sovereign Partnership": return "شراكة سيادية مستدامة";
      case "Legendary Legacy": return "الإرث الإبداعي المستمر";
      default: return label;
    }
  };

  const getServiceFeaturesTranslation = (id: string, originalFeatures: string[]) => {
    if (lang === "en") return originalFeatures;
    const translations: Record<string, string[]> = {
      "serv-social-media": [
        "إعداد دراسة السوق وتحليل SWOT الشامل",
        "تدقيق وتقييم أداء الحسابات الحالي وتقديم تقرير دقيق",
        "تحليل المنافسين ومقارنة مؤشرات الأداء الرئيسية",
        "بناء وإدارة الإستراتيجية المتكاملة للمحتوى",
        "مواكبة وتتبع اتجاهات السوق الخليجي وتكييف المحتوى",
        "تقديم خطة محتوى شهرية مع تقارير أسبوعية",
        "تقارير شاملة لأداء الحسابات شهرياً وأسبوعياً"
      ],
      "serv-media-buying": [
        "إنشاء وإدارة الحملات الإعلانية الممولة بالكامل",
        "استهداف وتحديد الجماهير وتحسين الوصول للحملة",
        "توزيع الميزانية الإعلانية ومراقبتها بدقة",
        "تتبع الأداء الإعلاني والتحسين اللحظي للنتائج",
        "تقارير أسبوعية وشهرية لتحليلات الأداء والنتائج",
        "التطوير المستمر لمعدل التحويل وعائد الاستثمار"
      ],
      "serv-moderation": [
        "الرد السريع والمحترف على استفسارات العملاء والتعليقات",
        "إدارة الرسائل الخاصة وتوجيه العملاء بعناية فائقة",
        "مراقبة التفاعل وقياس انطباعات ومشاعر الجمهور",
        "تصعيد طلبات واستفسارات الشركاء والعملاء الهامة فوراً",
        "الحفاظ على السمعة المرموقة للعلامة وجودة الردود"
      ],
      "serv-logo-branding": [
        "تصميم شعار فريد بمظهر عصري ومتعدد الخيارات",
        "هوية ألوان مخصصة ومتوافقة مع ذوق أسواق الخليج",
        "تحديد وتنسيق الخطوط والتراتبية البصرية للنصوص",
        "دليل الهوية الأساسي والأصول الرقمية المعتمدة"
      ],
      "serv-landing-page": [
        "تصميم صفحة هبوط مبتكرة مخصصة لعلامتك",
        "تخطيط متجاوب بالكامل ومحسن لشاشات الجوال",
        "تهيئة الصفحة لزيادة معدل تحويل الزوار إلى عملاء",
        "إعداد نماذج الاتصال وأزرار الحث على اتخاذ إجراء",
        "التهيئة الأساسية لمحركات البحث لسهولة الأرشفة العضوية"
      ],
      "serv-crm-setup": [
        "تركيب وإعداد الـ CRM بالكامل وربط النطاق الخاص بك",
        "بناء مسارات مرئية لإدارة وتتبع صفقات المبيعات",
        "أتمتة عملية المبيعات وإعداد الإشعارات اللحظية",
        "إدارة وصول المستخدمين وصلاحيات فريق العمل",
        "لوحة تحليلات وتقارير مرئية لقياس كفاءة المبيعات"
      ],
      "serv-motion-graphics": [
        "خمسة مقاطع فيديو موشن جرافيكس مصممة خصيصاً",
        "تعليق صوتي احترافي باللهجة أو اللغة المفضلة",
        "تنسيق المقاطع بالأبعاد الرأسية والمربعة لشبكات التواصل"
      ],
      "serv-creative-design": [
        "١٥ منشوراً ثابتاً لوسائل التواصل مع نصوص إبداعية",
        "تصاميم حصرية متناسقة مع الهوية البصرية لعلامتك",
        "تنسيقات جاهزة للنشر ومحسنة لجميع المنصات"
      ]
    };
    return translations[id] || originalFeatures;
  };

  // Services search and category filter state
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // UI Panels
  const [activeTab, setActiveTab] = useState<"storefront" | "ledger">("storefront");
  const [activeServicePage, setActiveServicePage] = useState<ServiceItem | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<SavedOrder | null>(null);

  // Customization Configuration (Temporary holds duration & add-ons inside Detail Panel)
  const [durationMonths, setDurationMonths] = useState<number>(3); // Default 3 Months
  const [clientBrandName, setClientBrandName] = useState<string>("");
  const [clientBrandEthos, setClientBrandEthos] = useState<string>("");
  const [customScopeNarrative, setCustomScopeNarrative] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [limitErrorModal, setLimitErrorModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    isOneTime: boolean;
    message: string;
  } | null>(null);

  // Ledger / Order Vault State
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);

  // Shared Presentation / Viewable Link State
  const [sharedProposalId, setSharedProposalId] = useState<string | null>(null);
  const [sharedProposal, setSharedProposal] = useState<SavedOrder | null>(null);
  const [isLoadingShared, setIsLoadingShared] = useState<boolean>(false);
  const [sharedError, setSharedError] = useState<string | null>(null);

  // Checkout Form Details
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [companyDetails, setCompanyDetails] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [proposalLang, setProposalLang] = useState<"en" | "ar">("ar");
  const [proposalCurrency, setProposalCurrency] = useState<"AED" | "SAR" | "USD" | "EGP">("SAR");
  const [proposalCountry, setProposalCountry] = useState<"KSA" | "UAE" | "Egypt">("KSA");

  // Premium Add-on Options definitions
  const addonsOptions = useMemo(() => [
    {
      id: "addon-manager",
      name: "Dedicated GCC Brand Director",
      description: "Direct bi-weekly corporate strategy workspace and WhatsApp priority sync channel.",
      monthlyAED: 1500,
      monthlySAR: 1530,
      monthlyUSD: 400
    },
    {
      id: "addon-sprint",
      name: "High-Speed Campaign Sprint",
      description: "Fast-tracks execution parameters, shortening deliverables calendar by 14 working days.",
      monthlyAED: 3000,
      monthlySAR: 3060,
      monthlyUSD: 800
    },
    {
      id: "addon-locale",
      name: "Multilingual GCC Localization",
      description: "Adapts copy dialects specifically for Emirates, Saudi Nejd/Hejaz, and Kuwait audiences.",
      monthlyAED: 2000,
      monthlySAR: 2040,
      monthlyUSD: 550
    }
  ], []);

  // Duration discounts rules
  const durationDiscountRules = useMemo(() => [
    { months: 1, label: "Starter Trial", discountPct: 0 },
    { months: 3, label: "Quaterly Plan", discountPct: 5 },
    { months: 6, label: "Sovereign Partnership", discountPct: 10 },
    { months: 12, label: "Legendary Legacy", discountPct: 15 }
  ], []);

  // Sync proposal modal settings with active storefront defaults
  useEffect(() => {
    if (checkoutModalOpen) {
      setProposalLang(lang);
      setProposalCurrency(currency);
    }
  }, [checkoutModalOpen, lang, currency]);

  // Check route on mount for Shared Proposal View
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/proposal/")) {
      const id = path.split("/proposal/")[1];
      if (id) {
        setSharedProposalId(id);
        setIsLoadingShared(true);
        fetch(`/api/proposals/${id}`)
          .then(res => {
            if (!res.ok) throw new Error("Proposal not found.");
            return res.json();
          })
          .then(data => {
            if (data.success && data.proposal) {
              setSharedProposal(data.proposal);
            } else {
              setSharedError("Could not retrieve proposal blueprints.");
            }
          })
          .catch(err => {
            console.error(err);
            setSharedError("This strategy proposal does not exist or has expired.");
          })
          .finally(() => {
            setIsLoadingShared(false);
          });
      }
    }
  }, []);

  // Load and initial triggers
  useEffect(() => {
    // Populate an elegant default item in cart on load
    const defaultService = INITIAL_SERVICES[0];
    const initialItem: CartItem = {
      serviceId: defaultService.id,
      name: defaultService.name,
      category: defaultService.category,
      monthlyPriceAED: defaultService.monthlyPriceAED,
      monthlyPriceSAR: defaultService.monthlyPriceSAR,
      monthlyPriceUSD: defaultService.monthlyPriceUSD,
      quantity: 1,
      durationMonths: 3,
      customNotes: "Empowering Brand Growth in Riyadh. Custom SWOT and competitive analysis setup.",
      selectedAddons: ["addon-manager"]
    };
    setCart([initialItem]);

    // Preselect dynamic properties on start
    setSelectedService(defaultService);
    setDurationMonths(3);
    setClientBrandName("Brandoora GCC");
    setClientBrandEthos("High-fidelity creative growth agency.");
    setSelectedAddons(["addon-manager"]);
    setCustomScopeNarrative("A highly optimized editorial plan focusing on SWOT insights & local consumer behaviors.");

    // Load saved historical layouts from localStorage
    try {
      const stored = localStorage.getItem("brandoora_ledger_orders");
      if (stored) {
        setSavedOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed loading local ledger orders", e);
    }
  }, []);

  // Sync temp variables when selected service transitions
  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedAddons([]);
    setDurationMonths(3);
    setCustomScopeNarrative(
      lang === "en"
        ? `Professional retainer deployment for ${service.name}. Engineered with direct GCC market checkpoints.`
        : `تفعيل مخصص لعقد خدمات لـ ${getServiceTranslation(service.id, "name") || service.name}. مصمم مع نقاط تدقيق مباشرة متوافقة مع السوق الخليجي المشترك.`
    );
    showToast(
      lang === "en"
        ? `Loaded ${service.name} template`
        : `تم تحميل باقة ${getServiceTranslation(service.id, "name") || service.name}`,
      "info"
    );
  };

  // Helper Toast Alerts
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Live Currency Symbol Selector
  const getCurrencySymbol = () => {
    if (currency === "AED") return lang === "ar" ? "د.إ" : "AED";
    if (currency === "SAR") return lang === "ar" ? "ر.س" : "SAR";
    if (currency === "EGP") return lang === "ar" ? "ج.م" : "EGP";
    return "$";
  };

  // Tax Rate by Currency Center (UAE 5%, KSA 15%, Egypt 14%, USD 0% tax model)
  const getTaxRate = () => {
    if (currency === "AED") return 5;
    if (currency === "SAR") return 15;
    if (currency === "EGP") return 14;
    return 0; // Tax-free global USD terminal
  };

  // Dynamic Service base price selection helper
  const getServicePrice = (item: ServiceItem) => {
    if (currency === "AED") return item.monthlyPriceAED;
    if (currency === "SAR") return item.monthlyPriceSAR;
    if (currency === "EGP") return Math.round(item.monthlyPriceUSD * 48);
    return item.monthlyPriceUSD;
  };

  // Dynamic addon pricing getter
  const getAddonCost = (addonId: string) => {
    const addon = addonsOptions.find(a => a.id === addonId);
    if (!addon) return 0;
    if (currency === "AED") return addon.monthlyAED;
    if (currency === "SAR") return addon.monthlySAR;
    if (currency === "EGP") return Math.round(addon.monthlyUSD * 48);
    return addon.monthlyUSD;
  };

  // Calculate dynamic price of a single Cart Item with its months, add-ons and discounts
  const calculateSingleCartItemCost = (item: CartItem) => {
    // Find base service
    const baseServiceObj = INITIAL_SERVICES.find(s => s.id === item.serviceId);
    if (!baseServiceObj) return 0;

    let baseMonthlyPrice = 0;
    if (currency === "AED") baseMonthlyPrice = baseServiceObj.monthlyPriceAED;
    else if (currency === "SAR") baseMonthlyPrice = baseServiceObj.monthlyPriceSAR;
    else if (currency === "EGP") baseMonthlyPrice = Math.round(baseServiceObj.monthlyPriceUSD * 48);
    else baseMonthlyPrice = baseServiceObj.monthlyPriceUSD;

    let addonsMonthlySum = 0;
    if (item.selectedAddons) {
      item.selectedAddons.forEach(addonId => {
        const addon = addonsOptions.find(a => a.id === addonId);
        if (addon) {
          if (currency === "AED") addonsMonthlySum += addon.monthlyAED;
          else if (currency === "SAR") addonsMonthlySum += addon.monthlySAR;
          else if (currency === "EGP") addonsMonthlySum += Math.round(addon.monthlyUSD * 48);
          else addonsMonthlySum += addon.monthlyUSD;
        }
      });
    }

    if (baseServiceObj.isOneTime) {
      return baseMonthlyPrice + addonsMonthlySum;
    }

    const rawTotalMultiplier = (baseMonthlyPrice + addonsMonthlySum) * item.durationMonths;
    const rule = durationDiscountRules.find(r => r.months === item.durationMonths) || { discountPct: 0 };
    const discountAmount = Math.round((rawTotalMultiplier * rule.discountPct) / 100);

    return rawTotalMultiplier - discountAmount;
  };

  // Filter services by search query & category selection
  const filteredServices = useMemo(() => {
    return INITIAL_SERVICES.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // Calculations summary for items currently in cart
  const financeSummary = useMemo(() => {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += calculateSingleCartItemCost(item) * item.quantity;
    });

    const taxPct = getTaxRate();
    const taxAmount = Math.round((subtotal * taxPct) / 100);
    const total = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      total
    };
  }, [cart, currency, addonsOptions]);

  // Invoking server-side Google Gemini API to write beautiful custom retainer narratives
  const handleAiTailorRetainer = async () => {
    if (!selectedService) return;
    if (!clientBrandName.trim()) {
      showToast(
        lang === "en"
          ? "Please provide your Brand or Company name."
          : "يرجى تزويدنا باسم العلامة التجارية أو اسم الشركة.",
        "error"
      );
      return;
    }

    setAiGenerating(true);
    showToast(
      lang === "en"
        ? "Gemini Creative Director is structuring your campaign proposal..."
        : "يقوم المدير الإبداعي لـ Gemini بصياغة وهيكلة نطاق العمل المخصص...",
      "info"
    );

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: selectedService.name,
          clientName: clientBrandName,
          industryInstructions: clientBrandEthos || (lang === "en" ? "Establish premium Gulf market authority, utilizing standard cultural alignment templates" : "ترسيخ ريادة فاخرة ومكانة مرموقة في السوق الخليجي بالاعتماد على التوافق الثقافي المتميز"),
          currentDeliverables: selectedService.features.slice(0, 3).join(", "),
          lang: lang
        })
      });

      const data = await response.json();
      if (data.success && data.rewritten) {
        setCustomScopeNarrative(data.rewritten);
        showToast(
          lang === "en"
            ? "Bespoke agency retainer scope formatted!"
            : "تم تنسيق نطاق العمل المخصص للوكالة بنجاح!",
          "success"
        );
      } else {
        throw new Error(data.error || "Simulated tailored outcome generated.");
      }
    } catch (err: any) {
      console.warn("Using smart client styling model for backup:", err);
      // Premium interactive backup template
      const descText = lang === "en"
        ? `Bespoke localized campaign crafted exclusively for ${clientBrandName}. Integrating targeted GCC influencer frameworks, complete competitor benchmarking maps, SWOT optimization pipelines, and high-engagement media guidelines specifically tuned for ${clientBrandEthos || "premium Gulf market presence"}.`
        : `حملة تسويقية محلية مخصصة تم تصميمها خصيصاً لصالح ${clientBrandName}. تشتمل على أطر عمل مستهدفة للمؤثرين بدول مجلس التعاون الخليجي، وخرائط مقارنة مرجعية شاملة للمنافسين، وقنوات تحسين مرنة، وتوجيهات تواصل رقمي عالية التأثير مضبوطة لـ ${clientBrandEthos || "حضور وحضور مرموق في السوق الخليجي"}.`;
      setCustomScopeNarrative(descText);
      showToast(
        lang === "en"
          ? "Bespoke local scope structured."
          : "تمت هيكلة نطاق العمل المحلي المخصص بنجاح.",
        "success"
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const isMultipleAllowed = (serviceId: string) => {
    return serviceId === "serv-motion-graphics" || serviceId === "serv-creative-design";
  };

  const triggerLimitError = (serviceId: string) => {
    const sObj = INITIAL_SERVICES.find(s => s.id === serviceId);
    if (!sObj) return;
    const isOneTime = !!sObj.isOneTime;
    const message = isOneTime
      ? `This is a premium, bespoke digital setup package (e.g. brand foundations, system configurations, or landing pages). A single business profile only requires one foundational setup of this type. To purchase additional graphic packages or video deliverables, please use the separate "Extra" content packages instead.`
      : `This is a comprehensive monthly channel retainer. A standard brand project or marketing campaign brief only requires one active retainer of this type to run effectively. For additional post/video deliverables, you can add our extra asset packages.`;
    
    setLimitErrorModal({
      isOpen: true,
      serviceName: sObj.name,
      isOneTime,
      message
    });
  };

  // Add service directly to cart immediately with default duration & no addons, with absolutely no side drawers or popups opening
  const handleDirectAddToCart = (service: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If multiple not allowed, check if ANY item with this serviceId is already in cart
    if (!isMultipleAllowed(service.id)) {
      const alreadyInCart = cart.some(item => item.serviceId === service.id);
      if (alreadyInCart) {
        triggerLimitError(service.id);
        return;
      }
    }
    
    const defaultDuration = service.isOneTime ? 1 : 3;

    // Check if item with exact same default configuration already exists
    const existsIndex = cart.findIndex(
      item => item.serviceId === service.id && 
              item.durationMonths === defaultDuration &&
              (!item.selectedAddons || item.selectedAddons.length === 0)
    );

    if (existsIndex > -1) {
      if (!isMultipleAllowed(service.id)) {
        triggerLimitError(service.id);
        return;
      }
      setCart(prev => prev.map((item, index) => {
        if (index === existsIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }));
      showToast(
        lang === "en"
          ? `Added another "${service.name}" to brief bag`
          : `تمت إضافة نسخة أخرى من "${getServiceTranslation(service.id, "name") || service.name}" إلى حقيبة العرض`,
        "success"
      );
    } else {
      const newItem: CartItem = {
        serviceId: service.id,
        name: service.name,
        category: service.category,
        monthlyPriceAED: service.monthlyPriceAED,
        monthlyPriceSAR: service.monthlyPriceSAR,
        monthlyPriceUSD: service.monthlyPriceUSD,
        quantity: 1,
        durationMonths: defaultDuration,
        customNotes: service.isOneTime 
          ? (lang === "en" ? `One-Time package setup for ${service.name}.` : `تهيئة وتفعيل لمرة واحدة لـ ${getServiceTranslation(service.id, "name") || service.name}.`)
          : (lang === "en" ? `Standard 3-Month package retainer for ${service.name}.` : `عقد شهري قياسي لمدة ٣ أشهر لـ ${getServiceTranslation(service.id, "name") || service.name}.`),
        selectedAddons: [],
        isOneTime: service.isOneTime
      };
      setCart(prev => [...prev, newItem]);
      showToast(
        lang === "en"
          ? `Added "${service.name}" to campaign brief bag!`
          : `تمت إضافة "${getServiceTranslation(service.id, "name") || service.name}" بنجاح إلى حقيبة العرض!`,
        "success"
      );
    }
  };

  // Add customized package to the Cart
  const handleAddCustomizedToCart = () => {
    if (!selectedService) return;

    // If multiple not allowed, check if ANY item with this serviceId is already in cart
    if (!isMultipleAllowed(selectedService.id)) {
      const alreadyInCart = cart.some(item => item.serviceId === selectedService.id);
      if (alreadyInCart) {
        triggerLimitError(selectedService.id);
        return;
      }
    }

    const actualDuration = selectedService.isOneTime ? 1 : durationMonths;

    // Check if item with exact same configuration already exists
    const existsIndex = cart.findIndex(
      item => item.serviceId === selectedService.id && 
              item.durationMonths === actualDuration &&
              JSON.stringify(item.selectedAddons?.sort()) === JSON.stringify([...selectedAddons].sort())
    );

    if (existsIndex > -1) {
      if (!isMultipleAllowed(selectedService.id)) {
        triggerLimitError(selectedService.id);
        return;
      }
      setCart(prev => prev.map((item, index) => {
        if (index === existsIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }));
      showToast(
        lang === "en"
          ? `Added another "${selectedService.name}" to cart`
          : `تمت إضافة نسخة أخرى من "${getServiceTranslation(selectedService.id, "name") || selectedService.name}" إلى العرض`,
        "success"
      );
    } else {
      const newItem: CartItem = {
        serviceId: selectedService.id,
        name: selectedService.name,
        category: selectedService.category,
        monthlyPriceAED: selectedService.monthlyPriceAED,
        monthlyPriceSAR: selectedService.monthlyPriceSAR,
        monthlyPriceUSD: selectedService.monthlyPriceUSD,
        quantity: 1,
        durationMonths: actualDuration,
        customNotes: customScopeNarrative || undefined,
        selectedAddons: [...selectedAddons],
        isOneTime: selectedService.isOneTime
      };
      setCart(prev => [...prev, newItem]);
      showToast(
        lang === "en"
          ? `Added customized "${selectedService.name}" to campaign brief`
          : `تم إضافة تصميم الخدمة المخصص لـ "${getServiceTranslation(selectedService.id, "name") || selectedService.name}" بنجاح!`,
        "success"
      );
    }
    // Quietly added, no drawers opened, matching user instructions!
  };

  // Quantity updates
  const updateCartQuantity = (id: string, duration: number, addonsStr: string, delta: number) => {
    if (delta > 0 && !isMultipleAllowed(id)) {
      triggerLimitError(id);
      return;
    }
    setCart(prev => prev.map(item => {
      const itemAddonsStr = JSON.stringify(item.selectedAddons?.sort() || []);
      if (item.serviceId === id && item.durationMonths === duration && itemAddonsStr === addonsStr) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  // Remove single config from cart
  const removeCartItem = (id: string, duration: number, addonsStr: string) => {
    setCart(prev => prev.filter(item => {
      const itemAddonsStr = JSON.stringify(item.selectedAddons?.sort() || []);
      return !(item.serviceId === id && item.durationMonths === duration && itemAddonsStr === addonsStr);
    }));
    showToast(
      lang === "en" ? "Removed package brief configuration" : "تمت إزالة تهيئة الباقة من حقيبة العرض",
      "info"
    );
  };

  // Toggle addon active state
  const handleToggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    } else {
      setSelectedAddons(prev => [...prev, addonId]);
    }
  };

  // Save Cart state to LEDGER database
  const handleSaveAsDraftOrder = () => {
    if (cart.length === 0) {
      showToast(
        lang === "en" ? "Cannot archive an empty campaign configuration" : "لا يمكن أرشفة باقة حملة فارغة",
        "error"
      );
      return;
    }

    const orderRecord: SavedOrder = {
      id: "PROPOSAL-BD-" + Date.now().toString().slice(-4),
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      customerName: customerName || (lang === "en" ? "Enterprise Client Desk" : "مكتب شركاء المؤسسات"),
      customerEmail: customerEmail || "partner@brandoora.net",
      currency,
      taxRate: getTaxRate(),
      items: JSON.parse(JSON.stringify(cart)),
      subtotal: financeSummary.subtotal,
      taxAmount: financeSummary.taxAmount,
      total: financeSummary.total,
      shippingAddress: companyDetails || (lang === "en" ? "GCC Advisory Desk Delivery" : "تسليم مكتب الهيئة الاستشارية الخليجية"),
      paymentMethod
    };

    const updated = [orderRecord, ...savedOrders];
    setSavedOrders(updated);
    localStorage.setItem("brandoora_ledger_orders", JSON.stringify(updated));
    
    // Sync proposal to backend API to enable shareable URL support
    fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRecord)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(
          lang === "en"
            ? "Strategy brief archived with active shareable cloud link!"
            : "تمت أرشفة مخطط الإستراتيجية بنجاح مع رابط مشاركة سحابي نشط!",
          "success"
        );
      } else {
        showToast(
          lang === "en" ? "Strategy brief archived in Brandoora Ledger!" : "تمت أرشفة مخطط الإستراتيجية بنجاح في سجلات براندورا!",
          "success"
        );
      }
    })
    .catch(err => {
      console.error("Cloud sync error:", err);
      showToast(
        lang === "en" ? "Strategy brief archived in Brandoora Ledger!" : "تمت أرشفة مخطط الإستراتيجية بنجاح في سجلات براندورا!",
        "success"
      );
    });
  };

  // Delete draft from Ledger
  const handleDeleteLedgerItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = confirm(
      lang === "en"
        ? "Permanently delete this archived strategy proposal blueprint?"
        : "هل أنت متأكد من رغبتك في حذف مخطط العرض الإستراتيجي المؤرشف هذا نهائياً؟"
    );
    if (confirmed) {
      const updated = savedOrders.filter(o => o.id !== id);
      setSavedOrders(updated);
      localStorage.setItem("brandoora_ledger_orders", JSON.stringify(updated));
      showToast(
        lang === "en" ? "Blueprint pruned from archives" : "تم حذف المخطط من السجلات المؤرشفة بنجاح",
        "info"
      );
    }
  };

  // Load blueprint from local ledger and display the final sharable offer directly
  const loadLedgerBlueprint = (order: SavedOrder) => {
    setLastReceipt(order);
    showToast(
      lang === "en"
        ? `Opening strategy proposal for ${order.customerName}`
        : `جاري فتح وثيقة العرض الإستراتيجي لـ ${order.customerName}`,
      "success"
    );
  };

  // Trigger Complete simulated purchase checkout receipts
  const handleCompletePaymentSimulated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      showToast(
        lang === "en"
          ? "Please fill in contact name and commercial email."
          : "يرجى ملء الاسم الكامل والبريد الإلكتروني المعتمد.",
        "error"
      );
      return;
    }

    // Dynamically calculate totals in target proposalCurrency if different from storefront
    let targetTaxRate = 0;
    if (proposalCurrency === "AED") targetTaxRate = 5;
    else if (proposalCurrency === "SAR") targetTaxRate = 15;
    else if (proposalCurrency === "EGP") targetTaxRate = 14;
    else targetTaxRate = 0;

    // Helper to calculate cost in selected target currency
    const calculateItemCostInProposalCurrency = (cartItem: CartItem) => {
      const baseServiceObj = INITIAL_SERVICES.find(s => s.id === cartItem.serviceId);
      if (!baseServiceObj) return 0;

      let baseMonthlyPrice = 0;
      if (proposalCurrency === "AED") baseMonthlyPrice = baseServiceObj.monthlyPriceAED;
      else if (proposalCurrency === "SAR") baseMonthlyPrice = baseServiceObj.monthlyPriceSAR;
      else if (proposalCurrency === "EGP") baseMonthlyPrice = Math.round(baseServiceObj.monthlyPriceUSD * 48);
      else baseMonthlyPrice = baseServiceObj.monthlyPriceUSD;

      let addonsMonthlySum = 0;
      if (cartItem.selectedAddons) {
        cartItem.selectedAddons.forEach(addonId => {
          const addon = addonsOptions.find(a => a.id === addonId);
          if (addon) {
            if (proposalCurrency === "AED") addonsMonthlySum += addon.monthlyAED;
            else if (proposalCurrency === "SAR") addonsMonthlySum += addon.monthlySAR;
            else if (proposalCurrency === "EGP") addonsMonthlySum += Math.round(addon.monthlyUSD * 48);
            else addonsMonthlySum += addon.monthlyUSD;
          }
        });
      }

      if (baseServiceObj.isOneTime) {
        return baseMonthlyPrice + addonsMonthlySum;
      }

      const rawTotalMultiplier = (baseMonthlyPrice + addonsMonthlySum) * cartItem.durationMonths;
      const rule = durationDiscountRules.find(r => r.months === cartItem.durationMonths) || { discountPct: 0 };
      const discountAmount = Math.round((rawTotalMultiplier * rule.discountPct) / 100);

      return rawTotalMultiplier - discountAmount;
    };

    // Calculate recalculated subtotal
    const recalculatedSubtotal = cart.reduce((sum, item) => {
      const singleCost = calculateItemCostInProposalCurrency(item);
      return sum + (singleCost * item.quantity);
    }, 0);

    const recalculatedTax = Math.round((recalculatedSubtotal * targetTaxRate) / 100);
    const recalculatedTotal = recalculatedSubtotal + recalculatedTax;

    const completedReceipt: SavedOrder = {
      id: "BD-PROPOSAL-2026-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleDateString(proposalLang === "ar" ? "ar-EG" : "en-US", {
        month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      customerName,
      customerEmail,
      currency: proposalCurrency,
      taxRate: targetTaxRate,
      items: JSON.parse(JSON.stringify(cart)),
      subtotal: recalculatedSubtotal,
      taxAmount: recalculatedTax,
      total: recalculatedTotal,
      shippingAddress: companyDetails || (proposalLang === "en" ? "GCC Private Headquarters Delivery" : "تسليم المقر الخاص لدول مجلس التعاون الخليجي"),
      paymentMethod,
      targetCountry: proposalCountry,
      targetLang: proposalLang
    };

    setLastReceipt(completedReceipt);
    
    // Auto-archive completed orders into ledger vault
    const updated = [completedReceipt, ...savedOrders];
    setSavedOrders(updated);
    localStorage.setItem("brandoora_ledger_orders", JSON.stringify(updated));

    // Clear active cart & state
    setCart([]);
    setCheckoutModalOpen(false);

    // Sync generated proposal to cloud server
    fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(completedReceipt)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(
          lang === "en"
            ? "Strategic Proposal Generated, Certified & Published!"
            : "تم إنشاء وتوثيق ونشر وثيقة العرض الإستراتيجي بنجاح!",
          "success"
        );
      } else {
        showToast(
          lang === "en"
            ? "Strategic Proposal Generated & Certified!"
            : "تم إنشاء وتوثيق العرض الإستراتيجي بنجاح!",
          "success"
        );
      }
    })
    .catch(err => {
      console.error("Cloud publishing error:", err);
      showToast(
        lang === "en"
          ? "Strategic Proposal Generated & Certified!"
          : "تم إنشاء وتوثيق العرض الإستراتيجي بنجاح!",
        "success"
      );
    });
  };

  // Format Helper for currency digits
  const formatValue = (num: number) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Selected Monthly discount rate
  const activeDiscountRate = useMemo(() => {
    const rule = durationDiscountRules.find(r => r.months === durationMonths);
    return rule ? rule.discountPct : 0;
  }, [durationMonths, durationDiscountRules]);

  if (sharedProposalId) {
    if (isLoadingShared) {
      return (
        <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-700 mb-4" />
          <p className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
            Verifying Signature & Retrieving Proposal...
          </p>
        </div>
      );
    }

    if (sharedError || !sharedProposal) {
      return (
        <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertCircle size={40} className="text-red-500 animate-pulse" />
          <h2 className="text-lg font-black uppercase font-sans tracking-wide">
            PROPOSAL NOT DEPLOYED OR EXPIRED
          </h2>
          <p className="text-sm text-slate-500 max-w-md font-medium leading-relaxed">
            {sharedError || "This strategy proposal link does not exist, or it has expired on our secure creative servers."}
          </p>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-2 py-3 px-6 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Go to Co-Creation Desk
          </button>
        </div>
      );
    }

    return (
      <BrandedProposal 
        proposal={sharedProposal} 
        isSharedView={true} 
        onExploreStudio={() => {
          window.location.href = "/";
        }}
        defaultLang={lang}
      />
    );
  }

  return (
    <div id="brandoora-products-app" className="min-h-screen bg-[#FBF9F4] text-[#0f172a] font-sans selection:bg-[#EEDBC5]" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Dynamic Toast Feedback overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-xl text-sm font-bold ${
              toast.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                : toast.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : "bg-indigo-50 border-indigo-200 text-indigo-950"
            }`}
          >
            {toast.type === "success" && <Check size={16} className="text-emerald-700 shrink-0" />}
            {toast.type === "error" && <AlertCircle size={16} className="text-rose-700 shrink-0" />}
            {toast.type === "info" && <Award size={16} className="text-indigo-700 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High-End Styling Navigation Header with Saudi & Dubai Office references */}
      <header className="h-auto py-5 md:py-0 md:h-24 px-6 md:px-12 border-b border-[#EDE9DF] bg-white/95 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center justify-between w-full md:w-auto gap-8">
          <div 
            onClick={() => setActiveTab("storefront")}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Brandora Co-Creation Desk"
          >
            <BrandoraLogo size={85} theme="light" className="group-hover:scale-105 transition-all duration-300" />
            <div className="flex flex-col text-start">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#8B5CF6] font-black uppercase transition-transform group-hover:translate-x-1">
                {t.studioTitle}
              </span>
            </div>
          </div>

          {/* Quick Tab Selectors */}
          <nav className="flex items-center gap-2 bg-[#f4f1ea] p-1 rounded-full border border-[#ede9df]">
            <button
              onClick={() => setActiveTab("storefront")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "storefront" 
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {lang === "en" ? "Services" : "الخدمات المتاحة"}
            </button>
            <button
              onClick={() => {
                setActiveTab("ledger");
                setIsCartOpen(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "ledger" 
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {lang === "en" ? "Ledger Vault" : "العروض المؤرشفة"} ({savedOrders.length})
            </button>
          </nav>
        </div>

        {/* Dynamic Global Customizers: Currency Terminal */}
        <div className="flex items-center flex-wrap gap-4 w-full md:w-auto justify-end">
          
          {/* High-visibility Language Switcher Button */}
          <button
            onClick={() => {
              setLang(lang === "en" ? "ar" : "en");
              showToast(lang === "en" ? "تم تحويل النظام إلى اللغة العربية" : "System switched to English", "success");
            }}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#8B5CF6] rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-2xs"
            title="Toggle Language / تبديل اللغة"
          >
            <Globe size={13} className="animate-pulse" />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>

          <div className="flex items-center gap-2 bg-[#f4f1ea] border border-[#ede9df] p-1 rounded-full">
            <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold pl-3 pr-1">{t.currencyLabel}</span>
            {([
              { key: "AED", label: "AED (UAE)" },
              { key: "SAR", label: "SAR (KSA)" },
              { key: "EGP", label: "EGP (Egypt)" },
              { key: "USD", label: "USD ($ Global)" }
            ] as const).map((curr) => (
              <button
                key={curr.key}
                onClick={() => {
                  setCurrency(curr.key);
                  showToast(`Rates updated to ${curr.key}`, "info");
                }}
                className={`px-3 py-1 text-xs font-black font-mono rounded-full transition-all cursor-pointer ${
                  currency === curr.key 
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-[#ede9df]"
                }`}
                title={curr.label}
              >
                {curr.key}
              </button>
            ))}
          </div>

          {/* Checkout Bag Counter Slide Button */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#D946EF] text-white rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag size={14} className="text-fuchsia-400 animate-pulse" />
            <span>{t.briefBag}</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </button>
        </div>
      </header>

      {/* Main Container Studio Layout */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-10 py-8">
        
        {activeTab === "storefront" ? (
          activeServicePage ? (
            <div className="space-y-8 animate-fade-in">
              
              {/* Back navigation button */}
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#EDE9DF]">
                <button
                  onClick={() => {
                    setActiveServicePage(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <ArrowLeft size={14} className="text-amber-300" />
                  <span>{lang === "en" ? "Back to All Brandoora Services" : "العودة إلى جميع الخدمات"}</span>
                </button>
                
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider hidden sm:inline-block font-bold">
                  {lang === "en" ? "Bespoke Service Charter & Digital Explainer" : "ميثاق الخدمة المخصصة والشارح الرقمي"}
                </span>
              </div>

              {/* Dedicated Service Page Editorial Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: In-depth Explanations, Taglines and Deliverables */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Luxury Cover Header Block */}
                  <div className="relative min-h-[300px] md:min-h-[360px] rounded-[32px] overflow-hidden border border-slate-200 shadow-lg flex flex-col justify-end p-8 text-start">
                    <img 
                      src={activeServicePage.image} 
                      alt={activeServicePage.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="relative space-y-3 z-10">
                      <span className="text-[10px] font-mono bg-violet-600 text-white px-3.5 py-1.5 rounded-full uppercase font-black tracking-widest inline-block">
                        {getCategoryTranslation(activeServicePage.category)}
                      </span>
                      <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                        {getServiceTranslation(activeServicePage.id, "name")}
                      </h1>
                      <p className="text-sm md:text-base text-slate-200 font-sans font-medium max-w-2xl leading-relaxed">
                        {getServiceTranslation(activeServicePage.id, "tagline")}
                      </p>
                    </div>
                  </div>

                  {/* Complete In-depth Written Explanations */}
                  <div className="bg-white rounded-[24px] border border-[#EDE9DF] p-6 md:p-8 space-y-6 text-start">
                    
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-700 font-bold uppercase tracking-wider">
                        <Award size={14} />
                        <span>{lang === "en" ? "Service Explanation" : "شرح وتفاصيل الخدمة"}</span>
                      </div>
                      <div className="text-slate-600 text-xs md:text-sm leading-relaxed font-sans font-medium">
                        <p>
                          {getServiceTranslation(activeServicePage.id, "description")}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#EDE9DF] pt-6 space-y-3">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-700 font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} />
                        <span>{lang === "en" ? "Scope & Deliverables" : "نطاق العمل والتسليمات"}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {getServiceFeaturesTranslation(activeServicePage.id, activeServicePage.features).map((feat, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-2.5 bg-[#FAF9F6] p-3 rounded-xl border border-[#EDE9DF] transition-all"
                          >
                            <span className="p-0.5 bg-emerald-100 text-emerald-800 rounded-md shrink-0 mt-0.5">
                              <CheckCircle size={12} strokeWidth={2.5} />
                            </span>
                            <p className="text-xs font-bold text-[#0f172a] font-sans leading-tight">{feat}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#EDE9DF] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF9F6] -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 rounded-b-[24px]">
                      <div className="text-start space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                          {activeServicePage.isOneTime ? (lang === "en" ? "One-Time Setup Rate:" : "رسوم التأسيس لمرة واحدة:") : (lang === "en" ? "Standard Retainer Rate:" : "قيمة الاشتراك الشهري:")}
                        </span>
                        <div className="text-base md:text-lg font-mono font-black text-slate-900">
                          {getCurrencySymbol()} {formatValue(getServicePrice(activeServicePage))} {!activeServicePage.isOneTime && <span className="text-xs font-normal text-slate-400 font-sans">{lang === "en" ? "/mo" : "/شهرياً"}</span>}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDirectAddToCart(activeServicePage, e)}
                        className="py-2.5 px-5 bg-[#6d28d9] hover:bg-violet-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={14} className="text-amber-300" />
                        <span>{activeServicePage.isOneTime ? (lang === "en" ? "Add to Brief Bag" : "إضافة إلى حقيبة العرض") : (lang === "en" ? "Add standard package" : "إضافة الباقة القياسية")}</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* RIGHT SIDE: Customized Retainer Planner Scoped to this service */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="bg-white rounded-[24px] border-2 border-violet-600/30 p-6 md:p-8 shadow-sm space-y-6 text-start">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between pb-4 border-b border-[#EDE9DF]">
                      <div className="space-y-1">
                        <div className="text-[9px] font-mono font-black text-violet-700 uppercase tracking-widest block">
                          {lang === "en" ? "Bespoke Partner Desk" : "مكتب الشريك المخصص"}
                        </div>
                        <h3 className="font-display font-black text-[#0f172a] text-base md:text-lg uppercase leading-tight">
                          {lang === "en" ? `Tailor Your ${activeServicePage.name}` : `تخصيص وتهيئة ${getServiceTranslation(activeServicePage.id, "name")}`}
                        </h3>
                      </div>
                      <span className="p-2 border border-violet-100 rounded-xl text-violet-700 bg-violet-50">
                        <Sparkles size={16} />
                      </span>
                    </div>

                    {/* Choose months section - hidden for one-time setups */}
                    {!activeServicePage.isOneTime && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono text-[#475569] block font-bold uppercase tracking-wider">
                            {lang === "en" ? "Choose Package Duration" : "اختر مدة التعاقد والخدمة"}
                          </label>
                          {(() => {
                            const rule = durationDiscountRules.find(r => r.months === durationMonths) || { discountPct: 0 };
                            return (
                              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                {rule.discountPct > 0 ? (lang === "en" ? `Loyalty Discount: ${rule.discountPct}% Off` : `خصم الولاء: ${rule.discountPct}% خصم`) : (lang === "en" ? "No Commitment contract" : "عقد مرن بدون التزام")}
                              </span>
                            );
                          })()}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {durationDiscountRules.map((rule) => (
                            <button
                              key={rule.months}
                              onClick={() => {
                                setDurationMonths(rule.months);
                                showToast(`Configured for ${rule.months} Months Retainer`, "info");
                              }}
                              className={`py-2.5 px-2 border rounded-xl text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
                                durationMonths === rule.months 
                                  ? "border-violet-600 bg-violet-50/50 text-violet-950 font-black ring-1 ring-violet-500/20" 
                                  : "border-[#EDE9DF] hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <span className="text-base font-black font-mono block leading-none">{rule.months}</span>
                              <span className="text-[9px] font-mono font-semibold text-slate-400 block uppercase tracking-tighter">
                                {lang === "en" ? "Months" : "أشهر"}
                              </span>
                              <span className="text-[8px] font-bold block truncate max-w-full text-violet-700 uppercase">
                                {getDurationLabelTranslation(rule.label)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Add-ons Checkboxes */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono text-[#475569] block font-bold uppercase tracking-wider">
                        {lang === "en" ? "Tailored Add-on Solutions (Optional)" : "الحلول والخيارات الإضافية المخصصة (اختياري)"}
                      </label>
                      <div className="space-y-2">
                        {addonsOptions.map((add) => {
                          const isActive = selectedAddons.includes(add.id);
                          const cost = getAddonCost(add.id);

                          return (
                            <div 
                              key={add.id}
                              onClick={() => handleToggleAddon(add.id)}
                              className={`p-3 rounded-xl border text-start cursor-pointer transition-all flex items-start gap-3 select-none ${
                                isActive 
                                  ? "border-violet-500 bg-violet-50/20" 
                                  : "border-slate-200 hover:border-slate-350"
                              }`}
                            >
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isActive ? "bg-violet-700 border-violet-700 text-white" : "border-slate-300 text-white"
                              }`}>
                                <Check size={12} strokeWidth={3} className={isActive ? "block" : "hidden"} />
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex justify-between items-center gap-2">
                                  <h5 className="font-extrabold text-xs text-slate-900 truncate">{getAddonTranslation(add.id, "name")}</h5>
                                  <span className="font-mono text-xs text-slate-900 font-bold shrink-0">
                                    +{getCurrencySymbol()} {formatValue(cost)} <span className="text-[9px] text-[#64748b] font-normal">{activeServicePage.isOneTime ? (lang === "en" ? "one-time" : "مرة واحدة") : (lang === "en" ? "/mo" : "/شهرياً")}</span>
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{getAddonTranslation(add.id, "description")}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cost breakdown */}
                    {(() => {
                      const basePrice = getServicePrice(activeServicePage);
                      const addonsCost = selectedAddons.reduce((acc, curr) => acc + getAddonCost(curr), 0);
                      const rule = activeServicePage.isOneTime ? { discountPct: 0 } : (durationDiscountRules.find(r => r.months === durationMonths) || { discountPct: 0 });
                      const rawBaseTotal = activeServicePage.isOneTime ? (basePrice + addonsCost) : (basePrice + addonsCost) * durationMonths;
                      
                      let discountAmount = 0;
                      if (!activeServicePage.isOneTime) {
                        const monthlyRaw = basePrice + addonsCost;
                        discountAmount = Math.round((monthlyRaw * rule.discountPct) / 100) * durationMonths;
                      }
                      
                      const finalTotal = rawBaseTotal - discountAmount;

                      return (
                        <div className="p-4 bg-[#FAF9F6] border border-[#EDE9DF] rounded-xl space-y-2 text-xs font-mono">
                          <div className="flex justify-between text-slate-500">
                            <span>{activeServicePage.isOneTime ? (lang === "en" ? "BASE SETUP RATE:" : "رسوم التأسيس الأساسية:") : (lang === "en" ? "BASE RETAINER:" : "الاشتراك الشهري الأساسي:")}</span>
                            <span>{getCurrencySymbol()} {formatValue(basePrice)}{activeServicePage.isOneTime ? "" : (lang === "en" ? "/mo" : "/شهرياً")}</span>
                          </div>
                          {addonsCost > 0 && (
                            <div className="flex justify-between text-slate-500">
                              <span>{lang === "en" ? "ADDONS SELECTED:" : "الحلول الإضافية المختارة:"}</span>
                              <span>+{getCurrencySymbol()} {formatValue(addonsCost)}{activeServicePage.isOneTime ? "" : (lang === "en" ? "/mo" : "/شهرياً")}</span>
                            </div>
                          )}
                          {!activeServicePage.isOneTime && rule.discountPct > 0 && (
                            <div className="flex justify-between text-emerald-600">
                              <span>{lang === "en" ? "LOYALTY DISCOUNT:" : "خصم الولاء للعملاء:"}</span>
                              <span>-{rule.discountPct}%</span>
                            </div>
                          )}
                          {!activeServicePage.isOneTime && (
                            <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-xs">
                              <span>{lang === "en" ? "ESTIMATED /MO RATE:" : "المعدل الشهري المتوقع:"}</span>
                              <span>{getCurrencySymbol()} {formatValue(Math.round(finalTotal / durationMonths))}{lang === "en" ? "/mo" : "/شهرياً"}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-violet-700 text-sm border-t border-dashed border-slate-200 pt-1.5">
                            <span>{activeServicePage.isOneTime ? (lang === "en" ? "TOTAL CONTRACT VALUE:" : "إجمالي القيمة التأسيسية للملف:") : (lang === "en" ? "TOTAL RETAINER VALUE:" : "القيمة الإجمالية للعقد:")}</span>
                            <span>{getCurrencySymbol()} {formatValue(finalTotal)}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Add To Cart immediately */}
                    <button
                      onClick={handleAddCustomizedToCart}
                      className="w-full py-4 px-6 bg-[#6d28d9] hover:bg-violet-800 text-white font-display font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus size={14} className="text-amber-300" />
                      <span>{activeServicePage.isOneTime ? (lang === "en" ? "Add contract to brief bag" : "إضافة الهوية المصممة إلى حقيبة العرض") : (lang === "en" ? "Add customized retainer to campaign bag" : "تأكيد وإدراج الباقة المخصصة في الملف")}</span>
                    </button>

                  </div>

                  {/* Sister recommendations sidebar */}
                  <div className="bg-[#FAF9F6] border border-[#EDE9DF] rounded-2xl p-6 text-start space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">{lang === "en" ? "Recommended Sister Specialties" : "تخصصات إبداعية مقترحة للعلامة"}</h4>
                    <div className="space-y-3">
                      {INITIAL_SERVICES.filter(s => s.id !== activeServicePage.id).slice(0, 2).map((sister) => (
                        <div 
                          key={sister.id}
                          onClick={() => {
                            setActiveServicePage(sister);
                            handleSelectService(sister);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="flex gap-3 items-center p-2.5 rounded-xl bg-white border border-[#EDE9DF] hover:border-violet-500/30 transition-all cursor-pointer group"
                        >
                          <img src={sister.image} alt={sister.name} className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-mono text-violet-700 uppercase font-black">{getCategoryTranslation(sister.category)}</span>
                            <h5 className="text-xs font-black uppercase text-slate-900 group-hover:text-violet-700 transition-colors truncate">{getServiceTranslation(sister.id, "name")}</h5>
                          </div>
                          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="space-y-8">
            
            {/* Elegant Amethyst Custom Header inspired by Page 1-4 of PDF */}
            <div className="relative overflow-hidden bg-gradient-to-tr from-[#120024] via-[#1f013d] to-[#04000a] text-white rounded-3xl p-8 md:p-10 shadow-lg border border-violet-900/30 text-start">
              <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full"></div>
              
              <div className="relative max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">
                  {lang === "en" ? "Bespoke GCC Creative Strategy" : "الإستراتيجية الإبداعية المخصصة لدول الخليج"}
                </h1>
              </div>
            </div>            {/* Store Catalog and Categories */}
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* Search and Category Filters */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-3 rounded-2xl border border-[#EDE9DF]">
                <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {["All", "Social Media & Video", "Brand & Identity", "Web & Technology", "Growth & Strategy"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? "bg-[#6d28d9] text-white shadow-sm" 
                          : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#eae6db]/40"
                      }`}
                    >
                      {getCategoryTranslation(cat)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={`w-full md:w-60 py-2 bg-[#FBF9F4] border border-[#EDE9DF] rounded-xl text-xs focus:outline-none focus:border-[#6d28d9] font-sans ${
                      lang === "ar" ? "pr-9 pl-4 text-right" : "pl-9 pr-4 text-left"
                    }`}
                  />
                  <Search className={`w-3.5 h-3.5 absolute top-3 text-[#cbd5e1] ${lang === "ar" ? "right-3" : "left-3"}`} />
                </div>
              </div>

              {/* Elegant E-commerce Service Grid in 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const monthlyBasePrice = getServicePrice(service);
                  const cartItem = cart.find(
                    item => item.serviceId === service.id
                  );

                  return (
                    <div 
                      key={service.id}
                      className="p-5 rounded-2xl bg-white border border-[#EDE9DF] hover:border-violet-500/30 hover:shadow-md transition-all text-start flex flex-col justify-between group relative"
                    >
                      <div className="space-y-4">
                        {/* Image Wrapper */}
                        <div className="relative aspect-3/2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-bold tracking-wide uppercase bg-slate-900/90 backdrop-blur-xs text-white px-2.5 py-1 rounded">
                              {getCategoryTranslation(service.category)}
                            </span>
                          </div>
                        </div>

                        {/* Titles */}
                        <div>
                          <h3 className="font-display font-black text-sm uppercase text-[#0f172a] block tracking-tight line-clamp-1 group-hover:text-violet-700 transition-colors">
                            {getServiceTranslation(service.id, "name")}
                          </h3>
                        </div>
                      </div>

                      <div className={`mt-4 pt-3 border-t border-[#EDE9DF] flex items-center justify-between gap-2 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className="font-mono text-start">
                          {service.isOneTime ? (
                            <>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
                                {lang === "en" ? "One-Time Fee" : "رسوم لمرة واحدة"}
                              </span>
                              <span className="text-lg font-black text-violet-700">{getCurrencySymbol()} {formatValue(monthlyBasePrice)}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">
                                {lang === "en" ? "Monthly" : "شهرياً"}
                              </span>
                              <span className="text-lg font-black text-violet-700">
                                {getCurrencySymbol()} {formatValue(monthlyBasePrice)}
                                <span className="font-sans text-[10px] font-semibold text-slate-400 ml-0.5">
                                  {lang === "en" ? "/mo" : "/شهرياً"}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectService(service);
                              setActiveServicePage(service);
                            }}
                            className="p-2 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            title={lang === "en" ? "Open dedicated page & explanation" : "فتح الصفحة المخصصة والشرح"}
                          >
                            <Eye size={12} />
                            <span>{lang === "en" ? "Details" : "التفاصيل"}</span>
                          </button>
                          
                          {cartItem ? (
                            isMultipleAllowed(service.id) ? (
                              <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#EDE9DF] p-0.5 rounded-xl">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const itemAddonsStr = JSON.stringify(cartItem.selectedAddons || []);
                                    updateCartQuantity(service.id, cartItem.durationMonths, itemAddonsStr, -1);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-white border border-[#ede9df] hover:border-violet-500 rounded-lg text-xs cursor-pointer text-slate-600 transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="font-mono text-center min-w-[14px] text-[11px] font-bold text-slate-800">{cartItem.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const itemAddonsStr = JSON.stringify(cartItem.selectedAddons || []);
                                    updateCartQuantity(service.id, cartItem.durationMonths, itemAddonsStr, 1);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-white border border-[#ede9df] hover:border-violet-500 rounded-lg text-xs cursor-pointer text-slate-600 transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const itemAddonsStr = JSON.stringify(cartItem.selectedAddons || []);
                                  removeCartItem(service.id, cartItem.durationMonths, itemAddonsStr);
                                }}
                                className="p-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                title={lang === "en" ? "Remove from brief bag" : "إزالة من حقيبة العرض"}
                              >
                                <Check size={11} strokeWidth={3} />
                                <span>{lang === "en" ? "Added" : "تمت الإضافة"}</span>
                              </button>
                            )
                          ) : (
                            <button
                              onClick={(e) => handleDirectAddToCart(service, e)}
                              className="p-2 px-3 bg-violet-700 hover:bg-violet-800 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                              title={lang === "en" ? "Add directly to brief bag" : "إضافة مباشرة لحقيبة العرض"}
                            >
                              <Plus size={12} />
                              <span>{lang === "en" ? "Add" : "إضافة"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
          )
        ) : (
          /* SECTION LEDGER: Archives database vault of orders */
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-8">
              <span className="text-[10px] font-mono bg-[#EEDBC5] text-amber-950 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {lang === "en" ? "Brandoora Ledgers & Archives" : "سجلات وأرشيفات براندورا"}
              </span>
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-950 uppercase">
                {lang === "en" ? "Active Client Retainer Vault" : "خزنة عقود العملاء النشطة"}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-sans font-medium font-arabic">
                {lang === "en" 
                  ? "Review, load, or print past customized campaign retainer blueprints and commercial summaries. Blueprints are stored securely for continuous client coordination."
                  : "مراجعة أو تحميل أو طباعة مخططات عقود الحملات المخصصة السابقة والملخصات التجارية. يتم تخزين المخططات بشكل آمن للتنسيق المستمر مع العملاء."}
              </p>
            </div>

            {savedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EDE9DF] p-12 text-center text-slate-400 max-w-lg mx-auto">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-[#0f172a] text-sm uppercase mb-1">{t.noBlueprints}</h4>
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">{t.createConfigPrompt}</p>
                <button
                  onClick={() => setActiveTab("storefront")}
                  className="px-5 py-2 bg-[#6d28d9] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-violet-800 cursor-pointer"
                >
                  {lang === "en" ? "Configure Services Retainers" : "تهيئة وتخصيص عقود الخدمات"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {savedOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => loadLedgerBlueprint(order)}
                    className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-[#8B5CF6] transition-all cursor-pointer relative flex flex-col justify-between text-start group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-purple-50 text-[#8B5CF6] border border-purple-100 font-mono text-[9px] uppercase font-black px-2.5 py-0.5 rounded">
                          {order.id}
                        </span>
                        <button
                          onClick={(e) => handleDeleteLedgerItem(order.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-full"
                          title={lang === "en" ? "Purge record" : "حذف السجل نهائياً"}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm uppercase font-sans tracking-tight">
                        {order.customerName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5 block">
                        {order.timestamp}
                      </p>

                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#8B5CF6] font-bold uppercase tracking-wider">
                          <Award size={12} />
                          <span>{lang === "en" ? "DIGITAL STRATEGY DELIVERABLE" : "مخرجات الإستراتيجية الرقمية"}</span>
                        </div>
                        <div className="p-3.5 bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border border-purple-100/60 rounded-xl space-y-1">
                          <div className="text-[10px] text-slate-500 font-medium">
                            {lang === "en" ? "Prepared for:" : "معد لصالح:"}
                          </div>
                          <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{order.customerEmail}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-600 font-black uppercase">
                          <ShieldCheck size={12} />
                          <span>{lang === "en" ? "CERTIFIED GCC RETAINER" : "عقد معتمد لدول مجلس التعاون"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-start">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">{t.totalInvestment}</span>
                        <div className="text-sm font-black text-[#8B5CF6] font-mono leading-none mt-0.5">
                          {order.currency} {formatValue(order.total)}
                        </div>
                      </div>
                      <button 
                        className="py-2 px-3.5 bg-[#8B5CF6] hover:bg-[#D946EF] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadLedgerBlueprint(order);
                        }}
                      >
                        <Eye size={12} strokeWidth={2.5} />
                        <span>{t.viewStrategyOffer}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </main>

      {/* Dynamic Slide-in Shopping Bag Brief Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
            
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-white border-l border-[#EDE9DF]"
              >
                <div className="h-full flex flex-col justify-between shadow-2xl text-start">
                  
                  {/* Cart Header */}
                  <div className="px-6 py-5 border-b border-[#EDE9DF] bg-[#FAF9F6] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="text-violet-750 text-violet-700 animate-bounce" size={16} />
                      <h3 className="font-display font-black text-[#0f172a] text-sm uppercase tracking-wide">
                        {lang === "en" ? "My Strategy Brief Bag" : "حقيبة العرض الإستراتيجي الخاصة بي"}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-1.5 text-slate-450 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Cart Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="py-20 text-center space-y-3">
                        <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
                        <h5 className="font-bold text-[#0f172a] text-xs uppercase">
                          {lang === "en" ? "Your campaign bag is empty" : "حقيبة العرض الإستراتيجي فارغة"}
                        </h5>
                        <p className="text-2xs text-slate-450 font-sans leading-relaxed">
                          {lang === "en" 
                            ? "Select and co-create bespoke creative services retainers on the co-creation desk."
                            : "يرجى تحديد وتخصيص باقات الخدمات الإبداعية وحملات الخدمات في منصة الإنتاج المشترك لتفعيل العرض."}
                        </p>
                      </div>
                    ) : (
                      cart.map((item, idx) => {
                        const totalItemPrice = calculateSingleCartItemCost(item) * item.quantity;
                        const itemAddonsStr = JSON.stringify(item.selectedAddons?.sort() || []);
                        
                        return (
                          <div 
                            key={idx}
                            className="p-4 bg-[#FAF9F6] border border-[#EDE9DF] rounded-xl flex flex-col gap-3 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <h4 className="font-extrabold text-[14px] text-[#0f172a] uppercase leading-snug font-sans">
                                {getServiceTranslation(item.serviceId, "name") || item.name}
                              </h4>
                              <button
                                onClick={() => removeCartItem(item.serviceId, item.durationMonths, itemAddonsStr)}
                                className="text-slate-400 hover:text-red-500 p-1 shrink-0 transition-colors"
                                title={lang === "en" ? "Remove item" : "إزالة الخدمة"}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Pricing and Cart Quantities multipliers */}
                            <div className={`flex items-center justify-between pt-2 border-t border-slate-200/60 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                              <span className="font-mono text-[15px] font-black text-violet-700">
                                {getCurrencySymbol()} {formatValue(totalItemPrice)}
                              </span>

                              <div className="flex items-center gap-2 bg-white border border-[#EDE9DF] p-0.5 rounded-lg">
                                <button
                                  onClick={() => updateCartQuantity(item.serviceId, item.durationMonths, itemAddonsStr, -1)}
                                  className="w-6 h-6 flex items-center justify-center bg-[#FAF9F6] border border-[#ede9df] hover:border-violet-500 rounded text-xs cursor-pointer text-slate-600 transition-colors"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="font-mono text-center min-w-[14px] text-[11px] font-extrabold text-slate-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.serviceId, item.durationMonths, itemAddonsStr, 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-[#FAF9F6] border border-[#ede9df] hover:border-violet-500 rounded text-xs cursor-pointer text-slate-600 transition-colors"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-6 bg-[#FAF9F6] border-t border-[#EDE9DF] space-y-4">
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-slate-550">
                          <span>{lang === "en" ? "STRATEGY SUB-TOTAL" : "المجموع الفرعي للإستراتيجية"}</span>
                          <span className="font-bold text-[#0f172a]">{getCurrencySymbol()} {formatValue(financeSummary.subtotal)}</span>
                        </div>
                        
                        <div className="flex justify-between text-slate-550">
                          <span>{lang === "en" ? `REG TAX/VAT CODE (${getTaxRate()}%)` : `ضريبة القيمة المضافة الإقليمية (${getTaxRate()}%)`}</span>
                          <span className="font-bold text-[#0f172a]">{getCurrencySymbol()} {formatValue(financeSummary.taxAmount)}</span>
                        </div>

                        <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-[#0f172a]">
                          <span>{lang === "en" ? "ESTIMATED TOTAL BUDGET" : "إجمالي الميزانية المقدرة"}</span>
                          <span className="text-violet-800">{getCurrencySymbol()} {formatValue(financeSummary.total)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          onClick={() => setCheckoutModalOpen(true)}
                          className="w-full py-3.5 bg-[#6d28d9] hover:bg-violet-800 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                        >
                          <span>{lang === "en" ? "Generate Proposal" : "توليد وإصدار العرض الإستراتيجي"}</span>
                          <ArrowRight size={14} className={lang === "ar" ? "rotate-180" : ""} />
                        </button>
                        
                        <button
                          onClick={handleSaveAsDraftOrder}
                          className="w-full py-2.5 border border-[#EDE9DF] hover:border-violet-300 hover:bg-white text-slate-600 hover:text-[#0f172a] bg-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                          title={lang === "en" ? "Save this collection configuration under Ledger database" : "حفظ باقة الخدمات الحالية في سجل الأرشيف والمسودات"}
                        >
                          {lang === "en" ? "Archive Draft" : "أرشفة المسودة"}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Limit Error Warning Modal Dialog */}
      <AnimatePresence>
        {limitErrorModal?.isOpen && (
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] border border-red-100 w-full max-w-md overflow-hidden shadow-2xl text-start"
              id="limit-error-modal"
            >
              <div className="px-6 py-5 border-b border-red-50/60 bg-red-50/20 flex justify-between items-center">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} strokeWidth={2.5} />
                  <h3 className="font-display font-black text-sm uppercase tracking-wide">
                    Package Capacity Limit
                  </h3>
                </div>
                <button 
                  onClick={() => setLimitErrorModal(null)}
                  className="p-1 text-slate-400 hover:text-[#0f172a] rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                    SELECTED CONFIGURATION
                  </span>
                  <h4 className="text-base font-extrabold text-[#0f172a] uppercase font-sans">
                    {limitErrorModal.serviceName}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {limitErrorModal.message}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setLimitErrorModal(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    Understood, Proceed
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Secure Checkout Form Modal dialog */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-[#EDE9DF] w-full max-w-lg overflow-hidden shadow-2xl text-start"
            >
              <div className="px-6 py-5 border-b border-[#EDE9DF] bg-[#FAF9F6] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-700" size={16} />
                  <h3 className="font-display font-black text-[#0f172a] text-sm uppercase tracking-wide">
                    {lang === "en" ? "Executive Proposal Setup" : "إعداد وتوليد وثيقة العرض المعتمدة"}
                  </h3>
                </div>
                <button 
                  onClick={() => setCheckoutModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-[#0f172a] rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCompletePaymentSimulated} className="p-6 space-y-4 font-sans">
                
                {/* Contact name */}
                <div>
                  <label className="text-[10px] font-mono text-[#64748b] block mb-1 font-bold uppercase tracking-wider">
                    {lang === "en" ? "Client Authorized Officer General Name" : "اسم الممثل المفوض للمؤسسة أو الشريك"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === "en" ? "e.g. Christopher Al Maktoum" : "مثال: عبد الرحمن آل مكتوم"}
                    className="w-full bg-[#FAF9F6] border border-[#EDE9DF] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-violet-500 font-bold"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="text-[10px] font-mono text-[#64748b] block mb-1 font-bold uppercase tracking-wider">
                    {lang === "en" ? "Secured Commercial Email" : "البريد الإلكتروني المعتمد للمراسلات التجارية"}
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={lang === "en" ? "e.g. christopher@mideastventures.ae" : "مثال: info@mideastventures.ae"}
                    className="w-full bg-[#FAF9F6] border border-[#EDE9DF] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Company details */}
                <div>
                  <label className="text-[10px] font-mono text-[#64748b] block mb-1 font-bold uppercase tracking-wider">
                    {lang === "en" ? "Company Registered Address & Headquarters" : "العنوان المسجل ومقر الشركة الرئيسي"}
                  </label>
                  <textarea
                    rows={2}
                    value={companyDetails}
                    onChange={(e) => setCompanyDetails(e.target.value)}
                    placeholder={lang === "en" ? "e.g. Boulevard Plaza Tower 1, Level 15, Downtown Dubai, UAE" : "مثال: برج بوليفارد بلازا ١، الطابق ١٥، وسط مدينة دبي، الإمارات العربية المتحدة"}
                    className="w-full bg-[#FAF9F6] border border-[#EDE9DF] rounded-xl p-3 text-xs focus:outline-none focus:border-violet-500 font-sans"
                  />
                </div>

                {/* Simulated Payment Modes */}
                <div>
                  <label className="text-[10px] font-mono text-[#64748b] block mb-2 font-bold uppercase tracking-wider">
                    {lang === "en" ? "Enterprise Retainer Terms" : "شروط الدفع المعتمدة للمؤسسة"}
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    {[
                      { key: "Bank Transfer Net-15", icon: <Landmark size={12} /> },
                      { key: "Corporate Card", icon: <CreditCard size={12} /> },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.key}
                        onClick={() => setPaymentMethod(p.key)}
                        className={`p-3 border rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === p.key 
                            ? "border-violet-700 bg-violet-750 bg-violet-700 text-white" 
                            : "border-[#EDE9DF] bg-[#FAF9F6] text-slate-650 hover:border-violet-500"
                        }`}
                      >
                        {p.icon}
                        <span>{p.key === "Bank Transfer Net-15" ? (lang === "en" ? "Bank Transfer Net-15" : "حوالة بنكية خلال ١٥ يوماً") : (lang === "en" ? "Corporate Card" : "بطاقة الشركة الائتمانية")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Offer Customization Segment */}
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EDE9DF] space-y-3">
                  <h4 className="text-[10px] font-mono text-[#64748b] font-black uppercase tracking-wider border-b border-slate-200/60 pb-1">
                    {lang === "en" ? "Final Offer Customization" : "تخصيص وثيقة العرض الإستراتيجي"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Target Country */}
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-1 font-bold uppercase">
                        {lang === "en" ? "Country flag" : "بلد الاستهداف"}
                      </label>
                      <select
                        value={proposalCountry}
                        onChange={(e) => setProposalCountry(e.target.value as "KSA" | "UAE" | "Egypt")}
                        className="w-full bg-white border border-[#EDE9DF] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="KSA">🇸🇦 {lang === "en" ? "KSA" : "السعودية"}</option>
                        <option value="UAE">🇦🇪 {lang === "en" ? "UAE" : "الإمارات"}</option>
                        <option value="Egypt">🇪🇬 {lang === "en" ? "Egypt" : "مصر"}</option>
                      </select>
                    </div>

                    {/* Proposal Language */}
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-1 font-bold uppercase">
                        {lang === "en" ? "Language" : "لغة الوثيقة"}
                      </label>
                      <select
                        value={proposalLang}
                        onChange={(e) => setProposalLang(e.target.value as "en" | "ar")}
                        className="w-full bg-white border border-[#EDE9DF] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="ar">العربية 🇸🇦</option>
                        <option value="en">English 🇬🇧</option>
                      </select>
                    </div>

                    {/* Proposal Currency */}
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 block mb-1 font-bold uppercase">
                        {lang === "en" ? "Currency" : "العملة المعتمدة"}
                      </label>
                      <select
                        value={proposalCurrency}
                        onChange={(e) => setProposalCurrency(e.target.value as "AED" | "SAR" | "USD" | "EGP")}
                        className="w-full bg-white border border-[#EDE9DF] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="SAR">SAR (ر.س)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="EGP">EGP (ج.م)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subsidaries summary details */}
                {(() => {
                  const targetTaxRate = proposalCurrency === "AED" ? 5 : proposalCurrency === "SAR" ? 15 : proposalCurrency === "EGP" ? 14 : 0;
                  const getProposalCurrencySymbol = () => {
                    if (proposalCurrency === "AED") return proposalLang === "ar" ? "د.إ" : "AED";
                    if (proposalCurrency === "SAR") return proposalLang === "ar" ? "ر.س" : "SAR";
                    if (proposalCurrency === "EGP") return proposalLang === "ar" ? "ج.م" : "EGP";
                    return "$";
                  };
                  
                  const calculateItemCostInProposalCurrency = (cartItem: CartItem) => {
                    const baseServiceObj = INITIAL_SERVICES.find(s => s.id === cartItem.serviceId);
                    if (!baseServiceObj) return 0;

                    let baseMonthlyPrice = 0;
                    if (proposalCurrency === "AED") baseMonthlyPrice = baseServiceObj.monthlyPriceAED;
                    else if (proposalCurrency === "SAR") baseMonthlyPrice = baseServiceObj.monthlyPriceSAR;
                    else if (proposalCurrency === "EGP") baseMonthlyPrice = Math.round(baseServiceObj.monthlyPriceUSD * 48);
                    else baseMonthlyPrice = baseServiceObj.monthlyPriceUSD;

                    let addonsMonthlySum = 0;
                    if (cartItem.selectedAddons) {
                      cartItem.selectedAddons.forEach(addonId => {
                        const addon = addonsOptions.find(a => a.id === addonId);
                        if (addon) {
                          if (proposalCurrency === "AED") addonsMonthlySum += addon.monthlyAED;
                          else if (proposalCurrency === "SAR") addonsMonthlySum += addon.monthlySAR;
                          else if (proposalCurrency === "EGP") addonsMonthlySum += Math.round(addon.monthlyUSD * 48);
                          else addonsMonthlySum += addon.monthlyUSD;
                        }
                      });
                    }

                    if (baseServiceObj.isOneTime) {
                      return baseMonthlyPrice + addonsMonthlySum;
                    }

                    const rawTotalMultiplier = (baseMonthlyPrice + addonsMonthlySum) * cartItem.durationMonths;
                    const rule = durationDiscountRules.find(r => r.months === cartItem.durationMonths) || { discountPct: 0 };
                    const discountAmount = Math.round((rawTotalMultiplier * rule.discountPct) / 100);

                    return rawTotalMultiplier - discountAmount;
                  };

                  const tempSubtotal = cart.reduce((sum, item) => {
                    const singleCost = calculateItemCostInProposalCurrency(item);
                    return sum + (singleCost * item.quantity);
                  }, 0);

                  const tempTax = Math.round((tempSubtotal * targetTaxRate) / 100);
                  const tempTotal = tempSubtotal + tempTax;

                  return (
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EDE9DF] space-y-1.5 font-mono text-2xs uppercase">
                      <div className="flex justify-between text-slate-500">
                        <span>{lang === "en" ? "Retainers in checkout:" : "عدد الخدمات المضافة للعقد:"}</span>
                        <span className="font-bold text-slate-800">{cart.reduce((s, it) => s + it.quantity, 0)} {lang === "en" ? "Solutions" : "باقات مخصصة"}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{lang === "en" ? "Tax rate (Standard VAT):" : "معدل ضريبة القيمة المضافة:"}</span>
                        <span className="font-bold text-slate-800">{targetTaxRate}%</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{lang === "en" ? "Sovereign Retainer Subtotal:" : "المجموع الفرعي لرسوم العقد:"}</span>
                        <span className="font-bold text-slate-800">{getProposalCurrencySymbol()} {formatValue(tempSubtotal)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#0f172a] border-t border-slate-200 pt-1.5 text-xs">
                        <span>{lang === "en" ? "Total Proposal Investment:" : "إجمالي الاستثمار المعتمد في العرض:"}</span>
                        <span className="text-violet-700">{getProposalCurrencySymbol()} {formatValue(tempTotal)}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="flex-1 py-3 border border-[#EDE9DF] text-slate-705 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer text-center"
                  >
                    {lang === "en" ? "Cancel" : "إلغاء"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest cursor-pointer text-center transition-all shadow"
                  >
                    {lang === "en" ? "Generate Certificate" : "إصدار وثيقة العقد المعتمد"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>      {/* Dynamic Certified Proposal of Service Delivery / Certificate of Authenticity */}
      <AnimatePresence>
        {lastReceipt && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <BrandedProposal 
              proposal={lastReceipt} 
              isSharedView={false} 
              onClose={() => setLastReceipt(null)} 
              defaultLang={lang}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="border-t border-[#EDE9DF] bg-white py-12 mt-20 px-6 text-center text-[#64748b] select-none text-xs">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-start">
            <span className="font-extrabold text-[#0f172a] uppercase tracking-wider font-display">BRANDOORA ADVISORY</span>
            <span className="text-[10px] font-mono mt-0.5 text-slate-450">© 2026 BRANDOORA.NET. Creative Growth Studio for Saudi Arabia and the Gulf Markets & Brand Identity Retainers.</span>
          </div>

          <div className="flex gap-4 font-mono text-[10px] text-slate-400">
            <span className="hover:text-purple-700 cursor-pointer">TERMS CODES</span>
            <span>•</span>
            <span className="hover:text-purple-700 cursor-pointer">GCC EXCLUSIVITY AGREEMENTS</span>
            <span>•</span>
            <span className="hover:text-purple-700 cursor-pointer">DUBAI • RIYADH</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
