import React, { useState } from "react";
import { 
  Printer, Link as LinkIcon, ArrowLeft, Check, Mail, Building, 
  ShieldCheck, Globe, Calendar, FileText, MapPin, DollarSign,
  Briefcase, Sparkles, Award
} from "lucide-react";
import { SavedOrder } from "../types";

interface BrandedProposalProps {
  proposal: SavedOrder;
  isSharedView?: boolean;
  onClose?: () => void;
  onExploreStudio?: () => void;
  defaultLang?: "en" | "ar";
}

export const BrandedProposal: React.FC<BrandedProposalProps> = ({
  proposal,
  isSharedView = false,
  onClose,
  onExploreStudio,
  defaultLang = "ar", // Default to Arabic as requested
}) => {
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">(proposal.targetLang || defaultLang);

  React.useEffect(() => {
    if (proposal.targetLang) {
      setLang(proposal.targetLang);
    }
  }, [proposal.targetLang]);

  const isRtl = lang === "ar";

  // Format Helper for currency
  const formatValue = (num: number) => {
    return Math.round(num).toLocaleString(undefined);
  };

  const getCurrencySymbol = () => {
    switch (proposal.currency) {
      case "SAR": return isRtl ? "ر.س" : "SAR";
      case "AED": return isRtl ? "د.إ" : "AED";
      case "EGP": return isRtl ? "ج.م" : "EGP";
      case "USD": return "$";
      default: return isRtl ? "ر.س" : "SAR";
    }
  };

  const getServiceTranslation = (id: string, defaultName: string) => {
    if (lang === "en") return defaultName;
    const translations: Record<string, string> = {
      "serv-social-media": "إدارة وسائل التواصل الاجتماعي متكاملة",
      "serv-media-buying": "إدارة الإعلانات المدفوعة والممولة",
      "serv-moderation": "إدارة الحسابات وخدمة العملاء التفاعلية",
      "serv-logo-branding": "تصميم الشعار وبناء الهوية البصرية المتكاملة",
      "serv-landing-page": "تصميم وبرمجة صفحة الهبوط السريعة",
      "serv-crm-setup": "أتمتة وإعداد أنظمة المبيعات والـ CRM",
      "serv-motion-graphics": "باقة مقاطع موشن جرافيكس إبداعية",
      "serv-creative-design": "باقة المنشورات والتصاميم الإبداعية للمنصات"
    };
    return translations[id] || defaultName;
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/proposal/${proposal.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => console.error("Could not copy link:", err));
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute item totals
  const calculateSingleItemCost = (item: any) => {
    let base = 0;
    if (proposal.currency === "SAR") base = item.monthlyPriceSAR || 1500;
    else if (proposal.currency === "AED") base = item.monthlyPriceAED || 1470;
    else if (proposal.currency === "EGP") base = (item.monthlyPriceUSD || 400) * 48;
    else base = item.monthlyPriceUSD || 400;

    // Apply monthly discounts if not a one-time service
    if (!item.isOneTime && item.durationMonths) {
      let discountPct = 0;
      if (item.durationMonths === 3) discountPct = 5;
      else if (item.durationMonths === 6) discountPct = 10;
      else if (item.durationMonths === 12) discountPct = 15;
      base = base * (1 - discountPct / 100);
    }
    
    // Addons cost
    let addonsCost = 0;
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const getAddonCostInCurrency = (addonId: string) => {
        const addonPricingAED: Record<string, number> = {
          "addon-manager": 1500,
          "addon-locale": 2000,
          "addon-seo": 1200,
          "addon-content": 2500,
          "addon-brand": 3500
        };
        const addonPricingSAR: Record<string, number> = {
          "addon-manager": 1530,
          "addon-locale": 2040,
          "addon-seo": 1224,
          "addon-content": 2550,
          "addon-brand": 3570
        };
        const addonPricingUSD: Record<string, number> = {
          "addon-manager": 400,
          "addon-locale": 550,
          "addon-seo": 330,
          "addon-content": 680,
          "addon-brand": 950
        };

        if (proposal.currency === "SAR") return addonPricingSAR[addonId] || 1000;
        if (proposal.currency === "AED") return addonPricingAED[addonId] || 1000;
        if (proposal.currency === "EGP") return (addonPricingUSD[addonId] || 300) * 48;
        return addonPricingUSD[addonId] || 300;
      };

      item.selectedAddons.forEach((addonId: string) => {
        addonsCost += getAddonCostInCurrency(addonId);
      });
    }

    const monthlyCost = base + addonsCost;
    const totalDurationMultiplier = item.isOneTime ? 1 : (item.durationMonths || 3);
    return Math.round(monthlyCost * totalDurationMultiplier);
  };

  // Target country metadata
  const targetCountry = proposal.targetCountry || "KSA";
  
  const countryFlag = {
    KSA: "🇸🇦",
    UAE: "🇦🇪",
    Egypt: "🇪🇬"
  }[targetCountry] || "🇸🇦";

  const countryName = {
    KSA: { en: "Kingdom of Saudi Arabia", ar: "المملكة العربية السعودية" },
    UAE: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    Egypt: { en: "Arab Republic of Egypt", ar: "جمهورية مصر العربية" }
  }[targetCountry] || { en: "Kingdom of Saudi Arabia", ar: "المملكة العربية السعودية" };

  // Curated static content translations
  const content = {
    en: {
      presentationMode: "OFFICIAL STRATEGIC PROPOSAL",
      strategyDeliverable: "DIGITAL EXCELLENCE BLUEPRINT",
      proposalId: "DOCUMENT ID",
      copyLink: "Copy Link",
      linkCopied: "Copied!",
      exportPdf: "Export PDF / Print",
      createOwn: "Build New Plan",
      office: "ISSUING OFFICE",
      desk: "BRANDORA GCC • STRATEGIC ADVISORY",
      preparedFor: "PREPARED EXCLUSIVELY FOR",
      correspondence: "COMMERCIAL LIAISON",
      regionScope: "TARGET JURISDICTION & NATIONAL SCOPE",
      ledgerData: "METADATA LEDGER",
      docId: "REF CODE",
      dateOfIssuance: "ISSUANCE DATE",
      settlementBasis: "RETAINER BASIS",
      gccRetainer: "Certified GCC Advisory Framework",
      section: "SECTION I • PROPOSED SOLUTION SPECIFICATIONS",
      customPackages: "Bespoke Retainer Scopes",
      startingAt: "INVESTMENT VALUE",
      oneTime: "Bespoke Project (One-Time)",
      retainerMonths: "Monthly Retainer: {months} Months",
      quantity: "Quantity: {qty}x Brand(s)",
      scopeClause: "Strategic Narrative & Scope Execution",
      appliedAddons: "Integrated Strategic Add-ons",
      legalNotif: "REGULATORY COMPLIANCE & EXCLUSIVITY WARRANTY",
      legalBody: "Brandora guarantees absolute brand exclusivity within the GCC area for active client retainer classes. This document is a binding advisory proposal valid for 30 calendar days from the date of issuance. Rates are exclusive of external ad-networks media spends.",
      subtotal: "Advisory Subtotal:",
      vat: "Standard VAT ({vat}%):",
      totalInvestment: "TOTAL COMPREHENSIVE INVESTMENT:",
      bespokeCampaign: "GLOBAL BRAND SYSTEMS",
      creativeIntellect: "CREATIVE SYSTEM • HIGH FIDELITY ADVISORY",
      strategist: "ISSUING SENIOR ADVISOR",
      strategistName: "Seef Al-Sultaan",
      partnerAcceptance: "PARTNER EXECUTION & ACCEPTANCE",
      signPrompt: "Authorized sign-off to execute this charter...",
      signatureAuthority: "Authorized Signature Authority",
      advisoryRole: "Lead Strategic Advisor & Creative Director",
      studioDesk: "Brandora GCC Executive Advisory Desk",
      footerRegions: "BRANDOORA.NET • RIYADH • DUBAI • CAIRO • NEW YORK",
      footerEncrypted: "Secure Document Record. Encryption Identifier: {id}",
      defaultDesc: "Precision strategic delivery framework designed and calibrated specifically for the brand identity, ensuring maximum cross-platform audience engagement and robust lead acquisition.",
      targetMarket: "Target Market",
      activeStatus: "ACTIVE STATUS"
    },
    ar: {
      presentationMode: "وثيقة العرض الإستراتيجي الرسمي",
      strategyDeliverable: "مخطط التميز الرقمي المعتمد",
      proposalId: "رقم المستند",
      copyLink: "نسخ الرابط",
      linkCopied: "تم النسخ!",
      exportPdf: "تصدير العرض / طباعة",
      createOwn: "إنشاء عرض مخصص جديد",
      office: "جهة الإصدار والاستشارة",
      desk: "براندورا الخليج العربي • مكتب الاستشارات التنفيذية",
      preparedFor: "أُعد خصيصاً لصالح الشريك",
      correspondence: "قنوات الاتصال التجاري المعتمدة",
      regionScope: "النطاق الجغرافي والبلد المستهدف للنمو",
      ledgerData: "بيانات تتبع الأرشفة والتوثيق",
      docId: "رمز المرجع",
      dateOfIssuance: "تاريخ الإصدار الرسمي",
      settlementBasis: "آلية التسوية المالية",
      gccRetainer: "إطار خدمات معتمد لدول مجلس التعاون والشرق الأوسط",
      section: "القسم الأول • تفاصيل النطاق الإبداعي والتجاري",
      customPackages: "مواصفات باقات العمل والحلول الإستراتيجية",
      startingAt: "قيمة الاستثمار المعتمد",
      oneTime: "مشروع مخصص (لمرة واحدة)",
      retainerMonths: "عقد خدمات شهري مستمر لمدة {months} أشهر",
      quantity: "الكمية المعتمدة: {qty} علامات تجارية",
      scopeClause: "بند نطاق العمل والرؤية الإستراتيجية للمشروع",
      appliedAddons: "الخدمات الإستراتيجية والمميزات المضافة",
      legalNotif: "إشعار الامتثال القانوني وضمان الحصرية التجارية",
      legalBody: "تلتزم مؤسسة براندورا بالحصرية الإبداعية والتجارية المطلقة لشركائها النشطين في منطقة الشرق الأوسط ضمن الفئات المحددة. هذا العرض استشاري رسمي ملزم وصالح لمدة ٣٠ يوماً من تاريخ صدوره. جميع الأسعار لا تشمل الميزانيات الترويجية المباشرة المدفوعة لمنصات الإعلانات العالمية.",
      subtotal: "المجموع الاستثماري الفرعي:",
      vat: "ضريبة القيمة المضافة القانونية ({vat}%):",
      totalInvestment: "إجمالي الاستثمار الشامل المعتمد:",
      bespokeCampaign: "أنظمة العلامات التجارية العالمية",
      creativeIntellect: "الفكر الإبداعي الفائق وأنظمة الهويات المؤسسية",
      strategist: "المستشار الإستراتيجي المصدر للعرض",
      strategistName: "سيف السلطان",
      partnerAcceptance: "قسم قبول واعتماد العرض والبدء بالتنفيذ",
      signPrompt: "يرجى التوقيع والاعتماد إيذاناً ببدء تفعيل الشراكة الرسمية...",
      signatureAuthority: "التوقيع والاعتماد المفوض للمؤسسة المستفيدة",
      advisoryRole: "المستشار الإستراتيجي الرئيسي والمدير الإبداعي التنفيذي",
      studioDesk: "المكتب التنفيذي لبراندورا الشرق الأوسط والخليج العربي",
      footerRegions: "براندورا.نت • الرياض • دبي • القاهرة • نيويورك",
      footerEncrypted: "مستند رسمي مؤرشف ومحمي بأنظمة أمان سحابية متقدمة. معرف التشفير: {id}",
      defaultDesc: "إطار عمل متكامل مصمم بدقة فائقة ليتوافق مع هوية العلامة التجارية للشريك، لضمان أعلى مستويات تفاعل الجمهور عبر جميع قنوات النشر الرقمية وتحقيق المبيعات.",
      targetMarket: "السوق المستهدف للخدمات",
      activeStatus: "معتمد وساري المفعول"
    }
  };

  const t = content[lang];

  // Helper to translate addon names dynamically to selected language
  const getAddonName = (addonId: string) => {
    const addonNames: Record<string, { en: string; ar: string }> = {
      "addon-manager": {
        en: "Dedicated GCC Brand Strategy Director",
        ar: "مدير إستراتيجية أول مخصص لمتابعة قنوات النمو والتواصل الفوري"
      },
      "addon-locale": {
        en: "Multilingual GCC Regional Dialects Localization",
        ar: "تهيئة وصياغة المحتوى باللهجات المحلية (النجدية، الإماراتية، المصرية)"
      },
      "addon-seo": {
        en: "Search Authority & Multi-Platform SEO Indexing",
        ar: "الأرشفة الاحترافية وتهيئة محركات البحث لضمان صدارة الظهور"
      },
      "addon-content": {
        en: "High-Fidelity Ad Copy & Strategic Storytelling masterclass",
        ar: "كتابة النصوص الإعلانية الإبداعية وسرد قصصي احترافي للعلامة"
      },
      "addon-brand": {
        en: "Dynamic Brand Book Guidelines & System Assets",
        ar: "كتيب إرشادات العلامة الكامل ودليل استخدام الهوية البصرية"
      }
    };
    
    if (addonNames[addonId]) {
      return addonNames[addonId][lang];
    }
    return addonId;
  };

  return (
    <div 
      className="min-h-screen bg-[#07050F] text-slate-900 font-sans selection:bg-purple-200 overflow-x-hidden relative pb-16 print:bg-white print:pb-0"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Subtle Gradient Glows (Hidden in Print) */}
      <div className="absolute top-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-to-br from-[#8B5CF6]/10 to-transparent blur-[120px] rounded-full pointer-events-none print:hidden z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-to-br from-[#D946EF]/10 to-transparent blur-[120px] rounded-full pointer-events-none print:hidden z-0" />
      
      {/* Premium Studio Controls Bar (Sticky, Hidden in Print) */}
      <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3.5 px-4 sm:px-6 sticky top-0 z-50 shadow-xl print:hidden" dir="ltr">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-slate-900 border border-slate-800 hover:border-[#8B5CF6] text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                title="Back to Studio Workspace"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="text-left">
              <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest block font-mono">
                {t.presentationMode}
              </span>
              <h2 className="text-xs font-black uppercase text-white tracking-wider font-mono">
                {t.proposalId}: <span className="text-purple-400">{proposal.id}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Language Toggler */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 text-purple-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              title="Toggle Language"
            >
              <Globe size={13} className="text-purple-400" />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>

            {/* Copy Shareable URL */}
            <button
              onClick={handleCopyLink}
              className={`py-2 px-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 border transition-all ${
                copied 
                  ? "bg-emerald-950 border-emerald-500 text-emerald-300" 
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
              }`}
            >
              {copied ? <Check size={13} /> : <LinkIcon size={13} />}
              <span>{copied ? t.linkCopied : t.copyLink}</span>
            </button>

            {/* Dynamic Export PDF / Print Option */}
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-purple-500/20"
            >
              <Printer size={13} />
              <span>{t.exportPdf}</span>
            </button>

            {isSharedView && onExploreStudio && (
              <button
                onClick={onExploreStudio}
                className="py-2 px-4 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md"
              >
                {t.createOwn}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Styled Head Banner */}
      <div className="text-center pt-10 pb-6 px-4 print:hidden relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/60 border border-purple-800/80 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest font-mono mb-3">
          <Sparkles size={11} className="text-fuchsia-400" />
          <span>{t.strategyDeliverable}</span>
        </div>
        <h1 className="designer-title text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text tracking-tight uppercase leading-none">
          {isRtl ? "عرض السعر الإستراتيجي المعتمد" : "OFFICIAL STRATEGIC PROPOSAL"}
        </h1>
        <p className="designer-mono text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">
          {t.desk}
        </p>
      </div>

      {/* 3. Main Printable Proposal Sheet (Luxury Switzerland-style Letterhead) */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 print:p-0 print:m-0 relative z-10">
        
        {/* Double-bordered Executive Document Canvas */}
        <div className="bg-white text-slate-950 overflow-hidden p-6 sm:p-12 md:p-14 relative border-4 border-double border-slate-900 shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0">
          
          {/* Aesthetic grid overlay watermark - subtle and high-end */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:20px_20px] print:hidden" />

          {/* Top Document Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-900 pb-8 relative z-10">
            <div className="space-y-3 text-start w-full sm:w-auto">
              <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                <span className="text-2xl" title={countryName[lang]}>{countryFlag}</span>
                <span className="designer-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  {countryName[lang]} • {t.targetMarket}
                </span>
              </div>
              
              <h2 className="designer-title text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {isRtl ? (
                  <span className="font-bold">وثيقة العرض التجاري الإستراتيجي</span>
                ) : (
                  <span>COMMERCIAL STRATEGY DESK</span>
                )}
              </h2>
              
              <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-md px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase font-mono">
                <Award size={10} className="text-amber-400" />
                <span>{t.gccRetainer}</span>
              </div>
            </div>

            {/* Document Signature Brand Logo Reference */}
            <div className={`flex flex-col ${isRtl ? "items-start sm:items-start" : "items-end sm:items-end"} w-full sm:w-auto justify-between h-full sm:h-24`}>
              <div className="font-black text-xl tracking-tight text-slate-900 font-mono flex items-center gap-1.5 border-b-2 border-slate-900 pb-1 uppercase">
                <span>Brandoora</span>
                <span className="text-purple-600">.</span>
              </div>
              
              <div className={`mt-3 ${isRtl ? "text-left" : "text-right"}`}>
                <span className="designer-mono text-[8px] font-bold text-slate-400 block uppercase tracking-widest">
                  {t.office}
                </span>
                <span className="designer-title text-[10px] font-extrabold uppercase text-slate-800 tracking-wider">
                  {t.desk}
                </span>
              </div>
            </div>
          </div>

          {/* McKinsey-style 4-Grid Information Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-900 relative z-10 text-xs text-slate-800 leading-relaxed">
            
            {/* Customer Details */}
            <div className={`space-y-4 ${isRtl ? "text-right" : "text-left"}`}>
              <div>
                <span className="designer-mono text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  {t.preparedFor}
                </span>
                <div className={`flex items-center gap-1.5 mt-1 text-slate-900 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                  <Building size={13} className="text-slate-600" />
                  <span className="designer-title font-black text-md uppercase tracking-tight">
                    {proposal.customerName}
                  </span>
                </div>
              </div>

              <div>
                <span className="designer-mono text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  {t.correspondence}
                </span>
                <div className={`flex items-center gap-1.5 mt-1 text-slate-700 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                  <Mail size={12} className="text-slate-400" />
                  <span className="designer-mono font-bold">{proposal.customerEmail}</span>
                </div>
              </div>

              {proposal.shippingAddress && (
                <div>
                  <span className="designer-mono text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    {t.regionScope}
                  </span>
                  <div className={`mt-1 flex items-center gap-1.5 text-slate-700 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <p className="font-bold text-slate-800 font-sans">{proposal.shippingAddress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Metadata Vault Info */}
            <div className={`space-y-4 flex flex-col justify-between items-start ${isRtl ? "md:items-start text-right" : "md:items-end text-left md:text-right"}`}>
              <div className="w-full space-y-1.5">
                <span className={`designer-mono text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono ${isRtl ? "text-right" : "text-left md:text-right"}`}>
                  {t.ledgerData}
                </span>
                
                {/* Clean Metadata Rows */}
                <div className="designer-mono text-[10px] text-slate-900 space-y-1 font-mono">
                  <div className={`flex gap-4 border-b border-dashed border-slate-200 pb-1 ${isRtl ? "justify-between" : "justify-between md:justify-end"}`}>
                    <span className="text-slate-400 font-medium">{t.docId}:</span>
                    <span className="text-slate-950 font-black">{proposal.id}</span>
                  </div>
                  <div className={`flex gap-4 border-b border-dashed border-slate-200 pb-1 ${isRtl ? "justify-between" : "justify-between md:justify-end"}`}>
                    <span className="text-slate-400 font-medium">{t.dateOfIssuance}:</span>
                    <span className="text-slate-950 font-black">{proposal.timestamp}</span>
                  </div>
                  <div className={`flex gap-4 border-b border-dashed border-slate-200 pb-1 ${isRtl ? "justify-between" : "justify-between md:justify-end"}`}>
                    <span className="text-slate-400 font-medium">{t.settlementBasis}:</span>
                    <span className="uppercase text-purple-600 font-black">{proposal.paymentMethod}</span>
                  </div>
                  <div className={`flex gap-4 ${isRtl ? "justify-between" : "justify-between md:justify-end"}`}>
                    <span className="text-slate-400 font-medium">{lang === "en" ? "Status:" : "حالة المستند:"}</span>
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.activeStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CORE SERVICES AND INVESTMENTS LIST */}
          <div className="py-8 space-y-6 relative z-10">
            <div className={`space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
              <span className="designer-mono text-[9px] text-slate-400 uppercase font-black tracking-widest block font-mono border-b border-slate-150 pb-1 inline-block">
                {t.section}
              </span>
              <h3 className="designer-title font-black text-lg uppercase tracking-tight text-slate-900 mt-1">
                {t.customPackages}
              </h3>
            </div>

            {/* Custom high-contrast table items block */}
            <div className="space-y-6">
              {proposal.items.map((item, idx) => {
                const finalCost = calculateSingleItemCost(item) * item.quantity;
                return (
                  <div 
                    key={idx} 
                    className={`group border-b border-slate-200 pb-6 last:border-b-0 last:pb-0 transition-all ${isRtl ? "text-right" : "text-left"}`}
                  >
                    <div className={`flex flex-col md:flex-row justify-between items-start gap-4 mb-2.5 ${isRtl ? "md:flex-row-reverse" : ""}`}>
                      <div className="space-y-1">
                        <h4 className="designer-title font-extrabold text-base text-slate-900 uppercase tracking-tight">
                          {idx + 1}. {getServiceTranslation(item.serviceId, item.name)}
                        </h4>
                        
                        <div className={`flex flex-wrap gap-2 ${isRtl ? "justify-start" : ""}`}>
                          <span className="designer-mono text-[8px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase font-mono">
                            {item.isOneTime ? t.oneTime : t.retainerMonths.replace("{months}", String(item.durationMonths || 3))}
                          </span>
                          {item.quantity > 1 && (
                            <span className="designer-mono text-[8px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold uppercase font-mono">
                              {t.quantity.replace("{qty}", String(item.quantity))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Explicit Investment Value Display */}
                      <div className={`shrink-0 flex flex-col items-start ${isRtl ? "md:items-start" : "md:items-end"}`}>
                        <span className="designer-mono text-[8px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                          {t.startingAt}
                        </span>
                        <span className="designer-title text-base font-black text-slate-900 tracking-tight whitespace-nowrap leading-none mt-0.5 font-mono" dir="ltr">
                          {getCurrencySymbol()} {formatValue(finalCost)}
                        </span>
                      </div>
                    </div>

                    {/* Scope Narrative block with clean minimal left-border formatting */}
                    <div className="mt-2.5">
                      {item.customNotes ? (
                        <div className="space-y-1">
                          <span className="designer-mono text-[8px] text-slate-400 uppercase font-bold tracking-wider block font-mono">
                            {t.scopeClause}
                          </span>
                          <p className={`designer-body text-slate-700 bg-slate-50 border-l-2 border-slate-900 p-3.5 rounded-r-md text-xs font-medium italic leading-relaxed ${isRtl ? "text-right border-l-0 border-r-2 rounded-r-none rounded-l-md" : "text-left"}`}>
                            "{item.customNotes}"
                          </p>
                        </div>
                      ) : (
                        <p className="designer-body text-xs text-slate-500 leading-relaxed max-w-3xl font-medium">
                          {t.defaultDesc}
                        </p>
                      )}
                    </div>

                    {/* Applied Strategic Add-ons pills */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="space-y-1.5 mt-3">
                        <span className="designer-mono text-[8px] text-slate-400 font-bold tracking-widest uppercase block font-mono">
                          {t.appliedAddons}
                        </span>
                        <div className={`flex flex-wrap gap-1.5 ${isRtl ? "justify-start" : ""}`}>
                          {item.selectedAddons.map((addonId: string) => (
                            <span 
                              key={addonId} 
                              className="designer-mono text-[8px] bg-slate-50 text-slate-800 px-2 py-0.5 rounded border border-slate-200 uppercase font-mono font-medium"
                            >
                              + {getAddonName(addonId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINANCIAL LEDGER STATEMENT TOTALS */}
          <div className={`py-6 border-t border-slate-900 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs ${isRtl ? "md:flex-row-reverse" : ""}`}>
            <div className={`max-w-md space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
              <span className="designer-mono text-[8px] text-slate-400 uppercase font-black tracking-widest block font-mono">
                {t.legalNotif}
              </span>
              <p className="designer-body text-slate-500 leading-relaxed text-[10px] font-medium">
                {t.legalBody}
              </p>
            </div>

            {/* Financial Invoice Table Card */}
            <div className="w-full md:w-80 bg-[#FAF9F6] border border-slate-300 p-5 rounded-md space-y-2.5 designer-mono font-mono text-[10px] text-slate-700" dir="ltr">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className={isRtl ? "order-2 text-right font-bold" : "text-left"}>{t.subtotal}</span>
                <span className="text-slate-950 font-black order-1">{getCurrencySymbol()} {formatValue(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className={isRtl ? "order-2 text-right font-bold" : "text-left"}>{t.vat.replace("{vat}", String(proposal.taxRate))}</span>
                <span className="text-slate-950 font-black order-1">{getCurrencySymbol()} {formatValue(proposal.taxAmount)}</span>
              </div>
              
              <div className="pt-2.5 flex justify-between text-slate-950 designer-title items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">{t.totalInvestment}</span>
                <span className="text-slate-950 font-mono text-lg font-black bg-slate-200/50 border border-slate-300 px-2 py-1 rounded">
                  {getCurrencySymbol()} {formatValue(proposal.total)}
                </span>
              </div>
            </div>
          </div>

          {/* SIGNATURES AND DEEDS DESK */}
          <div className="pt-8 mt-6 border-t border-slate-900 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-start text-xs pb-4">
            
            {/* Strategist Sign Block */}
            <div className="space-y-4">
              <div className={`space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
                <span className="designer-mono text-[8px] text-slate-400 block uppercase font-bold tracking-wider font-mono">
                  {t.strategist}
                </span>
                
                {/* Hand written strategic stamp signature */}
                <div className={`h-12 flex items-end pb-1 border-b border-slate-400 ${isRtl ? "justify-end" : ""}`}>
                  <span className="font-serif italic text-xl font-bold text-slate-800 tracking-tight leading-none">
                    {isRtl ? "سيف السلطان" : "Seef Al-Sultaan"}
                  </span>
                </div>
                
                <div className="font-black text-slate-900 mt-1">{t.studioDesk}</div>
                <div className="text-slate-400 text-[9px] designer-mono font-mono">{t.advisoryRole}</div>
              </div>
            </div>

            {/* Client Signature Acceptance Block */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className={`space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
                <span className="designer-mono text-[8px] text-slate-400 block uppercase font-bold tracking-wider font-mono">
                  {t.partnerAcceptance}
                </span>
                
                <div className="h-12 flex items-end pb-1 border-b border-slate-300 border-dashed">
                  <span className="text-slate-300 font-mono text-[9px] italic">
                    {t.signPrompt}
                  </span>
                </div>
                
                <div className="font-black text-slate-900 mt-1">{proposal.customerName}</div>
                <div className="text-slate-400 text-[9px] designer-mono font-mono font-bold">{t.signatureAuthority}</div>
              </div>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE DOCUMENT FOOTER */}
        <div className="mt-6 text-center text-[9px] designer-mono text-slate-400 space-y-1 uppercase tracking-widest relative z-10 print:text-slate-500">
          <div className="font-mono">{t.footerRegions}</div>
          <div className="text-[8px] tracking-normal font-sans text-slate-500 capitalize font-medium print:hidden">
            {t.footerEncrypted.replace("{id}", proposal.id)}
          </div>
        </div>

      </div>

    </div>
  );
};
