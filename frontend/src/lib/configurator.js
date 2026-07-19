export function getDefaultConfig(product) {
  if (!product?.configurator?.groups?.length) return {};
  return Object.fromEntries(
    product.configurator.groups.map((group) => [group.id, group.options[0]?.value ?? ''])
  );
}

export function getSelectedOption(group, config) {
  return group.options.find((option) => option.value === config[group.id]);
}

export function calculateConfigPrice(product, config) {
  if (!product?.configurator?.groups) return product.price;
  return product.configurator.groups.reduce((total, group) => {
    const selected = getSelectedOption(group, config);
    return total + (selected?.priceModifier || 0);
  }, product.price);
}

export function calculatePriceModifier(product, config) {
  return calculateConfigPrice(product, config) - product.price;
}

export function buildConfigSpecs(product, config) {
  const baseSpecs =
    product.specs instanceof Map ? Object.fromEntries(product.specs) : { ...(product.specs || {}) };

  const dynamicSpecs = {};
  product.configurator?.groups?.forEach((group) => {
    const selected = getSelectedOption(group, config);
    if (selected?.specs) Object.assign(dynamicSpecs, selected.specs);
  });

  product.configurator?.groups?.forEach((group) => {
    const selected = getSelectedOption(group, config);
    if (!selected) return;
    if (group.id === 'memory') dynamicSpecs.Memory = selected.label;
    if (group.id === 'storage') dynamicSpecs.Storage = selected.label;
    if (group.id === 'color') dynamicSpecs.Finish = selected.label;
    if (group.id === 'size' && !dynamicSpecs.Size) dynamicSpecs.Size = selected.label;
    if (group.id === 'gpu' && !dynamicSpecs.Graphics) dynamicSpecs.Graphics = selected.label;
    if (group.id === 'processor' && !dynamicSpecs.Processor) dynamicSpecs.Processor = selected.label;
    if (group.id === 'chip' && !dynamicSpecs.Processor) dynamicSpecs.Processor = selected.label;
  });

  return { ...baseSpecs, ...dynamicSpecs };
}

export function buildConfigSummary(product, config) {
  if (!product?.configurator?.groups) return '';
  return product.configurator.groups
    .map((group) => getSelectedOption(group, config)?.label)
    .filter(Boolean)
    .join(' · ');
}

export function buildCartVariant(product, config) {
  return {
    ...config,
    priceModifier: calculatePriceModifier(product, config),
    summary: buildConfigSummary(product, config),
  };
}

export function hasConfigurator(product) {
  return Boolean(product?.configurator?.groups?.length);
}
