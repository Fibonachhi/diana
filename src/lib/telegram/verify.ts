import crypto from "crypto";

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export type VerifiedTelegramInitData = {
  authDate: number;
  queryId?: string;
  user: TelegramUser;
};

function parseInitData(initData: string): Record<string, string> {
  return initData
    .split("&")
    .map((chunk) => chunk.split("="))
    .reduce<Record<string, string>>((acc, [key, value]) => {
      if (!key || value === undefined) {
        return acc;
      }
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

export function verifyTelegramInitData(initData: string, botToken: string): VerifiedTelegramInitData {
  const params = parseInitData(initData);
  const hash = params.hash;

  if (!hash) {
    throw new Error("initData hash is missing");
  }

  const checkString = Object.entries(params)
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secret).update(checkString).digest("hex");

  if (computedHash !== hash) {
    throw new Error("Invalid Telegram initData signature");
  }

  const authDate = Number(params.auth_date);
  if (!authDate || Number.isNaN(authDate)) {
    throw new Error("auth_date is invalid");
  }

  const maxAgeSec = 60 * 60;
  const currentUnix = Math.floor(Date.now() / 1000);
  if (currentUnix - authDate > maxAgeSec) {
    throw new Error("initData is expired");
  }

  if (!params.user) {
    throw new Error("user is missing in initData");
  }

  const user = JSON.parse(params.user) as TelegramUser;
  if (!user.id || !user.first_name) {
    throw new Error("Telegram user payload is invalid");
  }

  return {
    authDate,
    queryId: params.query_id,
    user,
  };
}
