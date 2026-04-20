export type ProductVariant = {
  sku: string;
  name: string;
  description: string;
  priceKopecks: number;
};

export type Product = {
  sku: string;
  title: string;
  tagline: string;
  variants: ProductVariant[];
};

export const BOARD_001: Product = {
  sku: "board-001",
  title: "THE BOARD · 001",
  tagline: "Дубова дошка. Ручний розпис. Лімітовані серії.",
  variants: [
    {
      sku: "pro",
      name: "PRO — 40 cm",
      description: "Турнірний розмір. Дуб + горіх. 40×40 см.",
      priceKopecks: 189000,
    },
    {
      sku: "classic",
      name: "CLASSIC — 35 cm",
      description: "Класичний розмір. Дуб + ясен. 35×35 см.",
      priceKopecks: 149000,
    },
    {
      sku: "mini",
      name: "MINI — 28 cm",
      description: "Компактний розмір. Бук + венге. 28×28 см.",
      priceKopecks: 99000,
    },
  ],
};

export const PRODUCTS: Record<string, Product> = {
  [BOARD_001.sku]: BOARD_001,
};

export function findVariant(
  productSku: string,
  variantSku: string
): { product: Product; variant: ProductVariant } | null {
  const product = PRODUCTS[productSku];
  if (!product) return null;
  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) return null;
  return { product, variant };
}
