export function variantKey(variant = {}) {
  const { priceModifier, summary, ...configValues } = variant;
  return Object.entries(configValues)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
}

export function variantsMatch(a = {}, b = {}) {
  return variantKey(a) === variantKey(b);
}
