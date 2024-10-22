import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import Notifications from "./Notifications";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

Notifications.init();
