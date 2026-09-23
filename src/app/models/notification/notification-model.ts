export interface NotificationModel {
  id: string;
  // userId: string | null;
  type: string; // enum gets converted into string from backend
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // readAt: string | null;
  relatedEntityId: string | null;
}
