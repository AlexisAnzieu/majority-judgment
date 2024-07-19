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
    `select * from answer where pollId = ? order by created_at desc`,
    [pollId]
  );
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

export async function DELETE(req: any) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    const res = await sql(`DELETE FROM answer WHERE id = ?`, [id]);
    return Response.json(res);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
