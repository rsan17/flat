import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout/progress";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutOpenTracker } from "@/components/analytics/checkout-open-tracker";
import { Marquee } from "@/components/landing/marquee";
import { findVariant, BOARD_001 } from "@/lib/products";

type SearchParams = Promise<{
  product?: string;
  variant?: string;
  engraving?: string;
  nickname?: string;
}>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const productSku = sp.product || BOARD_001.sku;
  const variantSku = sp.variant || BOARD_001.variants[0].sku;
  const hit = findVariant(productSku, variantSku) || {
    product: BOARD_001,
    variant: BOARD_001.variants[0],
  };
  const initialEngraving = sp.engraving === "1" || sp.engraving === "true";
  const initialNickname = (sp.nickname ?? "").slice(0, 80);

  return (
    <>
      <CheckoutOpenTracker />
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <Link href="/" className="font-display text-2xl">
            F5·BOARD
          </Link>
          <Link href="/" className="caps text-xs hover:underline">
            ← повернутись
          </Link>
        </div>
      </header>
      <Marquee
        items={["CHECKOUT", "DROP·001", "PAY·ONLINE", "MONO·APPLE·GOOGLE"]}
      />
      <div className="border-b-2 border-ink">
        <CheckoutProgress step={2} />
      </div>
      <main className="py-12">
        <div className="mx-auto mb-10 max-w-[1400px] px-6">
          <h1 className="font-display text-5xl md:text-7xl">ОФОРМЛЕННЯ</h1>
          <p className="mt-2 text-base opacity-70">
            {hit.product.title} — {hit.variant.name}
          </p>
        </div>
        <CheckoutForm
          product={hit.product}
          variant={hit.variant}
          initialEngraving={initialEngraving}
          initialClubMemberName={initialNickname}
        />
      </main>
    </>
  );
}
