"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold text-navy">Щось пішло не так</h1>
      <p className="max-w-sm text-sm text-navy/60">
        Сталася технічна помилка під час завантаження сторінки. Спробуйте ще раз.
      </p>
      <Button onClick={reset}>Спробувати знову</Button>
    </div>
  );
}
