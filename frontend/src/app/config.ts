export interface SiteConfig {
  recipient:   string;
  age:         number;
  sender:      string;
  accentColor: string;
  letterText:  string | null;
  musicUrl:    string | null;
}

export const defaultConfig: SiteConfig = {
  recipient:   'My Love',
  age:         19,
  sender:      '',
  accentColor: '#e89ab3',
  letterText:  null,
  musicUrl:    null,
};

// Get API base URL - use environment variable or default to current origin
const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return import.meta.env.VITE_API_URL || window.location.origin;
};

export async function fetchConfig(): Promise<SiteConfig> {
  try {
    const apiBase = getApiBase();
    const r = await fetch(`${apiBase}/api/config`);
    const d = await r.json();
    return { ...defaultConfig, ...d };
  } catch (_) {
    return defaultConfig;
  }
}
