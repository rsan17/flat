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
  tagline: "3D-друк, магнітна фіксація. Лімітована серія — 55 штук.",
  variants: [
    {
      sku: "standard",
      name: "THE BOARD — 17 cm",
      description: "Компактний формат. 3D-друк, магнітна фіксація. 17×17 см.",
      priceKopecks: 79900,
    },
  ],
};

export const ENGRAVING_FEE_KOPECKS = 10000;

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
