"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";
import type { Lang } from "@/lib/i18n";
import type { LeadSource, ThankYouContent } from "@/lib/types";

type Props = {
  source: LeadSource;
  buttonText: string;
  thankYou: ThankYouContent;
  lang: Lang;
};

const TEXT: Record<Lang, { name: string; phone: string; gradePlaceholder: string; grades: Record<string, string> }> = {
  uk: {
    name: "Ім'я",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Клас / курс навчання",
    grades: { "8": "8 клас", "9": "9 клас", "10": "10 клас", "11": "11 клас", college: "Коледж" },
  },
  en: {
    name: "Name",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Grade / year of study",
    grades: { "8": "Grade 8", "9": "Grade 9", "10": "Grade 10", "11": "Grade 11", college: "College" },
  },
  sk: {
    name: "Meno",
    phone: "+380 __ ___ __ __",
    gradePlaceholder: "Ročník / stupeň štúdia",
    grades: { "8": "8. ročník", "9": "9. ročník", "10": "10. ročník", "11": "11. ročník", college: "Vysoká škola" },
  },
};

export function LeadForm({ source, buttonText, thankYou, lang }: Props) {
  const [done, setDone] = useState(false);
  const t = TEXT[lang];
  const {
    register,
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
      <div className="w-full max-w-[640px] rounded-2xl bg-[#fbe1d1] px-8 py-5 text-[17px] text-[#5d2a1a]">
        {thankYou.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[640px]">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#ececec] bg-white p-3 min-[640px]:flex-row min-[640px]:gap-3">
        <input
          placeholder={t.name}
          className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-b max-[640px]:border-[#ececec] max-[640px]:pb-3"
          {...register("name")}
        />
        <input
          placeholder={t.phone}
          type="tel"
          className="min-w-0 flex-[1.2] border-none border-l border-[#ececec] bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-l-0 max-[640px]:border-b max-[640px]:pb-3"
          {...register("phone")}
        />
        <select
          defaultValue=""
          className="min-w-0 flex-1 border-none border-l border-[#ececec] bg-transparent px-3 py-2.5 text-base text-[#17191c] outline-none max-[640px]:border-l-0 [&:invalid]:text-[#a3a6af]"
          {...register("grade")}
        >
          <option value="" disabled>
            {t.gradePlaceholder}
          </option>
          {(["8", "9", "10", "11", "college"] as const).map((g) => (
            <option key={g} value={g}>
              {t.grades[g]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-full bg-[#17191c] px-6 py-3 text-base text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "…" : buttonText}
        </button>
      </div>

      {(errors.name || errors.phone || errors.grade) && (
        <p className="mt-2 text-left text-xs text-red-500">
          {errors.name?.message || errors.phone?.message || errors.grade?.message}
        </p>
      )}
    </form>
  );
}
