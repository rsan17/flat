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
  /** Він же slug у /shop/[slug] */
  sku: string;
  title: string;
  tagline: string;
  category: ProductCategory;
  status: ProductStatus;
  /** Короткий опис для картки в каталозі */
  cardDescription: string;
  /** Повний опис для PDP — по абзацу на елемент */
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
  title: "FLAT5 TEE",
  tagline: "Оверсайз-футболка кольору lilac ash. Гірлянда на спині.",
  category: "apparel",
  status: "soon",
  cardDescription:
    "Оверсайз-футболка в кольорі закладу. Спереду — «flat 5 team», на спині — логотип із гірляндою.",
  description: [
    "Та сама гірлянда, що висить у дворику, переїхала на спину футболки. Спереду — рукописне «flat 5 team» дрібним шрифтом: помітять тільки свої.",
    "Оверсайз-крій, щільний бавовняний джерсі, колір lilac ash — фірмовий лілак FLAT5.",
  ],
  media: [],
  variantLabel: "розмір",
  variants: [
    { sku: "s", name: "FLAT5 TEE — S", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "m", name: "FLAT5 TEE — M", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "l", name: "FLAT5 TEE — L", description: "Оверсайз-крій.", priceKopecks: 99900 },
    { sku: "xl", name: "FLAT5 TEE — XL", description: "Оверсайз-крій.", priceKopecks: 99900 },
  ],
  specs: [
    { label: "крій", value: "оверсайз, унісекс" },
    { label: "колір", value: "lilac ash" },
    { label: "друк", value: "шовкодрук: гірлянда + логотип" },
  ],
  badges: ["скоро", "мерч"],
};

export const STICKERS_001: Product = {
  sku: "stickers-001",
  title: "СТІКЕРПАК F5",
  tagline: "Лодонька, гірлянда, F5. Наклей, куди дотягнешся.",
  category: "accessory",
  status: "soon",
  cardDescription:
    "Набір фірмових стікерів: лодонька «дай п'ять», вигнутий FLAT5 і круглі F5 на 5 і 3 см.",
  description: [
    "Лодонька — це «дай п'ять і ще одну каву». Жест, з якого починається більшість вечорів у FLAT5.",
    "У наборі: лодонька, вигнутий логотип за формою гірлянди і круглі F5 двох розмірів — 5 і 3 см. Вінілові, стійкі до води.",
  ],
  media: [],
  variantLabel: "набір",
  variants: [
    {
      sku: "pack",
      name: "Стікерпак — 6 шт",
      description: "Лодонька, гірлянда-логотип, 2× F5 5 см, 2× F5 3 см.",
      priceKopecks: 14900,
    },
  ],
  specs: [
    { label: "склад", value: "6 стікерів" },
    { label: "розміри", value: "5 см і 3 см" },
    { label: "матеріал", value: "вініл, стійкий до води" },
  ],
  badges: ["скоро", "мерч"],
};

export const GIFTBOX_001: Product = {
  sku: "giftbox-001",
  title: "БОКС «ДАЙ П'ЯТЬ»",
  tagline: "Кава, кукіс і стікери в коробці з написом всередині.",
  category: "gift",
  status: "soon",
  cardDescription:
    "Подарунковий бокс: зерно від FLAT5, кукіс, стікерпак. На дні коробки — «don't share, we won't tell».",
  description: [
    "Коробка, яку приємно відкривати: всередині зерно, з якого ми варимо каву, свіжий кукіс і стікерпак.",
    "На дні — напис «don't share, we won't tell». Можна не ділитись, ми нікому не скажемо.",
  ],
  media: [],
  variantLabel: "комплект",
  variants: [
    {
      sku: "standard",
      name: "Бокс «Дай п'ять»",
      description: "Зерно 250 г, кукіс, стікерпак.",
      priceKopecks: 59900,
    },
  ],
  specs: [
    { label: "у боксі", value: "кава 250 г · кукіс · стікерпак" },
    { label: "пакування", value: "фірмова коробка FLAT5" },
  ],
  badges: ["скоро", "подарунок"],
};

/** Порядок тут = порядок у каталозі */
export const PRODUCT_LIST: Product[] = [
  BOARD_001,
  TEE_001,
  STICKERS_001,
  GIFTBOX_001,
];

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
