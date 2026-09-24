'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EditProfileModalProps {
  initialFullName: string | null;
  initialPhone: string | null;
  initialWhatsapp: string | null;
  initialUsername: string | null;
}

export function EditProfileModal({
  initialFullName,
  initialPhone,
  initialWhatsapp,
  initialUsername,
}: EditProfileModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState(initialFullName || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp || '');
  const [username, setUsername] = useState(initialUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/utilisateurs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim() || undefined,
          phone: phone.trim() || null,
          whatsapp: whatsapp.trim() || null,
          username: username.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour des informations.');
      }

      setSuccess('Informations mises à jour avec succès !');
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 font-bold"
        >
          ✏️ Modifier mes informations
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-vayeko-green">Modifier mes coordonnées</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
              <Input
                label="Nom complet"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Nom d'utilisateur (sans @)"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: koffi_mensah"
              />

              <Input
                label="Numéro WhatsApp (avec indicatif +228)"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+228 90 00 00 00"
              />

              <Input
                label="Téléphone d'appel"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+228 90 00 00 00"
              />

              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
              {success && <p className="text-xs font-semibold text-emerald-700">{success}</p>}

              <div className="mt-6 flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" loading={loading}>
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
