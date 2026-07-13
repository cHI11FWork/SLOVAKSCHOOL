"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validations";
import type { Lang } from "@/lib/i18n";
import type { LeadSource, ThankYouContent } from "@/lib/types";

type Props = {
  source: Exclude<LeadSource, "webinar_form">;
  buttonText: string;
  thankYou: ThankYouContent;
  lang: Lang;
};

const GRADES = ["8", "9", "10", "11", "college"] as const;

const TEXT: Record<Lang, { name: string; phone: string; gradePlaceholder: string; grades: Record<string, string> }> = {
  uk: {
    name: "Ім'я",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Який клас закінчила дитина",
    grades: { "8": "8 клас", "9": "9 клас", "10": "10 клас", "11": "11 клас", college: "Коледж" },
  },
  en: {
    name: "Name",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Which grade has the child completed",
    grades: { "8": "Grade 8", "9": "Grade 9", "10": "Grade 10", "11": "Grade 11", college: "College" },
  },
  sk: {
    name: "Meno",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Aký ročník dieťa ukončilo",
    grades: { "8": "8. ročník", "9": "9. ročník", "10": "10. ročník", "11": "11. ročník", college: "Vysoká škola" },
  },
};

export function LeadForm({ source, buttonText, thankYou, lang }: Props) {
  const [done, setDone] = useState(false);
  const t = TEXT[lang];
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source },
  });

  async function onSubmit(values: LeadInput) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
        className="w-full max-w-[560px] rounded-2xl bg-[#fde6f4] px-8 py-5 text-[17px] text-[#f41a94]"
      >
        {thankYou.message}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[560px]">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="grade"
          render={({ field }) => (
            <SelectPrimitive.Root value={field.value} onValueChange={field.onChange}>
              <SelectPrimitive.Trigger
                className="flex w-full items-center justify-between rounded-full border border-[#e6e6e6] bg-white px-5 py-3.5 text-base text-[#1e2156] outline-none data-[placeholder]:text-[#a3a6af]"
                aria-label={t.gradePlaceholder}
              >
                <SelectPrimitive.Value placeholder={t.gradePlaceholder} />
                <SelectPrimitive.Icon>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#a3a6af]" />
                </SelectPrimitive.Icon>
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  position="popper"
                  sideOffset={8}
                  className="z-50 overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-xl"
                  style={{ width: "var(--radix-select-trigger-width)" }}
                >
                  <SelectPrimitive.Viewport className="p-1.5">
                    {GRADES.map((g) => (
                      <SelectPrimitive.Item
                        key={g}
                        value={g}
                        className="cursor-pointer select-none rounded-xl px-4 py-2.5 text-base text-[#1e2156] outline-none data-[highlighted]:bg-[#fafafb]"
                      >
                        <SelectPrimitive.ItemText>{t.grades[g]}</SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          )}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-[#e6e6e6] bg-white p-3 min-[640px]:flex-row min-[640px]:gap-3">
          <input
            placeholder={t.name}
            className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-b max-[640px]:border-[#e6e6e6] max-[640px]:pb-3"
            {...register("name")}
          />
          <input
            placeholder={t.phone}
            type="tel"
            className="min-w-0 flex-[1.2] border-none border-l border-[#e6e6e6] bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-l-0"
            {...register("phone")}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 rounded-full bg-[#f41a94] px-6 py-3 text-base text-white shadow-[0_10px_24px_-10px_rgba(244,26,148,0.55)] transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_16px_32px_-10px_rgba(244,26,148,0.5)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? "…" : buttonText}
          </button>
        </div>
      </div>

      {(errors.name || errors.phone || errors.grade) && (
        <p className="mt-2 text-left text-xs text-red-500">
          {errors.name?.message || errors.phone?.message || errors.grade?.message}
        </p>
      )}
    </form>
  );
}
