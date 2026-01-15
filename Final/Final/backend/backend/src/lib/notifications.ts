import { db } from "./db";

interface NotificationData {
  userId: number;
  title: string;
  partner?: string;
  credits?: number;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  title,
  partner,
  credits = 0,
}: NotificationData) {
  try {
    const [result]: any = await db.query(
      `INSERT INTO notifications (user_id, title, partner, credits, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, title, partner || null, credits]
    );

    return {
      success: true,
      notificationId: result.insertId,
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      success: false,
      error: "Failed to create notification",
    };
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotifications(
  notifications: NotificationData[]
) {
  try {
    const promises = notifications.map((notif) => createNotification(notif));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error creating notifications:", error);
    return [];
  }
}
