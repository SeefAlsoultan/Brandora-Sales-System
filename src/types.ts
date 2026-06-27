export interface ServiceItem {
  id: string;
  category: "Social Media & Video" | "Brand & Identity" | "Web & Technology" | "Growth & Strategy";
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  monthlyPriceAED: number;
  monthlyPriceSAR: number;
  monthlyPriceUSD: number;
  image: string;
  features: string[];
  isOneTime?: boolean;
}

export interface CartItem {
  serviceId: string;
  name: string;
  category: string;
  monthlyPriceAED: number;
  monthlyPriceSAR: number;
  monthlyPriceUSD: number;
  quantity: number; // usually 1 for services, but could represent multiple brands or sites
  durationMonths: number; // "how many months" option
  customNotes?: string;
  selectedAddons?: string[];
  isOneTime?: boolean;
}

export interface SavedOrder {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  currency: "AED" | "SAR" | "USD" | "EGP";
  taxRate: number;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  targetCountry?: "KSA" | "UAE" | "Egypt";
  targetLang?: "en" | "ar";
}
