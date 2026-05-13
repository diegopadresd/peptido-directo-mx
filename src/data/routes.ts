import { products } from "./products";
import { cities } from "./cities";

export const staticRoutes = [
  "/",
  "/productos",
  "/como-funciona",
  "/empezar-negocio",
  "/distribuidor",
  "/preguntas-frecuentes",
  "/contacto",
  "/blog",
  "/resumen-empresa",
];

export const blogSlugs = ["como-empezar-negocio-peptidos-mexico"];

export const allRoutes = () => [
  ...staticRoutes,
  ...products.map((p) => `/productos/${p.slug}`),
  ...cities.map((c) => `/peptidos/${c.slug}`),
  ...blogSlugs.map((s) => `/blog/${s}`),
];
