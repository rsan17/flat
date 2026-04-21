"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clubJoinSchema, type ClubJoinInput } from "@/lib/validators";

type JoinResponse = {
  ok: true;
  alreadyMember: boolean;
  inviteUrl: string;
};

export function ChessClub() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<JoinResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClubJoinInput>({
    resolver: zodResolver(clubJoinSchema),
    defaultValues: {
      fullName: "",
      phone: "+380",
      nickname: "",
      chessHandle: "",
      consent: undefined as unknown as true,
    },
  });

  async function onSubmit(values: ClubJoinInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/club/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        setServerError("Щось пішло не так. Спробуй ще раз.");
        return;
      }
      const data = (await res.json()) as JoinResponse;
      setResult(data);
    } catch {
      setServerError("Немає з'єднання. Перевір інтернет і спробуй знову.");
    }
  }

  return (
    <section
      id="club"
      className="border-b-2 border-ink bg-bone"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="caps text-xs">004 — F5 CHESS CLUB</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
            F5 <span className="bg-lilac px-2">CHESS</span>
            <br />
            CLUB.
          </h2>
          <p className="mt-6 text-lg">
            Спільнота, де шахи виходять за межі звичного.
            <br />
            Тут грають, вчаться і знайомляться — без напруги і зайвої
            строгості.
          </p>
          <p className="mt-4 text-lg">
            Не обов&apos;язково бути профі: можна прийти з нуля або після
            паузи.
            <br />
            Поруч люди, з якими легко освоїтись і втягнутись у гру.
          </p>

          <div className="mt-8 space-y-4">
            <ClubPerk
              tag="всередині клубу"
              text="Гра з різними учасниками, турніри і події, навчання і практика, Telegram-канал з анонсами."
            />
            <ClubPerk
              tag="бонус"
              text="Твій перший бонус — карта лояльності і +5% кешбеку."
            />
            <ClubPerk
              tag="кодекс"
              text="Ми граємо запекло, але з повагою. Тут немає токсичності — тільки дружнє ставлення один до одного. І Flat5 — наш простір, тому бережемо його."
            />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="shadow-brut border-2 border-ink bg-paper p-6 md:p-8">
            {result ? (
              <JoinSuccess
                inviteUrl={result.inviteUrl}
                alreadyMember={result.alreadyMember}
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className="caps text-xs opacity-70">реєстрація в клубі</p>
                <h3 className="font-display mt-2 text-3xl">
                  Долучайся до тусовки
                </h3>

                <div className="mt-6 grid gap-4">
                  <Field
                    label="Ім'я та прізвище"
                    error={errors.fullName?.message}
                  >
                    <input
                      type="text"
                      className="input"
                      placeholder="Анна Ковальчук"
                      autoComplete="name"
                      {...register("fullName")}
                    />
                  </Field>

                  <Field
                    label="Номер телефону"
                    error={errors.phone?.message}
                  >
                    <input
                      type="tel"
                      className="input"
                      placeholder="+380XXXXXXXXX"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                  </Field>

                  <Field
                    label="Нікнейм у клубі"
                    error={errors.nickname?.message}
                  >
                    <input
                      type="text"
                      className="input"
                      placeholder="Під яким тебе знатимуть"
                      {...register("nickname")}
                    />
                  </Field>

                  <Field
                    label="Нік на chess.com / lichess.org"
                    hint="Опціонально"
                    error={errors.chessHandle?.message}
                  >
                    <input
                      type="text"
                      className="input"
                      placeholder="Можна залишити порожнім"
                      {...register("chessHandle")}
                    />
                  </Field>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 border-2 border-ink accent-ink"
                      {...register("consent")}
                    />
                    <span>
                      Згоден на обробку персональних даних для участі в клубі.
                    </span>
                  </label>
                  {errors.consent?.message && (
                    <p className="caps text-[11px] text-red-600">
                      {errors.consent.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="caps mt-4 text-xs text-red-600">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-lilac mt-6 w-full disabled:opacity-60"
                >
                  {isSubmitting ? "реєструємо..." : "приєднатись"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="caps flex items-center gap-2 text-[11px] opacity-70">
        {label}
        {hint && <span className="opacity-60">· {hint}</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && (
        <span className="caps mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function ClubPerk({ tag, text }: { tag: string; text: string }) {
  return (
    <div className="border-l-4 border-lilac pl-4">
      <span className="caps text-[11px] opacity-70">{tag}</span>
      <div className="text-base">{text}</div>
    </div>
  );
}

function JoinSuccess({
  inviteUrl,
  alreadyMember,
}: {
  inviteUrl: string;
  alreadyMember: boolean;
}) {
  return (
    <div>
      <p className="caps text-xs text-lilac">
        {alreadyMember ? "ти вже з нами" : "вітаємо в клубі"}
      </p>
      <h3 className="font-display mt-2 text-3xl">
        {alreadyMember ? "З поверненням." : "Готово."}
      </h3>
      <p className="mt-4 text-base">
        Ось посилання на Telegram-групу клубу. Там найсвіжіші анонси турнірів
        та лекцій.
      </p>
      <a
        href={inviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-lilac mt-6 w-full"
      >
        відкрити telegram-групу
      </a>
      <p className="caps mt-4 break-all text-[11px] opacity-60">{inviteUrl}</p>
    </div>
  );
}
