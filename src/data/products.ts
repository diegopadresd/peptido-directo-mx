import bpc157 from "@/assets/vial-bpc157.jpg";
import semaglutida from "@/assets/vial-semaglutida.jpg";
import tirzepatida from "@/assets/vial-tirzepatida.jpg";
import cjc1295 from "@/assets/vial-cjc1295.jpg";
import ipamorelin from "@/assets/vial-ipamorelin.jpg";
import bpctb500 from "@/assets/vial-bpctb500.jpg";
import retatrutide from "@/assets/vial-retatrutide.jpg";
import melanotan from "@/assets/vial-melanotan.jpg";

export type Tier = { min: number; max: number | null; pricePerVial: number };

export type Product = {
  slug: string;
  name: string;
  category: string;
  mgPerVial: string;
  image: string;
  shortDesc: string;
  longDesc: string;
  mechanism: string;
  dosing: string;
  storage: string;
  tiers: Tier[];
  faqs: Array<{ q: string; a: string }>;
  related: string[];
  bestSeller?: boolean;
  keywords: string[];
};

const standardTiers = (base: number): Tier[] => [
  { min: 10, max: 24, pricePerVial: base },
  { min: 25, max: 49, pricePerVial: Math.round(base * 0.95) },
  { min: 50, max: 99, pricePerVial: Math.round(base * 0.9) },
  { min: 100, max: null, pricePerVial: Math.round(base * 0.82) },
];

export const products: Product[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "recuperacion",
    mgPerVial: "5 mg",
    image: bpc157,
    shortDesc: "Péptido para recuperación de tejidos y soporte gastrointestinal.",
    longDesc:
      "BPC-157 (Body Protection Compound) es un péptido sintético derivado de una proteína gástrica protectora. Ampliamente utilizado en investigación por su perfil de reparación tisular.",
    mechanism:
      "Promueve la angiogénesis, modula óxido nítrico y acelera la migración celular en tejidos dañados (estudios in vitro y en modelos animales).",
    dosing: "Protocolos de investigación: 250–500 mcg/día subcutáneo o intramuscular cerca del sitio.",
    storage: "Refrigerar liofilizado a 2–8°C. Reconstituido: estable 7–14 días refrigerado.",
    tiers: standardTiers(280),
    faqs: [
      { q: "¿BPC-157 requiere refrigeración para envío?", a: "Se envía liofilizado, estable a temperatura ambiente durante el tránsito. Refrigerar al recibir." },
      { q: "¿Qué pureza tiene?", a: "≥99% verificada por HPLC. COA disponible bajo solicitud." },
    ],
    related: ["bpc-tb500", "tb-500"],
    bestSeller: true,
    keywords: ["comprar bpc 157 mayoreo", "bpc 157 precio mexico", "bpc 157 distribuidor"],
  },
  {
    slug: "semaglutida",
    name: "Semaglutida",
    category: "perdida-peso",
    mgPerVial: "5 mg",
    image: semaglutida,
    shortDesc: "Análogo de GLP-1 para investigación en pérdida de peso.",
    longDesc:
      "Semaglutida es un análogo del péptido GLP-1 con vida media extendida. Estudios clínicos demuestran reducción significativa de peso corporal y mejora del control glucémico.",
    mechanism:
      "Agonista del receptor GLP-1: reduce vaciado gástrico, aumenta saciedad y modula secreción de insulina.",
    dosing: "Titulación gradual semanal en investigación: 0.25 → 0.5 → 1.0 → 2.4 mg/semana SC.",
    storage: "Refrigerar 2–8°C. Reconstituido: 28 días refrigerado.",
    tiers: standardTiers(950),
    faqs: [
      { q: "¿Diferencia con tirzepatida?", a: "Semaglutida es agonista GLP-1 puro. Tirzepatida es dual GLP-1/GIP, con mayor pérdida de peso en estudios." },
      { q: "¿Necesito agua bacteriostática?", a: "Sí, se vende por separado o en kit. Consulta opciones por WhatsApp." },
    ],
    related: ["tirzepatida", "retatrutide"],
    bestSeller: true,
    keywords: ["semaglutida mayoreo mexico", "semaglutida precio mayoreo", "comprar semaglutida"],
  },
  {
    slug: "tirzepatida",
    name: "Tirzepatida",
    category: "perdida-peso",
    mgPerVial: "10 mg",
    image: tirzepatida,
    shortDesc: "Agonista dual GLP-1/GIP de última generación.",
    longDesc:
      "Tirzepatida combina actividad sobre receptores GLP-1 y GIP, mostrando en ensayos clínicos pérdidas de peso superiores a otros análogos.",
    mechanism: "Activación dual de incretinas que modulan apetito, sensibilidad a insulina y oxidación lipídica.",
    dosing: "Investigación: titulación 2.5 → 5 → 10 → 15 mg/semana SC.",
    storage: "Refrigerar 2–8°C. Reconstituido: 28 días refrigerado.",
    tiers: standardTiers(1450),
    faqs: [
      { q: "¿Cuántas semanas dura un vial de 10 mg?", a: "Depende de la dosis del protocolo. A 5 mg/semana, aproximadamente 2 semanas." },
    ],
    related: ["semaglutida", "retatrutide"],
    bestSeller: true,
    keywords: ["tirzepatida mayoreo", "tirzepatida precio", "tirzepatida distribuidor mexico"],
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295 (con DAC)",
    category: "crecimiento-muscular",
    mgPerVial: "2 mg",
    image: cjc1295,
    shortDesc: "Análogo de GHRH de larga duración.",
    longDesc:
      "CJC-1295 con DAC extiende la liberación pulsátil de GH durante varios días. Comúnmente combinado con Ipamorelin en investigación.",
    mechanism: "Agonista del receptor de GHRH; estimula la pituitaria a liberar GH endógena.",
    dosing: "Investigación: 1–2 mg semanales SC.",
    storage: "Refrigerar liofilizado. Reconstituido: 14 días refrigerado.",
    tiers: standardTiers(420),
    faqs: [
      { q: "¿Se combina con Ipamorelin?", a: "Sí, es el stack más común en investigación de secretagogos." },
    ],
    related: ["ipamorelin"],
    bestSeller: true,
    keywords: ["cjc 1295 distribuidor", "cjc 1295 mayoreo mexico"],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "crecimiento-muscular",
    mgPerVial: "5 mg",
    image: ipamorelin,
    shortDesc: "Secretagogo selectivo de GH sin elevar cortisol.",
    longDesc:
      "Ipamorelin imita a la grelina activando el receptor GHS-R1a sin afectar significativamente cortisol o prolactina.",
    mechanism: "Agonista selectivo de GHS-R1a; libera GH pulsátil.",
    dosing: "Investigación: 200–300 mcg, 2–3 veces al día SC.",
    storage: "Refrigerar liofilizado. Reconstituido: 14 días refrigerado.",
    tiers: standardTiers(380),
    faqs: [
      { q: "¿Mejor antes o después de entrenar?", a: "Protocolos comunes lo usan post-entrenamiento y antes de dormir." },
    ],
    related: ["cjc-1295"],
    bestSeller: true,
    keywords: ["ipamorelin precio mayoreo", "ipamorelin mexico"],
  },
  {
    slug: "bpc-tb500",
    name: "BPC-157 + TB-500 Stack",
    category: "recuperacion",
    mgPerVial: "5 mg + 5 mg",
    image: bpctb500,
    shortDesc: "Stack de recuperación profunda para tejidos y articulaciones.",
    longDesc:
      "Combinación sinérgica de BPC-157 y TB-500 (Timosina Beta-4) usada en investigación para recuperación acelerada.",
    mechanism: "BPC-157 acelera angiogénesis local; TB-500 promueve migración celular sistémica y regeneración.",
    dosing: "Investigación: 250–500 mcg BPC + 2–2.5 mg TB-500 semanales SC.",
    storage: "Refrigerar liofilizado.",
    tiers: standardTiers(620),
    faqs: [],
    related: ["bpc-157"],
    bestSeller: true,
    keywords: ["bpc tb500 stack mayoreo", "tb 500 mexico"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "perdida-peso",
    mgPerVial: "10 mg",
    image: retatrutide,
    shortDesc: "Triagonista GLP-1 / GIP / Glucagón en investigación.",
    longDesc:
      "Retatrutide es la siguiente generación tras tirzepatida: triple agonista que en ensayos fase 2 mostró >24% reducción de peso.",
    mechanism: "Activación simultánea de receptores GLP-1, GIP y glucagón.",
    dosing: "Investigación: titulación 2 → 4 → 8 → 12 mg semanales SC.",
    storage: "Refrigerar 2–8°C.",
    tiers: standardTiers(1850),
    faqs: [
      { q: "¿Está aprobado por COFEPRIS?", a: "No. Producto exclusivamente para uso de investigación." },
    ],
    related: ["tirzepatida", "semaglutida"],
    keywords: ["retatrutide mayoreo", "retatrutide mexico"],
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    category: "bronceado",
    mgPerVial: "10 mg",
    image: melanotan,
    shortDesc: "Análogo de α-MSH para pigmentación cutánea.",
    longDesc:
      "Melanotan II estimula la producción de melanina, generando pigmentación más oscura y duradera con menor exposición UV.",
    mechanism: "Agonista no selectivo de receptores de melanocortina (MC1R, MC3R, MC4R).",
    dosing: "Protocolos de investigación: dosis de carga 0.25–1 mg/día y mantenimiento.",
    storage: "Refrigerar liofilizado.",
    tiers: standardTiers(450),
    faqs: [],
    related: [],
    keywords: ["melanotan 2 mayoreo", "melanotan precio mexico"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
