// One accent color per experience type -- gives each section a distinct,
// recognizable color instead of everything being the same neutral gray.
// Kept identical to resume-rag-web's palette so the two apps read as one
// family rather than two different visual identities.
export const TYPE_BADGE_CLASSES: Record<string, string> = {
  EXPERIENCE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  EDUCATION: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  CERTIFICATION: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  PROJECT: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  ACHIEVEMENT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  SKILL: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-200',
};
