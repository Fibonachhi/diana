"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassButton } from "@/src/components/LiquidGlassButton";
import { LiquidGlassCard } from "@/src/components/LiquidGlassCard";
import { LiquidGlassPanel } from "@/src/components/LiquidGlassPanel";
import { CITIES, INTERESTS } from "@/src/lib/mock-data";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

type StepId = "welcome" | "how1" | "how2" | "how3" | "profile" | "city";

type ProfileForm = {
  age: string;
  city: string;
  interests: string[];
};

const steps: StepId[] = ["welcome", "how1", "how2", "how3", "profile", "city"];
const STORAGE_KEY = "plus_one_onboarding_v2";

const stepImages: Record<Exclude<StepId, "profile" | "city">, string> = {
  welcome: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
  how1: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1400&q=80",
  how2: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80",
  how3: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useTelegramProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>({ age: "", city: "", interests: [] });

  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);
  const canFinish = Boolean(profile.age.trim() && profile.city.trim() && profile.interests.length > 0);

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
    if (!canFinish) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    logClient("info", "onboarding_completed", {
      telegramId: user?.id ?? null,
      city: profile.city,
      interestsCount: profile.interests.length,
    });

    router.push("/home");
    window.setTimeout(() => {
      if (window.location.pathname !== "/home") {
        window.location.href = "/home";
      }
    }, 260);
  }

  return (
    <main className="onboarding-full">
      <section className="onboarding-stage">
        <Image src="/glass-orb.svg" alt="" width={300} height={300} className="bg-orb bg-orb-left" priority />
        <Image src="/glass-orb.svg" alt="" width={250} height={250} className="bg-orb bg-orb-right" priority />

        <div className="onboarding-content">
          <LiquidGlassPanel>
            <p className="muted">Шаг {stepIndex + 1} из {steps.length}</p>
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-fuchsia-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {user?.first_name ? <p className="mt-2 muted">Привет, {user.first_name}</p> : null}
          </LiquidGlassPanel>

          {step === "welcome" ? (
            <LiquidGlassCard>
              <figure className="event-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stepImages.welcome} alt="Онбординг" />
              </figure>
              <h2 className="screen-title">Добро пожаловать в Плюс Один</h2>
              <p className="mt-3 muted">Клуб знакомств через реальные встречи. Сначала событие, потом взаимная симпатия.</p>
            </LiquidGlassCard>
          ) : null}

          {step === "how1" ? (
            <LiquidGlassCard>
              <figure className="event-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stepImages.how1} alt="Выбор встречи" />
              </figure>
              <p className="eyebrow">Как это работает</p>
              <h2 className="screen-title mt-2">1. Вы выбираете встречу</h2>
              <p className="mt-2 muted">Живые мероприятия в вашем городе: книги, кино, прогулки и гастро.</p>
            </LiquidGlassCard>
          ) : null}

          {step === "how2" ? (
            <LiquidGlassCard>
              <figure className="event-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stepImages.how2} alt="Общение офлайн" />
              </figure>
              <p className="eyebrow">Как это работает</p>
              <h2 className="screen-title mt-2">2. Вы общаетесь офлайн</h2>
              <p className="mt-2 muted">Никаких чатов до встречи. Контакт, атмосфера и живые эмоции.</p>
            </LiquidGlassCard>
          ) : null}

          {step === "how3" ? (
            <LiquidGlassCard>
              <figure className="event-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stepImages.how3} alt="Симпатия после встречи" />
              </figure>
              <p className="eyebrow">Как это работает</p>
              <h2 className="screen-title mt-2">3. После встречи выбираете симпатию</h2>
              <p className="mt-2 muted">Взаимный выбор открывает контакт. Без давления и случайных диалогов.</p>
            </LiquidGlassCard>
          ) : null}

          {step === "profile" ? (
            <LiquidGlassCard>
              <h2 className="screen-title">Базовый профиль</h2>
              <p className="mt-2 muted">Имя и фото уже подтянуты из Telegram. Добавьте возраст, город и интересы.</p>

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
                    <option key={city} value={city}>
                      {city}
                    </option>
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
            </LiquidGlassCard>
          ) : null}

          {step === "city" ? (
            <LiquidGlassCard>
              <h2 className="screen-title">Ваш город</h2>
              <p className="mt-2 muted">Выберите основной город. Дальше откроется живая афиша с местами и участниками.</p>
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
            </LiquidGlassCard>
          ) : null}
        </div>

        <div className="onboarding-footer">
          {step === "city" ? (
            <>
              <LiquidGlassButton variant="accent" onClick={finishOnboarding} disabled={!canFinish}>
                Показать события
              </LiquidGlassButton>
              {!canFinish ? (
                <p className="mt-2 muted">Заполните возраст и минимум 1 интерес, чтобы открыть афишу.</p>
              ) : null}
            </>
          ) : (
            <LiquidGlassButton variant={step === "welcome" ? "accent" : "primary"} onClick={nextStep}>
              {step === "welcome" ? "Начать" : "Дальше"}
            </LiquidGlassButton>
          )}
        </div>
      </section>
    </main>
  );
}
