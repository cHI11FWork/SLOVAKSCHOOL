"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";
import type { LeadSource, ThankYouContent } from "@/lib/types";

type Props = {
  source: LeadSource;
  buttonText: string;
  thankYou: ThankYouContent;
};

export function LeadForm({ source, buttonText, thankYou }: Props) {
  const [done, setDone] = useState(false);
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
      <div className="w-full max-w-[560px] rounded-2xl bg-[#fbe1d1] px-8 py-5 text-[17px] text-[#5d2a1a]">
        {thankYou.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[560px]">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#ececec] bg-white p-3 min-[640px]:flex-row min-[640px]:gap-3">
        <input
          placeholder="Ім'я"
          className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-b max-[640px]:border-[#ececec] max-[640px]:pb-3"
          {...register("name")}
        />
        <input
          placeholder="+380 __ ___ __ __"
          type="tel"
          className="min-w-0 flex-[1.2] border-none border-l border-[#ececec] bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[#a3a6af] max-[640px]:border-l-0"
          {...register("phone")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-full bg-[#17191c] px-6 py-3 text-base text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "…" : buttonText}
        </button>
      </div>

      {(errors.name || errors.phone) && (
        <p className="mt-2 text-left text-xs text-red-500">
          {errors.name?.message || errors.phone?.message}
        </p>
      )}
    </form>
  );
}
