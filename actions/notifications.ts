"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { requireSession } from "@/lib/session";
import { Notification, ServiceRequest, User } from "@/models";

export async function createNotification(input: {
  userId: string;
  type: "assigned" | "status_changed" | "resolved";
  message: string;
  serviceRequestId: string;
  email?: string;
}) {
  await connectDb();
  await Notification.create({
    userId: input.userId,
    type: input.type,
    message: input.message,
    serviceRequestId: input.serviceRequestId,
    isRead: false,
  });

  if (input.email) {
    await sendMail({
      to: input.email,
      subject: "Imojuto request update",
      text: input.message,
    });
  }
}

export async function notifyRequester(serviceRequestId: string, message: string, type: "status_changed" | "resolved") {
  await connectDb();
  const request = await ServiceRequest.findById(serviceRequestId).select("requesterId").lean();
  if (!request) return;
  const user = await User.findById(request.requesterId).select("email").lean();
  await createNotification({
    userId: String(request.requesterId),
    serviceRequestId,
    type,
    message,
    email: user?.email,
  });
}

export async function getNotifications() {
  const session = await requireSession();
  await connectDb();
  const notifications = await Notification.find({ userId: session.user.userId }).sort({ createdAt: -1 }).limit(10).lean();
  const unreadCount = await Notification.countDocuments({ userId: session.user.userId, isRead: false });
  return {
    unreadCount,
    items: notifications.map((notification) => ({
      id: String(notification._id),
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt?.toISOString?.() ?? new Date().toISOString(),
      serviceRequestId: String(notification.serviceRequestId),
    })),
  };
}

export async function markNotificationsRead() {
  const session = await requireSession();
  await connectDb();
  await Notification.updateMany({ userId: session.user.userId, isRead: false }, { isRead: true });
  revalidatePath("/notifications");
}
