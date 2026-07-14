"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { webinarLeadSchema, type WebinarLeadInput } from "@/lib/validations";

export function WebinarRegisterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WebinarLeadInput>({
    resolver: zodResolver(webinarLeadSchema),
    defaultValues: { source: "webinar_form" },
  });

  async function onSubmit(values: WebinarLeadInput) {
    const res = await fetch("/api/webinar-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) setDone(true);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto grid max-w-[400px] gap-4"
      >
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />
        <input
          placeholder="Ім'я"
          className="rounded-lg border border-[#E9C9DB] bg-white px-[18px] py-[15px] text-[15px] text-[#23285A] outline-none focus:border-[#E6308A]"
          {...register("name")}
        />
        <input
          placeholder="Номер телефону"
          type="tel"
          className="rounded-lg border border-[#E9C9DB] bg-white px-[18px] py-[15px] text-[15px] text-[#23285A] outline-none focus:border-[#E6308A]"
          {...register("phone")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-[10px] bg-[#F0158C] py-[17px] text-sm font-bold tracking-[.12em] text-white uppercase shadow-[0_12px_26px_rgba(240,21,140,0.35)] transition-colors hover:bg-[#C11367] disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? "…" : "Зареєструватися"}
        </button>
        {(errors.name || errors.phone) && (
          <p className="text-left text-xs text-red-500">
            {errors.name?.message || errors.phone?.message}
          </p>
        )}
      </form>

      {done && <WebinarThankYouModal onClose={() => setDone(false)} />}
    </>
  );
}

function WebinarThankYouModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,15,25,0.55)] p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] rounded-[20px] bg-white px-8 pt-14 pb-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.3)] min-[480px]:px-16"
      >
        <button
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-[18px] right-[18px] p-1.5 text-[22px] leading-none text-[#E6308A]"
        >
          ✕
        </button>
        <h3 className="mb-[18px] font-[family-name:var(--font-montserrat)] text-[22px] font-extrabold uppercase text-[#23285A]">
          Дякуємо за реєстрацію!
        </h3>
        <p className="mb-3.5 text-[15px] font-bold text-[#23285A]">
          Наш менеджер з Вами зв&rsquo;яжеться протягом дня!
        </p>
        <p className="mb-7 text-sm leading-relaxed text-[#6B6F8C]">
          Також отримайте бонус – доступ до телеграм каналу про безкоштовне навчання в Словаччині
        </p>
        <button
          onClick={onClose}
          className="rounded-[10px] bg-[#F0158C] px-11 py-[15px] text-[13px] font-bold tracking-[.12em] text-white uppercase shadow-[0_12px_26px_rgba(240,21,140,0.35)] transition-colors hover:bg-[#C11367]"
        >
          На головну
        </button>
      </div>
    </div>
  );
}
