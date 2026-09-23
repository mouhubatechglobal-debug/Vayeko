import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'scripts/**',
      'public/**',
      '*.zip',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Les visuels de démo sont servis en local ; <img> est acceptable pour eux,
      // next/image reste utilisé pour les images dynamiques.
      '@next/next/no-img-element': 'off',
      // Contenu 100 % français : les apostrophes typographiques dans le JSX sont
      // sûres ici (aucune chaîne de formatage) — règle désactivée pour lisibilité.
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
