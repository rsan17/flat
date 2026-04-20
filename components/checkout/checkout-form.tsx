"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NovaPoshtaPicker } from "./nova-poshta-picker";
import { OrderSummary } from "./order-summary";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";
import type { Product, ProductVariant } from "@/lib/products";

type Props = {
  product: Product;
  variant: ProductVariant;
  initialEngraving?: boolean;
  initialClubMemberName?: string;
};

export function CheckoutForm({
  product,
  variant,
  initialEngraving = false,
  initialClubMemberName = "",
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "+380",
      email: "",
      city: "",
      cityRef: "",
      warehouse: "",
      warehouseRef: "",
      deliveryType: "warehouse",
      clubMemberName: initialClubMemberName,
      engraving: initialEngraving,
      comment: "",
      consent: undefined as unknown as true,
      productSku: product.sku,
      variantSku: variant.sku,
      quantity: 1,
    } as CheckoutInput,
  });

  const quantity = watch("quantity");
  const engraving = watch("engraving");

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.startsWith("380")) digits = digits.slice(3);
    digits = digits.slice(-9);
    setValue("phone", "+380" + digits, { shouldValidate: true });
  }

  async function onSubmit(data: CheckoutInput) {
    setServerError(null);
    if (data.engraving && (data.clubMemberName ?? "").trim().length < 2) {
      setError("clubMemberName", {
        type: "manual",
        message: "Вкажіть нікнейм для гравіювання",
      });
      setFocus("clubMemberName");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        pageUrl?: string;
        orderId?: string;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setServerError(json.error || "Не вдалося оформити замовлення");
        setSubmitting(false);
        return;
      }
      if (json.pageUrl) {
        window.location.href = json.pageUrl;
      } else if (json.orderId) {
        window.location.href = `/order/${json.orderId}`;
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Помилка мережі");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 pb-20 md:grid-cols-12"
    >
      <div className="space-y-8 md:col-span-7">
        <section>
          <h2 className="font-display text-4xl">Контакти</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="field">
              <label>Ім&apos;я</label>
              <input
                className="input"
                {...register("firstName")}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <div className="err">{errors.firstName.message}</div>
              )}
            </div>
            <div className="field">
              <label>Прізвище</label>
              <input
                className="input"
                {...register("lastName")}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <div className="err">{errors.lastName.message}</div>
              )}
            </div>
            <div className="field">
              <label>Телефон</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="input"
                    inputMode="tel"
                    placeholder="+380XXXXXXXXX"
                    onChange={handlePhoneInput}
                    aria-invalid={!!errors.phone}
                  />
                )}
              />
              {errors.phone && (
                <div className="err">{errors.phone.message}</div>
              )}
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div className="err">{errors.email.message}</div>
              )}
            </div>
            <div className="field md:col-span-2">
              <label>
                Нікнейм · F5 Chess Club{" "}
                <span className="opacity-60">
                  {engraving ? "(потрібно для гравіювання)" : "(опційно)"}
                </span>
              </label>
              <input
                className="input"
                placeholder="Якщо ви учасник F5 Chess Club"
                {...register("clubMemberName")}
                aria-invalid={!!errors.clubMemberName}
              />
              {errors.clubMemberName && (
                <div className="err">
                  {errors.clubMemberName.message as string}
                </div>
              )}
            </div>
            <div className="field md:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="chk mt-1"
                  {...register("engraving")}
                />
                <span className="flex-1">
                  <b className="caps text-xs">
                    гравіювання нікнейма · +100 ₴
                  </b>
                  <span className="mt-1 block text-xs opacity-70">
                    Персоналізація для учасників F5 Chess Club — твій нікнейм
                    на дошці.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-4xl">Доставка</h2>
          <p className="caps mt-2 text-xs opacity-70">
            Нова пошта · самовивіз зі Львова
          </p>
          <div className="mt-6">
            <Controller
              name="deliveryType"
              control={control}
              render={({ field }) => (
                <NovaPoshtaPicker
                  deliveryType={field.value}
                  city={watch("city") ?? ""}
                  cityRef={watch("cityRef") ?? ""}
                  warehouse={watch("warehouse") ?? ""}
                  warehouseRef={watch("warehouseRef") ?? ""}
                  onChange={(patch) => {
                    if (patch.deliveryType !== undefined) field.onChange(patch.deliveryType);
                    if (patch.city !== undefined) setValue("city", patch.city, { shouldValidate: true });
                    if (patch.cityRef !== undefined) setValue("cityRef", patch.cityRef, { shouldValidate: true });
                    if (patch.warehouse !== undefined) setValue("warehouse", patch.warehouse, { shouldValidate: true });
                    if (patch.warehouseRef !== undefined) setValue("warehouseRef", patch.warehouseRef, { shouldValidate: true });
                  }}
                  errors={{
                    city: errors.city?.message || errors.cityRef?.message,
                    warehouse: errors.warehouse?.message || errors.warehouseRef?.message,
                  }}
                />
              )}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-4xl">Коментар</h2>
          <div className="field mt-6">
            <label>Побажання (опційно)</label>
            <textarea
              className="input"
              rows={4}
              {...register("comment")}
            />
            {errors.comment && (
              <div className="err">{errors.comment.message as string}</div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="chk mt-1"
              {...register("consent")}
            />
            <span>
              Погоджуюсь з обробкою персональних даних та{" "}
              <a href="/terms" target="_blank" rel="noopener" className="underline">
                умовами сервісу
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <div className="err">{errors.consent.message as string}</div>
          )}

          {serverError && (
            <div className="err border-2 border-[#cc0033] bg-[#cc0033]/10 p-3">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lilac w-full"
            disabled={submitting}
          >
            {submitting ? "Створюємо платіж…" : "Оплатити"}
          </button>
        </section>
      </div>

      <div className="md:col-span-5">
        <div className="md:sticky md:top-20">
          <OrderSummary
            product={product}
            variant={variant}
            quantity={quantity}
            engraving={engraving}
            onQuantityChange={(q) =>
              setValue("quantity", q, { shouldValidate: true })
            }
          />
        </div>
      </div>
    </form>
  );
}
