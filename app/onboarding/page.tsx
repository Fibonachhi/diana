"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/src/components/app-shell";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { CITIES, INTERESTS } from "@/src/lib/mock-data";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";

type StepId = "welcome" | "how1" | "how2" | "how3" | "profile" | "city";

type ProfileForm = {
  age: string;
  city: string;
  interests: string[];
};

const steps: StepId[] = ["welcome", "how1", "how2", "how3", "profile", "city"];
const STORAGE_KEY = "plus_one_onboarding_v2";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useTelegramProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>({ age: "", city: "", interests: [] });

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
    if (!profile.age.trim() || !profile.city.trim() || profile.interests.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    router.push("/home");
  }

  return (
    <AppShell
      title="Добро пожаловать в Плюс Один"
      subtitle="Клуб знакомств через реальные встречи"
      showTabs={false}
    >
      <div className="screen-stack">
        <LiquidGlassPanel>
          <p className="muted">Шаг {stepIndex + 1} из {steps.length}</p>
          <div className="mt-2 h-2 rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-fuchsia-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {user?.first_name ? <p className="mt-3 muted">Telegram: {user.first_name}</p> : null}
        </LiquidGlassPanel>

        {step === "welcome" ? (
          <LiquidGlassCard>
            <h2 className="screen-title">Добро пожаловать в Плюс Один</h2>
            <p className="mt-3 muted">Сначала реальная встреча, потом симпатия. Никаких бесконечных чатов до события.</p>
            <div className="mt-4">
              <LiquidGlassButton variant="accent" onClick={nextStep}>Начать</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}

        {step === "how1" ? (
          <LiquidGlassCard>
            <p className="eyebrow">Как это работает</p>
            <h2 className="screen-title mt-2">1. Вы выбираете встречу</h2>
            <p className="mt-3 muted">Живые мероприятия в городе и понятный формат знакомства.</p>
            <div className="mt-4">
              <LiquidGlassButton onClick={nextStep}>Дальше</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}

        {step === "how2" ? (
          <LiquidGlassCard>
            <p className="eyebrow">Как это работает</p>
            <h2 className="screen-title mt-2">2. Вы общаетесь офлайн</h2>
            <p className="mt-3 muted">Никаких чатов до встречи. Только живой диалог и атмосфера.</p>
            <div className="mt-4">
              <LiquidGlassButton onClick={nextStep}>Дальше</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}

        {step === "how3" ? (
          <LiquidGlassCard>
            <p className="eyebrow">Как это работает</p>
            <h2 className="screen-title mt-2">3. После встречи выбираете симпатию</h2>
            <p className="mt-3 muted">Если симпатия взаимная, контакт открывается автоматически.</p>
            <div className="mt-4">
              <LiquidGlassButton onClick={nextStep}>Заполнить профиль</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}

        {step === "profile" ? (
          <LiquidGlassCard>
            <h2 className="screen-title">Базовый профиль</h2>
            <p className="mt-2 muted">Имя, username и фото подтягиваются из Telegram. Добавьте возраст, город и интересы.</p>

            <div className="mt-4">
              <p className="input-label">Сколько вам лет</p>
              <input
                className="input"
                inputMode="numeric"
                placeholder="Например, 28"
                value={profile.age}
                onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))}
              />
            </div>

            <div className="mt-3">
              <p className="input-label">В каком городе вы</p>
              <select
                className="input"
                value={profile.city}
                onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
              >
                <option value="">Выберите город</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <p className="input-label">Что вам интересно</p>
              <div className="tag-row">
                {INTERESTS.map((interest) => {
                  const selected = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      className={`tag-chip ${selected ? "tag-chip-active" : ""}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <LiquidGlassButton onClick={nextStep}>Дальше</LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}

        {step === "city" ? (
          <LiquidGlassCard>
            <h2 className="screen-title">Ваш город</h2>
            <p className="mt-2 muted">Выберите основной город. После этого откроется афиша встреч.</p>

            <div className="mt-3 tag-row">
              {CITIES.map((city) => (
                <button
                  key={city}
                  className={`tag-chip ${profile.city === city ? "tag-chip-active" : ""}`}
                  onClick={() => setProfile((current) => ({ ...current, city }))}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <LiquidGlassButton
                variant="accent"
                onClick={finishOnboarding}
                disabled={!profile.age.trim() || !profile.city.trim() || profile.interests.length === 0}
              >
                Показать события
              </LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ) : null}
      </div>
    </AppShell>
  );
}
