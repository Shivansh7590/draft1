import { useEffect } from 'react';

export default function SEO({ title, description }) {
  const siteTitle = 'Nimbus — Premium Audio & Wearables';
  const fullTitle = title ? `${title} | Nimbus` : siteTitle;
  const desc = description || 'Experience sound redefined. Premium earbuds, headphones, speakers, and wearables from Nimbus.';

  useEffect(() => {
    document.title = fullTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', desc);
  }, [fullTitle, desc]);

  return null;
}
