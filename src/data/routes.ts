import { products } from "./products";

export const staticRoutes = [
  "/",
  "/productos",
  "/como-funciona",
  "/empezar-negocio",
  "/distribuidor",
  "/preguntas-frecuentes",
  "/contacto",
  "/blog",
];

export const allRoutes = () => [
  ...staticRoutes,
  ...products.map((p) => `/productos/${p.slug}`),
];
