import { useEffect } from 'react';

export default function PageMeta({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | MunchkinKittie · Owego, NY`;
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

