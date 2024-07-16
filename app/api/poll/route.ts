import { sql } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: any) {
  noStore();
  console.log("coucou");

  const { searchParams } = new URL(req.url);
  const pollId = searchParams.get("pollId");

  if (!pollId) {
    return Response.json({ error: "pollId is required" }, { status: 400 });
  }

  const res = await sql(
    `select * from answer where pollId = ? order by created_at desc`,
    [pollId]
  );
  console.log(res);
  return Response.json(res);
}

export async function POST(req: any) {
  try {
    const { name, description, pollId } = await req.json();

    if (!name || !description || !pollId) {
      return Response.json({ error: "pollId is required" }, { status: 400 });
    }

    const res = await sql(
      `INSERT INTO answer (name, description, pollId) VALUES (?, ?, ? )`,
      [name, description, pollId]
    );
    return Response.json(res);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
