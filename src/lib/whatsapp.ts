export const WHATSAPP_NUMBER = "526623378663";
export const SITE_URL = "https://peptidosmayoreo.com";

export function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
