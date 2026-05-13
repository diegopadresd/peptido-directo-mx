import bpc157 from "@/assets/vial-bpc157.jpg";
import semaglutida from "@/assets/vial-semaglutida.jpg";
import tirzepatida from "@/assets/vial-tirzepatida.jpg";
import cjc1295 from "@/assets/vial-cjc1295.jpg";
import ipamorelin from "@/assets/vial-ipamorelin.jpg";
import bpctb500 from "@/assets/vial-bpctb500.jpg";
import retatrutide from "@/assets/vial-retatrutide.jpg";
import melanotan from "@/assets/vial-melanotan.jpg";
import generic from "@/assets/vial-generic.jpg";

export type DoseVariant = {
  dose: string;          // ej. "10 mg"
  mg: number;            // ej. 10
  basePricePerVial: number; // MXN por vial @ MOQ 10
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDesc: string;
  longDesc: string;
  mechanism: string;
  dosing: string;
  storage: string;
  variants: DoseVariant[];
  faqs: Array<{ q: string; a: string }>;
  related: string[];
  bestSeller?: boolean;
  keywords: string[];
};

const v = (dose: string, mg: number, basePricePerVial: number): DoseVariant => ({
  dose, mg, basePricePerVial,
});

export const products: Product[] = [
  // ───────── RECUPERACIÓN ─────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "recuperacion",
    image: bpc157,
    shortDesc: "Péptido pentadecapéptido para reparación de tejidos blandos y soporte gastrointestinal.",
    longDesc:
      "BPC-157 (Body Protection Compound) es un fragmento sintético derivado de una proteína protectora del jugo gástrico humano. Ampliamente utilizado en investigación por su perfil de reparación tisular en tendones, ligamentos y tracto digestivo.",
    mechanism: "Promueve angiogénesis, modula la vía del óxido nítrico y acelera la migración de fibroblastos en sitios de daño tisular (estudios in vitro y modelos animales).",
    dosing: "Protocolos de investigación: 250–500 mcg/día subcutáneo o intramuscular cerca del sitio diana.",
    storage: "Liofilizado: estable a temperatura ambiente en tránsito; refrigerar 2–8 °C al recibir. Reconstituido: 7–14 días refrigerado.",
    variants: [v("5 mg", 5, 810), v("10 mg", 10, 810)],
    faqs: [
      { q: "¿Por qué BPC-157 5 mg y 10 mg cuestan igual?", a: "Es una promoción del laboratorio: el vial de 10 mg duplica el contenido al mismo precio. Ideal para ciclos largos." },
      { q: "¿Requiere refrigeración para envío?", a: "No. Se envía liofilizado y es estable a temperatura ambiente durante el tránsito de 10–20 días." },
    ],
    related: ["bpc-tb500-wolverine", "tb-500"],
    bestSeller: true,
    keywords: ["bpc 157 mayoreo", "comprar bpc 157 mexico", "bpc 157 5mg precio", "bpc 157 10mg distribuidor"],
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    category: "recuperacion",
    image: generic,
    shortDesc: "Fragmento de Timosina Beta-4 para regeneración sistémica.",
    longDesc:
      "TB-500 es un fragmento sintético de la Timosina Beta-4, una proteína presente naturalmente en casi todas las células humanas. Estudiada por su rol en migración celular, formación de vasos sanguíneos y reparación post-lesión.",
    mechanism: "Se une a actina G y promueve diferenciación de células progenitoras endoteliales, acelerando reparación tisular sistémica.",
    dosing: "Investigación: 2–2.5 mg semanales SC, divididos en 1–2 aplicaciones.",
    storage: "Liofilizado refrigerado 2–8 °C. Reconstituido: estable 14 días refrigerado.",
    variants: [v("5 mg", 5, 900), v("10 mg", 10, 1000)],
    faqs: [],
    related: ["bpc-157", "bpc-tb500-wolverine"],
    keywords: ["tb 500 mayoreo", "thymosin beta 4 mexico", "tb500 distribuidor"],
  },
  {
    slug: "bpc-tb500-wolverine",
    name: "BPC-157 + TB-500 (Wolverine)",
    category: "recuperacion",
    image: bpctb500,
    shortDesc: "Stack premezclado para recuperación profunda de tejidos blandos.",
    longDesc:
      'El "stack Wolverine" combina BPC-157 (reparación local + GI) con TB-500 (regeneración sistémica) en un solo vial. Reduce el número de inyecciones y simplifica protocolos de investigación de recuperación post-lesión.',
    mechanism: "Sinergia: BPC-157 acelera angiogénesis y reparación local; TB-500 aporta migración celular y diferenciación progenitora a nivel sistémico.",
    dosing: "Investigación: dosis típica de 250–500 mcg BPC + 1–2.5 mg TB-500 semanales SC.",
    storage: "Liofilizado refrigerado 2–8 °C.",
    variants: [v("5 + 5 mg", 5, 810), v("10 + 10 mg", 10, 1620)],
    faqs: [],
    related: ["bpc-157", "tb-500"],
    bestSeller: true,
    keywords: ["wolverine peptido mayoreo", "bpc tb500 stack", "stack recuperacion peptidos mexico"],
  },

  // ───────── GH / MUSCULAR ─────────
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (No DAC)",
    category: "gh-muscular",
    image: cjc1295,
    shortDesc: "Análogo modificado de GHRH de acción corta.",
    longDesc:
      "CJC-1295 sin DAC (también conocido como Mod-GRF 1-29) es un análogo de la hormona liberadora de hormona de crecimiento. Su vida media corta produce pulsos fisiológicos de GH, ideal para combinar con un secretagogo tipo Ipamorelin.",
    mechanism: "Agonista del receptor de GHRH en la pituitaria anterior. Aumenta la amplitud del pulso natural de GH sin elevar prolactina ni cortisol.",
    dosing: "Investigación: 100 mcg, 1–3 veces al día SC, generalmente combinado con Ipamorelin.",
    storage: "Liofilizado refrigerado. Reconstituido: 14 días refrigerado.",
    variants: [v("5 mg", 5, 500)],
    faqs: [],
    related: ["cjc-ipamorelin", "ipamorelin", "sermorelin"],
    keywords: ["cjc 1295 no dac mayoreo", "mod grf 1 29 mexico"],
  },
  {
    slug: "cjc-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "gh-muscular",
    image: cjc1295,
    shortDesc: "El stack clásico de secretagogos de GH en un solo vial.",
    longDesc:
      "Combinación premezclada del agonista GHRH (CJC-1295) con el secretagogo selectivo de GH (Ipamorelin). Es el stack más utilizado en investigación para amplificar el pulso natural de hormona de crecimiento.",
    mechanism: "Doble vía: CJC-1295 estimula el receptor de GHRH y Ipamorelin activa GHS-R1a (receptor de grelina). El efecto combinado produce un pulso pronunciado y limpio de GH.",
    dosing: "Investigación: 100 mcg de cada uno, 1–3 veces al día SC. Aplicación nocturna en ayunas es la más estudiada.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 + 5 mg", 5, 945)],
    faqs: [
      { q: "¿Cuánto dura un vial?", a: "A 100 mcg/día rinde aproximadamente 50 dosis (~7 semanas)." },
    ],
    related: ["cjc-1295-no-dac", "ipamorelin", "tesamorelin"],
    bestSeller: true,
    keywords: ["cjc ipamorelin mayoreo", "stack gh peptidos mexico", "blend cjc ipamorelin precio"],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "gh-muscular",
    image: ipamorelin,
    shortDesc: "Secretagogo selectivo de GH sin elevar cortisol ni prolactina.",
    longDesc:
      "Ipamorelin es un pentapéptido mimético de grelina con altísima selectividad por el receptor GHS-R1a. Libera GH pulsátil sin afectar significativamente cortisol, prolactina ni aldosterona.",
    mechanism: "Agonista selectivo de GHS-R1a en pituitaria anterior. Provoca liberación pulsátil de GH endógena.",
    dosing: "Investigación: 200–300 mcg, 2–3 veces al día SC.",
    storage: "Liofilizado refrigerado. Reconstituido: 14 días refrigerado.",
    variants: [v("10 mg", 10, 600)],
    faqs: [],
    related: ["cjc-ipamorelin", "hexarelin"],
    keywords: ["ipamorelin 10mg mayoreo", "ipamorelin precio mexico"],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "gh-muscular",
    image: generic,
    shortDesc: "GHRH estabilizado, estudiado para reducción de grasa visceral.",
    longDesc:
      "Tesamorelin es un análogo estabilizado de GHRH humano (44 aminoácidos). En ensayos clínicos demostró reducción significativa de tejido adiposo visceral y mejora del perfil lipídico.",
    mechanism: "Agonista del receptor de GHRH; eleva niveles de GH e IGF-1 con preservación de la pulsatilidad fisiológica.",
    dosing: "Investigación: 1–2 mg/día SC al acostarse.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 800), v("20 mg", 20, 1400)],
    faqs: [],
    related: ["cjc-ipamorelin", "sermorelin"],
    keywords: ["tesamorelin mayoreo", "tesamorelin precio mexico", "tesamorelin 10mg distribuidor"],
  },
  {
    slug: "hgh-fragment-176-191",
    name: "HGH Fragment 176-191",
    category: "gh-muscular",
    image: generic,
    shortDesc: "Fragmento lipolítico aislado de la cadena de GH.",
    longDesc:
      "Aminoácidos 176-191 del extremo C-terminal de la hormona de crecimiento humana. Conserva la actividad lipolítica sin los efectos sobre IGF-1 ni metabolismo de carbohidratos del HGH completo.",
    mechanism: "Estimula la lipólisis y bloquea la lipogénesis vía receptores beta-3 adrenérgicos en adipocitos.",
    dosing: "Investigación: 250–500 mcg, 2 veces al día SC en ayunas.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 500)],
    faqs: [],
    related: ["aod-9604", "5-amino-1mq"],
    keywords: ["hgh fragment 176 191 mayoreo", "fragmento gh mexico"],
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    category: "gh-muscular",
    image: generic,
    shortDesc: "Análogo de IGF-1 de larga acción (vida media ~20–30 h).",
    longDesc:
      "IGF-1 Long R3 es una variante recombinante con vida media extendida y baja afinidad por proteínas de unión IGFBP, lo que la mantiene biodisponible más tiempo que el IGF-1 nativo.",
    mechanism: "Activa el receptor IGF-1R en músculo, hueso y otros tejidos, promoviendo síntesis proteica e hiperplasia.",
    dosing: "Investigación: 20–50 mcg/día SC, generalmente post-entreno.",
    storage: "Refrigerar 2–8 °C. Reconstituir solo con AA 0.6%.",
    variants: [v("1 mg", 1, 750)],
    faqs: [],
    related: ["cjc-ipamorelin"],
    keywords: ["igf 1 lr3 mayoreo", "igf lr3 mexico precio"],
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "gh-muscular",
    image: generic,
    shortDesc: "GHRH 1-29, el secretagogo clásico de pituitaria.",
    longDesc:
      "Sermorelin es el fragmento bioactivo (1-29) de la GHRH endógena humana. Es uno de los secretagogos de GH más estudiados en clínica.",
    mechanism: "Agonista del receptor de GHRH; libera GH respetando los pulsos naturales del eje somatotrópico.",
    dosing: "Investigación: 200–400 mcg al acostarse SC.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 500)],
    faqs: [],
    related: ["tesamorelin", "cjc-1295-no-dac"],
    keywords: ["sermorelin mayoreo", "sermorelin precio mexico"],
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    category: "gh-muscular",
    image: generic,
    shortDesc: "Hexapéptido secretagogo de GH de alta potencia.",
    longDesc:
      "Hexarelin es un análogo sintético de GHRP-6 con mayor potencia y menor estímulo de apetito. Estudiado además por sus efectos cardioprotectores.",
    mechanism: "Agonista del receptor GHS-R1a; libera GH y modula receptores CD36 cardíacos.",
    dosing: "Investigación: 100 mcg, 2–3 veces al día SC.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 500)],
    faqs: [],
    related: ["ipamorelin"],
    keywords: ["hexarelin mayoreo", "hexarelin mexico"],
  },

  // ───────── PÉRDIDA DE PESO ─────────
  {
    slug: "semaglutida",
    name: "Semaglutida",
    category: "perdida-peso",
    image: semaglutida,
    shortDesc: "Análogo de GLP-1 de larga acción para investigación en pérdida de peso.",
    longDesc:
      "Semaglutida es un análogo del péptido GLP-1 con vida media extendida (~7 días) gracias a una cadena lateral de ácido graso. Estudios clínicos muestran reducciones de peso corporal de 12–15% y mejora del control glucémico.",
    mechanism: "Agonista del receptor GLP-1: retrasa vaciado gástrico, aumenta saciedad central y potencia secreción de insulina dependiente de glucosa.",
    dosing: "Titulación semanal típica: 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg/semana SC.",
    storage: "Refrigerar 2–8 °C. Reconstituido: 28 días refrigerado.",
    variants: [v("5 mg", 5, 900), v("10 mg", 10, 1400)],
    faqs: [
      { q: "¿Diferencia con tirzepatida?", a: "Semaglutida es agonista GLP-1 puro. Tirzepatida es dual GLP-1/GIP, con mayor pérdida de peso en ensayos comparativos." },
      { q: "¿Necesito agua bacteriostática?", a: "Sí, se vende por separado. Pídela en el carrito." },
    ],
    related: ["tirzepatida", "retatrutida", "cagrilintide"],
    bestSeller: true,
    keywords: ["semaglutida mayoreo mexico", "semaglutida 10mg precio", "semaglutida distribuidor"],
  },
  {
    slug: "tirzepatida",
    name: "Tirzepatida",
    category: "perdida-peso",
    image: tirzepatida,
    shortDesc: "Agonista dual GLP-1 / GIP de última generación.",
    longDesc:
      "Tirzepatida activa simultáneamente los receptores GLP-1 y GIP. En ensayos SURMOUNT mostró pérdidas de peso superiores al 20% en 72 semanas, superando a semaglutida en comparativos directos.",
    mechanism: "Doble activación de incretinas: regula apetito central (GLP-1) y mejora sensibilidad a insulina y oxidación lipídica (GIP).",
    dosing: "Titulación típica: 2.5 → 5 → 7.5 → 10 → 12.5 → 15 mg/semana SC.",
    storage: "Refrigerar 2–8 °C. Reconstituido: 28 días refrigerado.",
    variants: [v("10 mg", 10, 1250), v("30 mg", 30, 2700), v("60 mg", 60, 4200)],
    faqs: [
      { q: "¿Cuál vial me conviene más?", a: "El de 60 mg ofrece el mejor precio por mg. Para una titulación inicial de 5 mg/semana, el vial de 30 mg rinde ~6 semanas." },
    ],
    related: ["semaglutida", "retatrutida", "mazdutide"],
    bestSeller: true,
    keywords: ["tirzepatida mayoreo", "tirzepatida 60mg precio", "tirzepatida distribuidor mexico"],
  },
  {
    slug: "retatrutida",
    name: "Retatrutida",
    category: "perdida-peso",
    image: retatrutide,
    shortDesc: "Triple agonista GLP-1 / GIP / Glucagón en investigación.",
    longDesc:
      "Retatrutida es la próxima generación tras tirzepatida. Triagonista que en ensayos de fase 2 mostró >24% de reducción de peso a 48 semanas, el resultado más alto reportado para una incretina.",
    mechanism: "Activación simultánea de receptores GLP-1, GIP y glucagón. La adición de glucagón aumenta gasto energético basal.",
    dosing: "Titulación de investigación: 2 → 4 → 8 → 12 mg semanales SC.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("5 mg", 5, 900), v("10 mg", 10, 1600), v("20 mg", 20, 2700), v("40 mg", 40, 4750), v("60 mg", 60, 6750)],
    faqs: [
      { q: "¿Está aprobado por COFEPRIS?", a: "No. Producto exclusivamente para uso de investigación in vitro." },
    ],
    related: ["tirzepatida", "semaglutida"],
    bestSeller: true,
    keywords: ["retatrutida mayoreo", "retatrutida 60mg mexico", "retatrutide precio distribuidor"],
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    category: "perdida-peso",
    image: generic,
    shortDesc: "Análogo de amilina de larga acción.",
    longDesc:
      "Cagrilintide es un análogo de amilina con vida media extendida. En combinación con semaglutida (CagriSema) ha mostrado pérdidas de peso aún mayores en ensayos de fase 2.",
    mechanism: "Agonista de receptores de amilina y calcitonina; reduce apetito y enlentece vaciado gástrico vía SNC.",
    dosing: "Investigación: titulación 0.16 → 2.4 mg semanales SC.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("5 mg", 5, 750)],
    faqs: [],
    related: ["semaglutida", "tirzepatida"],
    keywords: ["cagrilintide mayoreo", "cagrilintide mexico"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "perdida-peso",
    image: generic,
    shortDesc: "Péptido mitocondrial para sensibilidad a insulina y energía.",
    longDesc:
      "MOTS-c es un péptido de 16 aminoácidos codificado en el ADN mitocondrial. Estudiado por su rol en homeostasis metabólica, sensibilidad a insulina y resistencia al estrés.",
    mechanism: "Activa AMPK y aumenta captación de glucosa muscular; modula respuestas metabólicas al ejercicio.",
    dosing: "Investigación: 5–10 mg semanales SC, divididos en 2–3 dosis.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 540)],
    faqs: [],
    related: ["5-amino-1mq", "nad-plus"],
    keywords: ["mots c mayoreo", "mots-c mexico precio"],
  },
  {
    slug: "5-amino-1mq",
    name: "5-Amino-1MQ",
    category: "perdida-peso",
    image: generic,
    shortDesc: "Inhibidor selectivo de NNMT, vía oral.",
    longDesc:
      "5-Amino-1MQ es una pequeña molécula que inhibe la enzima nicotinamida N-metiltransferasa (NNMT). Estudiada por su efecto sobre metabolismo de adipocitos y preservación de masa muscular.",
    mechanism: "Inhibe NNMT en adipocitos, restaurando NAD+ y SAM, lo que reduce expansión de tejido adiposo blanco.",
    dosing: "Investigación: 50–150 mg/día vía oral.",
    storage: "Almacenar a temperatura ambiente, lugar seco.",
    variants: [v("50 mg/cap × frasco", 50, 720)],
    faqs: [],
    related: ["mots-c", "aod-9604"],
    keywords: ["5 amino 1mq mayoreo", "5-amino-1mq mexico"],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "perdida-peso",
    image: generic,
    shortDesc: "Fragmento C-terminal modificado de hGH para lipólisis localizada.",
    longDesc:
      "AOD-9604 es una variante modificada del HGH Fragment 176-191 con un residuo de tirosina añadido. Diseñado para conservar el efecto lipolítico sin actividad sobre IGF-1.",
    mechanism: "Estimula lipólisis y bloquea lipogénesis sin estimulación significativa de receptores de GH.",
    dosing: "Investigación: 250–500 mcg/día SC en ayunas.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 600)],
    faqs: [],
    related: ["hgh-fragment-176-191"],
    keywords: ["aod 9604 mayoreo", "aod-9604 mexico"],
  },
  {
    slug: "mazdutide",
    name: "Mazdutide",
    category: "perdida-peso",
    image: generic,
    shortDesc: "Doble agonista GLP-1 / Glucagón.",
    longDesc:
      "Mazdutide (IBI362) es un doble agonista de los receptores GLP-1 y glucagón. En ensayos de fase 2 mostró pérdidas de peso significativas con perfil cardiometabólico favorable.",
    mechanism: "Combina supresión de apetito (GLP-1) con aumento de gasto energético (glucagón).",
    dosing: "Investigación: titulación 1.5 → 9 mg semanales SC.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 1250)],
    faqs: [],
    related: ["tirzepatida", "retatrutida"],
    keywords: ["mazdutide mayoreo", "mazdutide mexico precio"],
  },

  // ───────── COGNICIÓN ─────────
  {
    slug: "semax",
    name: "Semax",
    category: "cognicion",
    image: generic,
    shortDesc: "Heptapéptido nootrópico derivado de ACTH.",
    longDesc:
      "Semax es un análogo sintético del fragmento ACTH(4-10), desarrollado en Rusia. Estudiado por sus efectos sobre BDNF, NGF y mejora cognitiva tras estrés.",
    mechanism: "Aumenta expresión de BDNF y NGF en hipocampo; modula sistemas dopaminérgico y serotoninérgico.",
    dosing: "Investigación: 200–600 mcg/día intranasal.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 585)],
    faqs: [],
    related: ["selank", "dihexa"],
    keywords: ["semax mayoreo", "semax mexico"],
  },
  {
    slug: "selank",
    name: "Selank",
    category: "cognicion",
    image: generic,
    shortDesc: "Péptido ansiolítico sin efecto sedante.",
    longDesc:
      "Selank es un análogo sintético del péptido tuftsina, estudiado por sus propiedades ansiolíticas, antidepresivas y nootrópicas sin sedación.",
    mechanism: "Modula expresión de GABA, BDNF y serotonina; potencia inmunomodulación natural.",
    dosing: "Investigación: 250–900 mcg/día intranasal.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 600)],
    faqs: [],
    related: ["semax", "dsip"],
    keywords: ["selank mayoreo", "selank mexico"],
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "cognicion",
    image: generic,
    shortDesc: "Mezcla de péptidos neurotróficos derivados de cerebro porcino.",
    longDesc:
      "Cerebrolysin es una solución estandarizada de péptidos neurotróficos de bajo peso molecular y aminoácidos libres. Estudiada en demencia, ictus y traumatismo craneoencefálico.",
    mechanism: "Mimetiza factores neurotróficos endógenos (BDNF, GDNF, NGF) y modula plasticidad sináptica.",
    dosing: "Investigación: 5–30 ml/día IM o IV en ciclos de 10–20 días.",
    storage: "Refrigerar 2–8 °C, proteger de la luz.",
    variants: [v("10 ml", 10, 750)],
    faqs: [],
    related: ["semax", "dihexa"],
    keywords: ["cerebrolysin mayoreo", "cerebrolysin mexico precio"],
  },
  {
    slug: "dihexa",
    name: "Dihexa",
    category: "cognicion",
    image: generic,
    shortDesc: "Hexapéptido potenciador de sinaptogénesis (~7 órdenes vs BDNF).",
    longDesc:
      "Dihexa es un derivado de la angiotensina IV con extraordinaria capacidad de promover formación de nuevas sinapsis. Estudiado en modelos de Alzheimer y deterioro cognitivo.",
    mechanism: "Activa el receptor HGF/c-Met, promoviendo sinaptogénesis hipocampal.",
    dosing: "Investigación: 8–45 mg/día vía oral.",
    storage: "Almacenar en seco, temperatura ambiente.",
    variants: [v("10 mg", 10, 1000)],
    faqs: [],
    related: ["semax", "cerebrolysin"],
    keywords: ["dihexa mayoreo", "dihexa mexico"],
  },
  {
    slug: "dsip",
    name: "DSIP",
    category: "cognicion",
    image: generic,
    shortDesc: "Delta Sleep Inducing Peptide, modulador del sueño.",
    longDesc:
      "DSIP es un nonapéptido aislado de líquido cefalorraquídeo. Estudiado por su capacidad de promover sueño delta profundo y modular respuesta al estrés.",
    mechanism: "Modula liberación de hormonas hipotalámicas; promueve ondas delta en EEG.",
    dosing: "Investigación: 100–500 mcg al acostarse SC.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 450)],
    faqs: [],
    related: ["selank"],
    keywords: ["dsip mayoreo", "delta sleep peptide mexico"],
  },

  // ───────── LONGEVIDAD ─────────
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "longevidad",
    image: generic,
    shortDesc: "Tripéptido de cobre para piel, cabello y reparación dérmica.",
    longDesc:
      "GHK-Cu es un complejo de cobre con el tripéptido glicil-histidil-lisina, presente naturalmente en plasma humano (declina con la edad). Estudiado por sus efectos sobre regeneración de la piel y crecimiento capilar.",
    mechanism: "Modula expresión génica relacionada con remodelación de matriz extracelular, antioxidación y angiogénesis.",
    dosing: "Investigación: 1–3 mg/día SC o aplicación tópica reconstituida.",
    storage: "Refrigerar protegido de la luz.",
    variants: [v("50 mg", 50, 450), v("100 mg", 100, 800)],
    faqs: [],
    related: ["epithalon", "thymosin-alpha-1"],
    keywords: ["ghk cu mayoreo", "copper peptide mexico", "ghk cu 100mg precio"],
  },
  {
    slug: "epithalon",
    name: "Epithalon (Epitalon)",
    category: "longevidad",
    image: generic,
    shortDesc: "Tetrapéptido sintético modulador de telómeros.",
    longDesc:
      "Epithalon (Ala-Glu-Asp-Gly) es un péptido sintético desarrollado por el Prof. Khavinson. Estudiado por su capacidad de inducir expresión de telomerasa y prolongar telómeros en cultivos celulares.",
    mechanism: "Estimula la expresión de telomerasa, modula eje pineal y restaura ritmos circadianos de melatonina.",
    dosing: "Investigación: 5–10 mg/día SC en ciclos de 10–20 días, 2 veces al año.",
    storage: "Liofilizado refrigerado.",
    variants: [v("10 mg", 10, 1350)],
    faqs: [],
    related: ["ghk-cu", "nad-plus"],
    keywords: ["epithalon mayoreo", "epitalon mexico precio"],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "longevidad",
    image: generic,
    shortDesc: "Coenzima esencial para metabolismo energético y reparación de ADN.",
    longDesc:
      "Nicotinamida adenina dinucleótido (NAD+) es coenzima crítica en cientos de reacciones metabólicas. Sus niveles caen con la edad; la suplementación se estudia por sus efectos sobre energía celular y sirtuinas.",
    mechanism: "Sustrato de sirtuinas, PARPs y CD38; regula reparación de ADN y metabolismo mitocondrial.",
    dosing: "Investigación: 100–500 mg SC o IM, 2–3 veces por semana.",
    storage: "Refrigerar 2–8 °C protegido de la luz.",
    variants: [v("500 mg", 500, 720), v("1000 mg", 1000, 1200)],
    faqs: [],
    related: ["mots-c", "epithalon"],
    keywords: ["nad mayoreo", "nad+ mexico precio", "nad 1000mg distribuidor"],
  },
  {
    slug: "glutathione",
    name: "Glutathione",
    category: "longevidad",
    image: generic,
    shortDesc: "Antioxidante maestro, soporte hepático y dérmico.",
    longDesc:
      "El glutatión es el principal antioxidante intracelular. La suplementación parenteral es estudiada por su soporte a la detoxificación hepática, claridad dérmica y respuesta inmune.",
    mechanism: "Neutraliza ROS, conjuga xenobióticos en fase II hepática y regenera otros antioxidantes (vit. C y E).",
    dosing: "Investigación: 600–1500 mg IV o IM, 2–3 veces por semana.",
    storage: "Refrigerar 2–8 °C protegido de la luz.",
    variants: [v("1500 mg", 1500, 900)],
    faqs: [],
    related: ["nad-plus"],
    keywords: ["glutathione mayoreo", "glutation mexico precio"],
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "longevidad",
    image: generic,
    shortDesc: "Modulador inmunológico derivado del timo.",
    longDesc:
      "Timosina alfa-1 es un péptido de 28 aminoácidos secretado por el timo. Estudiado en modulación inmune, infecciones crónicas y soporte oncológico.",
    mechanism: "Activa células T y NK vía receptor TLR; restaura balance Th1/Th2.",
    dosing: "Investigación: 1.6 mg, 2 veces por semana SC.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 700)],
    faqs: [],
    related: ["ghk-cu"],
    keywords: ["thymosin alpha 1 mayoreo", "timosina alfa 1 mexico"],
  },

  // ───────── BRONCEADO ─────────
  {
    slug: "melanotan-i",
    name: "Melanotan I (MT-1)",
    category: "bronceado",
    image: melanotan,
    shortDesc: "Análogo selectivo MC1R para pigmentación más uniforme.",
    longDesc:
      "Melanotan I (afamelanotida) es un análogo lineal del α-MSH con afinidad por receptores de melanocortina, particularmente MC1R. Estudiado en porfiria eritropoyética y fotoprotección.",
    mechanism: "Activa MC1R en melanocitos, aumentando síntesis de eumelanina con menor actividad sobre MC3/4R.",
    dosing: "Investigación: 0.16–0.5 mg/día SC en fase de carga; mantenimiento variable.",
    storage: "Liofilizado refrigerado.",
    variants: [v("10 mg", 10, 450)],
    faqs: [],
    related: ["melanotan-ii"],
    keywords: ["melanotan 1 mayoreo", "mt 1 mexico", "afamelanotida"],
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan II (MT-2)",
    category: "bronceado",
    image: melanotan,
    shortDesc: "Análogo cíclico no selectivo de melanocortina.",
    longDesc:
      "Melanotan II es un análogo cíclico no selectivo de α-MSH. Genera pigmentación cutánea más rápida y prolongada, con efectos colaterales sobre apetito y libido por activación de MC3/4R.",
    mechanism: "Agonista no selectivo de MC1R, MC3R, MC4R y MC5R.",
    dosing: "Investigación: dosis de carga 0.25–1 mg/día; mantenimiento 1 mg, 2 veces por semana.",
    storage: "Liofilizado refrigerado.",
    variants: [v("10 mg", 10, 450)],
    faqs: [],
    related: ["melanotan-i", "pt-141"],
    keywords: ["melanotan 2 mayoreo", "mt 2 mexico", "melanotan ii distribuidor"],
  },

  // ───────── ÍNTIMO Y HORMONAL ─────────
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotida)",
    category: "intimo-hormonal",
    image: generic,
    shortDesc: "Agonista de melanocortina para respuesta de deseo.",
    longDesc:
      "PT-141 (bremelanotida) es un análogo de α-MSH derivado de Melanotan II. Aprobado en EE.UU. para trastorno de deseo hipoactivo en mujeres premenopáusicas.",
    mechanism: "Agonista de receptores MC3R y MC4R en SNC; activa vías de respuesta apetitiva no vasculares.",
    dosing: "Investigación: 1–2 mg SC, 30–60 min antes del momento deseado.",
    storage: "Liofilizado refrigerado.",
    variants: [v("10 mg", 10, 700)],
    faqs: [],
    related: ["kisspeptin-10", "oxytocin"],
    keywords: ["pt 141 mayoreo", "bremelanotida mexico", "pt-141 distribuidor"],
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    category: "intimo-hormonal",
    image: generic,
    shortDesc: "Decapéptido modulador del eje gonadal.",
    longDesc:
      "Kisspeptin-10 es el fragmento bioactivo de kisspeptin-54. Estudiada por su capacidad de estimular liberación de GnRH y restaurar pulsatilidad del eje hipotálamo-hipófisis-gónada.",
    mechanism: "Agonista del receptor GPR54 (KISS1R); estimula liberación pulsátil de GnRH.",
    dosing: "Investigación: 50–200 mcg SC, según protocolo.",
    storage: "Liofilizado refrigerado.",
    variants: [v("5 mg", 5, 600)],
    faqs: [],
    related: ["pt-141", "hmg"],
    keywords: ["kisspeptin 10 mayoreo", "kisspeptin mexico"],
  },
  {
    slug: "oxytocin",
    name: "Oxytocin Acetate",
    category: "intimo-hormonal",
    image: generic,
    shortDesc: "Nonapéptido del vínculo y conexión social.",
    longDesc:
      'Oxitocina sintética en sal acetato. Estudiada por sus efectos sobre vínculo social, confianza, ansiedad y respuesta al estrés.',
    mechanism: "Agonista del receptor de oxitocina; modula amígdala y eje HPA.",
    dosing: "Investigación: 10–40 UI intranasal o 100–600 mcg SC.",
    storage: "Refrigerar 2–8 °C.",
    variants: [v("10 mg", 10, 540)],
    faqs: [],
    related: ["pt-141"],
    keywords: ["oxitocina mayoreo", "oxytocin acetate mexico"],
  },
  {
    slug: "hmg",
    name: "HMG (Gonadotropina Menopáusica)",
    category: "intimo-hormonal",
    image: generic,
    shortDesc: "Gonadotropina con actividad FSH/LH para soporte gonadal.",
    longDesc:
      "HMG (Human Menopausal Gonadotropin) es una gonadotropina urinaria purificada que aporta actividad FSH y LH ~1:1. Utilizada en investigación de fertilidad y soporte de eje gonadal.",
    mechanism: "Estimula directamente células de Leydig (LH) y de Sertoli/granulosa (FSH).",
    dosing: "Investigación: 75–150 UI SC, 2–3 veces por semana según protocolo.",
    storage: "Liofilizado refrigerado.",
    variants: [v("75 UI", 75, 400)],
    faqs: [],
    related: ["kisspeptin-10"],
    keywords: ["hmg mayoreo", "menotropina mexico", "gonadotropina menopausica precio"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const minBasePrice = (p: Product) =>
  Math.min(...p.variants.map((v) => v.basePricePerVial));
