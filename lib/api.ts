import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';

/**
 * Helpers communs des Route Handlers — messages d'erreur génériques,
 * jamais de stack trace ni d'information interne exposée au client.
 */

export function jsonError(status: number, message: string, details?: unknown): NextResponse {
  return NextResponse.json({ error: message, details: details ?? null }, { status });
}

/** Message utilisateur-safe pour les erreurs inattendues (logguées en interne). */
export function serverError(context: string, error: unknown): NextResponse {
  console.error(`[vayeko][${context}]`, error);
  return jsonError(500, 'Une erreur est survenue. Réessayez dans un instant.');
}

/** Valide un corps JSON avec Zod. Renvoie { data } ou une NextResponse 400. */
export function parseJson<T>(
  schema: ZodSchema<T>,
  payload: unknown,
): { data: T; error: null } | { data: null; error: NextResponse } {
  try {
    const data = schema.parse(payload);
    return { data, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        data: null,
        error: jsonError(
          400,
          'Requête invalide.',
          err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        ),
      };
    }
    return { data: null, error: jsonError(400, 'Requête invalide.') };
  }
}

/** Lit le JSON d'une requête de façon sûre. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
