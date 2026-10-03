export interface SrtEntry {
  id?: number;
  start: number;
  end: number;
  text: string;
}

export function parseSrtToJson(input: string): SrtEntry[] {
  const blocks = input
    .replace(/\r/g, '')
    .trim()
    .split(/\n\s*\n+/)
    .filter(Boolean);

  const entries: SrtEntry[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim());
    if (lines.length < 3) continue;

    const timeLine = lines[1] || '';
    const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{1,3})/);

    if (!match) continue;

    const start = srtTimeToSeconds(match[1]);
    const end = srtTimeToSeconds(match[2]);
    const text = lines.slice(2).join('\n').replace(/\s+\n/g, '\n').trim();

    if (!text) continue;

    entries.push({
      start,
      end,
      text,
    });
  }

  return entries;
}

export function srtTimeToSeconds(value: string): number {
  const match = value.match(/(\d{2}):(\d{2}):(\d{2}),(\d{1,3})/);
  if (!match) return 0;

  const [, hh, mm, ss, ms] = match;
  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000;
}

export function srtToJson(input: string): string {
  return JSON.stringify(parseSrtToJson(input), null, 2);
}

export function srtToJsonFile(input: string): Record<string, unknown>[] {
  return parseSrtToJson(input) as Record<string, unknown>[];
}
