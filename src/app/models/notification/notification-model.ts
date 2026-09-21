export interface NotificationModel {
  id: string;
  // userId: string | null;
  type: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // readAt: string | null;
  relatedEntityId: string | null;
}
