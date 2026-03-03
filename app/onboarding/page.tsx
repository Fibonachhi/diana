"use client";

import { AppShell } from "@/src/components/app-shell";
import { CITIES, INTERESTS } from "@/src/lib/mock-data";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type StepId = "welcome" | "how1" | "how2" | "how3" | "profile" | "city";

type ProfileForm = {
  age: string;
  city: string;
  interests: string[];
};

const steps: StepId[] = ["welcome", "how1", "how2", "how3", "profile", "city"];

const STORAGE_KEY = "plus_one_onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>({ age: "", city: "", interests: [] });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ProfileForm;
      if (parsed.city) {
        const timer = window.setTimeout(() => {
          setProfile(parsed);
          setCompleted(true);
        }, 0);

        return () => window.clearTimeout(timer);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function toggleInterest(interest: string) {
    setProfile((current) => {
      if (current.interests.includes(interest)) {
        return { ...current, interests: current.interests.filter((item) => item !== interest) };
      }

      return { ...current, interests: [...current.interests, interest] };
    });
  }

  function finishOnboarding() {
    const ready = profile.age.trim() && profile.city.trim() && profile.interests.length > 0;
    if (!ready) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    router.push("/home");
  }

  if (completed) {
    return (
      <AppShell title="Онбординг завершён" subtitle="Профиль уже заполнен, можно перейти к встречам.">
        <div className="space-y-4">
          <div className="rounded-2xl bg-black/5 p-4 text-sm text-black/80">
            <p>Город: {profile.city}</p>
            <p>Возраст: {profile.age}</p>
            <p>Интересы: {profile.interests.join(", ")}</p>
          </div>
          <button className="primary-btn" onClick={() => router.push("/home")}>
            Перейти к событиям
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Добро пожаловать в Плюс Один"
      subtitle="Клуб знакомств через реальные встречи"
    >
      <div className="space-y-4">
        <div className="h-2 overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>

        {step === "welcome" ? (
          <section className="space-y-4">
            <p className="text-sm text-black/75">
              Здесь вы сначала знакомитесь вживую на встрече, а симпатию выбираете уже после события.
            </p>
            <button className="primary-btn" onClick={nextStep}>
              Начать
            </button>
          </section>
        ) : null}

        {step === "how1" ? (
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-black/45">Как это работает</p>
            <h2 className="text-2xl font-semibold leading-tight">1. Вы выбираете встречу</h2>
            <p className="text-sm text-black/75">Живые мероприятия в вашем городе.</p>
            <button className="primary-btn" onClick={nextStep}>
              Дальше
            </button>
          </section>
        ) : null}

        {step === "how2" ? (
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-black/45">Как это работает</p>
            <h2 className="text-2xl font-semibold leading-tight">2. Вы общаетесь офлайн</h2>
            <p className="text-sm text-black/75">Никаких чатов до встречи.</p>
            <button className="primary-btn" onClick={nextStep}>
              Дальше
            </button>
          </section>
        ) : null}

        {step === "how3" ? (
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-black/45">Как это работает</p>
            <h2 className="text-2xl font-semibold leading-tight">
              3. После встречи выбираете симпатию
            </h2>
            <p className="text-sm text-black/75">Если она взаимная, мы открываем контакт.</p>
            <button className="primary-btn" onClick={nextStep}>
              Заполнить профиль
            </button>
          </section>
        ) : null}

        {step === "profile" ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight">Базовый профиль</h2>
            <p className="text-sm text-black/75">
              Имя, username и фото берём из Telegram. Добавьте возраст, город и интересы.
            </p>

            <label className="field-block">
              <span className="field-label">Сколько вам лет</span>
              <input
                className="field-input"
                inputMode="numeric"
                placeholder="Например, 28"
                value={profile.age}
                onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))}
              />
            </label>

            <label className="field-block">
              <span className="field-label">В каком городе вы</span>
              <select
                className="field-input"
                value={profile.city}
                onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
              >
                <option value="">Выберите город</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2">
              <p className="field-label">Что вам интересно</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = profile.interests.includes(interest);

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-black/15 bg-white text-black/75"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button className="primary-btn" onClick={nextStep}>
              Дальше
            </button>
          </section>
        ) : null}

        {step === "city" ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight">Ваш город</h2>
            <p className="text-sm text-black/75">Выберите основной город, чтобы видеть релевантные встречи.</p>
            <div className="grid grid-cols-2 gap-2">
              {CITIES.map((city) => {
                const selected = profile.city === city;

                return (
                  <button
                    key={city}
                    type="button"
                    className={`rounded-2xl border p-3 text-left text-sm font-medium transition ${
                      selected ? "border-black bg-black text-white" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setProfile((current) => ({ ...current, city }))}
                  >
                    {city}
                  </button>
                );
              })}
            </div>

            <button
              className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!profile.age.trim() || !profile.city.trim() || profile.interests.length === 0}
              onClick={finishOnboarding}
            >
              Показать события
            </button>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
