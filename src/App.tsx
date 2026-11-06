import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type Category =
  | 'Discovery' | 'Research' | 'Strategy' | 'UX' | 'UI'
  | 'Prototyping' | 'Testing' | 'Design System' | 'Delivery';

type Participant =
  | 'UX Designer' | 'UI Designer' | 'Product Designer' | 'Product Manager'
  | 'Developer' | 'Client' | 'End Users' | 'Stakeholders' | 'Marketing'
  | 'Sales' | 'Data / Analytics' | 'Management';

type Status = 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
type MobileTab = 'library' | 'builder' | 'summary';

const STATUS_LABELS: Record<Status, string> = {
  Draft:    'Brouillon',
  Sent:     'Envoyé',
  Accepted: 'Accepté',
  Rejected: 'Refusé',
};

interface LibItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  risk: string;
  deliverables: string[];
  defaultTJM: number;
  defaultDays: number;
  participants: Participant[];
}

interface ProjItem {
  instanceId: string;
  libId: string;
  title: string;
  category: Category;
  description: string;
  risk: string;
  deliverables: string[];
  tjm: number;
  days: number;
  useCustomTJM: boolean;
  optional: boolean;
  participants: Participant[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIBLIOTHÈQUE D'ACTIVITÉS
// ═══════════════════════════════════════════════════════════════════════════════

const LIBRARY: LibItem[] = [
  // ── Discovery ──────────────────────────────────────────────────────────────
  {
    id: 'd1', title: 'Stakeholder Interviews', category: 'Discovery',
    description: "Conversations structurées avec les commanditaires et parties prenantes clés pour identifier les objectifs, contraintes et critères de succès avant de démarrer la conception.",
    risk: "Sans alignement, le projet risque de résoudre le mauvais problème — de manière coûteuse.",
    deliverables: ["Synthèse des interviews", "Carte des parties prenantes", "Note d'alignement"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Product Manager', 'Stakeholders'],
  },
  {
    id: 'd2', title: 'Kick-off Workshop', category: 'Discovery',
    description: "Session facilitée réunissant toutes les parties pour aligner vision, périmètre, contraintes et modes de fonctionnement de l'équipe dès le premier jour.",
    risk: "Des attentes mal alignées se transforment en dérives de périmètre et en reprises coûteuses.",
    deliverables: ["Compte-rendu du Workshop", "Canvas de vision partagée", "Brief projet validé"],
    defaultTJM: 750, defaultDays: 1,
    participants: ['Product Designer', 'Product Manager', 'Client', 'Stakeholders'],
  },
  {
    id: 'd3', title: 'Analyse du Brief & Cadrage', category: 'Discovery',
    description: "Revue critique du brief projet pour définir les limites, faire remonter les risques cachés et valider ce qui est dans et hors du périmètre.",
    risk: "Un projet mal cadré garantit des dépassements de délais et de budget.",
    deliverables: ["Document de cadrage", "Registre des risques", "Matrice RACI"],
    defaultTJM: 750, defaultDays: 1.5,
    participants: ['UX Designer', 'Product Manager'],
  },
  {
    id: 'd4', title: 'Analyse Concurrentielle', category: 'Discovery',
    description: "Revue structurée des concurrents et produits adjacents pour identifier les écarts de positionnement, les bonnes pratiques et les anti-patterns à éviter.",
    risk: "Concevoir en isolation revient à réinventer la roue ou reproduire des erreurs déjà connues.",
    deliverables: ["Matrice concurrentielle", "Rapport de Benchmark", "Principaux enseignements"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Marketing'],
  },

  // ── Research ───────────────────────────────────────────────────────────────
  {
    id: 'r1', title: 'Interviews Utilisateurs', category: 'Research',
    description: "Entretiens qualitatifs approfondis avec les utilisateurs cibles pour comprendre leurs motivations, modèles mentaux, points de douleur et workflows réels.",
    risk: "Concevoir à partir d'hypothèses plutôt que de données réelles produit des produits que personne ne veut utiliser.",
    deliverables: ["Enregistrements des interviews", "Diagramme d'affinité", "Rapport d'insights utilisateurs"],
    defaultTJM: 750, defaultDays: 4,
    participants: ['UX Designer', 'End Users', 'Product Manager'],
  },
  {
    id: 'r2', title: 'Enquête Contextuelle', category: 'Research',
    description: "Observation des utilisateurs dans leur propre environnement pour comprendre les workflows réels, les contournements et les contraintes de contexte.",
    risk: "La recherche en laboratoire ne tient pas compte de la réalité désordonnée de l'utilisation effective du produit.",
    deliverables: ["Notes d'observation terrain", "Insights environnementaux", "Rapport des comportements observés"],
    defaultTJM: 800, defaultDays: 3,
    participants: ['UX Designer', 'End Users'],
  },
  {
    id: 'r3', title: 'Revue des Analytics', category: 'Research',
    description: "Analyse quantitative des données produit existantes pour cartographier les abandons, les points de friction et les patterns d'usage à grande échelle.",
    risk: "Sans données, les décisions de design reflètent la voix du Stakeholder le plus fort, pas celle du plus grand groupe d'utilisateurs.",
    deliverables: ["Rapport d'analytics", "Analyse du funnel", "Carte de chaleur des opportunités"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Data / Analytics', 'Product Manager'],
  },
  {
    id: 'r4', title: 'Conception & Analyse de Questionnaire', category: 'Research',
    description: "Questionnaire quantitatif pour valider des hypothèses et collecter des données structurées auprès d'un large échantillon d'utilisateurs cibles.",
    risk: "La recherche qualitative seule peut manquer les patterns majoritaires — les questionnaires apportent la confiance statistique nécessaire pour agir.",
    deliverables: ["Questionnaire", "Jeu de données des réponses", "Rapport d'analyse statistique"],
    defaultTJM: 750, defaultDays: 2.5,
    participants: ['UX Designer', 'End Users', 'Data / Analytics'],
  },

  // ── Strategy ───────────────────────────────────────────────────────────────
  {
    id: 's1', title: 'Stratégie UX & Vision', category: 'Strategy',
    description: "Définir l'étoile du nord UX à long terme, les principes directeurs et les piliers stratégiques qui cadreront toutes les décisions de design tout au long du projet.",
    risk: "Sans direction stratégique, le design devient réactif, incohérent et impossible à défendre.",
    deliverables: ["Présentation de la stratégie UX", "Principes de design", "Artefact de vision de l'expérience"],
    defaultTJM: 850, defaultDays: 3,
    participants: ['Product Designer', 'Product Manager', 'Management', 'Stakeholders'],
  },
  {
    id: 's2', title: 'Jobs-to-be-Done Mapping', category: 'Strategy',
    description: "Workshop et synthèse pour identifier les jobs fondamentaux que les utilisateurs confient au produit, en distinguant les dimensions fonctionnelles, émotionnelles et sociales.",
    risk: "La pensée feature-first produit des produits techniquement capables qui ne résolvent aucun besoin réel sous-jacent.",
    deliverables: ["Canvas JTBD", "Carte des opportunités", "Recommandations stratégiques"],
    defaultTJM: 850, defaultDays: 2,
    participants: ['UX Designer', 'Product Manager', 'Stakeholders'],
  },
  {
    id: 's3', title: 'Stratégie de Contenu', category: 'Strategy',
    description: "Définir le modèle de contenu, le ton éditorial, la hiérarchie des messages et le modèle de gouvernance pour l'ensemble du contenu produit.",
    risk: "Les interfaces qui semblent parfaites à vide se cassent avec du vrai contenu — la stratégie de contenu évite ce problème.",
    deliverables: ["Modèle de contenu", "Guide de ton & voix", "Audit de contenu & analyse des lacunes"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Marketing', 'Product Manager'],
  },

  // ── UX ─────────────────────────────────────────────────────────────────────
  {
    id: 'u1', title: 'Audit UX & Évaluation Heuristique', category: 'UX',
    description: "Revue experte d'un produit existant selon les heuristiques d'utilisabilité établies pour identifier et prioriser les points de friction avant la refonte.",
    risk: "Les problèmes connus restent non traités et la frustration des utilisateurs s'accumule sans revue externe d'expert.",
    deliverables: ["Rapport d'audit", "Liste des problèmes classés par sévérité", "Recommandations priorisées"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer'],
  },
  {
    id: 'u2', title: 'Cartographie du Parcours Utilisateur', category: 'UX',
    description: "Visualisation de bout en bout de l'expérience utilisateur à travers tous les points de contact, faisant apparaître les moments forts, les frictions et les zones d'opportunité.",
    risk: "La pensée en silos manque les frictions inter-canaux et les moments où la fidélité des utilisateurs se gagne ou se perd.",
    deliverables: ["Artefact de parcours utilisateur", "Carte de chaleur des opportunités", "Outputs du Workshop"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Product Manager', 'Client'],
  },
  {
    id: 'u3', title: "Architecture de l'Information", category: 'UX',
    description: "Structurer et organiser le contenu et la navigation du produit pour correspondre aux modèles mentaux des utilisateurs, via le tri de cartes et le tree testing.",
    risk: "Une mauvaise architecture de l'information crée des échecs de trouvabilité qu'aucun investissement en design visuel ne peut surmonter.",
    deliverables: ["Plan du site", "Modèle de navigation", "Rapports de tri de cartes & tree testing"],
    defaultTJM: 750, defaultDays: 2.5,
    participants: ['UX Designer', 'End Users'],
  },
  {
    id: 'u4', title: 'Wireframing', category: 'UX',
    description: "Maquettes structurelles basse fidélité des écrans clés pour valider hiérarchie, flux et priorités de contenu avant d'investir dans le design visuel.",
    risk: "Passer au UI haute fidélité sans Wireframes validés garantit des reprises coûteuses et démoralisantes.",
    deliverables: ["Jeu de Wireframes", "Flux annotés", "Notes de justification des choix de design"],
    defaultTJM: 750, defaultDays: 4,
    participants: ['UX Designer', 'Product Manager', 'Developer'],
  },
  {
    id: 'u5', title: 'Audit Accessibilité (WCAG 2.1 AA)', category: 'UX',
    description: "Revue systématique du produit selon les critères de succès WCAG 2.1 Niveau AA pour identifier les lacunes et définir une feuille de route de mise en conformité priorisée.",
    risk: "Les produits inaccessibles excluent des utilisateurs et exposent l'organisation à des risques réglementaires et de réputation.",
    deliverables: ["Rapport d'audit WCAG 2.1 AA", "Liste priorisée des correctifs", "Protocole de re-test"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'Developer'],
  },

  // ── UI ─────────────────────────────────────────────────────────────────────
  {
    id: 'ui1', title: "Déclinaison de l'Identité Visuelle", category: 'UI',
    description: "Transposer l'identité de marque en un langage de design produit cohérent — système de couleurs, échelle typographique, style d'iconographie et espacement.",
    risk: "La déconnexion marque-produit érode la confiance des utilisateurs et signale un manque de qualité.",
    deliverables: ["Guide de style UI", "Système de couleurs & typographie", "Directives d'approche iconographique"],
    defaultTJM: 850, defaultDays: 3,
    participants: ['UI Designer', 'Marketing', 'Stakeholders'],
  },
  {
    id: 'ui2', title: 'UI Design — Écrans Clés', category: 'UI',
    description: "Design haute fidélité des écrans produit principaux dans tous les états d'interaction, cas limites et breakpoints responsive.",
    risk: "Sans UI soignée, les Stakeholders peinent à évaluer le produit et les développeurs manquent d'une cible claire à implémenter.",
    deliverables: ["Fichier Figma avec tous les écrans", "Layouts responsive", "Documentation des états"],
    defaultTJM: 850, defaultDays: 6,
    participants: ['UI Designer', 'UX Designer', 'Product Manager'],
  },
  {
    id: 'ui3', title: "Système d'Illustration & d'Icônes", category: 'UI',
    description: "Style d'illustration sur-mesure et jeu d'icônes alignés sur l'identité visuelle du produit pour une communication visuelle cohérente et distinctive.",
    risk: "Les assets génériques érodent le capital de marque et donnent au produit une impression de commodité.",
    deliverables: ["Jeu d'icônes (SVG)", "Système d'illustration", "Guide d'utilisation"],
    defaultTJM: 900, defaultDays: 3,
    participants: ['UI Designer'],
  },

  // ── Prototyping ────────────────────────────────────────────────────────────
  {
    id: 'p1', title: 'Prototype Interactif', category: 'Prototyping',
    description: "Prototype Figma cliquable des flux utilisateurs clés, suffisamment réaliste pour la validation des Stakeholders et les sessions de tests utilisateurs.",
    risk: "Sans Prototype, les tests utilisateurs restent hypothétiques et les Stakeholders ne peuvent pas expérimenter ce qu'ils approuvent.",
    deliverables: ["Prototype Figma", "Carte de couverture des flux", "Scripts de scénarios de test"],
    defaultTJM: 750, defaultDays: 3,
    participants: ['Product Designer', 'UX Designer'],
  },
  {
    id: 'p2', title: 'Micro-interactions & Motion Design', category: 'Prototyping',
    description: "Design et spécification des transitions, animations de feedback et micro-interactions qui donnent au produit sa finition et sa réactivité tactile.",
    risk: "Les interfaces statiques et sans réponse semblent bon marché et dégradent la qualité perçue du produit.",
    deliverables: ["Spécification de motion", "Prototype animé", "Notes de Handoff pour les développeurs"],
    defaultTJM: 850, defaultDays: 2,
    participants: ['UI Designer', 'Developer'],
  },

  // ── Testing ────────────────────────────────────────────────────────────────
  {
    id: 't1', title: "Tests d'Utilisabilité Modérés", category: 'Testing',
    description: "Sessions d'utilisabilité facilitées en direct avec de vrais utilisateurs pour identifier les points de friction critiques et valider les décisions de design par des preuves.",
    risk: "Les designs non testés arrivent en production avec des inconnues qui sont exponentiellement plus coûteuses à corriger après le lancement.",
    deliverables: ["Protocole de test", "Enregistrements des sessions", "Rapport des findings d'utilisabilité"],
    defaultTJM: 750, defaultDays: 4,
    participants: ['UX Designer', 'End Users', 'Product Manager'],
  },
  {
    id: 't2', title: 'Tests à Distance Non Modérés', category: 'Testing',
    description: "Tests asynchrones via des outils comme Maze ou Lookback pour valider des tâches spécifiques à grande échelle sur un échantillon d'utilisateurs plus large et non biaisé.",
    risk: "Les tests modérés sur petit échantillon peuvent manquer des patterns qui n'émergent qu'à plus grande échelle.",
    deliverables: ["Configuration du test", "Rapport quantitatif", "Analyse des taux de complétion"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['UX Designer', 'End Users'],
  },
  {
    id: 't3', title: 'Test de Première Impression (5 secondes)', category: 'Testing',
    description: "Test de perception rapide pour valider si les écrans clés communiquent le bon message dans les premières secondes critiques d'exposition.",
    risk: "Les mauvaises premières impressions se forment en moins de 100ms et sont extrêmement difficiles à surmonter sans données.",
    deliverables: ["Rapport de test", "Score de clarté perceptive", "Recommandations actionnables"],
    defaultTJM: 650, defaultDays: 1,
    participants: ['UX Designer', 'End Users', 'Marketing'],
  },

  // ── Design System ──────────────────────────────────────────────────────────
  {
    id: 'ds1', title: 'Bibliothèque de Composants', category: 'Design System',
    description: "Bibliothèque de composants Figma entièrement documentée et prête pour la production, couvrant tous les patterns d'interface avec variantes, auto-layout et notes d'usage.",
    risk: "Sans bibliothèque partagée, l'UI diverge entre les features et le Handoff design-développement s'effondre.",
    deliverables: ["Bibliothèque de composants Figma", "Documentation des composants", "Guide d'utilisation"],
    defaultTJM: 850, defaultDays: 6,
    participants: ['UI Designer', 'Developer', 'Product Manager'],
  },
  {
    id: 'ds2', title: 'Design Tokens & Système de Thèmes', category: 'Design System',
    description: "Définir et documenter les Design Tokens pour les couleurs, espacements, typographie, élévation et motion afin de permettre une thématisation cohérente et un mode sombre.",
    risk: "Les valeurs codées en dur rendent la maintenance pénible et le support multi-thèmes ou multi-marques quasi impossible.",
    deliverables: ["Bibliothèque de Tokens (Figma + JSON)", "Documentation des thèmes", "Spécification du mode sombre"],
    defaultTJM: 850, defaultDays: 3,
    participants: ['UI Designer', 'Developer'],
  },
  {
    id: 'ds3', title: 'Gouvernance du Design System', category: 'Design System',
    description: "Établir les processus de contribution, cycles de révision, stratégie de versionnement et normes d'équipe pour garder le Design System sain et crédible dans le temps.",
    risk: "Un Design System sans gouvernance est abandonné en quelques mois car les équipes construisent en contournement.",
    deliverables: ["Playbook de gouvernance", "Guide de contribution", "Politique de dépréciation & versionnement"],
    defaultTJM: 850, defaultDays: 2,
    participants: ['Product Designer', 'Developer', 'Management'],
  },

  // ── Delivery ───────────────────────────────────────────────────────────────
  {
    id: 'del1', title: 'Developer Handoff', category: 'Delivery',
    description: "Package de Handoff complet avec spécifications annotées, assets exportés et notes d'interaction qui éliminent les incertitudes pour les développeurs.",
    risk: "Un mauvais Handoff crée une dérive d'implémentation — le produit livré s'écarte silencieusement de l'intention du design.",
    deliverables: ["Spécifications Figma annotées", "Package d'export d'assets", "Document de notes développeurs"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['Product Designer', 'Developer'],
  },
  {
    id: 'del2', title: 'Design QA & Revue de Production', category: 'Delivery',
    description: "Revue Sprint par Sprint du produit implémenté par rapport aux spécifications design pour détecter et documenter les écarts avant qu'ils ne s'accumulent.",
    risk: "Sans QA, l'écart entre l'intention du design et l'implémentation s'agrandit silencieusement à chaque Sprint.",
    deliverables: ["Journal de revue QA", "Tracker des écarts", "Document de validation finale"],
    defaultTJM: 750, defaultDays: 2,
    participants: ['Product Designer', 'Developer', 'Product Manager'],
  },
  {
    id: 'del3', title: 'Présentation aux Dirigeants', category: 'Delivery',
    description: "Présentation soignée des résultats du design, de la justification stratégique et des prochaines étapes recommandées, adaptée à un public dirigeant ou client.",
    risk: "Un excellent design mal communiqué est rarement approuvé ou financé pour la prochaine phase.",
    deliverables: ["Support de présentation", "Script de démo", "Annexe de référence"],
    defaultTJM: 750, defaultDays: 1.5,
    participants: ['Product Designer', 'Product Manager', 'Management', 'Client'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_CATEGORIES: (Category | 'All')[] = [
  'All', 'Discovery', 'Research', 'Strategy', 'UX', 'UI',
  'Prototyping', 'Testing', 'Design System', 'Delivery',
];

const CAT: Record<Category, { pill: string; dot: string }> = {
  Discovery:       { dot: '#f97316', pill: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' },
  Research:        { dot: '#3b82f6', pill: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  Strategy:        { dot: '#8b5cf6', pill: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' },
  UX:              { dot: '#10b981', pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' },
  UI:              { dot: '#ec4899', pill: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300' },
  Prototyping:     { dot: '#f59e0b', pill: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  Testing:         { dot: '#ef4444', pill: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300' },
  'Design System': { dot: '#06b6d4', pill: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300' },
  Delivery:        { dot: '#6b7280', pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
};

const PART_COLOR: Record<Participant, string> = {
  'UX Designer':      '#6d3bff',
  'UI Designer':      '#ec4899',
  'Product Designer': '#8b5cf6',
  'Product Manager':  '#3b82f6',
  'Developer':        '#10b981',
  'Client':           '#f97316',
  'End Users':        '#06b6d4',
  'Stakeholders':     '#64748b',
  'Marketing':        '#f59e0b',
  'Sales':            '#ef4444',
  'Data / Analytics': '#14b8a6',
  'Management':       '#6b7280',
};

const ALL_PARTICIPANTS: Participant[] = [
  'UX Designer', 'UI Designer', 'Product Designer', 'Product Manager',
  'Developer', 'Client', 'End Users', 'Stakeholders', 'Marketing',
  'Sales', 'Data / Analytics', 'Management',
];

const STATUS_STYLE: Record<Status, string> = {
  Draft:    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Sent:     'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════

function uid() { return Math.random().toString(36).slice(2, 9); }

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function initials(p: Participant) {
  if (p === 'UX Designer') return 'UX';
  if (p === 'UI Designer') return 'UI';
  if (p === 'End Users') return 'U';
  return p.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function libToProj(item: LibItem, tjm: number): ProjItem {
  return {
    instanceId: uid(),
    libId: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    risk: item.risk,
    deliverables: [...item.deliverables],
    tjm,
    days: item.defaultDays,
    useCustomTJM: false,
    optional: false,
    participants: [...item.participants],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS ATOMIQUES
// ═══════════════════════════════════════════════════════════════════════════════

function CategoryBadge({ cat, sm }: { cat: Category; sm?: boolean }) {
  const s = CAT[cat];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sm ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'} ${s.pill}`}>
      <span className="rounded-full shrink-0" style={{ width: sm ? 5 : 6, height: sm ? 5 : 6, background: s.dot }} />
      {cat}
    </span>
  );
}

function Avatar({ p, size = 26 }: { p: Participant; size?: number }) {
  const color = PART_COLOR[p];
  return (
    <span
      title={p}
      style={{ width: size, height: size, background: color + '22', color, fontSize: size * 0.36, border: `1.5px solid ${color}44` }}
      className="inline-flex items-center justify-center rounded-full font-['DM_Mono'] font-medium shrink-0 select-none"
    >
      {initials(p)}
    </span>
  );
}

function Participants({ list, max = 4 }: { list: Participant[]; max?: number }) {
  const shown = list.slice(0, max);
  const extra = list.length - shown.length;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {shown.map(p => <Avatar key={p} p={p} />)}
      {extra > 0 && <span className="text-[10px] text-[var(--muted)] font-medium ml-0.5">+{extra}</span>}
    </div>
  );
}

function PriceTag({ amount }: { amount: number }) {
  return (
    <span className="font-['DM_Mono'] text-[var(--accent)] text-sm font-medium tabular-nums">
      {fmt(amount)}
    </span>
  );
}

function DragHandle() {
  return (
    <span className="flex flex-col gap-[3px] items-center justify-center px-1 opacity-30 hover:opacity-70 transition-opacity cursor-grab active:cursor-grabbing shrink-0">
      {[0, 1, 2].map(i => (
        <span key={i} className="flex gap-[3px]">
          <span className="w-[3px] h-[3px] rounded-full bg-[var(--muted)]" />
          <span className="w-[3px] h-[3px] rounded-full bg-[var(--muted)]" />
        </span>
      ))}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARTE DE BIBLIOTHÈQUE
// ═══════════════════════════════════════════════════════════════════════════════

function LibCard({ item, onAdd, onDragStart }: {
  item: LibItem;
  onAdd: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const price = item.defaultTJM * item.defaultDays;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 group hover:border-[var(--accent)] hover:shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing active:opacity-70 active:scale-[0.98]"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--text)] leading-snug truncate">{item.title}</p>
          <div className="mt-1"><CategoryBadge cat={item.category} sm /></div>
        </div>
        <button
          onClick={onAdd}
          className="shrink-0 w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors text-sm font-bold leading-none"
          title="Ajouter au scope"
        >+</button>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <PriceTag amount={price} />
        <span className="text-[11px] text-[var(--muted)] font-['DM_Mono']">{item.defaultDays}j × {fmt(item.defaultTJM)}/j</span>
      </div>

      <div className="flex items-center justify-between">
        <Participants list={item.participants} max={3} />
        <button
          onClick={() => setExpanded(x => !x)}
          className="text-[10px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          {expanded ? '▲ moins' : '▼ plus'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">{item.description}</p>
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">Risque adressé</p>
            <p className="text-[11px] text-[var(--text)] leading-relaxed italic">{item.risk}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">Livrables</p>
            <ul className="space-y-0.5">
              {item.deliverables.map(d => (
                <li key={d} className="text-[11px] text-[var(--text)] flex items-start gap-1.5">
                  <span className="text-[var(--accent)] mt-0.5 shrink-0">›</span>{d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARTE DU SCOPE
// ═══════════════════════════════════════════════════════════════════════════════

function BuilderCard({ item, isEditing, isDragging, onEdit, onRemove, onDuplicate, onToggleOptional, onDragStart, onDragEnd }: {
  item: ProjItem;
  isEditing: boolean;
  isDragging: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onToggleOptional: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const price = item.tjm * item.days;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`flex items-stretch gap-0 bg-[var(--surface)] border rounded-xl overflow-hidden group transition-all duration-150 ${
        item.optional ? 'opacity-60' : ''
      } ${
        isEditing
          ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]'
          : item.optional
          ? 'border-dashed border-[var(--border)] hover:border-[var(--accent)]/40'
          : 'border-[var(--border)] hover:border-[var(--accent)]/50'
      } ${isDragging ? 'opacity-40 scale-[0.98]' : ''}`}
    >
      <div className="w-1 shrink-0 rounded-l-xl" style={{ background: item.optional ? CAT[item.category].dot + '60' : CAT[item.category].dot }} />
      <div className="flex items-center pl-2 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <DragHandle />
      </div>
      <button onClick={onEdit} className="flex-1 text-left py-3 pr-3 min-w-0">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[13px] font-semibold leading-snug ${item.optional ? 'text-[var(--muted)]' : 'text-[var(--text)]'}`}>{item.title}</span>
              <CategoryBadge cat={item.category} sm />
              {item.optional && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-dashed border-[var(--muted)]/50 text-[var(--muted)]">option</span>
              )}
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed line-clamp-1 italic">{item.risk}</p>
          </div>
          <div className="shrink-0 text-right">
            {item.optional ? (
              <span className="font-['DM_Mono'] text-[var(--muted)] text-sm line-through tabular-nums">{fmt(price)}</span>
            ) : (
              <PriceTag amount={price} />
            )}
            <p className="text-[10px] text-[var(--muted)] font-['DM_Mono'] mt-0.5">{item.days}j</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Participants list={item.participants} max={4} />
          {item.useCustomTJM && !item.optional && (
            <span className="text-[10px] bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded font-medium">tarif personnalisé</span>
          )}
        </div>
      </button>
      <div className="flex flex-col items-center justify-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleOptional}
          title={item.optional ? 'Inclure dans le devis' : 'Mettre en option'}
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
            item.optional
              ? 'text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
              : 'text-[var(--muted)] hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
        >
          {item.optional ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
        <button onClick={onDuplicate} title="Dupliquer" className="w-6 h-6 rounded-md text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] flex items-center justify-center text-xs transition-colors">⧉</button>
        <button onClick={onRemove} title="Supprimer" className="w-6 h-6 rounded-md text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center text-xs transition-colors">×</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIROIR D'ÉDITION
// ═══════════════════════════════════════════════════════════════════════════════

function EditDrawer({ item, globalTJM, onUpdate, onClose, onRemove }: {
  item: ProjItem;
  globalTJM: number;
  onUpdate: (updated: ProjItem) => void;
  onClose: () => void;
  onRemove: () => void;
}) {
  const effectiveTJM = item.useCustomTJM ? item.tjm : globalTJM;

  function set<K extends keyof ProjItem>(key: K, value: ProjItem[K]) {
    onUpdate({ ...item, [key]: value });
  }

  function toggleParticipant(p: Participant) {
    const has = item.participants.includes(p);
    set('participants', has ? item.participants.filter(x => x !== p) : [...item.participants, p]);
  }

  function setTJM(v: number) { onUpdate({ ...item, tjm: v, useCustomTJM: true }); }
  function resetTJM() { onUpdate({ ...item, tjm: globalTJM, useCustomTJM: false }); }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-[var(--surface)] border-l border-[var(--border)] flex flex-col shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-0.5">Modifier l'activité</p>
            <CategoryBadge cat={item.category} />
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors text-lg">×</button>
        </div>

        {/* Total en vedette */}
        <div className={`px-5 py-4 border-b border-[var(--border)] ${item.optional ? 'bg-[var(--surface2)]' : 'bg-[var(--accent-soft)]'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-[var(--muted)] mb-1 font-medium">Total de l'activité</p>
              {item.optional ? (
                <p className="font-['DM_Mono'] text-3xl font-medium text-[var(--muted)] tabular-nums line-through">{fmt(effectiveTJM * item.days)}</p>
              ) : (
                <p className="font-['DM_Mono'] text-3xl font-medium text-[var(--accent)] tabular-nums">{fmt(effectiveTJM * item.days)}</p>
              )}
              <p className="text-[11px] text-[var(--muted)] mt-1">{fmt(effectiveTJM)}/jour × {item.days} jour{item.days !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => set('optional', !item.optional)}
              className={`shrink-0 mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                item.optional
                  ? 'bg-[var(--surface)] text-[var(--muted)] border-dashed border-[var(--muted)]/50 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  : 'border-dashed border-[var(--muted)]/50 text-[var(--muted)] hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {item.optional ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  En option
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Mettre en option
                </>
              )}
            </button>
          </div>
          {item.optional && (
            <p className="text-[11px] text-[var(--muted)] mt-2 italic">Cette activité est en option — non comptabilisée dans le total.</p>
          )}
        </div>

        {/* Formulaire */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">Titre</label>
            <input type="text" value={item.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={item.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none leading-relaxed" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">Risque adressé</label>
            <textarea value={item.risk} onChange={e => set('risk', e.target.value)} rows={2}
              className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none leading-relaxed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">Jours</label>
              <input type="number" min={0.5} step={0.5} value={item.days} onChange={e => set('days', parseFloat(e.target.value) || 0)}
                className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] text-[var(--text)] font-['DM_Mono'] outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">TJM</label>
                {item.useCustomTJM && (
                  <button onClick={resetTJM} className="text-[10px] text-[var(--accent)] hover:underline">revenir au global</button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-[12px]">€</span>
                <input type="number" min={0} step={50} value={item.useCustomTJM ? item.tjm : globalTJM} onChange={e => setTJM(parseInt(e.target.value) || 0)}
                  className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-lg pl-6 pr-3 py-2 text-[13px] text-[var(--text)] font-['DM_Mono'] outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              {!item.useCustomTJM && <p className="text-[10px] text-[var(--muted)] mt-1">Taux global utilisé</p>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5">Livrables</label>
            <div className="space-y-1.5">
              {item.deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={d} onChange={e => { const next = [...item.deliverables]; next[i] = e.target.value; set('deliverables', next); }}
                    className="flex-1 bg-[var(--surface2)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[12px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors" />
                  <button onClick={() => set('deliverables', item.deliverables.filter((_, j) => j !== i))} className="text-[var(--muted)] hover:text-red-500 text-sm shrink-0">×</button>
                </div>
              ))}
              <button onClick={() => set('deliverables', [...item.deliverables, ''])} className="text-[11px] text-[var(--accent)] hover:underline">+ Ajouter un livrable</button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Participants</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PARTICIPANTS.map(p => {
                const active = item.participants.includes(p);
                return (
                  <button key={p} onClick={() => toggleParticipant(p)}
                    style={active ? { background: PART_COLOR[p] + '20', color: PART_COLOR[p], borderColor: PART_COLOR[p] + '60' } : {}}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${active ? 'font-medium' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
                  >{p}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied */}
        <div className="px-5 py-4 border-t border-[var(--border)] flex items-center gap-3">
          <button onClick={() => { onRemove(); onClose(); }}
            className="flex-1 py-2 rounded-lg text-[13px] font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            Supprimer l'activité
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-[13px] font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity">
            Terminer
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANNEAU DE SYNTHÈSE
// ═══════════════════════════════════════════════════════════════════════════════

function SummaryPanel({ items, globalTJM, onGlobalTJMChange }: {
  items: ProjItem[];
  globalTJM: number;
  onGlobalTJMChange: (v: number) => void;
}) {
  const required = items.filter(i => !i.optional);
  const optional = items.filter(i => i.optional);
  const total = required.reduce((s, i) => s + i.tjm * i.days, 0);
  const optionalTotal = optional.reduce((s, i) => s + i.tjm * i.days, 0);
  const totalDays = required.reduce((s, i) => s + i.days, 0);
  const allParticipants = [...new Set(items.flatMap(i => i.participants))];
  const catCounts = required.reduce<Partial<Record<Category, number>>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Total */}
      <div className="bg-[var(--accent-soft)] rounded-2xl p-5 border border-[var(--accent)]/20">
        <p className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">Total du devis</p>
        <p className="font-['DM_Mono'] text-4xl font-medium text-[var(--accent)] tabular-nums leading-none">{fmt(total)}</p>
        <p className="text-[12px] text-[var(--muted)] mt-2">{totalDays} jours estimés</p>
        {optional.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--accent)]/20">
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mb-1">Options non incluses</p>
            <p className="font-['DM_Mono'] text-[15px] text-[var(--muted)] tabular-nums line-through">{fmt(optionalTotal)}</p>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">{optional.length} activité{optional.length > 1 ? 's' : ''} en option</p>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
        <StatRow label="Activités incluses" value={required.length.toString()} />
        {optional.length > 0 && <StatRow label="En option" value={optional.length.toString()} />}
        <StatRow label="Total jours" value={totalDays % 1 === 0 ? totalDays.toString() : totalDays.toFixed(1)} />
        <StatRow label="Participants" value={allParticipants.length.toString()} />
        <StatRow label="Risques couverts" value={required.length.toString()} />
      </div>

      {/* TJM global */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
        <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Taux journalier global</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">€</span>
          <input type="number" min={0} step={50} value={globalTJM} onChange={e => onGlobalTJMChange(parseInt(e.target.value) || 0)}
            className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl pl-7 pr-3 py-2.5 text-[14px] text-[var(--text)] font-['DM_Mono'] font-medium outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-2">Taux par défaut pour les nouvelles activités. Chaque activité peut utiliser un tarif personnalisé.</p>
      </div>

      {/* Répartition par catégorie */}
      {required.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Par catégorie</p>
          <div className="space-y-2">
            {(Object.entries(catCounts) as [Category, number][]).map(([cat, _count]) => {
              const catTotal = required.filter(i => i.category === cat).reduce((s, i) => s + i.tjm * i.days, 0);
              const pct = total > 0 ? (catTotal / total) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[var(--text)] font-medium">{cat}</span>
                    <span className="text-[11px] font-['DM_Mono'] text-[var(--muted)]">{fmt(catTotal)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-[var(--surface2)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: CAT[cat].dot }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Participants */}
      {allParticipants.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Participants</p>
          <div className="flex flex-wrap gap-2">
            {allParticipants.map(p => (
              <div key={p} className="inline-flex items-center gap-2 min-w-0 rounded-full bg-[var(--surface2)] pr-3">
                <Avatar p={p} size={30} />
                <span className="text-[11px] font-medium text-[var(--text)] whitespace-nowrap">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[var(--muted)]">{label}</span>
      <span className="text-[13px] font-['DM_Mono'] font-medium text-[var(--text)]">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALE TJM
// ═══════════════════════════════════════════════════════════════════════════════

function TJMModal({ current, pending, onApplyAll, onApplyNew, onCancel }: {
  current: number; pending: number;
  onApplyAll: () => void; onApplyNew: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="font-semibold text-[var(--text)] text-[15px] mb-2">Modifier le taux journalier ?</h3>
        <p className="text-[13px] text-[var(--muted)] mb-5 leading-relaxed">
          Passage du taux global de <span className="font-['DM_Mono'] text-[var(--text)]">{fmt(current)}</span> à{' '}
          <span className="font-['DM_Mono'] text-[var(--accent)] font-medium">{fmt(pending)}</span>/jour.
          <br />Que faire avec les activités déjà dans le scope ?
        </p>
        <div className="space-y-2">
          <button onClick={onApplyAll} className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
            Appliquer à toutes les activités
          </button>
          <button onClick={onApplyNew} className="w-full py-2.5 rounded-xl bg-[var(--surface2)] text-[var(--text)] text-[13px] font-medium hover:bg-[var(--border)] transition-colors">
            Appliquer uniquement aux nouvelles activités
          </button>
          <button onClick={onCancel} className="w-full py-2 text-[12px] text-[var(--muted)] hover:text-[var(--text)] transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EN-TÊTE
// ═══════════════════════════════════════════════════════════════════════════════

function InfoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <button className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer la fenêtre d'information" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">À propos de l'outil</p>
            <h2 id="info-modal-title" className="text-xl font-semibold text-[var(--text)]">Le périmètre de Loopy</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-[var(--muted)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--text)]" aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            Loopy aide les designers UX/UI et Product à composer un scope de projet, à estimer la charge de travail et à construire une première enveloppe budgétaire.
          </p>

          <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Ce que vous pouvez faire</p>
            <ul className="space-y-2">
              {[
                "Sélectionner et organiser des activités depuis la bibliothèque.",
                "Ajuster les jours, le TJM, les participants et les livrables.",
                "Distinguer les activités incluses des options non comptabilisées.",
                "Obtenir une estimation instantanée du budget et de la durée.",
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-[12px] leading-relaxed text-[var(--text)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">À garder en tête</p>
            <p className="text-[12px] leading-relaxed text-[var(--muted)]">
              Le résultat est une estimation indicative destinée au cadrage et à la discussion. Il ne remplace pas un devis contractuel et n'inclut pas automatiquement les coûts externes, les taxes, les aléas ou les prestations absentes du scope.
            </p>
          </div>

          <div className="rounded-xl bg-[var(--surface2)] px-4 py-3 text-[12px] leading-relaxed text-[var(--muted)]">
            Une suggestion pour améliorer Loopy ? Écrivez à{' '}
            <a href="mailto:anais.lopez641@gmail.com" className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-2 hover:decoration-[var(--accent)]">
              anais.lopez641@gmail.com
            </a>
          </div>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] bg-[var(--surface2)]/50 px-6 py-4">
          <button onClick={onClose} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90">
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ projectName, clientName, status, dark, saved, onProjectName, onClientName, onStatus, onToggleDark, onExport }: {
  projectName: string; clientName: string; status: Status; dark: boolean; saved: boolean;
  onProjectName: (v: string) => void; onClientName: (v: string) => void;
  onStatus: (v: Status) => void; onToggleDark: () => void; onExport: () => void;
}) {
  const [editingProject, setEditingProject] = useState(false);
  const [editingClient, setEditingClient] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
    <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] flex items-center px-4 gap-4 relative z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[20px] font-['Instrument_Serif'] italic text-[var(--accent)]">Loopy</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1" />
      </div>
      <div className="h-5 w-px bg-[var(--border)] shrink-0" />

      {/* Nom du projet */}
      {editingProject ? (
        <input autoFocus type="text" value={projectName} onChange={e => onProjectName(e.target.value)}
          onBlur={() => setEditingProject(false)} onKeyDown={e => e.key === 'Enter' && setEditingProject(false)}
          className="text-[14px] font-semibold text-[var(--text)] bg-[var(--surface2)] border border-[var(--accent)] rounded-lg px-2 py-1 outline-none w-48" />
      ) : (
        <button onClick={() => setEditingProject(true)} title="Cliquer pour modifier"
          className="text-[14px] font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors truncate max-w-[200px]">
          {projectName}
        </button>
      )}

      <span className="text-[var(--muted)] text-[13px] shrink-0">pour</span>

      {/* Client */}
      {editingClient ? (
        <input autoFocus type="text" value={clientName} onChange={e => onClientName(e.target.value)}
          onBlur={() => setEditingClient(false)} onKeyDown={e => e.key === 'Enter' && setEditingClient(false)}
          className="text-[13px] text-[var(--text)] bg-[var(--surface2)] border border-[var(--accent)] rounded-lg px-2 py-1 outline-none w-32" />
      ) : (
        <button onClick={() => setEditingClient(true)}
          className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors truncate max-w-[150px]">
          {clientName}
        </button>
      )}

      {/* Statut */}
      <div className="relative shrink-0">
        <button onClick={() => setShowStatusMenu(x => !x)}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[status]}`}>
          {STATUS_LABELS[status]}
        </button>
        {showStatusMenu && (
          <div className="absolute top-full left-0 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
            {(['Draft', 'Sent', 'Accepted', 'Rejected'] as Status[]).map(s => (
              <button key={s} onClick={() => { onStatus(s); setShowStatusMenu(false); }}
                className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[var(--surface2)] transition-colors ${status === s ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Indicateur de sauvegarde */}
      <span className={`text-[11px] shrink-0 transition-colors ${saved ? 'text-emerald-500' : 'text-[var(--muted)]'}`}>
        {saved ? '✓ Enregistré' : 'Non enregistré'}
      </span>

      {/* Informations sur l'outil */}
      <button onClick={() => setShowInfo(true)} title="À propos de Loopy" aria-label="Afficher les informations sur Loopy"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--accent)] transition-colors">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {/* Mode sombre */}
      <button onClick={onToggleDark} title={dark ? 'Mode clair' : 'Mode sombre'}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors text-base">
        {dark ? '☀' : '◑'}
      </button>

      {/* Export */}
      <button onClick={onExport} className="shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity">
        Exporter
      </button>
    </header>
    {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANNEAU BIBLIOTHÈQUE
// ═══════════════════════════════════════════════════════════════════════════════

function LibraryPanel({ onAdd, onDragStart }: {
  onAdd: (item: LibItem) => void;
  onDragStart: (e: React.DragEvent, item: LibItem) => void;
}) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<Category | 'All'>('All');

  const filtered = LIBRARY.filter(item => {
    const matchesCat = catFilter === 'All' || item.category === catFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const grouped = ALL_CATEGORIES.slice(1).reduce<Partial<Record<Category, LibItem[]>>>((acc, cat) => {
    const items = filtered.filter(i => i.category === cat);
    if (items.length > 0) acc[cat as Category] = items;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Bibliothèque d'activités</h2>
          <span className="text-[11px] text-[var(--muted)] font-['DM_Mono']">{LIBRARY.length} activités</span>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-[12px]">⌕</span>
          <input type="text" placeholder="Rechercher une activité…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors" />
        </div>
      </div>

      {/* Filtres catégorie */}
      <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto shrink-0 border-b border-[var(--border)]">
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat as Category | 'All')}
            className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
              catFilter === cat ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}>
            {cat === 'All' ? 'Tout' : cat}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {items!.map(item => (
                <LibCard key={item.id} item={item} onAdd={() => onAdd(item)} onDragStart={e => onDragStart(e, item)} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[var(--muted)]">Aucune activité trouvée</p>
            <button onClick={() => { setSearch(''); setCatFilter('All'); }} className="text-[12px] text-[var(--accent)] mt-2 hover:underline">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE DE DÉPÔT
// ═══════════════════════════════════════════════════════════════════════════════

function BuilderDropZone({ visible, onDragOver, onDrop }: {
  visible: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div onDragOver={onDragOver} onDrop={onDrop} className={`relative transition-all duration-150 ${visible ? 'h-3 my-1' : 'h-2 my-0.5'}`}>
      {visible && <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 rounded-full bg-[var(--accent)]" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANNEAU DU SCOPE (BUILDER)
// ═══════════════════════════════════════════════════════════════════════════════

function BuilderPanelWrapper({ items, editingId, globalTJM, libDragData, onEdit, onRemove, onDuplicate, onToggleOptional, onReorder, onDropFromLibrary }: {
  items: ProjItem[];
  editingId: string | null;
  globalTJM: number;
  libDragData: React.MutableRefObject<LibItem | null>;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleOptional: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onDropFromLibrary: (libId: string, atIndex: number) => void;
}) {
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [draggingBuilderIndex, setDraggingBuilderIndex] = useState<number | null>(null);
  const builderDragIndex = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const totalPrice = items.filter(i => !i.optional).reduce((s, i) => s + i.tjm * i.days, 0);

  function handleCardDragStart(e: React.DragEvent, index: number) {
    builderDragIndex.current = index;
    setDraggingBuilderIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleCardDragEnd() {
    setDraggingBuilderIndex(null);
    setDropIndex(null);
    builderDragIndex.current = null;
  }

  function handleCardDragOver(e: React.DragEvent, cardIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const idx = e.clientY < rect.top + rect.height / 2 ? cardIndex : cardIndex + 1;
    setDropIndex(idx);
  }

  function commitDrop(targetIdx: number) {
    setDropIndex(null);
    setDraggingBuilderIndex(null);
    if (libDragData.current) {
      onDropFromLibrary(libDragData.current.id, targetIdx);
      libDragData.current = null;
    } else if (builderDragIndex.current !== null) {
      const from = builderDragIndex.current;
      if (from !== targetIdx && from !== targetIdx - 1) onReorder(from, targetIdx);
      builderDragIndex.current = null;
    }
  }

  function handleCardDrop(e: React.DragEvent, cardIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const idx = e.clientY < rect.top + rect.height / 2 ? cardIndex : cardIndex + 1;
    commitDrop(idx);
  }

  function handlePanelDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (items.length === 0) setDropIndex(0);
  }

  function handlePanelDrop(e: React.DragEvent) {
    e.preventDefault();
    commitDrop(items.length);
  }

  function handlePanelDragLeave(e: React.DragEvent) {
    if (!panelRef.current?.contains(e.relatedTarget as Node)) setDropIndex(null);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 py-3 border-b border-[var(--border)] shrink-0 flex items-center justify-between bg-[var(--surface)]/60">
        <div>
          <h2 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Scope du projet</h2>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            {items.length} {items.length === 1 ? 'activité' : 'activités'}
            {items.filter(i => i.optional).length > 0 && ` (${items.filter(i => i.optional).length} en option)`}
            {items.length > 0 && ` · ${items.filter(i => !i.optional).reduce((s, i) => s + i.days, 0)} jours`}
          </p>
        </div>
        {items.length > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Total</p>
            <p className="font-['DM_Mono'] text-[17px] font-medium text-[var(--accent)]">{fmt(totalPrice)}</p>
          </div>
        )}
      </div>

      <div ref={panelRef} className="flex-1 overflow-y-auto px-5 py-4"
        onDragOver={handlePanelDragOver} onDrop={handlePanelDrop} onDragLeave={handlePanelDragLeave}>
        {items.length === 0 ? (
          <div className={`min-h-[300px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
            dropIndex !== null ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--accent)]/40'
          }`}>
            <div className="text-6xl mb-4 opacity-20 select-none">⊕</div>
            <p className="text-[15px] font-medium text-[var(--muted)]">Glissez des activités ici</p>
            <p className="text-[12px] text-[var(--muted)]/60 mt-1">ou utilisez le bouton + dans la bibliothèque</p>
          </div>
        ) : (
          <div>
            <BuilderDropZone visible={dropIndex === 0}
              onDragOver={e => { e.preventDefault(); setDropIndex(0); }}
              onDrop={e => { e.preventDefault(); commitDrop(0); }} />
            {items.map((item, i) => (
              <div key={item.instanceId}>
                <div onDragOver={e => handleCardDragOver(e, i)} onDrop={e => handleCardDrop(e, i)}>
                  <BuilderCard
                    item={item} isEditing={editingId === item.instanceId} isDragging={draggingBuilderIndex === i}
                    onEdit={() => onEdit(item.instanceId)} onRemove={() => onRemove(item.instanceId)} onDuplicate={() => onDuplicate(item.instanceId)}
                    onToggleOptional={() => onToggleOptional(item.instanceId)}
                    onDragStart={e => handleCardDragStart(e, i)} onDragEnd={handleCardDragEnd} />
                </div>
                <BuilderDropZone visible={dropIndex === i + 1}
                  onDragOver={e => { e.preventDefault(); setDropIndex(i + 1); }}
                  onDrop={e => { e.preventDefault(); commitDrop(i + 1); }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_SCOPE: string[] = ['d1', 'r1', 'u2', 'u4', 'ui2', 'p1', 't1'];

export default function App() {
  const [dark, setDark] = useState(false);
  const [projectName, setProjectName] = useState('Refonte Onboarding SaaS');
  const [clientName, setClientName] = useState('Acme Corp');
  const [status, setStatus] = useState<Status>('Draft');
  const [globalTJM, setGlobalTJM] = useState(750);
  const [items, setItems] = useState<ProjItem[]>(() =>
    SAMPLE_SCOPE.map(id => LIBRARY.find(l => l.id === id)).filter(Boolean).map(l => libToProj(l!, 750))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('builder');
  const [saved, setSaved] = useState(true);
  const [tjmModal, setTjmModal] = useState<{ pending: number } | null>(null);

  const libDragData = useRef<LibItem | null>(null);
  const editingItem = editingId ? items.find(i => i.instanceId === editingId) ?? null : null;

  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 800);
    return () => clearTimeout(t);
  }, [items, projectName, clientName, status, globalTJM]);

  const handleAdd = (lib: LibItem) => setItems(prev => [...prev, libToProj(lib, globalTJM)]);

  const handleRemove = (instanceId: string) => {
    setItems(prev => prev.filter(i => i.instanceId !== instanceId));
    setEditingId(id => id === instanceId ? null : id);
  };

  const handleDuplicate = (instanceId: string) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.instanceId === instanceId);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], instanceId: uid() };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  };

  const handleUpdate = (updated: ProjItem) => setItems(prev => prev.map(i => i.instanceId === updated.instanceId ? updated : i));

  const handleToggleOptional = (instanceId: string) =>
    setItems(prev => prev.map(i => i.instanceId === instanceId ? { ...i, optional: !i.optional } : i));

  const handleReorder = (from: number, to: number) => {
    setItems(prev => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to > from ? to - 1 : to, 0, item);
      return next;
    });
  };

  const handleDropFromLibrary = (libId: string, atIndex: number) => {
    const lib = LIBRARY.find(l => l.id === libId);
    if (!lib) return;
    const newItem = libToProj(lib, globalTJM);
    setItems(prev => { const next = [...prev]; next.splice(atIndex, 0, newItem); return next; });
  };

  const handleLibDragStart = (e: React.DragEvent, item: LibItem) => {
    libDragData.current = item;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', item.id);
  };

  function handleGlobalTJMChange(newTJM: number) {
    if (items.length > 0) setTjmModal({ pending: newTJM });
    else setGlobalTJM(newTJM);
  }

  function applyTJMToAll() {
    const pending = tjmModal!.pending;
    setGlobalTJM(pending);
    setItems(prev => prev.map(i => ({ ...i, tjm: pending, useCustomTJM: false })));
    setTjmModal(null);
  }

  function applyTJMToNew() { setGlobalTJM(tjmModal!.pending); setTjmModal(null); }

  function handleExport() {
    const data = {
      projet: projectName, client: clientName, statut: STATUS_LABELS[status], tjmGlobal: globalTJM,
      total: items.reduce((s, i) => s + i.tjm * i.days, 0),
      joursTotal: items.reduce((s, i) => s + i.days, 0),
      activités: items.map(i => ({ titre: i.title, catégorie: i.category, option: i.optional, jours: i.days, tjm: i.tjm, total: i.optional ? 0 : i.tjm * i.days, totalBrut: i.tjm * i.days, participants: i.participants, livrables: i.deliverables })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loopy-${projectName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const MOBILE_LABELS: Record<MobileTab, string> = {
    library: 'Bibliothèque',
    builder: `Scope (${items.length})`,
    summary: 'Synthèse',
  };

  return (
    <div className={`${dark ? 'dark' : ''} h-screen flex flex-col overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans`}>
      <Header projectName={projectName} clientName={clientName} status={status} dark={dark} saved={saved}
        onProjectName={setProjectName} onClientName={setClientName} onStatus={setStatus}
        onToggleDark={() => setDark(d => !d)} onExport={handleExport} />

      {/* Onglets mobile */}
      <div className="flex lg:hidden shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
        {(['library', 'builder', 'summary'] as MobileTab[]).map(tab => (
          <button key={tab} onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-[12px] font-semibold transition-colors ${
              mobileTab === tab ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--muted)]'
            }`}>
            {MOBILE_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Layout 3 colonnes */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Bibliothèque */}
        <div className={`${mobileTab === 'library' ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[280px] xl:w-[300px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] min-h-0`}>
          <LibraryPanel onAdd={handleAdd} onDragStart={handleLibDragStart} />
        </div>

        {/* Scope */}
        <div className={`${mobileTab === 'builder' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-[var(--bg)] min-h-0 min-w-0`}>
          <BuilderPanelWrapper items={items} editingId={editingId} globalTJM={globalTJM} libDragData={libDragData}
            onEdit={setEditingId} onRemove={handleRemove} onDuplicate={handleDuplicate}
            onToggleOptional={handleToggleOptional}
            onReorder={handleReorder} onDropFromLibrary={handleDropFromLibrary} />
        </div>

        {/* Synthèse */}
        <div className={`${mobileTab === 'summary' ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[260px] xl:w-[280px] shrink-0 border-l border-[var(--border)] bg-[var(--surface)] overflow-y-auto p-4`}>
          <SummaryPanel items={items} globalTJM={globalTJM} onGlobalTJMChange={handleGlobalTJMChange} />
        </div>
      </div>

      {/* Tiroir d'édition */}
      {editingItem && (
        <EditDrawer item={editingItem} globalTJM={globalTJM} onUpdate={handleUpdate}
          onClose={() => setEditingId(null)} onRemove={() => handleRemove(editingItem.instanceId)} />
      )}

      {/* Modale TJM */}
      {tjmModal && (
        <TJMModal current={globalTJM} pending={tjmModal.pending}
          onApplyAll={applyTJMToAll} onApplyNew={applyTJMToNew} onCancel={() => setTjmModal(null)} />
      )}
    </div>
  );
}
