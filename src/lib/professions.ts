// Vayeko - Système de Professions
// Profession ≠ Rôle
// Rôle = ce qu'elle PEUT faire sur Vayeko (USER, SELLER, PROFESSIONAL, etc.)
// Profession = ce qu'elle FAIT dans la vie (mécanicien, coiffeur, architecte, etc.)
// Structure évolutive permettant d'ajouter de nouvelles professions sans modifier le cœur

export interface ProfessionCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

export interface Profession {
  id: string
  name: string
  slug: string
  categoryId: string
  description: string
  icon: string
  requiresVerification: boolean
  isActive: boolean
}

export enum VerificationStatus {
  NON_VERIFIE = 'NON_VERIFIE',
  EN_VERIFICATION = 'EN_VERIFICATION',
  VERIFIE = 'VERIFIE',
  REJETE = 'REJETE'
}

export const professionCategories: ProfessionCategory[] = [
  { id: 'maison', name: 'Maison / Construction', slug: 'maison-construction', description: 'Bâtiment, construction, rénovation', icon: '🏗️', color: '#F59E0B' },
  { id: 'informatique', name: 'Informatique / Technologie', slug: 'informatique-technologie', description: 'Numérique, développement, design', icon: '💻', color: '#06B6D4' },
  { id: 'commerce', name: 'Commerce', slug: 'commerce', description: 'Vente, distribution, boutique', icon: '🛒', color: '#7C3AED' },
  { id: 'restauration', name: 'Restauration / Alimentation', slug: 'restauration-alimentation', description: 'Cuisine, food, livraison', icon: '🍽️', color: '#EF4444' },
  { id: 'beaute', name: 'Beauté / Bien-être', slug: 'beaute-bien-etre', description: 'Coiffure, esthétique, bien-être', icon: '💄', color: '#EC4899' },
  { id: 'transport', name: 'Transport / Automobile', slug: 'transport-automobile', description: 'Mécanique, conduite, livraison', icon: '🚗', color: '#6366F1' },
  { id: 'education', name: 'Éducation', slug: 'education', description: 'Enseignement, formation, coaching', icon: '📚', color: '#0E9F6E' },
  { id: 'sante', name: 'Santé', slug: 'sante', description: 'Médical, paramédical - vérification requise', icon: '🏥', color: '#E11D48' },
  { id: 'juridique', name: 'Juridique / Finance', slug: 'juridique-finance', description: 'Droit, compta, assurance', icon: '⚖️', color: '#1F2937' },
  { id: 'immobilier', name: 'Immobilier', slug: 'immobilier', description: 'Agence, gestion, promotion', icon: '🏠', color: '#06B6D4' },
  { id: 'emploi', name: 'Emploi / Entreprise', slug: 'emploi-entreprise', description: 'Recrutement, RH, coaching pro', icon: '💼', color: '#E11D48' },
  { id: 'art', name: 'Art / Culture / Événementiel', slug: 'art-culture-evenementiel', description: 'Artiste, photo, événement', icon: '🎨', color: '#8B5CF6' },
  { id: 'services_particuliers', name: 'Services aux particuliers', slug: 'services-particuliers', description: 'Nettoyage, jardinage, aide', icon: '🧹', color: '#10B981' },
  { id: 'agriculture', name: 'Agriculture', slug: 'agriculture', description: 'Agriculteur, éleveur, pêcheur', icon: '🌾', color: '#84CC16' },
  { id: 'services_pro', name: 'Services professionnels', slug: 'services-professionnels', description: 'Consultant, traducteur, freelance', icon: '💼', color: '#6B7280' },
]

export const professions: Profession[] = [
  // MAISON / CONSTRUCTION
  { id: 'architecte', name: 'Architecte', slug: 'architecte', categoryId: 'maison', description: 'Conception plans, suivi chantier', icon: '📐', requiresVerification: true, isActive: true },
  { id: 'macon', name: 'Maçon', slug: 'macon', categoryId: 'maison', description: 'Construction gros œuvre', icon: '🧱', requiresVerification: false, isActive: true },
  { id: 'electricien', name: 'Électricien', slug: 'electricien', categoryId: 'maison', description: 'Installation, dépannage électrique', icon: '⚡', requiresVerification: false, isActive: true },
  { id: 'plombier', name: 'Plombier', slug: 'plombier', categoryId: 'maison', description: 'Plomberie, sanitaire', icon: '🚿', requiresVerification: false, isActive: true },
  { id: 'carreleur', name: 'Carreleur', slug: 'carreleur', categoryId: 'maison', description: 'Pose carrelage, faïence', icon: '🔲', requiresVerification: false, isActive: true },
  { id: 'peintre_batiment', name: 'Peintre en bâtiment', slug: 'peintre-batiment', categoryId: 'maison', description: 'Peinture intérieure/extérieure', icon: '🎨', requiresVerification: false, isActive: true },
  { id: 'menuisier', name: 'Menuisier', slug: 'menuisier', categoryId: 'maison', description: 'Bois, portes, fenêtres', icon: '🪚', requiresVerification: false, isActive: true },
  { id: 'charpentier', name: 'Charpentier', slug: 'charpentier', categoryId: 'maison', description: 'Charpente, toiture', icon: '🏠', requiresVerification: false, isActive: true },
  { id: 'soudeur', name: 'Soudeur', slug: 'soudeur', categoryId: 'maison', description: 'Soudure métallique', icon: '🔥', requiresVerification: false, isActive: true },
  { id: 'vitrier', name: 'Vitrier', slug: 'vitrier', categoryId: 'maison', description: 'Vitres, miroirs', icon: '🪟', requiresVerification: false, isActive: true },
  { id: 'climaticien', name: 'Climaticien', slug: 'climaticien', categoryId: 'maison', description: 'Climatisation, froid', icon: '❄️', requiresVerification: false, isActive: true },
  { id: 'decorateur', name: 'Décorateur', slug: 'decorateur', categoryId: 'maison', description: 'Décoration intérieur', icon: '🛋️', requiresVerification: false, isActive: true },
  { id: 'designer_interieur', name: "Designer d'intérieur", slug: 'designer-interieur', categoryId: 'maison', description: 'Aménagement intérieur', icon: '✨', requiresVerification: false, isActive: true },
  { id: 'paysagiste', name: 'Paysagiste', slug: 'paysagiste', categoryId: 'maison', description: 'Jardins, espaces verts', icon: '🌳', requiresVerification: false, isActive: true },

  // INFORMATIQUE / TECHNOLOGIE
  { id: 'dev_web', name: 'Développeur web', slug: 'developpeur-web', categoryId: 'informatique', description: 'Sites web, applications web', icon: '🌐', requiresVerification: false, isActive: true },
  { id: 'dev_mobile', name: 'Développeur mobile', slug: 'developpeur-mobile', categoryId: 'informatique', description: 'Apps iOS/Android', icon: '📱', requiresVerification: false, isActive: true },
  { id: 'dev_logiciel', name: 'Développeur logiciel', slug: 'developpeur-logiciel', categoryId: 'informatique', description: 'Logiciels sur mesure', icon: '💾', requiresVerification: false, isActive: true },
  { id: 'admin_systeme', name: 'Administrateur système', slug: 'administrateur-systeme', categoryId: 'informatique', description: 'Serveurs, infra', icon: '🖥️', requiresVerification: false, isActive: true },
  { id: 'tech_info', name: 'Technicien informatique', slug: 'technicien-informatique', categoryId: 'informatique', description: 'Maintenance, support', icon: '🔧', requiresVerification: false, isActive: true },
  { id: 'reparateur_info', name: 'Réparateur informatique', slug: 'reparateur-informatique', categoryId: 'informatique', description: 'Réparation PC, téléphone', icon: '🛠️', requiresVerification: false, isActive: true },
  { id: 'tech_reseau', name: 'Technicien réseau', slug: 'technicien-reseau', categoryId: 'informatique', description: 'Réseaux, internet', icon: '🌐', requiresVerification: false, isActive: true },
  { id: 'ui_ux', name: 'Designer UI/UX', slug: 'designer-ui-ux', categoryId: 'informatique', description: 'Interface utilisateur', icon: '🎨', requiresVerification: false, isActive: true },
  { id: 'graphiste', name: 'Graphiste', slug: 'graphiste', categoryId: 'informatique', description: 'Design graphique', icon: '🖌️', requiresVerification: false, isActive: true },
  { id: 'photographe', name: 'Photographe', slug: 'photographe', categoryId: 'informatique', description: 'Photo pro, événement', icon: '📸', requiresVerification: false, isActive: true },
  { id: 'videaste', name: 'Vidéaste', slug: 'videaste', categoryId: 'informatique', description: 'Vidéo, montage', icon: '🎬', requiresVerification: false, isActive: true },
  { id: 'community_manager', name: 'Community manager', slug: 'community-manager', categoryId: 'informatique', description: 'Réseaux sociaux', icon: '📱', requiresVerification: false, isActive: true },

  // COMMERCE
  { id: 'commercant', name: 'Commerçant', slug: 'commercant', categoryId: 'commerce', description: 'Commerce général', icon: '🏪', requiresVerification: false, isActive: true },
  { id: 'vendeur', name: 'Vendeur', slug: 'vendeur', categoryId: 'commerce', description: 'Vente détail', icon: '🛍️', requiresVerification: false, isActive: true },
  { id: 'grossiste', name: 'Grossiste', slug: 'grossiste', categoryId: 'commerce', description: 'Vente en gros', icon: '📦', requiresVerification: false, isActive: true },
  { id: 'distributeur', name: 'Distributeur', slug: 'distributeur', categoryId: 'commerce', description: 'Distribution produits', icon: '🚚', requiresVerification: false, isActive: true },

  // RESTAURATION
  { id: 'restaurant', name: 'Restaurant', slug: 'restaurant', categoryId: 'restauration', description: 'Restaurant, maquis', icon: '🍽️', requiresVerification: false, isActive: true },
  { id: 'cuisinier', name: 'Cuisinier', slug: 'cuisinier', categoryId: 'restauration', description: 'Cuisine pro', icon: '👨‍🍳', requiresVerification: false, isActive: true },
  { id: 'patissier', name: 'Pâtissier', slug: 'patissier', categoryId: 'restauration', description: 'Pâtisserie', icon: '🧁', requiresVerification: false, isActive: true },
  { id: 'traiteur', name: 'Traiteur', slug: 'traiteur', categoryId: 'restauration', description: 'Service traiteur', icon: '🍱', requiresVerification: false, isActive: true },
  { id: 'livreur_repas', name: 'Livreur de repas', slug: 'livreur-repas', categoryId: 'restauration', description: 'Livraison food', icon: '🛵', requiresVerification: false, isActive: true },

  // BEAUTÉ
  { id: 'coiffeur', name: 'Coiffeur', slug: 'coiffeur', categoryId: 'beaute', description: 'Coiffure homme', icon: '💇‍♂️', requiresVerification: false, isActive: true },
  { id: 'coiffeuse', name: 'Coiffeuse', slug: 'coiffeuse', categoryId: 'beaute', description: 'Coiffure femme', icon: '💇‍♀️', requiresVerification: false, isActive: true },
  { id: 'barbier', name: 'Barbier', slug: 'barbier', categoryId: 'beaute', description: 'Barbe, rasage', icon: '✂️', requiresVerification: false, isActive: true },
  { id: 'esthetique', name: 'Esthéticienne', slug: 'esthetique', categoryId: 'beaute', description: 'Soins beauté', icon: '💅', requiresVerification: false, isActive: true },
  { id: 'couturier', name: 'Couturier', slug: 'couturier', categoryId: 'beaute', description: 'Couture, retouches', icon: '👗', requiresVerification: false, isActive: true },
  { id: 'styliste', name: 'Styliste', slug: 'styliste', categoryId: 'beaute', description: 'Mode, création', icon: '👠', requiresVerification: false, isActive: true },

  // TRANSPORT / AUTO
  { id: 'mecanicien', name: 'Mécanicien', slug: 'mecanicien', categoryId: 'transport', description: 'Réparation auto/moto', icon: '🔧', requiresVerification: false, isActive: true },
  { id: 'electricien_auto', name: 'Électricien automobile', slug: 'electricien-auto', categoryId: 'transport', description: 'Électricité auto', icon: '⚡', requiresVerification: false, isActive: true },
  { id: 'vulcanisateur', name: 'Vulcanisateur', slug: 'vulcanisateur', categoryId: 'transport', description: 'Pneus, vulcanisation', icon: '🛞', requiresVerification: false, isActive: true },
  { id: 'conducteur', name: 'Conducteur', slug: 'conducteur', categoryId: 'transport', description: 'Chauffeur, conducteur', icon: '🚕', requiresVerification: false, isActive: true },
  { id: 'livreur', name: 'Livreur', slug: 'livreur', categoryId: 'transport', description: 'Livraison colis', icon: '📦', requiresVerification: false, isActive: true },
  { id: 'lavage_auto', name: 'Lavage automobile', slug: 'lavage-auto', categoryId: 'transport', description: 'Lavage, nettoyage auto', icon: '🚿', requiresVerification: false, isActive: true },

  // ÉDUCATION
  { id: 'enseignant', name: 'Enseignant', slug: 'enseignant', categoryId: 'education', description: 'Enseignement scolaire', icon: '👨‍🏫', requiresVerification: false, isActive: true },
  { id: 'formateur', name: 'Formateur', slug: 'formateur', categoryId: 'education', description: 'Formation pro', icon: '📖', requiresVerification: false, isActive: true },
  { id: 'coach_scolaire', name: 'Coach scolaire', slug: 'coach-scolaire', categoryId: 'education', description: 'Soutien scolaire', icon: '🎓', requiresVerification: false, isActive: true },

  // SANTÉ - Vérification requise
  { id: 'medecin', name: 'Médecin', slug: 'medecin', categoryId: 'sante', description: 'Médecine générale/spécialisée', icon: '👨‍⚕️', requiresVerification: true, isActive: true },
  { id: 'infirmier', name: 'Infirmier', slug: 'infirmier', categoryId: 'sante', description: 'Soins infirmiers', icon: '💉', requiresVerification: true, isActive: true },
  { id: 'pharmacien', name: 'Pharmacien', slug: 'pharmacien', categoryId: 'sante', description: 'Pharmacie', icon: '💊', requiresVerification: true, isActive: true },
  { id: 'dentiste', name: 'Dentiste', slug: 'dentiste', categoryId: 'sante', description: 'Soins dentaires', icon: '🦷', requiresVerification: true, isActive: true },
  { id: 'sage_femme', name: 'Sage-femme', slug: 'sage-femme', categoryId: 'sante', description: 'Maternité', icon: '👶', requiresVerification: true, isActive: true },
  { id: 'kine', name: 'Kinésithérapeute', slug: 'kinesitherapeute', categoryId: 'sante', description: 'Kiné, rééducation', icon: '🦴', requiresVerification: true, isActive: true },
  { id: 'clinique', name: 'Clinique', slug: 'clinique', categoryId: 'sante', description: 'Clinique, centre santé', icon: '🏥', requiresVerification: true, isActive: true },

  // JURIDIQUE / FINANCE - Vérification requise
  { id: 'avocat', name: 'Avocat', slug: 'avocat', categoryId: 'juridique', description: 'Conseil juridique', icon: '⚖️', requiresVerification: true, isActive: true },
  { id: 'notaire', name: 'Notaire', slug: 'notaire', categoryId: 'juridique', description: 'Actes notariés', icon: '📜', requiresVerification: true, isActive: true },
  { id: 'comptable', name: 'Comptable', slug: 'comptable', categoryId: 'juridique', description: 'Comptabilité', icon: '🧮', requiresVerification: true, isActive: true },
  { id: 'expert_comptable', name: 'Expert-comptable', slug: 'expert-comptable', categoryId: 'juridique', description: 'Expertise comptable', icon: '📊', requiresVerification: true, isActive: true },
  { id: 'assureur', name: 'Assureur', slug: 'assureur', categoryId: 'juridique', description: 'Assurance', icon: '🛡️', requiresVerification: false, isActive: true },

  // IMMOBILIER
  { id: 'agent_immobilier', name: 'Agent immobilier', slug: 'agent-immobilier', categoryId: 'immobilier', description: 'Transaction immo', icon: '🏠', requiresVerification: false, isActive: true },
  { id: 'agence_immobiliere', name: 'Agence immobilière', slug: 'agence-immobiliere', categoryId: 'immobilier', description: 'Agence immo', icon: '🏢', requiresVerification: false, isActive: true },
  { id: 'promoteur_immobilier', name: 'Promoteur immobilier', slug: 'promoteur-immobilier', categoryId: 'immobilier', description: 'Promotion immobilière', icon: '🏗️', requiresVerification: false, isActive: true },

  // EMPLOI
  { id: 'recruteur', name: 'Recruteur', slug: 'recruteur', categoryId: 'emploi', description: 'Recrutement', icon: '🤝', requiresVerification: false, isActive: true },
  { id: 'cabinet_recrutement', name: 'Cabinet de recrutement', slug: 'cabinet-recrutement', categoryId: 'emploi', description: 'Cabinet RH', icon: '🏢', requiresVerification: false, isActive: true },
  { id: 'coach_pro', name: 'Coach professionnel', slug: 'coach-professionnel', categoryId: 'emploi', description: 'Coaching carrière', icon: '🎯', requiresVerification: false, isActive: true },

  // ART / CULTURE
  { id: 'artiste', name: 'Artiste', slug: 'artiste', categoryId: 'art', description: 'Art, création', icon: '🎨', requiresVerification: false, isActive: true },
  { id: 'musicien', name: 'Musicien', slug: 'musicien', categoryId: 'art', description: 'Musique', icon: '🎵', requiresVerification: false, isActive: true },
  { id: 'dj', name: 'DJ', slug: 'dj', categoryId: 'art', description: 'Animation musicale', icon: '🎧', requiresVerification: false, isActive: true },
  { id: 'photographe_event', name: 'Photographe événementiel', slug: 'photographe-evenementiel', categoryId: 'art', description: 'Photo mariage, événement', icon: '📸', requiresVerification: false, isActive: true },
  { id: 'organisateur_event', name: "Organisateur d'événements", slug: 'organisateur-evenements', categoryId: 'art', description: 'Événementiel', icon: '🎉', requiresVerification: false, isActive: true },
  { id: 'artisan', name: 'Artisan', slug: 'artisan', categoryId: 'art', description: 'Artisanat local', icon: '👐', requiresVerification: false, isActive: true },

  // SERVICES PARTICULIERS
  { id: 'nettoyage', name: 'Agent de nettoyage', slug: 'agent-nettoyage', categoryId: 'services_particuliers', description: 'Nettoyage, ménage', icon: '🧹', requiresVerification: false, isActive: true },
  { id: 'jardinier', name: 'Jardinier', slug: 'jardinier', categoryId: 'services_particuliers', description: 'Jardinage', icon: '🌱', requiresVerification: false, isActive: true },
  { id: 'garde_enfants', name: "Garde d'enfants", slug: 'garde-enfants', categoryId: 'services_particuliers', description: 'Baby-sitting', icon: '👶', requiresVerification: false, isActive: true },
  { id: 'securite', name: 'Agent de sécurité', slug: 'agent-securite', categoryId: 'services_particuliers', description: 'Sécurité, gardiennage', icon: '🛡️', requiresVerification: false, isActive: true },
  { id: 'demenageur', name: 'Déménageur', slug: 'demenageur', categoryId: 'services_particuliers', description: 'Déménagement', icon: '🚚', requiresVerification: false, isActive: true },

  // AGRICULTURE
  { id: 'agriculteur', name: 'Agriculteur', slug: 'agriculteur', categoryId: 'agriculture', description: 'Culture, maraîchage', icon: '🌾', requiresVerification: false, isActive: true },
  { id: 'eleveur', name: 'Éleveur', slug: 'eleveur', categoryId: 'agriculture', description: 'Élevage', icon: '🐄', requiresVerification: false, isActive: true },
  { id: 'pecheur', name: 'Pêcheur', slug: 'pecheur', categoryId: 'agriculture', description: 'Pêche', icon: '🎣', requiresVerification: false, isActive: true },
  { id: 'producteur_agricole', name: 'Producteur agricole', slug: 'producteur-agricole', categoryId: 'agriculture', description: 'Production agricole', icon: '🥕', requiresVerification: false, isActive: true },

  // SERVICES PRO
  { id: 'consultant', name: 'Consultant', slug: 'consultant', categoryId: 'services_pro', description: 'Conseil entreprise', icon: '💡', requiresVerification: false, isActive: true },
  { id: 'traducteur', name: 'Traducteur', slug: 'traducteur', categoryId: 'services_pro', description: 'Traduction', icon: '🌐', requiresVerification: false, isActive: true },
  { id: 'redacteur', name: 'Rédacteur', slug: 'redacteur', categoryId: 'services_pro', description: 'Rédaction', icon: '✍️', requiresVerification: false, isActive: true },
  { id: 'commercial', name: 'Commercial', slug: 'commercial', categoryId: 'services_pro', description: 'Vente, négoce', icon: '🤝', requiresVerification: false, isActive: true },
  { id: 'freelance', name: 'Freelance', slug: 'freelance', categoryId: 'services_pro', description: 'Indépendant', icon: '💻', requiresVerification: false, isActive: true },
]

export function getProfessionsByCategory(categoryId: string): Profession[] {
  return professions.filter(p => p.categoryId === categoryId && p.isActive)
}

export function getProfessionById(id: string): Profession | undefined {
  return professions.find(p => p.id === id)
}

export function getProfessionBySlug(slug: string): Profession | undefined {
  return professions.find(p => p.slug === slug)
}

export function searchProfessions(query: string): Profession[] {
  const q = query.toLowerCase()
  return professions.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.slug.includes(q)
  )
}

export const customProfession = {
  id: 'autre',
  name: 'Autre profession',
  slug: 'autre-profession',
  description: 'Profession non listée - saisie libre, modération admin',
  icon: '➕',
}
