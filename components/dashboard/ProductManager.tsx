import { ImageUploader } from '@/components/ui/ImageUploader';
'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatCfa } from '@/lib/utils';
import { productInputSchema } from '@/lib/validations';
import type { ProductCategory } from '@/types/database';

interface MyProduct {
  id: string;
  name: string;
  price_cfa: number;
  available: boolean;
  status: string;
  shop_id: string;
}

interface MyShop {
  id: string;
  name: string;
}

/** Gestion des produits du commerçant — création, édition, retrait. */
export function ProductManager({ categories }: { categories: ProductCategory[] }) {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [shops, setShops] = useState<MyShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_cfa: '',
    shop_id: '',
    category_id: '',
    stock: '',
    available: true,
    imageUrl: '',
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/produits?mine=1');
      if (res.ok) {
        const json = (await res.json()) as { items: MyProduct[]; shops?: MyShop[] };
        setProducts(json.items);
        if (json.shops) setShops(json.shops);
        if (json.shops?.length) {
          setForm((f) => (f.shop_id ? f : { ...f, shop_id: json.shops![0].id }));
        }
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
    setForm((f) => ({ ...f, name: '', description: '', price_cfa: '', category_id: '', stock: '', available: true, imageUrl: '' }));
    setMessage(null);
  }

  function startEdit(p: MyProduct) {
    setEditingId(p.id);
    setForm((f) => ({
      ...f,
      name: p.name,
      price_cfa: String(p.price_cfa),
      shop_id: p.shop_id,
      available: p.available,
    }));
    setMessage(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = productInputSchema.safeParse({
      name: form.name,
      description: form.description || null,
      price_cfa: Number.parseInt(form.price_cfa, 10),
      shop_id: form.shop_id || undefined,
      category_id: form.category_id || null,
      stock: form.stock ? Number.parseInt(form.stock, 10) : null,
      available: form.available,
    });
    if (!parsed.success) {
      setMessage({ kind: 'err', text: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' });
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId ? { ...parsed.data, id: editingId } : parsed.data;
      const res = await fetch('/api/produits', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (res.ok) {
        setMessage({ kind: 'ok', text: editingId ? 'Produit mis à jour.' : 'Produit publié !' });
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
    if (!window.confirm('Retirer ce produit de la vente ?')) return;
    const res = await fetch(`/api/produits?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) void refresh();
    else setMessage({ kind: 'err', text: 'Suppression impossible pour le moment.' });
  }

  if (!loading && shops.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <p className="text-sm text-neutral-600">
          Créez d'abord votre boutique (onglet <strong>Ma boutique</strong>) pour pouvoir publier
          des produits.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="liste-produits">
        <h2 id="liste-produits" className="text-lg font-extrabold text-vayeko-green">
          Mes produits ({products.length})
        </h2>
        {loading ? (
          <p className="mt-3 text-sm text-neutral-500">Chargement…</p>
        ) : products.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-white p-5 text-sm text-neutral-500 shadow-card">
            Aucun produit pour l'instant. Ajoutez votre premier produit ci-dessous !
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {products.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
                <div>
                  <p className="font-bold text-vayeko-green">{p.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-700">{formatCfa(p.price_cfa)}</span>
                    {!p.available && <Badge tone="red">Indisponible</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                    Modifier
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onRemove(p.id)}>
                    <Icon name="x" className="h-3.5 w-3.5" /> Retirer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="form-produit" className="rounded-2xl bg-white p-6 shadow-card">
        <h2 id="form-produit" className="text-lg font-extrabold text-vayeko-green">
          {editingId ? 'Modifier le produit' : 'Publier un produit'}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nom du produit"
            required
            maxLength={100}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Prix (FCFA)"
            type="number"
            min={0}
            max={100000000}
            inputMode="numeric"
            required
            value={form.price_cfa}
            onChange={(e) => setForm((f) => ({ ...f, price_cfa: e.target.value }))}
          />
          <div>
            <label htmlFor="prod-shop" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Boutique
            </label>
            <select
              id="prod-shop"
              value={form.shop_id}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm((f) => ({ ...f, shop_id: e.target.value }))}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm shadow-sm disabled:opacity-60"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prod-cat" className="mb-1.5 block text-sm font-semibold text-vayeko-green">
              Catégorie (facultatif)
            </label>
            <select
              id="prod-cat"
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
          <Input
            label="Stock (facultatif)"
            type="number"
            min={0}
            max={1000000}
            inputMode="numeric"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-semibold text-vayeko-green">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-300 accent-[var(--vayeko-green)]"
            />
            Disponible à la vente
          </label>
          <div className="sm:col-span-2">
            <Textarea
              label="Description (facultatif)"
              maxLength={2000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
            <Button type="submit" loading={saving} disabled={form.name.trim().length < 3 || !form.price_cfa}>
              {editingId ? 'Enregistrer' : 'Publier le produit'}
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
