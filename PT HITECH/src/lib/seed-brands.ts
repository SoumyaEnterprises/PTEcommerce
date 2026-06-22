import type { Brand } from "@/types";

const brandSeed: { name: string; count: number }[] = [
  { name: "Samsung", count: 78 },
  { name: "Kingston", count: 64 },
  { name: "Crucial", count: 41 },
  { name: "Western Digital", count: 52 },
  { name: "Seagate", count: 37 },
  { name: "Corsair", count: 69 },
  { name: "ASUS ROG", count: 45 },
  { name: "G.Skill", count: 28 },
  { name: "Intel", count: 33 },
  { name: "AMD", count: 31 },
  { name: "NVIDIA", count: 19 },
  { name: "Toshiba", count: 24 },
  { name: "Gigabyte", count: 36 },
  { name: "MSI", count: 42 },
  { name: "Sabrent", count: 15 },
  { name: "SK Hynix", count: 22 },
];

export const seedBrands: Brand[] = brandSeed.map(({ name, count }, i) => ({
  id: `brand-${i + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  logo: null,
  productCount: count,
  createdAt: "2024-01-10T08:00:00Z",
}));
