import { products } from "./products";
import { cities } from "./cities";
import { allBlogSlugs } from "./blog";

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

export const blogSlugs = allBlogSlugs;

export const allRoutes = () => [
  ...staticRoutes,
  ...products.map((p) => `/productos/${p.slug}`),
  ...cities.map((c) => `/peptidos/${c.slug}`),
  ...blogSlugs.map((s) => `/blog/${s}`),
];
