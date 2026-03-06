"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, INTERESTS } from "@/src/lib/mock-data";
import { useTelegramProfile } from "@/src/hooks/use-telegram-profile";
import { logClient } from "@/src/lib/logger";

type StepId = "splash" | "welcome" | "how1" | "how2" | "how3" | "profile";

type ProfileForm = {
  age: string;
  city: string;
  interests: string[];
};

const steps: StepId[] = ["splash", "welcome", "how1", "how2", "how3", "profile"];
const STORAGE_KEY = "plus_one_onboarding_v3";

const backgrounds: Record<Exclude<StepId, "splash" | "profile">, string> = {
  welcome: "/images/onboard-1.jpg",
  how1: "/images/onboard-1.jpg",
  how2: "/images/onboard-2.jpg",
  how3: "/images/onboard-3.jpg",
};

function validAge(raw: string) {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 18 && value <= 80;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useTelegramProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>({ age: "", city: "", interests: [] });
  const splashVideoRef = useRef<HTMLVideoElement | null>(null);
  const [manualVideoStart, setManualVideoStart] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const step = steps[stepIndex];
  const profileValid = validAge(profile.age) && Boolean(profile.city.trim()) && profile.interests.length > 0;
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

  useEffect(() => {
    if (step !== "splash") return;

    const startedAt = Date.now();
    const duration = 5600;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setSplashProgress(p);

      if (p >= 100) {
        window.clearInterval(timer);
        setStepIndex(1);
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "splash") return;

    const video = splashVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.defaultMuted = true;

    const tryPlay = async () => {
      try {
        await video.play();
        setManualVideoStart(false);
      } catch {
        setManualVideoStart(true);
        logClient("warn", "splash_video_autoplay_blocked", {});
      }
    };

    void tryPlay();
    const retryTimer = window.setTimeout(() => void tryPlay(), 350);
    const retryTimer2 = window.setTimeout(() => void tryPlay(), 900);
    const onCanPlay = () => void tryPlay();
    video.addEventListener("canplay", onCanPlay);

    return () => {
      window.clearTimeout(retryTimer);
      window.clearTimeout(retryTimer2);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [step]);

  function toggleInterest(interest: string) {
    setProfile((current) => {
      if (current.interests.includes(interest)) {
        return { ...current, interests: current.interests.filter((item) => item !== interest) };
      }
      return { ...current, interests: [...current.interests, interest] };
    });
  }

  function nextStep() {
    if (step === "profile") {
      if (!profileValid) return;
      finishOnboarding();
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function prevStep() {
    if (stepIndex <= 1) return;
    setStepIndex((current) => Math.max(current - 1, 1));
  }

  function finishOnboarding() {
    if (!profileValid) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    logClient("info", "onboarding_completed", {
      telegramId: user?.id ?? null,
      city: profile.city,
      interestsCount: profile.interests.length,
      age: Number(profile.age),
    });

    const cityParam = encodeURIComponent(profile.city);
    router.push(`/home?city=${cityParam}`);
    window.setTimeout(() => {
      if (!window.location.pathname.startsWith("/home")) {
        window.location.href = `/home?city=${cityParam}`;
      }
    }, 240);
  }

  if (step === "splash") {
    return (
      <main className="onboarding-splash-root">
        <div className="onboarding-splash-video-wrap">
          <video
            ref={splashVideoRef}
            className="onboarding-splash-video"
            src="/video/logoanim.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
          />
          {!videoReady ? <div className="onboarding-video-placeholder">Загружаем анимацию...</div> : null}
          {manualVideoStart ? (
            <button
              type="button"
              className="onboarding-video-play-btn"
              onClick={() => {
                const video = splashVideoRef.current;
                if (!video) return;
                void video.play()
                  .then(() => setManualVideoStart(false))
                  .catch(() => setManualVideoStart(true));
              }}
            >
              Запустить анимацию
            </button>
          ) : null}
        </div>

        <div className="onboarding-splash-content">
          <div className="onboarding-loader">
            <div className="onboarding-loader-fill" style={{ width: `${splashProgress}%` }} />
          </div>
          <p className="onboarding-loader-text">Плюс Один • загрузка {splashProgress}%</p>
        </div>
      </main>
    );
  }

  const background = step === "profile" ? backgrounds.how3 : backgrounds[step as keyof typeof backgrounds];

  return (
    <main
      className={`onboarding-canvas ${step === "how3" || step === "profile" ? "onboarding-canvas-bw" : ""}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="onboarding-shade" />

      <section className="onboarding-layer">
        <div className="onboarding-top-meta">
          <p>Шаг {stepIndex + 1} из {steps.length}</p>
          <div className="onboarding-mini-progress">
            <div className="onboarding-mini-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === "welcome" ? (
          <div className="onboarding-compact-card">
            <p className="onboarding-kicker">Добро пожаловать</p>
            <h2>Клуб знакомств через реальные встречи</h2>
            <p>Сначала живое событие. Потом выбор симпатии без бесконечных чатов.</p>
          </div>
        ) : null}

        {step === "how1" ? (
          <div className="onboarding-compact-card">
            <p className="onboarding-kicker">Как это работает</p>
            <h2>1. Выбираете встречу</h2>
            <p>События в вашем городе: кино, книги, прогулки, гастро-форматы.</p>
          </div>
        ) : null}

        {step === "how2" ? (
          <div className="onboarding-compact-card">
            <p className="onboarding-kicker">Как это работает</p>
            <h2>2. Общаетесь офлайн</h2>
            <p>До встречи нет чатов. Только живой контакт и настоящая атмосфера.</p>
          </div>
        ) : null}

        {step === "how3" ? (
          <div className="onboarding-compact-card">
            <p className="onboarding-kicker">Как это работает</p>
            <h2>3. После встречи свайпы</h2>
            <p>Взаимная симпатия открывает контакт. Влево - дружба, вправо - романтика.</p>
          </div>
        ) : null}

        {step === "profile" ? (
          <div className="onboarding-form-card">
            <p className="onboarding-kicker">Профиль</p>
            <h2>Заполните данные</h2>
            <p className="onboarding-note">{user?.first_name ? `${user.first_name},` : ""} нужен возраст, город и интересы.</p>

            <label className="onboarding-field">
              <span>Возраст</span>
              <input
                className="input"
                inputMode="numeric"
                placeholder="Например, 28"
                value={profile.age}
                onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value.replace(/\D/g, "") }))}
              />
            </label>

            <label className="onboarding-field">
              <span>Город</span>
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
            </label>

            <div className="onboarding-field">
              <span>Интересы</span>
              <div className="onboarding-interest-grid">
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

            {!profileValid ? (
              <p className="onboarding-validation">Заполните возраст 18-80, город и минимум один интерес.</p>
            ) : null}
          </div>
        ) : null}

        <div className="onboarding-arrow-footer">
          <button type="button" className="onboarding-arrow" onClick={prevStep} disabled={stepIndex <= 1}>
            ←
          </button>

          <button
            type="button"
            className="onboarding-arrow onboarding-arrow-next"
            onClick={nextStep}
            disabled={step === "profile" ? !profileValid : false}
          >
            {step === "profile" ? "✓" : "→"}
          </button>
        </div>
      </section>
    </main>
  );
}
