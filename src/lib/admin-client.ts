import { supabase } from "@/integrations/supabase/client";

type AdminServerFn<TResult> = (options?: any) => Promise<TResult>;

export async function getAdminAuthHeaders() {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (error || !token) {
    throw new Error("Tu sesión de administrador expiró. Inicia sesión otra vez.");
  }

  return { Authorization: `Bearer ${token}` };
}

export async function callAdminFn<TResult>(fn: AdminServerFn<TResult>, data?: unknown) {
  const headers = await getAdminAuthHeaders();
  return data === undefined ? fn({ headers }) : fn({ data, headers });
}

export function formatAdminError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar el panel admin. Intenta iniciar sesión otra vez.";
}