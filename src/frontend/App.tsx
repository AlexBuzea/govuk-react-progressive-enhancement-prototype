import type { AppData } from "../shared/types";
import { Layout } from "./layout/Layout";
import { AppRoutes } from "./routes";

type AppProps = {
  data: AppData;
};

export function App({ data }: AppProps) {
  return (
    <Layout>
      <AppRoutes data={data} />
    </Layout>
  );
}
