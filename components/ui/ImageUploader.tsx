'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface ImageUploaderProps {
  bucket: 'avatars' | 'business-assets' | 'product-images';
  onUploaded: (url: string) => void;
  defaultUrl?: string | null;
  label?: string;
  hint?: string;
}

export function ImageUploader({
  bucket,
  onUploaded,
  defaultUrl,
  label = 'Photo du produit ou service',
  hint = 'JPG, PNG, WebP — Max 5 Mo',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('L’image ne doit pas dépasser 5 Mo.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Vous devez être connecté pour uploader une photo.');
      }

      // Chemin sécurisé exigé par la politique RLS : <uid>/<timestamp>-<nom_fichier>
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${user.id}/${Date.now()}-${cleanFileName}`;

      const { data, error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      // Obtenir l'URL publique de l'image
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      setPreview(publicUrl);
      onUploaded(publicUrl);
    } catch (err: any) {
      console.error('[vayeko][upload]', err);
      setError(err?.message || 'Échec de l’envoi de la photo. Vérifiez votre connexion.');
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    onUploaded('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-vayeko-green">{label}</label>

      {preview ? (
        <div className="relative inline-block overflow-hidden rounded-2xl border-2 border-vayeko-green/20 shadow-sm">
          <div className="relative h-44 w-44 bg-neutral-100 sm:h-52 sm:w-52">
            <Image
              src={preview}
              alt="Aperçu photo"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 176px, 208px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 transition"
            title="Supprimer la photo"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/70 p-6 text-center transition hover:border-vayeko-green hover:bg-vayeko-green/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vayeko-yellow/20 text-vayeko-yellow-dark">
            <Icon name="camera" className="h-6 w-6" />
          </div>
          <p className="mt-2 text-sm font-bold text-vayeko-green">
            {uploading ? 'Envoi en cours…' : 'Appuyez pour prendre ou choisir une photo'}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs font-semibold text-vayeko-red">{error}</p>}
    </div>
  );
}
