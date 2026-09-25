/**
 * Єдине джерело правди по товарах: SKU, варіанти, ціни в копійках.
 * Не дублювати ціни в UI — тільки formatUAH(priceKopecks).
 */

export type ProductStatus = "available" | "soon" | "sold-out";

export type ProductCategory = "board" | "apparel" | "accessory" | "gift";

export type ProductVariant = {
  sku: string;
  name: string;
  description: string;
  priceKopecks: number;
  /** Окремий варіант може закінчитись, поки інші є */
  soldOut?: boolean;
};

export type ProductMedia = {
  src: string;
  alt: string;
  tag: string;
  video?: boolean;
  /** Тло під прозорі/вузькі кадри */
  bg?: "beam" | "lilac" | "ink" | "cream";
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type EngravingOption = {
  label: string;
  hint: string;
  priceKopecks: number;
  maxLength: number;
  placeholder: string;
};

export type Product = {
  /** Він же slug у /product/[slug] */
  sku: string;
  title: string;
  tagline: string;
  category: ProductCategory;
  status: ProductStatus;
  /** Короткий опис для картки в каталозі */
  cardDescription: string;
  /**
   * Розгорнутий опис, по абзацу на елемент.
   * ⚠️ Зараз НЕ рендериться: блок «що це і навіщо» прибрали з PDP.
   * Тримаємо текст тут — знадобиться для опису в каталозі чи для SEO.
   */
  description: string[];
  media: ProductMedia[];
  /** Підпис над списком варіантів: «розмір», «формат»… */
  variantLabel: string;
  variants: ProductVariant[];
  specs: ProductSpec[];
  /** Короткі ярлики на картці: «лімітка», «55 шт» */
  badges: string[];
  /** Персоналізація гравіюванням — поки лише в дошки */
  engraving?: EngravingOption;
};

export const ENGRAVING_FEE_KOPECKS = 10000;

const BOARD_ENGRAVING: EngravingOption = {
  label: "гравіювання нікнейма · f5 club",
  hint: "Персоналізація для учасників F5 Chess Club — твій нікнейм на дошці.",
  priceKopecks: ENGRAVING_FEE_KOPECKS,
  maxLength: 14,
  placeholder: "Напр. ILOVEHIKARU",
};

export const BOARD_001: Product = {
  sku: "board-001",
  title: "F5 BOARD · 001",
  tagline: "3D-друк, магнітна фіксація. Лімітована серія — 55 штук.",
  category: "board",
  status: "available",
  cardDescription:
    "Компактна шахова дошка з магнітною фіксацією. Дроп 001 — 55 штук.",
  description: [
    "Ми зробили шахи, які самі любимо брати в руки. Надруковані на 3D-принтері, але з увагою до деталей і відчуття.",
    "Вони трохи важчі, ніж очікуєш — і це кайф. Магніти фіксують кожен хід, тож дошку можна нахилити, перенести й нічого не поїде.",
    "І при цьому вона компактна: легко взяти з собою на зустріч, у подорож чи просто на вечір з друзями.",
  ],
  media: [
    {
      src: "/img/product_1.webp",
      alt: "F5 BOARD — складена дошка з фігурами на траві",
      tag: "01 · TOP",
      bg: "beam",
    },
    {
      src: "/img/product_3_video.mov",
      alt: "F5 BOARD — ракурс збоку, магнітна фіксація",
      tag: "02 · ANGLE",
      video: true,
      bg: "ink",
    },
    {
      src: "/img/product_video.mov",
      alt: "F5 BOARD — фігури, 3D-друк крупним планом",
      tag: "03 · PIECES",
      video: true,
      bg: "lilac",
    },
    {
      src: "/img/product_4.webp",
      alt: "F5 BOARD — деталь поверхні та розмітка",
      tag: "04 · DETAIL",
      bg: "beam",
    },
  ],
  variantLabel: "розмір",
  variants: [
    {
      sku: "standard",
      name: "F5 BOARD — 17 cm",
      description: "Компактний формат. 3D-друк, магнітна фіксація. 17×17 см.",
      priceKopecks: 79900,
    },
  ],
  specs: [
    { label: "розмір", value: "17 × 17 см" },
    { label: "матеріал", value: "3D-друк, приємна матова текстура" },
    { label: "фігури", value: "з додатковою вагою та магнітною основою" },
    { label: "тираж", value: "55 штук у дропі 001" },
    { label: "виготовлення", value: "5–7 днів" },
  ],
  badges: ["дроп 001", "55 штук", "ua made"],
  engraving: BOARD_ENGRAVING,
};

/* ─────────────────────────────────────────────────────────────
   Мерч. ⚠️ ЧЕРНЕТКА: ціни, склад і терміни — заглушки.
   Усі позиції зі status: "soon" — не потрапляють у чекаут.
   Замінити на реальні дані + фото перед запуском.
   ───────────────────────────────────────────────────────────── */

export const TEE_001: Product = {
  sku: "tee-001",
  title: "F5 CHESS CLUB TEE",
  tagline: "Чорний оверсайз. Шахівниця з графіті на всю спину.",
  category: "apparel",
  status: "soon",
  cardDescription:
    "Чорна оверсайз-футболка клубу: дрібний логотип спереду, шахівниця з тегами на спині.",
  description: [
    "Футболка, в якій грають у нашому дворику. Спереду — дрібне «F5 CHESS CLUB» на грудях, помітять тільки свої.",
    "На спині — шахівниця, де замість фігур теги, корона, смайл і підпис клубу. Знизу — «Львів · пл. Ринок 39», щоб знали, де нас шукати.",
  ],
  media: [
    {
      src: "/img/tee/tee-back.webp",
      alt: "Спина футболки F5 CHESS CLUB: бузкова шахівниця з графіті-тегами",
      tag: "back",
      bg: "cream",
    },
    {
      src: "/img/tee/tee-and-boards.webp",
      alt: "Логотип F5 CHESS CLUB на грудях і стос бузкових шахових дошок",
      tag: "front",
      bg: "cream",
    },
    {
      src: "/img/tee/tee-back-game.webp",
      alt: "Футболка F5 CHESS CLUB за грою в шахи у дворику",
      tag: "worn",
      bg: "cream",
    },
    {
      src: "/img/tee/tee-pieces.webp",
      alt: "Футболка з дошкою F5 BOARD і розсипаними фігурами",
      tag: "detail",
      bg: "cream",
    },
  ],
  variantLabel: "розмір",
  // ⚠️ Ціна — заглушка. Розміри теж треба підтвердити.
  variants: [
    { sku: "s", name: "S", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "m", name: "M", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "l", name: "L", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "xl", name: "XL", description: "Оверсайз-крій.", priceKopecks: 99900 },
  ],
  specs: [
    { label: "крій", value: "оверсайз, унісекс" },
    { label: "колір", value: "чорний" },
    { label: "принт", value: "шахівниця з графіті на спині, логотип спереду" },
  ],
  badges: ["скоро", "chess club"],
};

/** Порядок тут = порядок у каталозі */
export const PRODUCT_LIST: Product[] = [BOARD_001, TEE_001];

export const PRODUCTS: Record<string, Product> = Object.fromEntries(
  PRODUCT_LIST.map((p) => [p.sku, p])
);

export function getProduct(sku: string): Product | null {
  return PRODUCTS[sku] ?? null;
}

/** Товари, які реально можна покласти в замовлення */
export function purchasableProducts(): Product[] {
  return PRODUCT_LIST.filter((p) => p.status === "available");
}

export function isPurchasable(product: Product): boolean {
  return product.status === "available";
}

export function priceFromKopecks(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceKopecks));
}

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
