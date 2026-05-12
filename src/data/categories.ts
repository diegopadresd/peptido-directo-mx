export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "perdida-peso", name: "Pérdida de peso", description: "Péptidos GLP-1 y termogénicos." },
  { slug: "crecimiento-muscular", name: "Crecimiento muscular", description: "Secretagogos de GH e IGF-1." },
  { slug: "recuperacion", name: "Recuperación y lesiones", description: "Reparación de tejidos y articulaciones." },
  { slug: "anti-aging", name: "Anti-aging y longevidad", description: "Soporte celular y mitocondrial." },
  { slug: "bronceado", name: "Bronceado", description: "Estimuladores de melanocortina." },
  { slug: "bienestar-intimo", name: "Bienestar íntimo", description: "Soporte para la libido y respuesta vascular." },
  { slug: "cognitivo", name: "Cognitivo", description: "Nootrópicos peptídicos." },
];
