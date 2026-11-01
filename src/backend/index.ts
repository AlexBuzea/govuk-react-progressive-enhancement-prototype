import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, (error) => {
  // Express 5 passes startup errors (e.g. the port is already in use) to this callback
  if (error) throw error;
  console.log(`Parking permit prototype running at http://localhost:${PORT}`);

  // Pages still work without the island scripts, but the interactive parts will not
  const islands = fileURLToPath(new URL("../../public/islands", import.meta.url));
  if (!existsSync(islands)) {
    console.warn("Island scripts are not built yet. Run `npm run build` first (or use `npm run dev`).");
  }
});
