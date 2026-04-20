// In-memory store for F5 Chess Club registrations (dev fallback).
// Swap to Supabase insert once the `club_members` table is ready.

export type ClubMemberRecord = {
  id: string;
  full_name: string;
  phone: string;
  nickname: string;
  chess_handle: string | null;
  created_at: string;
};

declare global {
  var __CLUB_MEMBERS__: Map<string, ClubMemberRecord> | undefined;
}

function store() {
  if (!globalThis.__CLUB_MEMBERS__) globalThis.__CLUB_MEMBERS__ = new Map();
  return globalThis.__CLUB_MEMBERS__;
}

export function saveClubMemberLocal(m: ClubMemberRecord) {
  store().set(m.id, m);
}

export function findClubMemberByPhoneLocal(phone: string) {
  for (const m of store().values()) {
    if (m.phone === phone) return m;
  }
  return null;
}
