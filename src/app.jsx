import ErrorNotification from "shared/components/errorNotification";
import AppRoutes from "./routes";

const App = () => (
  <>
    <AppRoutes />
    <ErrorNotification />
  </>
);

export default App;
