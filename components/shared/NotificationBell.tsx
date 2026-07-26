import Link from "next/link";
import { Bell } from "lucide-react";
import { getNotifications, markNotificationsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";

export async function NotificationBell() {
  const notifications = await getNotifications();

  return (
    <form action={markNotificationsRead} className="relative">
      <Button type="submit" variant="ghost" size="icon" aria-label="Open notifications">
        <Bell className="h-5 w-5" aria-hidden="true" />
      </Button>
      {notifications.unreadCount ? (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-700 px-1 text-xs font-semibold text-white">
          {notifications.unreadCount}
        </span>
      ) : null}
      <div className="sr-only">
        {notifications.items.map((notification) => (
          <Link key={notification.id} href={`/requests/${notification.serviceRequestId}`}>
            {notification.message}
          </Link>
        ))}
      </div>
    </form>
  );
}
