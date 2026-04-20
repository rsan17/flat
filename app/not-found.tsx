import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col justify-center px-6 py-20">
      <p className="caps text-xs">error · 404</p>
      <h1 className="font-display mt-4 text-7xl md:text-9xl leading-none">
        ХОДУ
        <br />
        <span className="bg-lilac px-3">НЕМА.</span>
      </h1>
      <p className="mt-6 text-lg">
        Такої сторінки не існує. Можливо, ти перейшов за старим посиланням.
      </p>
      <div className="mt-10">
        <Link href="/" className="btn btn-lilac">
          на головну
        </Link>
      </div>
    </main>
  );
}
