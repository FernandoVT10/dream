import { addClasses, getIcon, CLOSE_ICON } from "./utils";

import styles from "./Notifications.module.scss";

let container: HTMLDivElement;
let prevTime = 0;

let notificationId = 0;

export enum NotificationType {
  Success,
  Error,
}

type Notification = {
  type: NotificationType;
  message: string;
  el: HTMLDivElement;
  time: number;
};

const notifications: Map<number, Notification> = new Map;

function lerp(start, end, time): number {
  return start + (end - start) * time;
}

function sinStep(t: number): number {
  return (Math.sin(t * Math.PI - 0.5*Math.PI) + 1) * 0.5;
}

const SECS = 0.3;

function loop(time: number) {
  const dt = (time - prevTime) / 1000;
  prevTime = time;

  for(const [id, notification] of notifications) {
    notification.time += dt;

    if(notification.time < 0.5)
      notification.el.style.opacity = lerp(0, 1, sinStep(notification.time / 0.5));

    if(notification.time < SECS) {
      notification.el.style.top = lerp(100, 0, sinStep(notification.time / SECS)) + "px";
      notification.el.style.left = lerp(350, 0, sinStep(notification.time / SECS)) + "px";
    }

    if(notification.time > 3 && notification.time < 3 + SECS) {
      notification.el.style.left = lerp(0, 350, sinStep((notification.time - 3) / SECS)) + "px";
    }

    if(notification.time > 4) {
      Notifications.remove(id);
    }
  }

  requestAnimationFrame(loop);
}

export default class Notifications {
  static init(): void {
    container = document.createElement("div");
    addClasses(container, styles.notifications);
    document.body.appendChild(container);

    requestAnimationFrame(loop);
  }

  static push(type: NotificationType, message: string): void {
    const id = ++notificationId;

    const icon = document.createElement("span");
    icon.innerHTML = getIcon(type);
    addClasses(icon, styles.icon);
    const iconContainer = document.createElement("div");
    addClasses(iconContainer, styles.iconContainer);
    iconContainer.appendChild(icon);

    const msgEl = document.createElement("p");
    msgEl.innerText = message;

    const bodyEl = document.createElement("div");
    addClasses(bodyEl, styles.body);
    bodyEl.appendChild(msgEl);
    const closeButton = document.createElement("button");
    closeButton.innerHTML = CLOSE_ICON;
    closeButton.addEventListener("click", () => {
      Notifications.remove(id);
    });
    addClasses(closeButton, styles.closeButton);

    const el = document.createElement("div");
    addClasses(el, styles.notification, type === NotificationType.Success ? styles.success : styles.error);
    el.append(iconContainer, bodyEl, closeButton);

    container.appendChild(el);

    notifications.set(id, { type, message, el, time: 0 });
  }

  static success(message: string): void {
    Notifications.push(NotificationType.Success, message);
  }

  static error(message: string): void {
    Notifications.push(NotificationType.Error, message);
  }

  static remove(id: number): void {
    container.removeChild(notifications.get(id).el);
    notifications.delete(id);
  }
}
