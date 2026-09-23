"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { products } from "@/lib/data"
import { ProductCard } from "@/components/ProductCard"

export function ProduitsSection() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]/30">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Produits populaires</h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Mise à jour aujourd&apos;hui • Prix vérifiés • FCFA</p>
          </div>
          <Link href="/boutiques" className="hidden sm:flex text-sm font-semibold text-[#0E9F6E] hover:underline">Voir toutes les boutiques →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={product as any} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
