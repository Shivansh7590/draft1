export const SECTION_CATEGORIES = {
  computer: ['laptops', 'desktops'],
  wearables: ['smart-watches', 'earbuds', 'headphones'],
  lifestyle: ['accessories', 'gadgets'],
};

export const ALL_CATEGORIES = Object.values(SECTION_CATEGORIES).flat();

export function getCategoriesForSection(section) {
  return SECTION_CATEGORIES[section] || null;
}

export function isValidCategory(category) {
  return ALL_CATEGORIES.includes(category);
}
