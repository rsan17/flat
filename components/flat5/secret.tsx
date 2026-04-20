export function Secret() {
  return (
    <section
      id="how-to-find"
      className="grain relative border-b-2 border-ink bg-ink text-paper"
    >
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="caps text-xs text-lilac">002 — ЯК ЗНАЙТИ</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-8xl">
            БЕЗ
            <br />
            <span className="text-lilac">ВИВІСКИ.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-paper/90">
            у нас немає вивіски. є лише маленький секрет.
          </p>
        </div>

        <ol className="space-y-6 md:col-span-7 md:col-start-6">
          <Step
            num="01"
            title="натискаєш «5»"
            body="на домофоні біля дверей під'їзду."
          />
          <Step
            num="02"
            title="заходиш у під'їзд"
            body="старий львівський, тихий, свій."
          />
          <Step
            num="03"
            title="і знаходиш нас"
            body="двері flat5. ти на місці."
          />
        </ol>

        <div className="md:col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Photo tag="05 · DOMOFON" />
            <Photo tag="06 · DOOR" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-6 border-b border-lilac/40 pb-6">
      <div className="font-display text-5xl text-lilac md:text-6xl">{num}</div>
      <div>
        <div className="font-display text-2xl md:text-3xl">{title}</div>
        <div className="mt-2 text-paper/80">{body}</div>
      </div>
    </li>
  );
}

function Photo({ tag }: { tag: string }) {
  return (
    <div className="shadow-brut relative aspect-[4/3] border-2 border-lilac bg-ink">
      <span className="caps absolute bottom-3 left-3 bg-lilac px-2 py-1 text-[10px] text-ink">
        {tag} · фото скоро
      </span>
    </div>
  );
}
