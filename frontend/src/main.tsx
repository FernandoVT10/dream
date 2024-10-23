import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import Notifications from "./Notifications";

import "./styles/index.scss";
import "./styles/buttons.scss";
import "./styles/input.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

Notifications.init();
