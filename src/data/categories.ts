export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "perdida-peso", name: "Pérdida de peso", description: "GLP-1, GIP y amilina." },
  { slug: "gh-muscular", name: "Crecimiento muscular y GH", description: "Secretagogos de GH e IGF-1." },
  { slug: "recuperacion", name: "Recuperación y reparación", description: "Reparación de tejidos y articulaciones." },
  { slug: "longevidad", name: "Anti-aging y longevidad", description: "Soporte celular y mitocondrial." },
  { slug: "bronceado", name: "Bronceado y pigmentación", description: "Estimuladores de melanocortina." },
  { slug: "intimo-hormonal", name: "Bienestar íntimo y hormonal", description: "Soporte para libido y eje hormonal." },
  { slug: "cognicion", name: "Cognición y nootrópicos", description: "Péptidos para enfoque y memoria." },
];
