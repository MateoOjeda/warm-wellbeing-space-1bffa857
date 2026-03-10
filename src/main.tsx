import { createRoot } from "react-dom/client";
import App from "./App.tsx";
<<<<<<< HEAD
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
=======
import { EnvCheck } from "./components/EnvCheck.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <EnvCheck>
    <App />
  </EnvCheck>
);
>>>>>>> 0fb6fac6b4d0fea511f90bf08e275f1557f3bd47
