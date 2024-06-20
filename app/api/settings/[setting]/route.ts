import { set, get } from "@/lib/redis";
import { unstable_noStore as noStore } from "next/cache";

type SettingsParam = { params: { setting: Settings } };

const settings = {
  primaryColor: "primaryColor",
  secondaryColor: "secondaryColor",
} as const;
type Settings = keyof typeof settings;

const PREFIX = "settings" as const;

const DEFAULT_SETTINGS = {
  primaryColor: "#800080",
  secondaryColor: "#ffffff",
};

function getAndValidatePollId(req: Request) {
  const { searchParams } = new URL(req.url);
  const pollId = searchParams.get("pollId");

  if (!pollId) {
    return { error: Response.json({ error: "pollId is required" }) };
  }

  return { pollId };
}

function checkSetting(setting: Settings) {
  const settingKeys = Object.keys(settings);
  if (!settingKeys.includes(setting)) {
    return Response.json({
      error: `Invalid setting. Available settings are [${settingKeys}]`,
    });
  }
}

function getKeyPattern(setting: Settings, pollId: string) {
  return `${PREFIX}/${setting}/${pollId}`;
}

export async function POST(req: Request, { params }: SettingsParam) {
  noStore();

  const settingError = checkSetting(params.setting);
  if (settingError) return settingError;

  const { error, pollId } = getAndValidatePollId(req);
  if (error) return error;

  const settingValue = new URL(req.url).searchParams.get("value");
  const res = await set(
    getKeyPattern(params.setting, pollId),
    settingValue,
    30
  );

  return Response.json(res);
}

export async function GET(req: Request, { params }: SettingsParam) {
  noStore();

  const settingError = checkSetting(params.setting);
  if (settingError) return settingError;

  const { error, pollId } = getAndValidatePollId(req);
  if (error) return error;

  const res = await get(getKeyPattern(params.setting, pollId));

  if (!res) {
    return Response.json(DEFAULT_SETTINGS[params.setting]);
  }

  return Response.json(res);
}
