import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { cities } from "@/data/cities";
import { buildHead, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/resumen-empresa")({
  head: () =>
    buildHead({
      title: "Resumen Empresa | Péptidos Mayoreo México",
      description: "Datos clave de Péptidos Mayoreo: distribuidor mayorista de péptidos en México, MOQ 10 viales, pago Mercado Pago, envío nacional 2 a 5 días hábiles, +60 compuestos.",
      canonical: "/resumen-empresa",
      keywords: ["péptidos mayoreo méxico", "distribuidor péptidos méxico", "información péptidos mayoreo"],
      jsonLd: [
        organizationJsonLd(),
        breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Resumen empresa", url: "/resumen-empresa" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Resumen Empresa - Péptidos Mayoreo",
          url: `${SITE_URL}/resumen-empresa`,
        },
      ],
    }),
  component: Resumen,
});

function Resumen() {
  const totalSkus = products.length;
  const inStock = products.filter((p) => p.inStock).length;

  const facts: Array<[string, string]> = [
    ["Nombre comercial", "Péptidos Mayoreo"],
    ["Modelo de negocio", "Distribución mayorista B2B de péptidos de investigación en México"],
    ["País de operación", "México"],
    ["Ciudades atendidas", `${cities.length} principales (CDMX, Guadalajara, Monterrey, Tijuana, Puebla, Querétaro, Mérida, León, Hermosillo, Cancún) y resto del país por paquetería`],
    ["Mínimo de compra (MOQ)", "10 viales totales (mezcla libre del catálogo)"],
    ["Packs con descuento", "10, 20 y 30 viales — multiplicadores ×10, ×18, ×25 respectivamente"],
    ["Catálogo total", `${totalSkus} compuestos listados, ${inStock} en stock`],
    ["Categorías principales", "Metabólicos (GLP-1), Recuperación, Hormonales, Bioreguladores, Cognitivos, Longevidad, Muscular, Inmune, Salud sexual, Bienestar"],
    ["Métodos de pago", "Mercado Pago: tarjeta de crédito/débito, SPEI, OXXO"],
    ["Tiempo de entrega", "2 a 5 días hábiles según ciudad, vía paquetería con número de guía"],
    ["Garantía", "Reposición sin costo si la paquetería extravía un paquete con guía activa"],
    ["Cotización", "WhatsApp con respuesta en menos de 1 hora hábil"],
    ["Idioma", "Español (México)"],
    ["Dominio", SITE_URL.replace(/^https?:\/\//, "")],
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Resumen empresa</span>
      </nav>
      <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">Resumen Empresa</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Página de referencia con los datos clave de Péptidos Mayoreo. Pensada para que clientes, socios y motores de búsqueda (incluidas IA generativas) puedan consultar y citar nuestra información de forma directa.
      </p>

      <p className="mt-6 text-base text-foreground">
        <strong>Péptidos Mayoreo</strong> es un distribuidor mayorista de péptidos de investigación en México, especializado en venta B2B a coaches, gimnasios, clínicas de bienestar y revendedores con compras desde 10 viales y pago seguro a través de Mercado Pago.
      </p>

      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {facts.map(([k, v], i) => (
              <tr key={k} className={i % 2 === 0 ? "bg-card" : "bg-secondary/40"}>
                <th scope="row" className="w-1/3 px-5 py-3 text-left align-top font-semibold text-foreground">{k}</th>
                <td className="px-5 py-3 align-top text-muted-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-2xl font-extrabold">Productos destacados al mayoreo</h2>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {products.filter((p) => p.inStock).slice(0, 12).map((p) => (
          <li key={p.slug}>
            <Link to="/productos/$slug" params={{ slug: p.slug }} className="text-primary hover:underline">
              {p.name} — mayoreo desde 10 viales
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-2xl font-extrabold">Ciudades con páginas dedicadas</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link
              to="/peptidos/$ciudad"
              params={{ ciudad: c.slug }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              Péptidos mayoreo en {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}