import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введіть ім'я")
    .max(80, "Задовге ім'я"),
  phone: z
    .string()
    .trim()
    .min(7, "Введіть номер телефону")
    .max(20, "Задовгий номер")
    .regex(/^[0-9+()\-\s]+$/, "Некоректний номер телефону"),
  source: z.enum(["hero_form", "consultation_form", "feedback_form"]),
  // honeypot: humans never fill this in, bots often do
  company: z.string().max(0, "").optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
