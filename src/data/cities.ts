export type City = {
  slug: string;
  name: string;
  state: string;
  deliveryDays: string;
  intro: string;
  whyHere: string;
  testimonials: Array<{ name: string; role: string; quote: string }>;
  faqs: Array<{ q: string; a: string }>;
};

const baseFaqs = (city: string, days: string): City["faqs"] => [
  {
    q: `¿Cuánto tarda el envío de péptidos a ${city}?`,
    a: `Los envíos a ${city} llegan en ${days} hábiles desde la confirmación de pago, vía paqueterías nacionales con número de guía.`,
  },
  {
    q: `¿Hacen envío contra entrega en ${city}?`,
    a: `No. Trabajamos con pago anticipado por eCartPay (tarjeta, SPEI u OXXO). Esto nos permite mantener precios al mayoreo sin sumar el costo de COD.`,
  },
  {
    q: `¿Cuál es el mínimo de viales para distribuidores en ${city}?`,
    a: `El mínimo es 10 viales totales. Puedes mezclar libremente cualquier producto del catálogo y se aplican descuentos por volumen en packs de 10, 20 o 30 viales.`,
  },
];

export const cities: City[] = [
  {
    slug: "cdmx",
    name: "Ciudad de México",
    state: "CDMX",
    deliveryDays: "1 a 2 días",
    intro:
      "Atendemos a distribuidores, coaches y clínicas de bienestar en la Ciudad de México con entrega rápida en alcaldías como Benito Juárez, Cuauhtémoc, Miguel Hidalgo y Coyoacán. Por ser nuestro mercado más activo, las salidas a CDMX se procesan diariamente.",
    whyHere:
      "CDMX concentra el mayor volumen de revendedores de péptidos del país. Nuestros precios al mayoreo permiten márgenes saludables incluso compitiendo contra clínicas establecidas, y la entrega en 1-2 días te deja reaccionar rápido a pedidos urgentes de tus clientes.",
    testimonials: [
      {
        name: "Daniel R.",
        role: "Coach de composición corporal, Polanco",
        quote: "Hago pedidos de 20 viales mezclados cada quincena. Llegan al día siguiente y nunca he tenido un faltante.",
      },
      {
        name: "Clínica B., Roma Norte",
        role: "Centro de longevidad",
        quote: "Pasamos de comprar a precio retail a manejar mayoreo aquí. La diferencia financiera es lo que nos permitió crecer.",
      },
    ],
    faqs: baseFaqs("CDMX", "1 a 2 días"),
  },
  {
    slug: "guadalajara",
    name: "Guadalajara",
    state: "Jalisco",
    deliveryDays: "2 a 3 días",
    intro:
      "Servimos a Guadalajara, Zapopan, Tlaquepaque y la Zona Metropolitana con entregas en 2 a 3 días hábiles. Tenemos varios distribuidores activos en Providencia, Chapalita y Andares que reciben pedidos quincenales.",
    whyHere:
      "El mercado tapatío es uno de los más receptivos a péptidos GLP-1 (semaglutida, tirzepatida, retatrutida) por su alta cultura fitness y de bienestar. Nuestro stock permanente de estos compuestos a precio mayoreo facilita rotar inventario rápido.",
    testimonials: [
      {
        name: "Iván M.",
        role: "Distribuidor independiente, Zapopan",
        quote: "Empecé con 10 viales de prueba. Hoy compro packs de 30 mezclados cada mes y la calidad ha sido consistente.",
      },
      {
        name: "Karla S.",
        role: "Coach nutricional, Providencia",
        quote: "Recomiendo a mis clientes y ellos compran directo. Los precios mayoreo me permiten ofrecer mejor que las farmacias.",
      },
    ],
    faqs: baseFaqs("Guadalajara", "2 a 3 días"),
  },
  {
    slug: "monterrey",
    name: "Monterrey",
    state: "Nuevo León",
    deliveryDays: "2 a 3 días",
    intro:
      "En Monterrey y su zona metropolitana (San Pedro, Santa Catarina, Apodaca, Guadalupe) entregamos en 2 a 3 días hábiles. Es uno de nuestros mercados con mayor ticket promedio por pedido.",
    whyHere:
      "Regiomontanos compran en volumen: el pedido promedio en Monterrey es 60% mayor al nacional. Nuestros packs de 30 viales con descuento extra están pensados exactamente para este perfil de distribuidor consolidado.",
    testimonials: [
      {
        name: "Roberto T.",
        role: "Gimnasio boutique, San Pedro",
        quote: "Compro packs de 30 cada 3 semanas. El descuento por volumen hace toda la diferencia para mi negocio.",
      },
      {
        name: "Ana P.",
        role: "Distribuidora, Cumbres",
        quote: "Logística impecable. La paquetería siempre llega antes de lo prometido a Monterrey.",
      },
    ],
    faqs: baseFaqs("Monterrey", "2 a 3 días"),
  },
  {
    slug: "tijuana",
    name: "Tijuana",
    state: "Baja California",
    deliveryDays: "3 a 5 días",
    intro:
      "Enviamos a Tijuana, Rosarito y Mexicali con tiempos de 3 a 5 días hábiles. Trabajamos con paqueterías que cubren toda Baja California sin sobrecostos por zona extendida.",
    whyHere:
      "Tijuana tiene un mercado fronterizo único: clientes mexicanos y compradores cross-border. Nuestros precios al mayoreo son competitivos incluso comparados con proveedores estadounidenses cuando se considera el tipo de cambio.",
    testimonials: [
      {
        name: "Luis C.",
        role: "Wellness coach, Zona Río",
        quote: "Tijuana no siempre es prioridad para proveedores. Aquí me responden y entregan rápido, eso vale oro.",
      },
      {
        name: "Marisol H.",
        role: "Distribuidora, Playas de Tijuana",
        quote: "Llevo 8 meses comprando aquí. Cero problemas de calidad, cero envíos perdidos.",
      },
    ],
    faqs: baseFaqs("Tijuana", "3 a 5 días"),
  },
  {
    slug: "puebla",
    name: "Puebla",
    state: "Puebla",
    deliveryDays: "2 a 4 días",
    intro:
      "Cubrimos la ciudad de Puebla y municipios cercanos como Cholula y Atlixco con entregas en 2 a 4 días hábiles. Mercado emergente con creciente demanda de péptidos para composición corporal y antienvejecimiento.",
    whyHere:
      "Puebla está en una etapa temprana de adopción: hay menos competencia entre revendedores y los márgenes para distribuidores nuevos son mayores. Es un buen momento para construir base de clientes a precio mayoreo.",
    testimonials: [
      {
        name: "Jorge V.",
        role: "Personal trainer, Angelópolis",
        quote: "Empecé revendiéndoles a mis 6 alumnos. Hoy cubro a 30 personas con pedidos quincenales.",
      },
      {
        name: "Sofía L.",
        role: "Estética avanzada, Cholula",
        quote: "Los péptidos de regeneración (BPC, TB-500, GHK-Cu) son mi línea más vendida. Aquí me surto al mejor precio.",
      },
    ],
    faqs: baseFaqs("Puebla", "2 a 4 días"),
  },
  {
    slug: "queretaro",
    name: "Querétaro",
    state: "Querétaro",
    deliveryDays: "2 a 3 días",
    intro:
      "Querétaro es uno de los mercados de mayor crecimiento del país. Entregamos en 2 a 3 días hábiles a la capital, Juriquilla y El Marqués, atendiendo el creciente nicho corporativo y de wellness.",
    whyHere:
      "El perfil del cliente queretano valora calidad y trazabilidad. Cada pedido incluye documentación de lote y orientación sobre conservación, lo que facilita justificar precio premium frente a tu cliente final.",
    testimonials: [
      {
        name: "Pablo D.",
        role: "Wellness studio, Juriquilla",
        quote: "Los clientes de Querétaro preguntan mucho por COA y origen. Aquí siempre tengo respuesta clara.",
      },
      {
        name: "Mónica G.",
        role: "Coach de longevidad",
        quote: "Pasé de comprar de 5 en 5 a packs de 20. La logística a Querétaro es impecable.",
      },
    ],
    faqs: baseFaqs("Querétaro", "2 a 3 días"),
  },
  {
    slug: "merida",
    name: "Mérida",
    state: "Yucatán",
    deliveryDays: "3 a 5 días",
    intro:
      "Atendemos Mérida, Progreso y la zona norte de Yucatán con entregas en 3 a 5 días hábiles. Mercado con fuerte demanda de péptidos para bienestar y manejo de peso.",
    whyHere:
      "El sureste suele tener menos opciones de proveedores serios. Nuestro envío a Mérida es directo, sin escalas en CDMX que añadan días, y a precio mayoreo sin recargo por distancia.",
    testimonials: [
      {
        name: "Carlos R.",
        role: "Coach fitness, Mérida Norte",
        quote: "Antes pedía a EE.UU. y tardaba semanas. Aquí en Mérida en 4 días tengo el pedido en mi puerta.",
      },
      {
        name: "Diana E.",
        role: "Spa de longevidad",
        quote: "GHK-Cu y BPC-157 vuelan en Mérida. Los precios mayoreo me hacen viable mi línea de tratamientos.",
      },
    ],
    faqs: baseFaqs("Mérida", "3 a 5 días"),
  },
  {
    slug: "leon",
    name: "León",
    state: "Guanajuato",
    deliveryDays: "2 a 4 días",
    intro:
      "León y todo el Bajío (Irapuato, Celaya, Salamanca) se sirven en 2 a 4 días hábiles. Zona industrial con buena base de gimnasios y centros de bienestar corporativo.",
    whyHere:
      "El Bajío tiene poder adquisitivo alto y una cultura fitness consolidada. Nuestros distribuidores en León suelen comenzar con 10 viales y escalar a packs de 30 en 3-4 meses.",
    testimonials: [
      {
        name: "Esteban M.",
        role: "Gimnasio funcional, León Centro",
        quote: "El servicio al cliente es lo que me hizo quedarme. Cualquier duda me responden rápido.",
      },
      {
        name: "Patricia O.",
        role: "Distribuidora, Irapuato",
        quote: "Entregas confiables en todo el Bajío. Llevo más de un año comprándoles.",
      },
    ],
    faqs: baseFaqs("León", "2 a 4 días"),
  },
  {
    slug: "hermosillo",
    name: "Hermosillo",
    state: "Sonora",
    deliveryDays: "3 a 5 días",
    intro:
      "Hermosillo y la región Sonora (Ciudad Obregón, Navojoa) reciben pedidos en 3 a 5 días hábiles. Mercado en expansión con interés creciente en GLP-1 y péptidos antienvejecimiento.",
    whyHere:
      "Sonora tiene un mercado fitness fuerte y receptivo a precios al mayoreo. Nuestra red de paqueterías cubre todo el estado sin sobrecostos.",
    testimonials: [
      {
        name: "Andrés F.",
        role: "Coach personal, Hermosillo",
        quote: "Pedidos llegan en tiempo. La calidad ha sido consistente desde mi primer pack.",
      },
      {
        name: "Nora B.",
        role: "Asesora de bienestar",
        quote: "Manejo cartera de clientes en todo Sonora. Surtirme aquí me dejó dejar de depender de proveedores informales.",
      },
    ],
    faqs: baseFaqs("Hermosillo", "3 a 5 días"),
  },
  {
    slug: "cancun",
    name: "Cancún",
    state: "Quintana Roo",
    deliveryDays: "3 a 5 días",
    intro:
      "Cancún, Playa del Carmen y la Riviera Maya reciben en 3 a 5 días hábiles. Mercado premium con clientela internacional, ideal para revendedores que atienden expats y turismo de bienestar.",
    whyHere:
      "El cliente de la Riviera Maya paga premium por servicio confiable. Nuestros precios al mayoreo permiten vender al ticket que el mercado tolera, dejando margen amplio.",
    testimonials: [
      {
        name: "Mauricio L.",
        role: "Wellness concierge, Playa del Carmen",
        quote: "Atiendo expats que ya conocen los productos. Necesito proveedor serio y consistente, eso encontré aquí.",
      },
      {
        name: "Gabriela A.",
        role: "Spa boutique, Cancún Hotel Zone",
        quote: "Los péptidos cosméticos (GHK-Cu, ipamorelin) son mi línea estrella. Los precios mayoreo lo hacen viable.",
      },
    ],
    faqs: baseFaqs("Cancún", "3 a 5 días"),
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}