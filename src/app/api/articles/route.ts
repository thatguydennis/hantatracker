import { NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);
  const source = url.searchParams.get("source") ?? undefined;
  const since = url.searchParams.get("since") ?? undefined;

  const result = await getArticles({ limit, source, since });
  return NextResponse.json(result);
}
