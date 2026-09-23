'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';
import { resetPasswordSchema, signInSchema, signUpSchema } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Feedback = { kind: 'ok' | 'err'; text: string } | null;

function mapAuthError(raw: string): string {
  const message = raw.toLowerCase();
  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return 'E-mail ou mot de passe incorrect.';
  }
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Un compte existe déjà avec cette adresse e-mail.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Trop de tentatives. Réessayez dans quelques minutes.';
  }
  return 'Une erreur est survenue. Réessayez.';
}

function DemoNotice() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="mb-4 rounded-xl bg-vayeko-yellow/15 px-4 py-3 text-sm text-vayeko-green">
      <strong>Mode démonstration.</strong> Supabase n’est pas encore configuré — configurez
      <code className="mx-1 rounded bg-white/70 px-1">.env.local</code>
      pour activer l’authentification réelle.
    </div>
  );
}

/** Formulaire de connexion. */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join('.') || '_'] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) {
        setFeedback({ kind: 'err', text: mapAuthError(error.message) });
      } else {
        const dest = searchParams.get('redirectedFrom') || '/profil';
        router.replace(dest.startsWith('/') && !dest.startsWith('//') ? dest : '/profil');
        router.refresh();
      }
    } catch {
      setFeedback({ kind: 'err', text: 'Connexion impossible. Vérifiez votre réseau.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <DemoNotice />
      <Input
        label="Adresse e-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute right-3 top-[37px] rounded px-2 py-1 text-xs font-semibold text-neutral-500 hover:text-vayeko-green"
        >
          {showPassword ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      <div className="flex justify-end">
        <Link href="/mot-de-passe-oublie" className="text-sm font-semibold text-vayeko-green hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>
      {feedback && (
        <p role="alert" className={`rounded-lg px-3 py-2 text-sm font-medium ${feedback.kind === 'err' ? 'bg-red-50 text-vayeko-red' : 'bg-emerald-50 text-emerald-700'}`}>
          {feedback.text}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Se connecter
      </Button>
    </form>
  );
}

/** Formulaire d'inscription. */
export function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const parsed = signUpSchema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join('.') || '_'] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { full_name: parsed.data.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setFeedback({ kind: 'err', text: mapAuthError(error.message) });
      } else {
        setFeedback({
          kind: 'ok',
          text: 'Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse.',
        });
        setFullName('');
        setEmail('');
        setPassword('');
      }
    } catch {
      setFeedback({ kind: 'err', text: 'Inscription impossible. Vérifiez votre réseau.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <DemoNotice />
      <Input
        label="Nom complet"
        type="text"
        autoComplete="name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />
      <Input
        label="Adresse e-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint="8 caractères minimum, avec une lettre et un chiffre."
      />
      {feedback && (
        <p role="alert" className={`rounded-lg px-3 py-2 text-sm font-medium ${feedback.kind === 'err' ? 'bg-red-50 text-vayeko-red' : 'bg-emerald-50 text-emerald-700'}`}>
          {feedback.text}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Créer mon compte
      </Button>
      <p className="text-center text-xs text-neutral-500">
        En créant un compte, vous acceptez nos{' '}
        <Link href="/conditions" className="font-semibold text-vayeko-green hover:underline">
          Conditions d'utilisation
        </Link>{' '}
        et notre{' '}
        <Link href="/confidentialite" className="font-semibold text-vayeko-green hover:underline">
          Politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}

/** Formulaire de réinitialisation du mot de passe. */
export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const parsed = resetPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors({ email: parsed.error.issues[0]?.message ?? 'E-mail invalide.' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const supabase = createClient();
      // Message identique quel que soit le résultat (ne pas révéler l'existence du compte).
      await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profil`,
      });
      setFeedback({
        kind: 'ok',
        text: 'Si un compte existe avec cet e-mail, un lien de réinitialisation vient d’être envoyé.',
      });
    } catch {
      setFeedback({ kind: 'err', text: 'Impossible d’envoyer l’e-mail pour le moment.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <DemoNotice />
      <Input
        label="Adresse e-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      {feedback && (
        <p role="alert" className={`rounded-lg px-3 py-2 text-sm font-medium ${feedback.kind === 'err' ? 'bg-red-50 text-vayeko-red' : 'bg-emerald-50 text-emerald-700'}`}>
          {feedback.text}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        M’envoyer le lien
      </Button>
    </form>
  );
}
