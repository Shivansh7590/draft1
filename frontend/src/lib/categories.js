import { Laptop, Watch, Sparkles } from 'lucide-react';

export const SECTIONS = [
  {
    value: 'computer',
    label: 'Computer',
    description: 'Laptops and desktop systems built for work and play.',
    icon: Laptop,
    subcategories: [
      { value: 'laptops', label: 'Laptops' },
      { value: 'desktops', label: 'Desktops' },
    ],
  },
  {
    value: 'wearables',
    label: 'Wearables',
    description: 'Smart watches, earbuds, and headphones for life on the move.',
    icon: Watch,
    subcategories: [
      { value: 'smart-watches', label: 'Smart Watches' },
      { value: 'earbuds', label: 'Earbuds' },
      { value: 'headphones', label: 'Headphones' },
    ],
  },
  {
    value: 'lifestyle',
    label: 'Lifestyle',
    description: 'Accessories and gadgets that complete your everyday setup.',
    icon: Sparkles,
    subcategories: [
      { value: 'accessories', label: 'Accessories' },
      { value: 'gadgets', label: 'Gadgets' },
    ],
  },
];

export const ALL_SUBCATEGORIES = SECTIONS.flatMap((section) => section.subcategories);

const subcategoryMap = new Map(
  SECTIONS.flatMap((section) =>
    section.subcategories.map((sub) => [sub.value, { ...sub, section: section.value }])
  )
);

const sectionMap = new Map(SECTIONS.map((section) => [section.value, section]));

export const getSection = (value) => sectionMap.get(value) ?? null;

export const getSubcategory = (value) => subcategoryMap.get(value) ?? null;

export const getSectionForCategory = (category) => {
  const sub = getSubcategory(category);
  return sub ? getSection(sub.section) : null;
};

export const getSubcategoriesForSection = (sectionValue) =>
  getSection(sectionValue)?.subcategories ?? [];

export const getCategoryLabel = (value) =>
  getSubcategory(value)?.label ?? value;

export const isCategoryInSection = (category, sectionValue) =>
  getSubcategoriesForSection(sectionValue).some((sub) => sub.value === category);
