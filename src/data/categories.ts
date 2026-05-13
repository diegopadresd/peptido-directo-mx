export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "metabolicos", name: "Metabólicos", description: "GLP-1, GIP, glucagón y moduladores de adipocitos." },
  { slug: "recuperacion", name: "Recuperación", description: "Reparación de tejidos, articulaciones y músculo." },
  { slug: "hormonales", name: "Hormonales", description: "Secretagogos de GH, GHRH y eje HPG." },
  { slug: "biorreguladores", name: "Biorreguladores", description: "Péptidos cortos Khavinson para regulación tejido-específica." },
  { slug: "piel", name: "Piel y estética", description: "Colágeno, melanocortinas y blends dérmicos." },
  { slug: "cognitivos", name: "Cognitivos", description: "Nootrópicos y neuroprotección." },
  { slug: "longevidad", name: "Longevidad", description: "Mitocondrial, NAD+ y senolíticos." },
  { slug: "muscular", name: "Muscular", description: "Inhibidores de miostatina y MGF." },
  { slug: "inmune", name: "Inmune", description: "Catelicidinas y moduladores innatos." },
  { slug: "sexual", name: "Salud sexual", description: "MC4R y oxitocina." },
  { slug: "bienestar", name: "Bienestar", description: "Sueño y ritmo circadiano." },
  { slug: "suministros", name: "Suministros", description: "Solventes y agua bacteriostática." },
];
