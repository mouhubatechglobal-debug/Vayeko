'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { formatCfa } from '@/lib/utils';
import { serviceInputSchema } from '@/lib/validations';
import { RATE_TYPE_LABELS } from '@/lib/constants';
import type { ServiceCategory } from '@/types/database';

interface MyService {
  id: string;
  name: string;
  price_cfa: number | null;
  rate_type: string;
  status: string;
}

interface MyBusiness {
  id: string;
  name: string;
  type: string;
}

/** Gestion des services du prestataire — création, édition, retrait. */
export function ServiceManager({
  businesses,
  categories,
}: {
  businesses: MyBusiness[];
  categories: ServiceCategory[];
}) {
  const [services, setServices] = useState<MyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_cfa: '',
    rate_type: 'quote' as 'fixed' | 'from' | 'quote' | 'hourly',
    business_id: businesses[0]?.id ?? '',
    category_id: '',
    phone: '',
    whatsapp: '',
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services?mine=1');
      if (res.ok) {
        const json = (await res.json()) as { items: MyService[] };
        setServices(json.items);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  function resetForm() {
    setEditingId(null);
    setForm((f) => ({ ...f, name: '', description: '', price_cfa: '', rate_type: 'quote', category_id: '', phone: '', whatsapp: '' }));
    setMessage(null);
  }

  function startEdit(s: MyService) {
    setEditingId(s.id);
    setForm((f) => ({
      ...f,
      name: s.name,
      price_cfa: s.price_cfa != null ? String(s.price_cfa) : '',
      rate_type: (s.rate_type as typeof form.rate_type) ?? 'quote',
    }));
    setMessage(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = serviceInputSchema.safeParse({
      name: form.name,
      description: form.description,
      price_cfa: form.price_cfa ? Number.parseInt(form.price_cfa, 10) : null,
      rate_type: form.rate_type,
      business_id: form.business_id || undefined,
      category_id: form.category_id || null,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
    });
    if (!parsed.success) {
      setMessage({ kind: 'err', text: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' });
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId ? { ...parsed.data, id: editingId } : parsed.data;
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (res.ok) {
        setMessage({ kind: 'ok', text: editingId ? 'Service mis à jour.' : 'Service publié !' });
        resetForm();
        void refresh();
      } else {
        setMessage({ kind: 'err', text: json.error ?? 'Opération impossible pour le moment.' });
      }
    } finally {
      setSaving(false);
    }
  }

  async function onRemove(id: string) {
    if (!window.confirm('Retirer ce service ? Il ne sera plus visible.')) return;
    const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) void refresh();
    else setMessage({ kind: 'err', text: 'Suppression impossible pour le moment.' });
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <p className="text-sm text-neutral-600">
          Créez d'abord votre entreprise (type <strong>Prestataire</strong> ou{' '}
          <strong>Les deux</strong>) dans l'onglet <strong>Ma boutique</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="liste-services">
        <h2 id="liste-services" className="text-lg font-extrabold text-vayeko-green">
          Mes services ({services.length})
        </h2>
        {loading ? (
          <p className="mt-3 text-sm text-neutral-500">Chargement…</p>
        ) : services.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-white p-5 text-sm text-neutral-500 shadow-card">
            Aucun service pour l'instant. Publiez votre premier service ci-dessous !
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {services.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
                <div>
                  <p className="font-bold text-vayeko-green">{s.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                    <span>{s.price_cfa != null ? formatCfa(s.price_cfa) : RATE_TYPE_LABELS[s.rate_type] ?? s.rate_type}</span>
                    <Badge tone={s.status === 'active' ? 'green' : 'yellow'}>{s.status === 'active' ? 'Visible' : s.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(s)}>
                    Modifier
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onRemove(s.id)}>
                    Retirer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="form-service" className="rounded-2xl bg-white p-6 shadow-card">
        <h2 id="form-service" className="text-lg font-extrabold text-vayeko-green">
          {editingId ? 'Modifier le service' : 'Publier un service'}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nom du service"
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div>
            <label htmlFor="srv-cat" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Catégorie (facultatif)
            </label>
            <select
              id="srv-cat"
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm"
            >
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="srv-biz" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Entreprise
            </label>
            <select
              id="srv-biz"
              value={form.business_id}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm((f) => ({ ...f, business_id: e.target.value }))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm disabled:opacity-60"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="srv-rate" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Type de tarification
            </label>
            <select
              id="srv-rate"
              value={form.rate_type}
              onChange={(e) => setForm((f) => ({ ...f, rate_type: e.target.value as typeof form.rate_type }))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm"
            >
              {Object.entries(RATE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Prix (FCFA, facultatif)"
            type="number"
            min={0}
            max={100000000}
            inputMode="numeric"
            value={form.price_cfa}
            onChange={(e) => setForm((f) => ({ ...f, price_cfa: e.target.value }))}
          />
          <Input
            label="WhatsApp de contact"
            type="tel"
            placeholder="+228 90 00 00 00"
            maxLength={20}
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          />
          <Input
            label="Téléphone (facultatif)"
            type="tel"
            placeholder="+228 22 00 00 00"
            maxLength={20}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              required
              maxLength={3000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez votre service, vos horaires, votre zone d'intervention…"
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
            <Button type="submit" loading={saving} disabled={form.name.trim().length < 3 || form.description.trim().length < 10}>
              {editingId ? 'Enregistrer' : 'Publier le service'}
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
