export const WHATSAPP_NUMBER = "525555555555"; // placeholder — reemplazar
export const SITE_URL = "https://peptidosmayoreo.com";

export function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
