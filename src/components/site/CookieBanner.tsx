import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("pm_cookies_ok")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-lg border border-border bg-background p-4 shadow-xl md:p-5">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Usamos cookies para mejorar tu experiencia y analizar tráfico. Cumplimos con la LFPDPPP.
        </p>
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem("pm_cookies_ok", "1");
            setShow(false);
          }}
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
}
