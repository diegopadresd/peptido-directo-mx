export type BlogSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  intro: string;
  sections: BlogSection[];
  faq?: { q: string; a: string }[];
  related?: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "como-empezar-negocio-peptidos-mexico",
    title: "Cómo empezar un negocio de péptidos en México en 2025",
    excerpt: "Guía práctica para arrancar tu negocio de reventa de péptidos en México con menos de $5,000 MXN: nichos, SKUs ganadores, márgenes reales y errores que matan al 80% de los nuevos.",
    date: "2025-04-12",
    readingMinutes: 12,
    tags: ["negocio", "guía", "principiantes"],
    intro:
      "El mercado mexicano de péptidos creció más de 340% entre 2023 y 2025. Las búsquedas de semaglutida, tirzepatida, BPC-157 y retatrutida se multiplicaron, mientras la oferta confiable sigue siendo escasa. Si estás pensando entrar como revendedor o distribuidor, este es el momento — pero hay que hacerlo bien desde el día uno. Esta guía resume lo que aprendimos surtiendo a más de 400 distribuidores en los últimos 18 meses.",
    sections: [
      {
        heading: "1. Define tu nicho antes de comprar inventario",
        paragraphs: [
          "El error más común es querer venderle a todos. Los péptidos no son un producto único: cada nicho compra cosas diferentes, paga precios diferentes y necesita comunicación diferente.",
          "Los tres nichos rentables en México son: usuarios de gimnasio (BPC-157, ipamorelin, CJC-1295, TB-500), pérdida de peso (semaglutida, tirzepatida, retatrutida) y clínicas estéticas (GHK-Cu, melanotan, glutathione).",
        ],
        list: [
          "Gym/biohackers: ticket promedio $1,200–$2,500 MXN, alta recompra mensual.",
          "Pérdida de peso: ticket $2,800–$5,500 MXN, recompra cada 4 semanas.",
          "Estética/clínicas: ticket $5,000–$15,000 MXN, recompra trimestral pero alto volumen.",
        ],
      },
      {
        heading: "2. Empieza con 3 a 5 SKUs, no más",
        paragraphs: [
          "Comprar 15 productos diferentes en cantidades pequeñas es la forma más rápida de quedarte con capital muerto. Empieza con los tres más buscados de tu nicho y agrega SKUs solo cuando tu rotación lo justifique.",
          "Para gym, el combo BPC-157 5 mg + ipamorelin 5 mg + TB-500 5 mg cubre el 70% de la demanda. Para pérdida de peso, semaglutida 5 mg + tirzepatida 10 mg es suficiente para arrancar.",
        ],
      },
      {
        heading: "3. Compra al mayoreo desde el primer pedido",
        paragraphs: [
          "Comprar viales sueltos a precio retail no deja margen real. Nuestro MOQ es 10 viales mezclados y a partir de ahí el precio baja entre 35% y 55% contra retail.",
          "Con $5,000 MXN puedes armar un kit inicial de 10 viales que te genera $9,000–$12,000 MXN de venta. Reinvierte el 50% del primer ciclo y en 3–4 meses estás moviendo 80–120 viales/mes.",
        ],
      },
      {
        heading: "4. WhatsApp es tu canal principal, no la tienda online",
        paragraphs: [
          "El cliente mexicano de péptidos compra por WhatsApp. Quiere hablar con alguien, preguntar dosis, ver fotos del lote. Tener una tienda Shopify perfecta no sirve si nadie te escribe.",
          "Construye tu funnel así: contenido en Instagram/TikTok → CTA a WhatsApp → catálogo PDF → cierre por mensaje → pago por Mercado Pago o transferencia → envío con guía.",
        ],
      },
      {
        heading: "5. Reinversión disciplinada los primeros 6 meses",
        paragraphs: [
          "El que se quema es el que sale las primeras ganancias en gastos personales. Los primeros 6 meses, el 50% de cada venta vuelve a inventario. Así pasas de 10 viales a 100 viales sin meter capital fresco.",
        ],
      },
    ],
    faq: [
      { q: "¿Cuánto necesito para empezar?", a: "Con $5,000 MXN puedes armar un kit de 10 viales mezclados que te permite generar entre $9,000 y $12,000 MXN en ventas el primer ciclo." },
      { q: "¿Es legal vender péptidos en México?", a: "Los péptidos se comercializan en México como productos de investigación. Las clínicas y profesionales de la salud son los responsables del uso clínico final." },
      { q: "¿Cuál es el margen promedio?", a: "Entre 80% y 180% según el SKU y el canal. Los péptidos GLP-1 (semaglutida, tirzepatida, retatrutida) son los de mayor margen absoluto." },
    ],
    related: ["semaglutida-vs-tirzepatida-cual-vender", "errores-comunes-revendedores-peptidos", "precios-peptidos-mayoreo-mexico-2025"],
  },
  {
    slug: "semaglutida-vs-tirzepatida-cual-vender",
    title: "Semaglutida vs Tirzepatida vs Retatrutida: cuál vender en México en 2025",
    excerpt: "Comparativa práctica de los tres GLP-1 más vendidos en México: precios al mayoreo, margen, perfil de cliente, recompra y cuál conviene tener en stock primero.",
    date: "2025-05-02",
    readingMinutes: 14,
    tags: ["GLP-1", "semaglutida", "tirzepatida", "retatrutida"],
    intro:
      "Los GLP-1 son la categoría que más creció en péptidos en México. Tres moléculas dominan el mercado: semaglutida (la pionera), tirzepatida (la dual GIP/GLP-1) y retatrutida (la triple agonista que recién está entrando). Si vas a entrar al negocio de pérdida de peso, esta es la decisión más importante que vas a tomar.",
    sections: [
      {
        heading: "Semaglutida: el caballo de batalla",
        paragraphs: [
          "Es la molécula más conocida (Ozempic, Wegovy en versiones farmacéuticas). El cliente ya la pide por nombre, lo que reduce el costo de educación. Es ideal para arrancar.",
          "Precio mayoreo típico: $850–$1,200 MXN por vial 5 mg (10+ unidades). Reventa: $1,800–$2,800 MXN. Recompra: cada 4–5 semanas.",
        ],
      },
      {
        heading: "Tirzepatida: el upgrade premium",
        paragraphs: [
          "Doble agonista GIP/GLP-1. Mejor pérdida de peso reportada en estudios y mejor tolerancia gastrointestinal. El cliente que ya probó semaglutida y quiere 'más fuerte' pide tirzepatida.",
          "Precio mayoreo: $1,400–$2,200 MXN vial 10 mg. Reventa: $3,200–$4,800 MXN. Margen absoluto mayor por unidad.",
        ],
      },
      {
        heading: "Retatrutida: el producto de oportunidad",
        paragraphs: [
          "Triple agonista (GLP-1, GIP, glucagón). Todavía no aprobada como medicamento en la mayoría de países, lo que la mantiene como producto de investigación con alta demanda y poca oferta.",
          "Quien tiene retatrutida en stock cobra premium del 40–60% sobre tirzepatida. Es el producto que más rápido se vende y el de mayor margen porcentual.",
        ],
      },
      {
        heading: "Estrategia recomendada por etapa",
        list: [
          "Mes 1–3: solo semaglutida 5 mg. Aprende a vender el GLP-1.",
          "Mes 4–6: agrega tirzepatida 10 mg. Sube ticket promedio.",
          "Mes 7+: retatrutida 5 mg/10 mg como producto premium para clientes recurrentes.",
        ],
      },
    ],
    faq: [
      { q: "¿Cuál tiene más margen?", a: "Retatrutida en porcentaje, tirzepatida en monto absoluto, semaglutida en volumen total." },
      { q: "¿Cuál se mueve más rápido?", a: "Semaglutida por reconocimiento de marca, pero retatrutida se agota en horas cuando hay stock." },
    ],
    related: ["como-empezar-negocio-peptidos-mexico", "retatrutida-mexico-mayoreo", "precios-peptidos-mayoreo-mexico-2025"],
  },
  {
    slug: "bpc-157-guia-completa-distribuidores",
    title: "BPC-157: guía completa para distribuidores en México",
    excerpt: "Todo lo que un revendedor debe saber sobre BPC-157: por qué es el péptido más vendido en gimnasios, dosis típicas, presentaciones, precios al mayoreo y argumentos de venta.",
    date: "2025-05-08",
    readingMinutes: 11,
    tags: ["BPC-157", "recuperación", "gym"],
    intro:
      "BPC-157 (Body Protection Compound) es el péptido más vendido en el nicho gym/recuperación en México. Es el primer SKU que cualquier distribuidor debería tener en stock. Aquí va lo que necesitas saber para venderlo bien.",
    sections: [
      {
        heading: "Qué es y por qué se vende tanto",
        paragraphs: [
          "BPC-157 es un péptido de 15 aminoácidos derivado de una proteína gástrica. Se usa para acelerar recuperación de tendones, ligamentos y músculo.",
          "El cliente típico es alguien con lesión deportiva, dolor crónico o que entrena pesado y busca acortar tiempos de recuperación. Es un producto que el usuario recompra cada 4–6 semanas mientras dura el ciclo.",
        ],
      },
      {
        heading: "Presentaciones que se venden en México",
        list: [
          "BPC-157 5 mg vial: el estándar, 90% de las ventas.",
          "BPC-157 10 mg vial: para usuarios avanzados o ciclos largos.",
          "BPC-157 + TB-500 combo: el upsell más rentable.",
        ],
      },
      {
        heading: "Precios mayoreo y reventa",
        paragraphs: [
          "Mayoreo (10+ viales): $380–$520 MXN vial 5 mg. Reventa típica: $850–$1,200 MXN. Margen >100% es realista.",
        ],
      },
      {
        heading: "Argumentos de venta que funcionan",
        list: [
          "Recuperación 2–3x más rápida en lesiones de tendón.",
          "Compatible con cualquier rutina de entrenamiento.",
          "Sin efectos androgénicos, no afecta hormonas.",
          "Se puede combinar con TB-500 para potenciar resultado.",
        ],
      },
    ],
    faq: [
      { q: "¿Cuál es el MOQ?", a: "10 viales mezclados con otros SKUs." },
      { q: "¿Necesita refrigeración?", a: "Sí, refrigerado entre 2–8°C una vez reconstituido. Liofilizado tolera temperatura ambiente en envío." },
    ],
    related: ["ipamorelin-cjc-1295-stack-ventas", "logistica-envio-peptidos-cadena-frio", "como-empezar-negocio-peptidos-mexico"],
  },
  {
    slug: "retatrutida-mexico-mayoreo",
    title: "Retatrutida en México: el péptido de mayor margen en 2025",
    excerpt: "Por qué retatrutida es el producto más rentable para distribuidores de péptidos en México: oferta limitada, demanda creciente, ticket promedio alto y márgenes superiores al 150%.",
    date: "2025-05-05",
    readingMinutes: 10,
    tags: ["retatrutida", "GLP-1", "premium"],
    intro:
      "Retatrutida es el péptido del que todos hablan pero pocos tienen en stock. Si quieres diferenciarte como distribuidor en México, este es el producto que te pone arriba del resto.",
    sections: [
      {
        heading: "Qué es retatrutida",
        paragraphs: [
          "Triple agonista de receptores GLP-1, GIP y glucagón. En estudios clínicos mostró pérdida de peso superior a tirzepatida. Aún no está aprobada comercialmente, lo que la mantiene como producto de investigación con alta demanda.",
        ],
      },
      {
        heading: "Por qué tiene margen superior",
        list: [
          "Pocos proveedores la importan a México.",
          "El cliente que la pide ya conoce semaglutida y tirzepatida — paga premium sin objetar.",
          "No hay equivalente farmacéutico de marca con el que compararse.",
        ],
      },
      {
        heading: "Precios y posicionamiento",
        paragraphs: [
          "Mayoreo (10+ viales): $1,800–$2,600 MXN vial 5 mg. Reventa: $4,500–$6,800 MXN. Margen porcentual >150%.",
          "Posiciónalo como 'la siguiente generación de GLP-1'. No compitas en precio: vende exclusividad y disponibilidad.",
        ],
      },
    ],
    faq: [
      { q: "¿Cuándo conviene tenerla en stock?", a: "Cuando ya tengas base de clientes recurrentes de semaglutida o tirzepatida que pidan algo 'más fuerte'." },
    ],
    related: ["semaglutida-vs-tirzepatida-cual-vender", "precios-peptidos-mayoreo-mexico-2025"],
  },
  {
    slug: "ipamorelin-cjc-1295-stack-ventas",
    title: "Ipamorelin + CJC-1295: el stack que más se vende en México",
    excerpt: "Cómo posicionar y vender el combo ipamorelin + CJC-1295 (con o sin DAC), el producto favorito del nicho anti-aging y composición corporal en México.",
    date: "2025-05-09",
    readingMinutes: 9,
    tags: ["ipamorelin", "CJC-1295", "GH", "anti-aging"],
    intro:
      "Ipamorelin y CJC-1295 son péptidos secretagogos de GH. Combinados son el stack más popular en México para clientes anti-aging, pérdida de grasa visceral y mejora de calidad de sueño.",
    sections: [
      {
        heading: "Qué hace cada uno",
        paragraphs: [
          "Ipamorelin estimula liberación pulsátil de GH sin afectar cortisol ni prolactina. CJC-1295 (sin DAC, también llamado mod GRF 1-29) potencia y prolonga ese pulso.",
          "Juntos producen una liberación natural de GH que mejora composición corporal, sueño profundo y recuperación.",
        ],
      },
      {
        heading: "Versiones DAC vs no-DAC",
        list: [
          "CJC-1295 sin DAC: pulsos más naturales, ideal para combinar con ipamorelin.",
          "CJC-1295 con DAC: vida media de hasta 8 días, una inyección semanal.",
        ],
      },
      {
        heading: "Precios mayoreo",
        paragraphs: [
          "Ipamorelin 5 mg: $320–$450 MXN. CJC-1295 sin DAC 5 mg: $380–$520 MXN. Combo blend 10 mg: $580–$780 MXN. Reventa del combo: $1,400–$2,000 MXN.",
        ],
      },
    ],
    related: ["bpc-157-guia-completa-distribuidores", "ghk-cu-mercado-estetico-mexico"],
  },
  {
    slug: "como-importar-peptidos-legalmente-mexico",
    title: "Cómo se manejan los péptidos en México: marco regulatorio para distribuidores",
    excerpt: "Qué dice COFEPRIS, cómo se clasifican los péptidos como producto de investigación, y cómo operar tu negocio de forma transparente en México.",
    date: "2025-04-25",
    readingMinutes: 8,
    tags: ["regulación", "COFEPRIS", "legal"],
    intro:
      "Una de las preguntas más comunes de distribuidores nuevos es cómo opera legalmente este mercado. Aquí va una explicación clara, sin promesas y sin asesoría legal — solo el marco práctico que usamos.",
    sections: [
      {
        heading: "Clasificación como producto de investigación",
        paragraphs: [
          "La mayoría de péptidos no están registrados como medicamento de venta libre en México. Se comercializan como productos de investigación bioquímica (research chemicals).",
          "El uso clínico final es responsabilidad de profesionales de la salud o del usuario. El distribuidor surte el producto, no prescribe.",
        ],
      },
      {
        heading: "Buenas prácticas operativas",
        list: [
          "No hacer claims médicos en publicidad (no curar, no tratar enfermedades).",
          "Etiquetar como 'producto de investigación' o 'research use only'.",
          "Mantener trazabilidad: lote, fecha de fabricación, certificado de análisis.",
          "Operar tu negocio fiscalmente: alta como persona física con actividad empresarial o moral.",
        ],
      },
    ],
    related: ["como-empezar-negocio-peptidos-mexico", "errores-comunes-revendedores-peptidos"],
  },
  {
    slug: "precios-peptidos-mayoreo-mexico-2025",
    title: "Precios de péptidos al mayoreo en México 2025: tabla actualizada",
    excerpt: "Tabla de referencia de precios al mayoreo (10+ viales) de los péptidos más vendidos en México: BPC-157, semaglutida, tirzepatida, retatrutida, ipamorelin y más.",
    date: "2025-05-10",
    readingMinutes: 7,
    tags: ["precios", "mayoreo", "referencia"],
    intro:
      "Esta tabla resume rangos típicos de precio mayoreo (MOQ 10 viales mezclados) y reventa sugerida en México a mayo 2025. Los precios se mueven con el tipo de cambio y disponibilidad de lotes.",
    sections: [
      {
        heading: "Recuperación y rendimiento",
        list: [
          "BPC-157 5 mg: mayoreo $380–$520 / reventa $850–$1,200.",
          "TB-500 5 mg: mayoreo $480–$680 / reventa $1,100–$1,600.",
          "Ipamorelin 5 mg: mayoreo $320–$450 / reventa $750–$1,100.",
          "CJC-1295 sin DAC 5 mg: mayoreo $380–$520 / reventa $850–$1,200.",
        ],
      },
      {
        heading: "Pérdida de peso (GLP-1)",
        list: [
          "Semaglutida 5 mg: mayoreo $850–$1,200 / reventa $1,800–$2,800.",
          "Tirzepatida 10 mg: mayoreo $1,400–$2,200 / reventa $3,200–$4,800.",
          "Retatrutida 5 mg: mayoreo $1,800–$2,600 / reventa $4,500–$6,800.",
        ],
      },
      {
        heading: "Estética y piel",
        list: [
          "GHK-Cu 50 mg: mayoreo $480–$680 / reventa $1,200–$1,800.",
          "Glutathione 600 mg: mayoreo $580–$780 / reventa $1,400–$2,000.",
          "Melanotan II 10 mg: mayoreo $320–$450 / reventa $750–$1,100.",
        ],
      },
      {
        heading: "Notas",
        paragraphs: [
          "Precios en MXN, sujetos a cambio. Volumen mayor a 30 viales acepta condiciones especiales. El pago se procesa por Mercado Pago o transferencia SPEI.",
        ],
      },
    ],
    related: ["semaglutida-vs-tirzepatida-cual-vender", "como-empezar-negocio-peptidos-mexico"],
  },
  {
    slug: "errores-comunes-revendedores-peptidos",
    title: "7 errores que matan al 80% de los nuevos revendedores de péptidos",
    excerpt: "Los errores más comunes que vemos en distribuidores que arrancan y cómo evitarlos: dispersión de SKUs, mala cadena de frío, precios irreales y más.",
    date: "2025-04-30",
    readingMinutes: 10,
    tags: ["errores", "negocio", "principiantes"],
    intro:
      "De cada 10 distribuidores que arrancan, 8 abandonan en menos de 6 meses. No es por falta de demanda — es por errores operativos repetitivos. Aquí van los siete que más cuestan dinero.",
    sections: [
      {
        heading: "1. Comprar 15 SKUs diferentes desde el inicio",
        paragraphs: ["Capital atrapado en productos que no rotan. Empieza con 3–5 SKUs y agrega solo cuando el primero ya esté generando recompra estable."],
      },
      {
        heading: "2. No respetar la cadena de frío",
        paragraphs: ["Un vial reconstituido fuera de refrigeración pierde potencia. Un cliente decepcionado no recompra. Invierte en hielera con gel pack desde el primer envío."],
      },
      {
        heading: "3. Vender por debajo del precio de mercado para 'arrancar'",
        paragraphs: ["Bajar precio no genera lealtad — genera clientes que se van con el siguiente más barato. Compite en confianza, lote, atención y rapidez."],
      },
      {
        heading: "4. Operar sin certificado de análisis",
        paragraphs: ["El cliente serio pide COA. Si no lo tienes, pierdes la venta de mayor ticket. Pídeselo siempre a tu proveedor."],
      },
      {
        heading: "5. No tener catálogo en PDF",
        paragraphs: ["El cliente pregunta por WhatsApp y tú le respondes con audios. Pierdes tiempo y se ve poco profesional. Catálogo PDF con precios, presentaciones y dosis."],
      },
      {
        heading: "6. Mezclar finanzas personales con las del negocio",
        paragraphs: ["Sin contabilidad separada, no sabes si ganas o pierdes. Cuenta bancaria aparte desde el primer mes."],
      },
      {
        heading: "7. No reinvertir ganancias",
        paragraphs: ["El que saca todo el primer mes se estanca. 50% de cada venta vuelve al inventario los primeros 6 meses."],
      },
    ],
    related: ["como-empezar-negocio-peptidos-mexico", "logistica-envio-peptidos-cadena-frio"],
  },
  {
    slug: "ghk-cu-mercado-estetico-mexico",
    title: "GHK-Cu en México: el péptido que las clínicas estéticas piden por kilo",
    excerpt: "Por qué GHK-Cu (cobre péptido) es el SKU favorito de clínicas estéticas y dermatólogos en México, presentaciones, precios al mayoreo y argumentos de venta.",
    date: "2025-05-11",
    readingMinutes: 8,
    tags: ["GHK-Cu", "estética", "clínicas"],
    intro:
      "GHK-Cu (glycyl-histidyl-lysine cobre) es uno de los péptidos más rentables del nicho estético. Si vendes a clínicas, dermatólogos o cosmetólogos en México, este SKU mueve volumen.",
    sections: [
      {
        heading: "Por qué se vende tanto en estética",
        paragraphs: [
          "Estimula síntesis de colágeno y elastina, mejora cicatrización, reduce líneas finas y manchas. Se usa en mesoterapia, microneedling y formulaciones tópicas.",
          "Una clínica que microneedling con GHK-Cu cobra $2,500–$4,500 MXN por sesión. Su costo por sesión es <$200 MXN. Ese diferencial los hace recomprar todos los meses.",
        ],
      },
      {
        heading: "Presentaciones",
        list: [
          "GHK-Cu 50 mg vial: estándar para clínicas.",
          "GHK-Cu 100 mg vial: para volumen alto.",
          "Polvo a granel: para formuladores cosméticos.",
        ],
      },
      {
        heading: "Precios mayoreo",
        paragraphs: ["Vial 50 mg: $480–$680 MXN al mayoreo. Reventa a clínica: $1,200–$1,800 MXN. Margen >120%."],
      },
    ],
    related: ["clinicas-esteticas-como-vender-peptidos", "ipamorelin-cjc-1295-stack-ventas"],
  },
  {
    slug: "logistica-envio-peptidos-cadena-frio",
    title: "Logística y cadena de frío para envío de péptidos en México",
    excerpt: "Cómo enviar péptidos en México sin perder potencia: empaque, hielera, gel pack, paqueterías recomendadas y cómo manejar envíos a Tijuana, Cancún y zonas calientes.",
    date: "2025-05-06",
    readingMinutes: 9,
    tags: ["logística", "envío", "cadena de frío"],
    intro:
      "El péptido liofilizado tolera temperatura ambiente, pero la confianza del cliente se gana con un buen empaque. Aquí va el protocolo que recomendamos a distribuidores que envían dentro de México.",
    sections: [
      {
        heading: "Empaque estándar para envío nacional",
        list: [
          "Caja rígida de cartón corrugado con espuma protectora.",
          "Hielera EPS pequeña con 1–2 gel packs congelados.",
          "Bolsa antiestática para los viales.",
          "Etiqueta 'frágil' y 'mantener refrigerado al recibir'.",
        ],
      },
      {
        heading: "Paqueterías que funcionan",
        list: [
          "Estafeta Día Siguiente: la más confiable centro y bajío.",
          "DHL Express: para Tijuana, Cancún, Mérida (24–48h).",
          "FedEx Prioritario: alternativa premium nacional.",
        ],
      },
      {
        heading: "Manejo de zonas calientes",
        paragraphs: [
          "Para Cancún, Mérida, Hermosillo o Tijuana en verano, doble gel pack y envío express obligatorio. Comunícale al cliente que reciba personalmente y refrigere de inmediato.",
        ],
      },
    ],
    related: ["errores-comunes-revendedores-peptidos", "como-empezar-negocio-peptidos-mexico"],
  },
  {
    slug: "marketing-peptidos-instagram-whatsapp",
    title: "Marketing de péptidos en Instagram y WhatsApp sin que te bajen la cuenta",
    excerpt: "Cómo construir presencia en Instagram y mover ventas por WhatsApp sin violar políticas de las plataformas: contenido educativo, CTA correctos y embudo limpio.",
    date: "2025-05-07",
    readingMinutes: 10,
    tags: ["marketing", "instagram", "whatsapp"],
    intro:
      "Instagram y TikTok son donde está tu cliente, pero también son donde te pueden bajar la cuenta si publicas mal. La regla de oro: educa, no recetes; muestra, no prometas.",
    sections: [
      {
        heading: "Qué SÍ publicar",
        list: [
          "Contenido educativo sobre cómo funcionan los péptidos a nivel general.",
          "Comparativas de presentaciones y dosis.",
          "Detrás de cámaras: empaque, envío, certificados de análisis.",
          "Testimoniales con consentimiento, sin claims médicos.",
        ],
      },
      {
        heading: "Qué NO publicar",
        list: [
          "Antes/después con claims de cura.",
          "Precios visibles en la publicación pública.",
          "Etiqueta directa de marca farmacéutica (Ozempic, Mounjaro).",
          "Inyecciones en video.",
        ],
      },
      {
        heading: "Embudo recomendado",
        paragraphs: [
          "Reel educativo → CTA 'link en bio para info' → landing simple → botón WhatsApp → catálogo PDF → cierre por mensaje. Mantén precios fuera del público y dentro del PDF.",
        ],
      },
    ],
    related: ["como-empezar-negocio-peptidos-mexico", "clinicas-esteticas-como-vender-peptidos"],
  },
  {
    slug: "clinicas-esteticas-como-vender-peptidos",
    title: "Cómo venderle péptidos a clínicas estéticas en México",
    excerpt: "Manual práctico para distribuidores que quieren entrar al canal B2B de clínicas estéticas y dermatológicas: prospección, ticket promedio, productos clave y cierre.",
    date: "2025-05-12",
    readingMinutes: 11,
    tags: ["B2B", "clínicas", "estética"],
    intro:
      "El canal de clínicas estéticas es donde están los tickets más altos y la recompra más predecible. Pero requiere otro tipo de venta: profesional, con CFDI, COA y trato consistente.",
    sections: [
      {
        heading: "Productos que las clínicas piden",
        list: [
          "GHK-Cu 50 mg / 100 mg para mesoterapia.",
          "Glutathione 600 mg para terapias de aclarado.",
          "BPC-157 + TB-500 para clínicas con enfoque deportivo.",
          "PT-141 y melanotan para clínicas con servicio premium.",
        ],
      },
      {
        heading: "Cómo prospectar",
        list: [
          "Listas de Google Maps + Instagram filtradas por 'clínica estética' por ciudad.",
          "Mensaje frío personalizado por DM o WhatsApp con catálogo y precios.",
          "Visita presencial en CDMX, GDL, MTY: cierra el doble que mensaje.",
        ],
      },
      {
        heading: "Cierre y postventa",
        paragraphs: [
          "La clínica espera CFDI, certificado de análisis por lote, entrega en 24–72h y un solo punto de contacto. Si das eso, recompra mensual prácticamente garantizada.",
        ],
      },
    ],
    related: ["ghk-cu-mercado-estetico-mexico", "marketing-peptidos-instagram-whatsapp"],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const allBlogSlugs = posts.map((p) => p.slug);