export type EventCard = {
  id: string;
  title: string;
  city: string;
  startsAt: string;
  ageLabel: string;
  spotsLeft: number;
  priceLabel: string;
  shortDescription: string;
  address: string;
  dressCode: string;
};

export type ParticipantCard = {
  id: string;
  eventId: string;
  name: string;
  age: number;
  job: string;
  bio: string;
};

export const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Саратов",
  "Казань",
  "Екатеринбург",
  "Нижний Новгород",
  "Новосибирск",
];

export const INTERESTS = [
  "кино",
  "книги",
  "путешествия",
  "искусство",
  "бизнес",
  "психология",
  "спорт",
];

export const EVENTS: EventCard[] = [
  {
    id: "book-club-moscow",
    title: "Книжный клуб знакомств",
    city: "Москва",
    startsAt: "14 марта, 19:00",
    ageLabel: "26-35",
    spotsLeft: 4,
    priceLabel: "3 500 ₽",
    shortDescription: "Вечер знакомств через книги: живой формат, 3 раунда общения и мягкий модератор.",
    address: "Москва, Покровка 11, пространство Stories",
    dressCode: "Smart casual",
  },
  {
    id: "cinema-club-msk",
    title: "Кино-встреча: плюс один",
    city: "Москва",
    startsAt: "20 марта, 20:00",
    ageLabel: "24-34",
    spotsLeft: 7,
    priceLabel: "4 200 ₽",
    shortDescription: "Смотрим короткий фильм, затем обсуждаем в парах и мини-группах.",
    address: "Москва, Хлебозавод, зал Кадр",
    dressCode: "Свободный, но аккуратный",
  },
  {
    id: "art-walk-spb",
    title: "Арт-прогулка и знакомства",
    city: "Санкт-Петербург",
    startsAt: "22 марта, 18:30",
    ageLabel: "25-37",
    spotsLeft: 2,
    priceLabel: "3 900 ₽",
    shortDescription: "Знакомимся через искусство, задания на диалог и чай после маршрута.",
    address: "СПб, Новая Голландия, инфо-точка у арки",
    dressCode: "По погоде + удобная обувь",
  },
];

export const PARTICIPANTS: ParticipantCard[] = [
  {
    id: "anna",
    eventId: "book-club-moscow",
    name: "Анна",
    age: 28,
    job: "маркетолог",
    bio: "Любит документальное кино и долгие прогулки по центру.",
  },
  {
    id: "maria",
    eventId: "book-club-moscow",
    name: "Мария",
    age: 31,
    job: "продюсер",
    bio: "Читает нон-фикшн и хочет больше офлайн-встреч без переписок.",
  },
  {
    id: "olga",
    eventId: "book-club-moscow",
    name: "Ольга",
    age: 27,
    job: "дизайнер",
    bio: "Фанатка выставок и коротких путешествий на выходные.",
  },
];

export const ADMIN_EVENTS = EVENTS.map((event) => ({
  ...event,
  status: "sales_open",
  paid: Math.max(0, 10 - event.spotsLeft),
  waitlist: event.spotsLeft < 3 ? 3 : 1,
}));
