import { apiUrl } from './utils/api';

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

export async function fetchConfig(): Promise<SiteConfig> {
  try {
    const r = await fetch(apiUrl('/api/config'));
    const d = await r.json();
    return { ...defaultConfig, ...d };
  } catch (_) {
    return defaultConfig;
  }
}
