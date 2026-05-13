import { supabase } from "@/integrations/supabase/client";

type AdminServerFn<TResult> = (options?: { data?: unknown; headers?: HeadersInit }) => Promise<TResult>;

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
  const options = data === undefined ? { headers } : { data, headers };
  return fn(options);
}