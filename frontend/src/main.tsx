import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import Notifications from "./Notifications";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

Notifications.init();
Notifications.success("Receipt added successfully!");
setTimeout(() => Notifications.error("There was an error :("), 250);
setTimeout(() => Notifications.error("There was a really bad error with the server. Try it again later please!!"), 500);

(window as any).n = Notifications;
