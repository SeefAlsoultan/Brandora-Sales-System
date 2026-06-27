import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

const PROPOSALS_FILE = path.join(process.cwd(), "proposals_db.json");

// Helper to read proposals
function readProposals(): Record<string, any> {
  try {
    if (fs.existsSync(PROPOSALS_FILE)) {
      const data = fs.readFileSync(PROPOSALS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading proposals file:", err);
  }
  return {};
}

// Helper to write proposals
function writeProposals(proposals: Record<string, any>) {
  try {
    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing proposals file:", err);
  }
}

// Initialize Google GenAI if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI rewriter will fall back to smart local simulation.");
}

app.use(express.json());

// API route for AI deliverables description rewrite
app.post("/api/rewrite", async (req, res) => {
  try {
    const { serviceName, clientName, industryInstructions, currentDeliverables, lang } = req.body;

    if (!serviceName) {
      return res.status(400).json({ error: "Service name is required." });
    }

    const brand = clientName || "Premium Client";
    const guidelines = industryInstructions || "luxury branding aesthetic";

    let rewritten = "";

    if (ai) {
      let prompt = "";
      if (lang === "ar") {
        prompt = `أنت مدير إبداعي عالمي المستوى في Brandoora، وهي وكالة استشارية متميزة للعلامات التجارية والهوية في دبي والرياض ونيويورك.
نحتاج إلى تخصيص وصف مخرجات عقد الخدمات بشكل احترافي لعميلنا "${brand}".
باقة الخدمة المحددة: "${serviceName}"
المخرجات الأساسية الحالية: "${currentDeliverables || ''}"
تفضيلات وتوجيهات العميل المخصصة: "${guidelines}"

المهمة: اكتب بند مخرجات مصقولاً واحترافياً للغاية يطابق أرقى معايير الشركات الكبرى (من 1 إلى 3 جمل كحد أقصى).
يجب أن تشعر الصياغة بالفخامة والتميز وأن تكون مخصصة لهوية وثقافة العميل. اذكر اسم العلامة التجارية "${brand}" بشكل طبيعي ضمن النص.
تجنب العبارات التسويقية المبتذلة، واجعلها ملموسة وذات طابع تنفيذي راقٍ جداً وموجهة للشركاء المفوضين بدول مجلس التعاون الخليجي. لا تستخدم القوائم النقطية أو لغة markdown، بل اكتبها كفقرة سردية متكاملة وأنيقة باللغة العربية الفصحى الفاخرة.`;
      } else {
        prompt = `You are a world-class luxury creative director at Brandoora, an elite brand advisory agency in Dubai, Riyadh, and New York.
We need to professionally customize a retainer deliverable description for our client "${brand}".
Service Plan: "${serviceName}"
Current Core Deliverables: "${currentDeliverables || ''}"
Custom Client Instructions/Preferences: "${guidelines}"

Task: Write a highly polished, professional, luxury-retail-standard deliverables clause (1-3 sentences maximum).
It should feel elite, sophisticated, and tailored to the client's campaign/brand character. Mention the brand name naturally.
Avoid generic marketing jargon, keep it concrete, ultra-premium, and highly executive. Do not use markdown bullet lists, write it as a beautiful unified narrative block.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });

      rewritten = response.text || "Bespoke retainer scope tailored with high-fidelity creative checkpoints.";
    } else {
      // Fallback response with beautiful client-specific tailored copy
      if (lang === "ar") {
        rewritten = `[صياغة نخبوية محاكاة] باقة مخصصة بالكامل تم تصميمها خصيصاً لـ ${brand}. مصممة لدمج وتلبية ${guidelines} مباشرة ضمن مخرجات ${serviceName}، مما يؤسس لريادة سوقية متميزة وحضور قوي ومستمر.`;
      } else {
        rewritten = `[Simulated Elite Tailoring] Bespoke retainer strategy designed exclusively for ${brand}. Engineered to integrate ${guidelines} directly into ${serviceName} deliverables, establishing elite market authority with continuous creative optimization.`;
      }
    }

    res.json({ success: true, rewritten: rewritten.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to customize deliverables via Gemini API." });
  }
});

// POST /api/proposals - save a proposal
app.post("/api/proposals", (req, res) => {
  try {
    const proposal = req.body;
    if (!proposal || !proposal.id) {
      return res.status(400).json({ error: "Invalid proposal data." });
    }
    const db = readProposals();
    db[proposal.id] = proposal;
    writeProposals(db);
    res.json({ success: true, id: proposal.id });
  } catch (error: any) {
    console.error("Failed to save proposal:", error);
    res.status(500).json({ error: error.message || "Failed to save proposal." });
  }
});

// GET /api/proposals/:id - load a proposal
app.get("/api/proposals/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = readProposals();
    const proposal = db[id];
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found." });
    }
    res.json({ success: true, proposal });
  } catch (error: any) {
    console.error("Failed to load proposal:", error);
    res.status(500).json({ error: error.message || "Failed to load proposal." });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Brandoora Studio] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server", err);
});
