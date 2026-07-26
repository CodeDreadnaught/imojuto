import { NextResponse } from "next/server";
import { listActivity } from "@/actions/activityLog";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const rows = await listActivity();
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=imojuto-activity.csv",
    },
  });
}
