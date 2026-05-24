import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const STAR_KEY = "roi-tool-stars";

// Redis is only instantiated when both env vars are present.
// Gracefully returns 0 in local dev without them.
function getRedis(): Redis | null {
  // Vercel's Upstash integration injects STORAGE_KV_REST_API_URL / TOKEN
  const url   = process.env.STORAGE_KV_REST_API_URL   ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.STORAGE_KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json({ count: 0, configured: false });
    const count = await redis.get<number>(STAR_KEY) ?? 0;
    return NextResponse.json({ count, configured: true });
  } catch {
    return NextResponse.json({ count: 0, configured: false });
  }
}

export async function POST() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json({ count: 0, configured: false });
    const count = await redis.incr(STAR_KEY);
    return NextResponse.json({ count, configured: true });
  } catch {
    return NextResponse.json({ count: 0, configured: false });
  }
}
