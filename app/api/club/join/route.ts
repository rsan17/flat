import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clubJoinSchema } from "@/lib/validators";
import {
  findClubMemberByPhoneLocal,
  saveClubMemberLocal,
} from "@/lib/club-store";

const FALLBACK_INVITE = "https://t.me/f5chess";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = clubJoinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { fullName, phone, nickname, chessHandle } = parsed.data;
  const existing = findClubMemberByPhoneLocal(phone);
  const id = existing?.id ?? randomUUID();

  if (!existing) {
    saveClubMemberLocal({
      id,
      full_name: fullName,
      phone,
      nickname,
      chess_handle: chessHandle?.trim() || null,
      created_at: new Date().toISOString(),
    });
  }

  const invite =
    process.env.F5_TG_INVITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_F5_TG_INVITE?.trim() ||
    FALLBACK_INVITE;

  return NextResponse.json({
    ok: true,
    alreadyMember: Boolean(existing),
    inviteUrl: invite,
  });
}
