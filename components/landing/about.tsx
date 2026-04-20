export function About() {
  return (
    <section id="about" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="caps text-xs">001 — ABOUT</p>
          <h2 className="font-display mt-4 text-6xl md:text-7xl">
            ДОШКА,
            <br />
            ЯКУ ПОМІТЯТЬ.
          </h2>
        </div>
        <div className="space-y-6 text-lg md:col-span-7 md:col-start-6">
          <p>
            Ми зробили шахи, які самі любимо брати в руки.
            <br />
            Надруковані на 3D-принтері, але з увагою до деталей і відчуття.
            <br />
            Вони трохи важчі, ніж очікуєш — і це кайф.
            <br />
            Магніти фіксують кожен хід для твоєї комфортної гри.
          </p>
          <p>
            І при цьому — вона компактна. Така, що легко взяти з собою: на
            зустріч, у подорож чи просто на вечір з друзями.
          </p>
          <p>
            F5 BOARD — новий погляд на класичну гру.
          </p>
          <ul className="mt-6 grid gap-3 text-base">
            <li className="border-l-4 border-lilac pl-4">
              <span className="caps text-[11px] opacity-70">матеріал</span>
              <div>Сучасний 3D-друк із приємною текстурою.</div>
            </li>
            <li className="border-l-4 border-lilac pl-4">
              <span className="caps text-[11px] opacity-70">фігури</span>
              <div>
                З додатковою вагою та магнітною основою, які тримають кожен хід.
                Кожна фігура має своє місце — усе продумано до дрібниць.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
