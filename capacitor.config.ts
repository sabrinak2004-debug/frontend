import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.unihohenheim.booking",
  appName: "Hohenheim Booking",

  // Für Remote ist webDir egal, aber Capacitor will es.
  webDir: "public",

  server: {
    url: "https://frontend-zeta-jet-62.vercel.app/",
    cleartext: false,
  },
};

export default config;
