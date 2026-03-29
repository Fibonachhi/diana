"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/src/lib/mock-data";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

type StepId = "splash" | "story1" | "story2" | "story3" | "age" | "city" | "taste" | "done";

type TasteId = "cinema" | "books" | "chess" | "snack";

type ProfileForm = {
  age: string;
  city: string;
  tastes: TasteId[];
};

const steps: StepId[] = ["splash", "story1", "story2", "story3", "age", "city", "taste", "done"];
const STORAGE_KEY = "plus_one_onboarding_v5";

const tasteCards: { id: TasteId; title: string; subtitle: string; emoji: string; theme: string }[] = [
  { id: "cinema", title: "Кино", subtitle: "Квиз + обсуждения", emoji: "🎬", theme: "amber" },
  { id: "books", title: "Книги", subtitle: "Стиль и жанры", emoji: "📖", theme: "blue" },
  { id: "chess", title: "Шахматы", subtitle: "Дуэли и тактика", emoji: "♞", theme: "mint" },
  { id: "snack", title: "Сырки", subtitle: "Мини-игры на скорость", emoji: "🍫", theme: "rose" },
];

function validAge(raw: string) {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 18 && value <= 80;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useTelegramProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>({ age: "", city: "", tastes: [] });

  const step = steps[stepIndex];
  const onboardingStepIndex = Math.max(1, stepIndex);
  const onboardingStepsTotal = steps.length - 1;

  const progress = useMemo(
    () => Math.round((onboardingStepIndex / onboardingStepsTotal) * 100),
    [onboardingStepIndex, onboardingStepsTotal],
  );

  useEffect(() => {
    if (step !== "splash") return;

    const startedAt = Date.now();
    const duration = 4200;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const value = Math.min(100, Math.round((elapsed / duration) * 100));
      setSplashProgress(value);

      if (value >= 100) {
        window.clearInterval(timer);
        setStepIndex(1);
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [step]);

  function toggleTaste(id: TasteId) {
    setProfile((current) => {
      if (current.tastes.includes(id)) {
        return { ...current, tastes: current.tastes.filter((value) => value !== id) };
      }
      return { ...current, tastes: [...current.tastes, id] };
    });
  }

  function canMoveForward() {
    if (step === "age") return validAge(profile.age);
    if (step === "city") return Boolean(profile.city);
    if (step === "taste") return profile.tastes.length > 0;
    return true;
  }

  function nextStep() {
    if (step === "done") {
      finishOnboarding();
      return;
    }

    if (!canMoveForward()) return;
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function prevStep() {
    if (stepIndex <= 1) return;
    setStepIndex((current) => Math.max(current - 1, 1));
  }

  function finishOnboarding() {
    if (!validAge(profile.age) || !profile.city || profile.tastes.length === 0) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    logClient("info", "onboarding_v5_completed", {
      telegramId: user?.id ?? null,
      city: profile.city,
      age: Number(profile.age),
      tastes: profile.tastes,
    });

    const cityParam = encodeURIComponent(profile.city);
    router.push(`/home?city=${cityParam}`);
  }

  if (step === "splash") {
    return (
      <main className="brand-splash">
        <div className="brand-splash-bg" />
        <div className="brand-splash-logo-wrap">
          <Image
            src="/brand/logo-plus-odin.png"
            alt="Плюс Один"
            width={280}
            height={280}
            className="brand-splash-logo"
            priority
          />
          <h1>Плюс Один</h1>
          <p>Кино • Книги • Шахматы • Сырки</p>

          <div className="brand-loader">
            <div className="brand-loader-fill" style={{ width: `${splashProgress}%` }} />
          </div>
          <span className="brand-loader-label">Запускаем игровой клуб {splashProgress}%</span>
        </div>
      </main>
    );
  }

  return (
    <main className="onboarding-v2">
      <div className="onboarding-v2-top">
        <Image src="/brand/logo-plus-odin.png" alt="Логотип Плюс Один" width={66} height={66} className="onboarding-v2-mini-logo" />
        <div className="onboarding-v2-progress-block">
          <p>Шаг {onboardingStepIndex} из {onboardingStepsTotal}</p>
          <div className="onboarding-v2-progress-track">
            <div className="onboarding-v2-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <section className="onboarding-v2-card">
        {step === "story1" ? (
          <>
            <p className="onboarding-v2-kicker">Механика</p>
            <h2>Выбирай живую встречу</h2>
            <p>Не просто дейтинг. Выбирай формат дня: кино, книги, шахматы или фановые битвы сырков.</p>
          </>
        ) : null}

        {step === "story2" ? (
          <>
            <p className="onboarding-v2-kicker">Механика</p>
            <h2>Встречайтесь офлайн</h2>
            <p>Никаких затяжных переписок до события. Только живой контакт в городе.</p>
          </>
        ) : null}

        {step === "story3" ? (
          <>
            <p className="onboarding-v2-kicker">Механика</p>
            <h2>После встречи — симпатии</h2>
            <p>Свайп вправо — романтика. Свайп влево — дружба. Взаимность открывает контакт.</p>
          </>
        ) : null}

        {step === "age" ? (
          <>
            <p className="onboarding-v2-kicker">Профиль</p>
            <h2>{user?.first_name ? `${user.first_name},` : "Дальше"} сколько вам лет?</h2>
            <label className="onboarding-v2-field">
              <span>Возраст</span>
              <input
                className="input"
                inputMode="numeric"
                placeholder="18-80"
                value={profile.age}
                onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value.replace(/\D/g, "") }))}
              />
            </label>
            {!validAge(profile.age) ? <p className="onboarding-v2-hint">Возраст должен быть от 18 до 80.</p> : null}
          </>
        ) : null}

        {step === "city" ? (
          <>
            <p className="onboarding-v2-kicker">Профиль</p>
            <h2>Выберите город</h2>
            <label className="onboarding-v2-field">
              <span>Ваш город</span>
              <select
                className="input"
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
          </>
        ) : null}

        {step === "taste" ? (
          <>
            <p className="onboarding-v2-kicker">Геймификация</p>
            <h2>Что вам заходит больше всего?</h2>
            <p className="onboarding-v2-hint">Выберите минимум 1 карточку. Это сформирует ваш вайб-профиль.</p>

            <div className="taste-grid">
              {tasteCards.map((card) => {
                const active = profile.tastes.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`taste-card taste-${card.theme} ${active ? "taste-card-active" : ""}`}
                    onClick={() => toggleTaste(card.id)}
                  >
                    <span className="taste-emoji">{card.emoji}</span>
                    <span className="taste-title">{card.title}</span>
                    <span className="taste-subtitle">{card.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {step === "done" ? (
          <>
            <p className="onboarding-v2-kicker">Готово</p>
            <h2>Профиль собран</h2>
            <p>
              Возраст: <b>{profile.age}</b>, город: <b>{profile.city}</b>, вайб: <b>{profile.tastes.length}</b> направлений.
            </p>
            <p className="onboarding-v2-hint">Теперь откроется главный экран с играми, событиями и картой людей рядом.</p>
          </>
        ) : null}
      </section>

      <div className="onboarding-v2-controls">
        <button type="button" className="onboarding-v2-btn" onClick={prevStep} disabled={stepIndex <= 1}>
          ←
        </button>
        <button type="button" className="onboarding-v2-btn onboarding-v2-btn-primary" onClick={nextStep} disabled={!canMoveForward()}>
          {step === "done" ? "Войти" : "→"}
        </button>
      </div>
    </main>
  );
}
