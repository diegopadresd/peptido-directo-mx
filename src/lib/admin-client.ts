import { supabase } from "@/integrations/supabase/client";

type ServerFnOptions = {
  data?: unknown;
  headers?: HeadersInit;
};

type ServerFn<TInput extends ServerFnOptions | undefined, TResult> = (options?: TInput) => Promise<TResult>;

export async function getAdminAuthHeaders() {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (error || !token) {
    throw new Error("Tu sesión de administrador expiró. Inicia sesión otra vez.");
  }

  return { Authorization: `Bearer ${token}` };
}

export async function callAdminFn<TResult>(fn: ServerFn<undefined, TResult>): Promise<TResult>;
export async function callAdminFn<TData, TResult>(
  fn: ServerFn<{ data: TData; headers?: HeadersInit }, TResult>,
  data: TData,
): Promise<TResult>;
export async function callAdminFn<TData, TResult>(
  fn: ServerFn<{ data: TData; headers?: HeadersInit } | { headers?: HeadersInit } | undefined, TResult>,
  data?: TData,
) {
  const headers = await getAdminAuthHeaders();
  const options = data === undefined ? { headers } : { data, headers };
  return fn(options as never);
}