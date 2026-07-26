import Link from "next/link";
import { BellRinging } from "@phosphor-icons/react/dist/ssr";
import { getNotifications, markNotificationsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export async function NotificationBell() {
  const notifications = await getNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open notifications" className="relative">
          <BellRinging className="h-5 w-5" weight="duotone" aria-hidden="true" />
          {notifications.unreadCount ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#9f2f2f] px-1 text-[11px] font-semibold text-white">
              {notifications.unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.items.length ? (
            notifications.items.slice(0, 5).map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link href={`/requests/${notification.serviceRequestId}`} className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-[#27241f]">{notification.message}</span>
                  <span className="text-xs text-[#8a7a67]">{formatDate(notification.createdAt)}</span>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-[#655c50]">No notifications yet.</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between gap-2 px-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/notifications">View all</Link>
          </Button>
          <form action={markNotificationsRead}>
            <Button type="submit" variant="outline" size="sm">
              Mark read
            </Button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
