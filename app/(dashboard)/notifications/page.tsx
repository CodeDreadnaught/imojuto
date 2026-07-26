import Link from "next/link";
import { BellRinging } from "@phosphor-icons/react/dist/ssr";
import { getNotifications, markNotificationsRead } from "@/actions/notifications";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Assignment and request status updates for your account."
        actions={
          <form action={markNotificationsRead}>
            <Button type="submit" variant="outline">
              Mark all read
            </Button>
          </form>
        }
      />
      {notifications.items.length ? (
        <div className="grid gap-3">
          {notifications.items.map((notification) => (
            <Card key={notification.id} className={notification.isRead ? "opacity-80" : ""}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#e6f2eb] text-[#1d4f43]">
                    <BellRinging className="h-5 w-5" weight="duotone" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-[#27241f]">{notification.message}</p>
                    <p className="mt-1 text-xs text-[#8a7a67]">{formatDate(notification.createdAt)}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0 self-start sm:self-center">
                  <Link href={`/requests/${notification.serviceRequestId}`}>Open request</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={BellRinging} title="No notifications" description="New assignment and status updates will appear here." />
      )}
    </div>
  );
}
