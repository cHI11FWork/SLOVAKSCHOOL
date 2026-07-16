"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { webinarLeadSchema, type WebinarLeadInput } from "@/lib/validations";

export function WebinarRegisterForm() {
  const router = useRouter();
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
    if (res.ok) router.push("/thank-you");
  }

  return (
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
  );
}
