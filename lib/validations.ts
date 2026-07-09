import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const phoneField = z
  .string()
  .trim()
  .min(7, "Введіть номер телефону")
  .max(20, "Задовгий номер")
  .refine((value) => isValidPhoneNumber(value, "UA"), "Некоректний номер телефону");

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введіть ім'я")
    .max(80, "Задовге ім'я"),
  phone: phoneField,
  source: z.enum(["hero_form", "consultation_form", "feedback_form"]),
  // honeypot: humans never fill this in, bots often do
  company: z.string().max(0, "").optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const adminLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введіть ім'я")
    .max(80, "Задовге ім'я"),
  phone: phoneField,
  source: z.enum(["hero_form", "consultation_form", "feedback_form"]),
  status: z.enum(["new", "in_progress", "done"]),
  notes: z.string().trim().max(2000, "Задовгі нотатки").optional(),
});

export type AdminLeadInput = z.infer<typeof adminLeadSchema>;
