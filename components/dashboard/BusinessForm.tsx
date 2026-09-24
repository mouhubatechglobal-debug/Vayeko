'use client';

import { ImageUploader } from '@/components/ui/ImageUploader';

import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { boutiqueInputSchema } from '@/lib/validations';
import type { City } from '@/types/database';

interface MyBusiness {
  id: string;
  name: string;
  slug: string;
  type: 'shop' | 'service' | 'both';
  status: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  member_role: string;
}

const STATUS_LABELS: Record<string, { label: string; tone: 'yellow' | 'green' | 'red' | 'neutral' }> = {
  pending: { label: 'En attente de validation', tone: 'yellow' },
  active: { label: 'Active et visible', tone: 'green' },
  suspended: { label: 'Suspendue', tone: 'red' },
  rejected: { label: 'Rejetée', tone: 'red' },
};

/** Création / édition de la boutique du commerçant (API sécurisée + Zod). */
export function BusinessForm({ cities }: { cities: City[] }) {
  const [businesses, setBusinesses] = useState<MyBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    whatsapp: '',
    type: 'shop' as 'shop' | 'service' | 'both',
    city_id: '',
    logo_url: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/boutiques?mine=1');
      if (res.ok) {
        const json = (await res.json()) as { items: MyBusiness[] };
        setBusinesses(json.items);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function startEdit(b: MyBusiness) {
    setEditingId(b.id);
    setForm({
      name: b.name,
      description: b.description ?? '',
      phone: b.phone ?? '',
      whatsapp: b.whatsapp ?? '',
      type: b.type,
      city_id: '',
    logo_url: '',
    });
    setMessage(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: '', description: '', phone: '', whatsapp: '', type: 'shop', city_id: '' });
    setMessage(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (editingId) {
      const res = await fetch('/api/boutiques', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      if (res.ok) {
        setMessage({ kind: 'ok', text: 'Boutique mise à jour.' });
        resetForm();
        void refresh();
      } else {
        setMessage({ kind: 'err', text: 'Mise à jour impossible. Vérifiez les champs.' });
      }
      return;
    }

    const parsed = boutiqueInputSchema.safeParse({ ...form, city_id: form.city_id });
    if (!parsed.success) {
      setMessage({ kind: 'err', text: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/boutiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { error?: string };
      if (res.ok) {
        setMessage({
          kind: 'ok',
          text: 'Boutique créée ! Elle sera visible après validation par notre équipe.',
        });
        resetForm();
        void refresh();
      } else {
        setMessage({ kind: 'err', text: json.error ?? 'Création impossible pour le moment.' });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="mes-boutiques">
        <h2 className="text-lg font-extrabold text-vayeko-green">Mes entreprises</h2>
        {loading ? (
          <p className="mt-3 text-sm text-neutral-500">Chargement…</p>
        ) : businesses.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-white p-5 text-sm text-neutral-500 shadow-card">
            Vous n'avez pas encore de boutique. Créez-la ci-dessous !
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {businesses.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
                <div>
                  <p className="font-bold text-vayeko-green">{b.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={STATUS_LABELS[b.status]?.tone ?? 'neutral'}>
                      {STATUS_LABELS[b.status]?.label ?? b.status}
                    </Badge>
                    <span className="text-xs text-neutral-400">Rôle : {b.member_role}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEdit(b)}>
                  <Icon name="settings" className="h-4 w-4" /> Modifier
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="form-boutique" className="rounded-2xl bg-white p-6 shadow-card">
        <h2 id="form-boutique" className="text-lg font-extrabold text-vayeko-green">
          {editingId ? 'Modifier ma boutique' : 'Créer ma boutique'}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nom de la boutique"
            required
            value={form.name}
            maxLength={100}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div>
            <label htmlFor="biz-type" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Type d'activité
            </label>
            <select
              id="biz-type"
              value={form.type}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm disabled:opacity-60"
            >
              <option value="shop">Commerce / boutique</option>
              <option value="service">Prestataire de services</option>
              <option value="both">Les deux</option>
            </select>
          </div>
          <Input
            label="Téléphone"
            type="tel"
            placeholder="+228 90 00 00 00"
            value={form.phone}
            maxLength={20}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="WhatsApp"
            type="tel"
            placeholder="+228 90 00 00 00"
            value={form.whatsapp}
            maxLength={20}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          />
          {!editingId && (
            <div className="sm:col-span-2">
              <label htmlFor="biz-ville" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
                Ville
              </label>
              <select
                id="biz-ville"
                required
                value={form.city_id}
                onChange={(e) => setForm((f) => ({ ...f, city_id: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm"
              >
                <option value="" disabled>
                  Choisir une ville…
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              maxLength={2000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Présentez votre activité, vos horaires, vos spécialités…"
            />
          </div>
          {message && (
            <p
              role="status"
              className={`sm:col-span-2 rounded-lg px-3 py-2 text-sm font-medium ${
                message.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-vayeko-red'
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" loading={saving} disabled={form.name.trim().length < 3}>
              {editingId ? 'Enregistrer les modifications' : 'Créer ma boutique'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
