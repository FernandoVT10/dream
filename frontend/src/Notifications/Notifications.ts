import { addClasses, getIcon, lerp, smoothStep, setElementPos, CLOSE_ICON } from "./utils";

import styles from "./Notifications.module.scss";

enum NotificationState {
  Entering,
  Staying,
  Exiting,
}

// this variable controls the duration of each step of the animation
// the duration is provided in seconds
const ANIM_DURATION = {
  [NotificationState.Entering]: 0.3,
  [NotificationState.Staying]: 5,
  [NotificationState.Exiting]: 0.3
};

const NOTIFICATION_WIDTH = 350;

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
  state: NotificationState;
};

const notifications: Map<number, Notification> = new Map;

function loop(time: number) {
  const dt = (time - prevTime) / 1000;
  prevTime = time;

  for(const [id, notification] of notifications) {
    notification.time += dt;
    
    const duration = ANIM_DURATION[notification.state];
    const t = smoothStep(notification.time / duration);

    switch(notification.state) {
      case NotificationState.Entering: {
        const x = lerp(NOTIFICATION_WIDTH, 0, t);
        const y = lerp(100, 0, t);

        setElementPos(notification.el, x, y);

        if(notification.time >= duration) {
          notification.state = NotificationState.Staying;
          notification.time = 0;

          setElementPos(notification.el, 0, 0);
        }
      } break;
      case NotificationState.Staying: {
        if(notification.time >= duration) {
          notification.state = NotificationState.Exiting;
          notification.time = 0;
        }
      } break;
      case NotificationState.Exiting: {
        const x = lerp(0, NOTIFICATION_WIDTH, t);
        setElementPos(notification.el, x, 0);

        if(notification.time >= duration) {
          Notifications.remove(id);
        }
      } break;
    }
  }

  requestAnimationFrame(loop);
}

function getCloseButton(notificationId: number): HTMLButtonElement {
  const closeButton = document.createElement("button");

  closeButton.innerHTML = CLOSE_ICON;
  closeButton.addEventListener("click", () => {
    if(notifications.has(notificationId)) {
      const notification = notifications.get(notificationId) as Notification;

      if(notification.state !== NotificationState.Exiting) {
        notification.state = NotificationState.Exiting;
        notification.time = 0;
      }
    }
  });
  addClasses(closeButton, styles.closeButton);

  return closeButton;
}

function getMessage(message: string): HTMLDivElement {
  const msgEl = document.createElement("p");
  msgEl.innerText = message;

  const bodyEl = document.createElement("div");
  addClasses(bodyEl, styles.body);
  bodyEl.appendChild(msgEl);

  return bodyEl;
}

function getIconContainer(type: NotificationType): HTMLDivElement {
  const icon = document.createElement("span");
  icon.innerHTML = getIcon(type);
  addClasses(icon, styles.icon);

  const iconContainer = document.createElement("div");
  addClasses(iconContainer, styles.iconContainer);
  iconContainer.appendChild(icon);

  return iconContainer;
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

    const notification = document.createElement("div");
    addClasses(
      notification,
      styles.notification,
      type === NotificationType.Success ? styles.success : styles.error
    );
    notification.append(
      getIconContainer(type),
      getMessage(message),
      getCloseButton(id),
    );

    container.appendChild(notification);

    notifications.set(id, {
      type,
      message,
      el: notification,
      time: 0,
      state: NotificationState.Entering,
    });
  }

  static success(message: string): void {
    Notifications.push(NotificationType.Success, message);
  }

  static error(message: string): void {
    Notifications.push(NotificationType.Error, message);
  }

  static remove(id: number): void {
    if(notifications.has(id)) {
      const notification = notifications.get(id) as Notification;
      container.removeChild(notification.el);
    }

    notifications.delete(id);
  }
}
