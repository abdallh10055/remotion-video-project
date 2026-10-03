---
name: arabic-motion-video
description: Build professional Arabic (Egyptian/MSA) video content end to end - TTS scripts for Google Gemini TTS, vertical or horizontal motion-graphics explainers in Remotion as ONE self-contained .tsx file synced to a voice-over via SRT, animated captions, camera moves and parallax, Islamic/manuscript/modern visual identities, generated sound effects and ambience, ffmpeg editing, and render pipelines (render.py / GitHub Actions). Use this skill whenever the user mentions video, motion graphics, موشن جرافيكس, فيديو, explainer, Remotion, voice-over, صوت, SRT, captions, كابشن, subtitles, Shorts/Reels, TTS, مؤثرات صوتية, or sends an audio file (m4a/mp3/wav) and wants a video made from it, even if they never say "skill" or "Remotion".
---

# Arabic Motion Video

Everything Claude can do for video, tuned for Arabic creators who record a voice-over and want a polished video around it.

## 0. What I can and cannot do (be honest about this up front)

Can do:
- Write TTS scripts (Egyptian Arabic) with per-line delivery notes for Google Gemini Flash TTS.
- Write a complete Remotion composition as ONE `.tsx` file: scenes, captions, camera moves, parallax, transitions, audio tracks.
- Generate sound effects and ambience as `.wav` files (Python/numpy + ffmpeg) to drop in `public/`.
- Edit with ffmpeg: trim, concat, burn subtitles, mix audio, normalize loudness, convert vertical/horizontal, extract audio, make previews/GIFs.
- Build SRT files from a transcript, shift/merge/split cues, convert SRT to a JSON scene/timing array.
- Write Python tools around the above (render.py, effects JSON drivers, timing tables).

Cannot do (say so, never fake it):
- Hear audio. No speech-to-text is available in the sandbox. Timing and topic come from an SRT or transcript the user provides. If they give only a transcript without times, estimate by character/word share of the total duration (get duration with `ffprobe`) and put all times in one editable array at the top of the file.
- Guarantee a final mp4: rendering a 10+ minute video with Chromium in the sandbox is usually too slow. Default delivery = the `.tsx` + audio assets + render instructions; offer a short preview (a few seconds as PNG stills or a short mp4) when feasible.

## 1. Workflow

1. **Collect inputs**: audio file (check duration with `ffprobe -v error -show_entries format=duration -of default=nw=1`), SRT or transcript, orientation, audience, identity (Islamic, tech, kids...), repo/render pipeline files if any.
2. **Ask before building** (the user expects this): propose 3 very different visual directions (style, palette, Arabic font, motion language) in short form, then ask only what is genuinely missing (SFX character, logo/end card). Do not start coding before they pick. Detail in section 6.
3. **Plan** in a few lines: scene list with start/end seconds, palette, 2 fonts, 3 to 5 reusable scene layouts.
4. **Build** the single `.tsx`, then SFX assets, then deliver with instructions.
5. **Deliver** short: file(s), where each goes (`src/`, `public/`), the Composition id, one line on assumptions. No long recap.

## 2. Remotion single-file rules

The user's repo takes one `.tsx` file containing everything. Therefore:
- One file: components, data arrays, styles, `export const RemotionRoot` (or the export the repo's `Root` expects). Inspect the uploaded `render.py` / `render.yaml` / `package.json` first and match: Composition id, fps, width/height, entry path, and where `staticFile()` assets are read from.
- Only import from packages the repo has. Safe core: `remotion` (`AbsoluteFill, Sequence, Audio, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, staticFile, Series, random`). `@remotion/google-fonts/*`, `@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/noise`, `@remotion/motion-blur` are good but may not be installed: check `package.json`, otherwise fall back to core only and inline SVG.
- Vertical = 1080x1920, 30 fps. Horizontal = 1920x1080. `durationInFrames = Math.ceil(audioSeconds * fps)`; compute from a constant, do not hardcode scattered numbers.
- Audio file lives in `public/` and is referenced with `staticFile("a4.m4a")`. Mount voice-over once at the root, SFX inside `<Sequence from={frame}>`.
- No `localStorage`, no network fetches at render time, no remote images. Draw with SVG/CSS; embed anything else as data URIs.
- Deterministic only: use `random("seed")` from remotion, never `Math.random()`, or frames differ between render threads.
- Keep fonts to 2 families. Load with `@remotion/google-fonts` if available; otherwise `@font-face` with a Google Fonts URL inside `delayRender/continueRender`.
- Performance for long videos: render only the active scene (`<Sequence>` already does this); avoid huge SVG filter stacks (blur/turbulence) full-screen on every frame; cap particles around 60.

### Timing source of truth
Scene data is an array: `{ id, start, end, text, layout, ... }` in seconds. Convert once: `const f = (s:number)=>Math.round(s*fps)`. For captions, each cue `{start,end,text}` comes straight from the SRT, and per-word timing is distributed by character count within the cue. Every animation is expressed relative to its Sequence start so the whole piece stays aligned if the user nudges one timestamp.

## 3. Arabic typography (most common source of ugly output)

- Always `direction: "rtl"` and `textAlign: "center"` (or `right`) on Arabic blocks; set `lang="ar"`.
- NEVER apply `letterSpacing` to Arabic: it breaks the letter joining. Never split a word into single letters for per-letter animation; animate per WORD (wrap each word in an inline-block span).
- Use real Arabic fonts: Amiri (naskh, classical), Aref Ruqaa (ruqaa), Reem Kufi (kufic headings), Cairo / Tajawal / IBM Plex Sans Arabic / Almarai (modern sans), El Messiri, Lalezar (bold display), Harmattan. Heavy weights (700-900) for captions.
- Line height 1.5 to 1.8 for naskh with tashkeel; do not clip descenders (`overflow: visible`, padding).
- Captions safe zone for vertical: keep inside 8% side margins; bottom 22% is covered by platform UI, so place captions around 55%-72% of height for Shorts/Reels, or centered for lesson videos.
- Numbers: Arabic-Indic digits (٠١٢) for classical/Islamic identity, Western digits for tech/modern.
- Quran verses or hadith: use proper tashkeel, a decorative frame, and never animate a verse so fast it cannot be read; do not alter or truncate the text. If the exact wording is uncertain, use only what the user supplied.

## 4. Motion toolkit (use varied tools, never one effect repeated)

Entrances / reveals: spring pop-in with overshoot, scale-from-point emerge, mask wipe (clip-path), ink-draw (SVG `stroke-dashoffset`), typewriter/pen write, blur-to-sharp focus pull, drop-in with bounce, stamp slam (scale 2.2 to 1 + shake + dust ring), unfold, page curl or flip, iris/circle reveal.

Camera illusions (the user specifically wants these):
- Wrap the whole scene in a "camera" div: slow push-in (scale 1 to 1.08), pan (translate), subtle roll (rotate ±1.5deg), handheld drift using sin/cos of frame with low amplitude, and a punch-in on emphasis words.
- Parallax: 3 to 5 depth layers (far background, mid ornaments, midground subject, foreground dust/leaves). Each layer moves by `camera.x * depth` and scales by `1 + camera.zoom * depth`. Foreground blurred slightly, far layers desaturated.
- "Constant movement": at no moment may the screen be static. Always run an ambient layer (floating particles, slow rotating ornament, drifting light rays) beneath scene-specific animation.
- Dolly/zoom-through transitions: scale the outgoing scene past 1.6 while fading, incoming scene starts at 0.8 and settles.

Transitions (rotate through 6+): ink-bloom wipe, page turn, circle iris, slide with parallax offset, zoom-through, ornament sweep, flash-cut on a sharp SFX hit, vertical shutter.

Caption styles (provide several and switch per scene or per emphasis, "various shapes"): ribbon banner, scroll/parchment strip, rounded pill, bracketed ornament frame, speech-stamp, highlight-marker behind the current word, karaoke fill (color sweep across words), word-pop one at a time, split two-line stack, key-phrase giant text with small subtitle. Highlight keywords in the accent color; active word scales 1.08.

Pacing rule: a new visual event at least every 1.5 to 2.5 s; a new scene layout every 6 to 12 s; punctuate section changes with a bigger move + sharp SFX.

## 5. Sound design

Generate assets with Python (numpy + `wave`/scipy, then ffmpeg for loudnorm), save as `.wav` or `.mp3` in `public/sfx/`.
- Ambience (calm, natural): soft wind (filtered noise), distant birds or night crickets (short chirp synth with random gaps), gentle water, quiet room tone. Loop-safe (crossfade the ends), mixed around -28 to -24 dB under the voice.
- Sharp accents: whoosh (swept filtered noise, 0.3-0.6 s), pop/click, paper swish, stamp thud (low sine burst + noise tick), pen-scratch, chime/bell (inharmonic partials with exponential decay), riser into a scene change, soft tick for each key word.
- Voice stays dominant: voice-over volume 1.0, ambience 0.08-0.15, SFX 0.25-0.6. Never place a sharp SFX during a quiet pause that precedes an important sentence unless it is a deliberate hit.
- Islamic identity: no music with instruments unless the user asks; rely on nature ambience, soft chimes and percussive hits without melody. Ask if they want nasheed-style vocal pads; do not assume.
- Wire SFX in code via a `cues` array `{t, sfx, vol}` rendered as `<Sequence from={f(t)}><Audio src={staticFile(...)} volume={vol}/></Sequence>`, with cue times aligned to scene starts and emphasized words.

## 6. Visual directions (offer these three, or invent ones that fit the topic)

Always propose three that differ in style, palette, font and motion language, then let the user pick or mix:
1. **Gold geometry on midnight**: Islamic star patterns and arabesque, navy/gold/ivory/turquoise, Reem Kufi + Tajawal, patterns blooming from center, rotating tessellations, golden glow reveals.
2. **Warm manuscript paper**: aged paper texture, ink, borders, beige/brown/olive/crimson, Amiri + Marqab-style headings, pen writing, stamps and seals, page turns, vignette.
3. **Bold modern neon**: dark emerald with mint/orange accents, Cairo or Almarai black weight, huge kinetic captions, shape morphs (circle to crescent to star), beat-synced shakes.
Other families worth offering: flat illustration with characters, blueprint/technical diagram, calm watercolor, kids' playful (bright, rounded shapes, big expressive words), news/documentary lower-thirds.

Islamic-identity guardrails: respectful imagery only; no depictions of prophets or companions; no human faces unless the user asks (use silhouettes/abstract); crescents, stars, domes, mihrab arches, lanterns, calligraphic ornaments, books, pens, lamps, olive branches are safe vocabulary.

## 7. TTS scripts (Google Gemini Flash TTS)

When asked to write the script (not when the user already supplied audio):
- Egyptian Arabic colloquial, short sentences, natural spoken rhythm, direct address.
- Provide: (a) a one-paragraph **voice description** (age, tone, pace, warmth, accent), (b) the script as numbered lines, each with a bracketed delivery tag such as `[calm]`, `[curious]`, `[emphatic]`, `[whisper]`, `[smiling]`, `[slower]`, (c) a pause hint between sections.
- Match length to the target duration (about 2.3 to 2.8 Arabic words per second in spoken delivery). Add tashkeel only on ambiguous words.
- Tell the user to feed the resulting audio back so the video is built to its exact timing.

## 8. Other video tasks (ffmpeg / Python)

- Probe: `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json file`.
- Burn subtitles: use ASS with an Arabic font (libass handles shaping if built with HarfBuzz; verify with a test frame) rather than raw SRT styling.
- Reframe to 9:16: crop or blurred-background fit; export with `-c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart`.
- Loudness: `-af loudnorm=I=-16:TP=-1.5:LRA=11`. Mix: `amix` with `volume` per input, or `sidechaincompress` to duck ambience under voice.
- Preview deliverables: `ffmpeg -ss T -i in -frames:v 1 frame.png` for stills, a 5 to 10 s mp4 clip for motion checks.
- Effects driven by JSON from an SRT (zoom-ins, shakes, flashes, sound hits at keyword times) are fine to build as a Python tool over ffmpeg when the user already has a rendered video.
- SRT utilities: parse, merge cues shorter than 0.8 s, split cues longer than 6 s at punctuation, shift by offset, export JSON for the Remotion data array.

## 9. Render pipeline notes

- Check `render.py` / `render.yaml` before naming anything: Composition id, entry file location, output name, fps, codec, whether it reads audio from `public/`.
- Local render: `npx remotion render <entry> <CompositionId> out.mp4 --codec=h264 --concurrency=50%`. Preview a window: `--frames=0-150`. A still: `npx remotion still <entry> <id> out.png --frame=120`.
- In GitHub Actions, long videos may exceed free-tier time; suggest rendering in chunks (`--frames` ranges) and concatenating with ffmpeg if a run times out.
- When the audio's real length differs from the constant in the file, the constant wins: tell the user which single number to change.

## 10. Quality checklist before delivering

- Every scene boundary lines up with an SRT cue start; no scene shorter than 1.5 s.
- No Arabic letter-spacing, no per-letter splitting, nothing clipped, text readable for at least its duration (about 0.35 s per word minimum on screen).
- Something is always moving; camera/parallax present in every scene; transitions varied.
- Captions inside safe zone; contrast ratio comfortable on the chosen background.
- Voice clearly above ambience and SFX; no SFX files missing from `public/sfx/` (list them in the reply).
- File compiles in principle: imports resolve, no unused undefined vars, Composition registered with the expected id.
- Reply is short: what was built, where files go, assumptions, one next step.
