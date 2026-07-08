"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { leadSchema, type LeadInput } from "@/lib/validations";
import type { LeadSource, ThankYouContent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SquiggleArrow } from "@/components/icons/decorative";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle: string;
  buttonText: string;
  source: LeadSource;
  thankYou: ThankYouContent;
  align?: "center" | "left";
  decorated?: boolean;
  card?: boolean;
  className?: string;
};

export function LeadForm({
  title,
  subtitle,
  buttonText,
  source,
  thankYou,
  align = "center",
  decorated = false,
  card = true,
  className,
}: Props) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
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
    if (res.ok) {
      reset({ source, name: "", phone: "" });
      setDone(true);
    }
  }

  return (
    <div className={cn("relative", className)}>
      {decorated && (
        <>
          <SquiggleArrow className="absolute -left-16 top-6 hidden w-32 -scale-x-100 md:block" />
          <SquiggleArrow className="absolute -right-16 bottom-0 hidden w-32 rotate-180 md:block" />
        </>
      )}

      <div
        className={cn(
          "relative z-10",
          card && "rounded-[15px] bg-pink-light px-6 py-10 sm:px-12",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        <h3 className="text-2xl font-bold text-navy sm:text-[32px]">{title}</h3>
        <p
          className={cn(
            "mt-3 text-sm text-navy/70",
            align === "center" ? "mx-auto max-w-md" : "max-w-md"
          )}
        >
          {subtitle}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "mt-8 flex flex-col gap-4",
            align === "center" && "mx-auto max-w-md"
          )}
        >
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

          <div>
            <Input placeholder="Ім'я" {...register("name")} />
            {errors.name && <p className="mt-1 text-left text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Номер телефону" type="tel" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-left text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn("mt-2", align === "center" && "mx-auto")}
          >
            {isSubmitting ? "Надсилаємо…" : buttonText}
          </Button>
        </form>
      </div>

      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="text-center"
          >
            <DialogTitle className="text-center">{thankYou.title}</DialogTitle>
            <DialogDescription className="text-center">{thankYou.message}</DialogDescription>
            <Button className="mt-8" onClick={() => setDone(false)}>
              {thankYou.button}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
