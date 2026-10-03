---
name: motion-graphics-remotion
description: Create and edit distinctive motion-graphics explainer videos in Remotion (React) from a voice-over, SRT and transcript. Use for any request to build, restyle, fix, time, or render a Remotion video, especially Arabic/RTL vertical videos. Covers art direction, scene planning, SRT sync, sound effects, verification, and GitHub Actions rendering.
---

# Motion Graphics with Remotion

Goal: produce a video that looks designed by a person with a point of view, not the average AI output (gradient background, fade-in cards, one font). Work in the order below. Do not skip steps 1, 3 and 7.

## 0. Inputs to collect
- Voice-over audio (`public/<name>.m4a`), `.srt` (timing), `.txt` (transcript).
- Format: default vertical 1080x1920, 30 fps. Horizontal: 1920x1080.
- Style wishes and what the user dislikes (store them; never ask twice).
- If the audio is missing you can still write code, but say clearly that you could not render or hear it.

## 1. Clean the transcript FIRST
ASR transcripts are wrong in predictable ways. Before any design:
- Remove tool watermarks (e.g. "Transcribed by TurboScribe") and duplicated lines.
- Fix obvious ASR errors from context. List the spots you are unsure about and show them to the user at the end.
- Religious/quoted text (Quran, hadith, poetry): write it verbatim in the correct orthography with tashkeel, cite sura:ayah, use ﷺ. Never paraphrase it and never guess; if unsure, flag it instead of inventing.
- Keep spoken dialect in captions only if the user wants it; otherwise light cleanup, same meaning.

## 2. Plan scenes from the SRT
- Group cues by topic shift into scenes of about 20-70 seconds. Name each: tag (small label), title (2-4 words), visual metaphor.
- One strong visual idea per scene, tied to the meaning (scale for "which is more important", day/moon split for day vs night, pillars that collapse for "demolishes Islam"). Avoid generic icons.
- Mark key moments inside the scene in seconds from the SRT (`marks: [[238.2,'الكتاب'], ...]`) and make visuals react exactly at those times.
- Keep everything in ONE data array (`SCENES` with `t0,t1,cues,marks`). To edit the video later you change data, not structure.

## 3. Art direction (decide before coding)
Write a 6-line brief and keep it in a `design.ts` or top-of-file constants:
- Style: pick ONE distinctive direction, e.g. manuscript paper, paper cut-out, blueprint, neo-brutalism, whiteboard, retro terminal, flat isometric, hand-drawn doodle, Swiss typography, duotone.
- Palette: 3-5 colors max, with hex codes. One accent for emphasis.
- Type: 1 display + 1 text font. Arabic: Amiri, Aref Ruqaa, Reem Kufi, Cairo, Tajawal, Noto Naskh Arabic.
- Motion language: spring/snappy vs slow/ceremonial. Max 4 entry variants cycled across scenes (rise, wipe, page-turn 3D, pop).
- Texture: paper grain, halftone, film grain, solid (hard) shadows instead of soft ones.
- BANNED unless the user asks: purple/blue gradients, identical rounded cards, fade-only transitions, same caption style for every cue, emoji as illustrations, stock-looking glassmorphism.
If the user gives no style: propose 3 very different directions in 3 lines each and wait, or choose the most distinctive and say why.

## 4. Remotion code rules
- Everything is a pure function of time: `const t = useCurrentFrame()/fps`. NEVER use CSS transitions/animations, `setTimeout`, `useEffect` animation, or `Math.random()` (use `random('seed')`).
- Use `interpolate(..., {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing})`, `spring({frame, fps, config})`, `Easing.out(Easing.cubic)`.
- Mount only the active scene (`t >= t0 && t < t1+0.4`) to keep renders fast.
- Audio: `<Audio src={staticFile('a.m4a')}/>`; effects via `<Sequence from layout="none"><Audio/></Sequence>`; ambience looped at volume 0.08-0.12; effects 0.3-0.8.
- Fonts: `@remotion/google-fonts/<Name>` with `loadFont('normal',{weights:[...],subsets:['arabic']})`. It must be in package.json. All `@remotion/*` packages must have the exact same version as `remotion`, pinned without `^`. Use `npx remotion add <pkg>` to install.
- Performance: avoid per-frame `feTurbulence` with changing seeds on large areas, big blur shadows, and thousands of DOM nodes. Prefer SVG paths, CSS gradients, `clipPath`, transforms. If render exceeds ~3 s/frame, simplify the heaviest layer.
- Layering: background (slow parallax, dust, rotating pattern) -> header -> hero visual -> captions -> progress bar. Add subtle camera drift (sin/cos of t) and a slow push-in per scene so no frame is static.
- Draw-on effects: SVG `pathLength={1}` with `strokeDasharray=1` and animated `strokeDashoffset`.
- Single-file compositions are fine for a first delivery; split into files only when it exceeds ~1500 lines.

## 5. Captions (the part most videos get wrong)
- Never show the whole sentence at once. Reveal word by word; estimate each word start by character length across the cue duration (use real word timestamps from Whisper if available).
- Use several caption designs and pick by meaning: plain scroll for narration, ribbon/tag for speakers, ornate frame + reference pill for Quran, quote bar for hadith, bold stamped box for key takeaways, ink underline for lists.
- Auto-size text by length (about 74px for <=28 chars down to ~40px for >120 chars). Max 3-4 lines. Keep inside safe zones: for Shorts/Reels leave ~250px at the bottom and ~120px on the right.
- Highlight the currently spoken word with the accent color.

## 6. Arabic / RTL rules
- `direction: 'rtl'`, `textAlign:'center'`; flex rows use `direction: rtl` so first item sits on the right.
- Split by words only, never by letters (breaks joining). No `letterSpacing` on Arabic.
- `lineHeight >= 1.5` when tashkeel is present. Use Arabic-Indic digits for ayah references.
- Check long words don't overflow: render stills of the longest cues.

## 7. Verify before delivering (mandatory)
1. `npx tsc --noEmit` passes.
2. Render 6-10 stills at key times, including the longest caption, an ayah, and the last frame: `npx remotion still A4Video --frame=900 out.png`. Look at them. Fix overflow, overlap, low contrast.
3. Confirm `durationInFrames = ceil(lastTime * fps)` matches audio length (use `ffprobe`).
4. Confirm all `staticFile` assets exist.
5. Only say "rendered" if you actually produced the mp4. If you cannot render in your environment, say so and give exact commands.

## 8. Render
- Local: `npx remotion render A4Video out/video.mp4 --codec=h264 --crf=18 --audio-codec=aac --concurrency=50%`
- Quick draft: add `--scale=0.5 --frames=0-600`.
- GitHub Actions: `actions/setup-node`, `npm ci` (commit `package-lock.json` together with `package.json`), `npx remotion render ...`, upload `out/*.mp4` with `actions/upload-artifact`. A "Module not found" error means the package is missing from package.json.
- Platform tips: YouTube/Shorts need H.264 + AAC, yuv420p; keep under the platform length limit.

## 9. Sound design
- Synthesize if no library: filtered noise whoosh (0.7 s), page turn, stamp = low sine drop + noise click, soft bell for ayahs, pop for dialog lines. Place one effect per meaningful event (scene entry, stamp, key caption), not per word.
- Ambience low under the voice (0.08-0.12). Never mask the narrator. Respect the user's tone (religious lectures: no cartoon sounds, calm and short effects).

## 10. How to beat a first draft (aim higher than a single pass)
After the first working version, do one improvement pass:
- Replace generic shapes with a custom SVG illustration per scene.
- Add audio-reactive motion (pre-compute amplitude with ffmpeg/`@remotion/media-utils` `visualizeAudio`) for a subtle pulse on a hero element.
- Use true word timestamps (Whisper `--word_timestamps True`) for caption sync.
- Add shared-element transitions between scenes (an element from the previous scene morphs into the next title) instead of plain cuts.
- Add chapter markers/lower thirds and a first-3-second hook frame; export a thumbnail still.
- Run a self-critique: list 5 weakest frames from stills, fix them, re-render.

## 11. Editing an existing video
- Read the current file and the user's complaint; change the smallest thing (data first).
- Preserve design tokens and timings unless asked. State exactly what changed.
- To re-render only a part: `--frames=START-END`.
- Keep a short changelog in your reply; do not rewrite files the user did not mention.

## 12. Final reply format
Short: what was built, files, exact run commands, and a list of uncertain transcript spots to verify. No long explanations.
