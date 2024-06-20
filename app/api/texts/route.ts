import { sql } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: any) {
  noStore();
  const { searchParams } = new URL(req.url);
  const pollId = searchParams.get("pollId");

  if (!pollId) {
    return Response.json({ error: "pollId is required" }, { status: 400 });
  }

  const res = await sql(
    `select * from text where pollId = ? order by created_at desc limit 300`,
    [pollId]
  );
  return Response.json(res);
}

export async function POST(req: any) {
  try {
    const { text, author, pollId } = await req.json();

    if (!pollId || !text || !author) {
      return Response.json({ error: "pollId is required" }, { status: 400 });
    }

    const res = await sql(
      `INSERT INTO text (message, author, pollId) VALUES (?, ?, ? )`,
      [text, author, pollId]
    );
    return Response.json(res);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
