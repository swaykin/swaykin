import {
  mockNotifications,
  Notification as NotificationType,
} from "@/mocks/notifications";

export type Notification = NotificationType;

export const useNotifications = () => {
  return mockNotifications;
};
