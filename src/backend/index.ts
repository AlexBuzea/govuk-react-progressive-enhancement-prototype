import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Parking permit prototype running at http://localhost:${PORT}`);
});
