import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function PageMeta({ title, description }) {
  const { settings } = useSelector((state) => state.settings);
  const activeSettings = Array.isArray(settings) ? settings[0] : settings;
  const catteryLocation = activeSettings?.mainLocation || 'Owego, NY';

  useEffect(() => {
    if (title) {
      document.title = `${title} | MunchkinKittie · ${catteryLocation}`;
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
  }, [title, description, catteryLocation]);

  return null;
}

