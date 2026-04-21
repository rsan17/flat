import { z } from "zod";

export const phoneRegex = /^\+380\d{9}$/;

export const deliveryTypeEnum = z.enum(["warehouse", "postomat", "pickup"]);
export type DeliveryType = z.infer<typeof deliveryTypeEnum>;

const npFieldsRequired = z.object({
  city: z.string().trim().min(1, "Оберіть місто"),
  cityRef: z.string().trim().min(1, "Оберіть місто зі списку"),
  warehouse: z.string().trim().min(1, "Оберіть відділення"),
  warehouseRef: z.string().trim().min(1, "Оберіть відділення зі списку"),
});

const basePersonal = z.object({
  firstName: z.string().trim().min(2, "Вкажіть ім'я"),
  lastName: z.string().trim().min(2, "Вкажіть прізвище"),
  phone: z.string().trim().regex(phoneRegex, "Формат: +380XXXXXXXXX"),
  email: z.string().trim().email("Некоректний email"),
  clubMemberName: z.string().trim().max(80).optional().or(z.literal("")),
  engraving: z.boolean().optional(),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Потрібна згода на обробку даних" }),
  productSku: z.string().min(1),
  variantSku: z.string().min(1),
  quantity: z.number().int().min(1).max(5),
});

export const checkoutSchema = z.discriminatedUnion("deliveryType", [
  basePersonal
    .extend({
      deliveryType: z.literal("warehouse"),
    })
    .merge(npFieldsRequired),
  basePersonal
    .extend({
      deliveryType: z.literal("postomat"),
    })
    .merge(npFieldsRequired),
  basePersonal.extend({
    deliveryType: z.literal("pickup"),
    city: z.string().optional().or(z.literal("")),
    cityRef: z.string().optional().or(z.literal("")),
    warehouse: z.string().optional().or(z.literal("")),
    warehouseRef: z.string().optional().or(z.literal("")),
  }),
]);

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const PICKUP_ADDRESS = "Львів, площа Ринок 39";

export const clubJoinSchema = z.object({
  fullName: z.string().trim().min(2, "Вкажіть ім'я та прізвище").max(80),
  phone: z.string().trim().regex(phoneRegex, "Формат: +380XXXXXXXXX"),
  nickname: z.string().trim().min(2, "Вкажіть нікнейм").max(40),
  chessHandle: z.string().trim().max(60).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Потрібна згода на обробку даних" }),
});

export type ClubJoinInput = z.infer<typeof clubJoinSchema>;
