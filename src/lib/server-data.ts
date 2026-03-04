import { createAdminSupabaseClient } from "@/src/lib/supabase/admin";

export type AppEvent = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  startsAt: string;
  location: string;
  priceLabel: string;
  capacity: number;
  paidCount: number;
  spotsLeft: number;
  status: string;
  matchingOpen: boolean;
  coverImageUrl: string;
  venueImageUrl: string;
};

export type DeckUser = {
  id: string;
  telegramId: number;
  name: string;
  username: string | null;
  age: number | null;
  bio: string | null;
  photos: string[];
};

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location_text: string | null;
  price_cents: number;
  capacity: number;
  status: string;
  matching_open: boolean | null;
  cities: { name: string } | { name: string }[] | null;
};

const eventMediaById: Record<string, { cover: string; venue: string }> = {
  "e1111111-1111-1111-1111-111111111111": {
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1400&q=80",
    venue: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1400&q=80",
  },
  "e2222222-2222-2222-2222-222222222222": {
    cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    venue: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80",
  },
  "e3333333-3333-3333-3333-333333333333": {
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    venue: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80",
  },
};

function formatPrice(priceCents: number): string {
  const rub = Math.round(priceCents / 100);
  return `${rub.toLocaleString("ru-RU")} ₽`;
}

function calcAge(birthdate: string | null): number | null {
  if (!birthdate) return null;
  const b = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age > 0 ? age : null;
}

export async function getEventsFromDb(): Promise<AppEvent[]> {
  const supabase = createAdminSupabaseClient();

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id,title,description,starts_at,location_text,price_cents,capacity,status,matching_open,cities(name)")
    .order("starts_at", { ascending: true });

  if (eventsError) {
    console.error("[plus-one] events query error", eventsError.message);
    return [];
  }

  const eventIds = (events ?? []).map((item) => item.id);
  let regs: { event_id: string; status: string }[] = [];

  if (eventIds.length > 0) {
    const { data: regsData, error: regsError } = await supabase
      .from("event_registrations")
      .select("event_id,status")
      .in("event_id", eventIds);

    if (!regsError) regs = regsData ?? [];
  }

  const rows = (events ?? []) as EventRow[];

  return rows.map((event) => {
    const paidCount = regs.filter((row) => row.event_id === event.id && row.status === "paid").length;
    const media = eventMediaById[event.id] ?? {
      cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
      venue: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
    };

    const cityValue = Array.isArray(event.cities) ? event.cities[0]?.name : event.cities?.name;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      city: cityValue ?? "Город не указан",
      startsAt: new Date(event.starts_at).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: event.location_text ?? "Локация уточняется",
      priceLabel: formatPrice(event.price_cents),
      capacity: event.capacity,
      paidCount,
      spotsLeft: Math.max(0, event.capacity - paidCount),
      status: event.status,
      matchingOpen: Boolean(event.matching_open),
      coverImageUrl: media.cover,
      venueImageUrl: media.venue,
    };
  });
}

export async function getEventByIdFromDb(id: string): Promise<AppEvent | null> {
  const events = await getEventsFromDb();
  return events.find((event) => event.id === id) ?? null;
}

export async function getProfileByTelegramId(telegramId: number) {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,telegram_id,first_name,last_name,username,bio,birthdate,photo_urls,allow_show_username")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (error) {
    console.error("[plus-one] profile query error", error.message);
    return null;
  }

  return data;
}

export async function getDeckForEvent(eventId: string, telegramId: number): Promise<DeckUser[]> {
  const me = await getProfileByTelegramId(telegramId);
  if (!me) return [];

  const supabase = createAdminSupabaseClient();

  const { data: attendanceRows, error: attendanceError } = await supabase
    .from("attendance")
    .select("user_id,status")
    .eq("event_id", eventId)
    .eq("status", "present");

  if (attendanceError) {
    console.error("[plus-one] deck attendance query error", attendanceError.message);
    return [];
  }

  const participantIds = (attendanceRows ?? []).map((row) => row.user_id).filter((id) => id !== me.id);
  if (participantIds.length === 0) return [];

  const { data: swipes } = await supabase
    .from("swipes")
    .select("to_user_id")
    .eq("event_id", eventId)
    .eq("from_user_id", me.id);

  const swipedIds = new Set((swipes ?? []).map((row) => row.to_user_id));

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,telegram_id,first_name,last_name,username,bio,birthdate,photo_urls")
    .in("id", participantIds);

  if (profilesError) {
    console.error("[plus-one] deck profiles query error", profilesError.message);
    return [];
  }

  return (profiles ?? [])
    .filter((profile) => !swipedIds.has(profile.id))
    .map((profile) => ({
      id: profile.id,
      telegramId: profile.telegram_id,
      name: [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Участник",
      username: profile.username,
      age: calcAge(profile.birthdate),
      bio: profile.bio,
      photos: profile.photo_urls?.length
        ? profile.photo_urls
        : ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"],
    }));
}

export async function getMatchesForTelegramId(telegramId: number) {
  const me = await getProfileByTelegramId(telegramId);
  if (!me) return [];

  const supabase = createAdminSupabaseClient();
  const { data: matches, error } = await supabase
    .from("matches")
    .select("id,event_id,user_a,user_b,type,created_at")
    .or(`user_a.eq.${me.id},user_b.eq.${me.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[plus-one] matches query error", error.message);
    return [];
  }

  const partnerIds = Array.from(
    new Set(
      (matches ?? []).map((m) => (m.user_a === me.id ? m.user_b : m.user_a)),
    ),
  );

  const { data: partners } = await supabase
    .from("profiles")
    .select("id,first_name,last_name,username,photo_urls,allow_show_username")
    .in("id", partnerIds);

  const byId = new Map((partners ?? []).map((p) => [p.id, p]));

  return (matches ?? []).map((match) => {
    const partnerId = match.user_a === me.id ? match.user_b : match.user_a;
    const partner = byId.get(partnerId);

    return {
      id: match.id,
      type: match.type,
      createdAt: match.created_at,
      partnerName:
        partner ? [partner.first_name, partner.last_name].filter(Boolean).join(" ") || "Участник" : "Участник",
      partnerUsername: partner?.allow_show_username ? partner.username : null,
      partnerPhoto:
        partner?.photo_urls?.[0] ??
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
    };
  });
}
