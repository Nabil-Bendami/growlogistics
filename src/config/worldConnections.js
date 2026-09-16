import { t } from '../i18n/index.js'
// All coordinates are [longitude, latitude]. These locations are illustrative only.
export const worldConnections = {
  origin: { id: 'casablanca', label: t("Casablanca, Maroc"), coordinates: [-7.5898, 33.5731] },
  destinations: [
    { id: 'paris', label: 'Paris, France', coordinates: [2.3522, 48.8566] },
    { id: 'new-york', label: t("New York, États-Unis"), coordinates: [-74.006, 40.7128] },
    { id: 'sao-paulo', label: t("São Paulo, Brésil"), coordinates: [-46.6333, -23.5505] },
    { id: 'dakar', label: t("Dakar, Sénégal"), coordinates: [-17.4677, 14.7167] },
    { id: 'dubai', label: t("Dubai, Émirats arabes unis"), coordinates: [55.2708, 25.2048] },
    { id: 'singapore', label: 'Singapore', coordinates: [103.8198, 1.3521] },
    { id: 'sydney', label: t("Sydney, Australie"), coordinates: [151.2093, -33.8688] },
  ],
  animation: { durationSeconds: 9, staggerSeconds: 1.1, pulseSeconds: 3.6 },
  // Optional overrides; otherwise the existing brand tokens are used.
  // colors: { background: '#F8F1E4', country: '#D8E3FF', border: '#B7AD9E', origin: '#111C44', connection: '#2457FF', hover: '#B7AD9E' },
}
