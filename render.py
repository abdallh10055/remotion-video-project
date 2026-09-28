import os
import re
import sys
import json
import shutil
import subprocess
import datetime

# ============ إعدادات ============
PROJECT = "."  # مسار المشروع الحالي في سيرفر جيثب
OUTPUT_DIR = "out"
# =================================

def sh(cmd, cwd=None, check=True):
    print(f"\n$ {cmd}")
    p = subprocess.Popen(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT, text=True, bufsize=1)
    for line in p.stdout:
        print(line, end="")
    p.wait()
    if check and p.returncode != 0:
        raise RuntimeError(f"❌ فشل الأمر: {cmd}")
    return p.returncode

print("🚀 بدء عملية التصيير الآلي عبر GitHub Actions...")

# ---------- 1) البحث عن ملف الكود الأساسي في المشروع ----------
src_dir = os.path.join(PROJECT, "src")
if not os.path.exists(src_dir):
    raise SystemExit(f"❌ مجلد src غير موجود في المسار: {src_dir}")

# البحث عن أي ملف تسامي (tsx/ts/jsx/js) داخل src
code_files = [f for f in os.listdir(src_dir) if f.endswith(('.tsx', '.ts', '.jsx', '.js'))]
if not code_files:
    raise SystemExit("❌ لم يتم العثور على أي ملف كود داخل مجلد src.")

fname = code_files[0]  # نأخذ أول ملف يتم إيجاده
file_path = os.path.join(src_dir, fname)

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

print(f"✅ تم العثور على الملف: {fname} ({len(code)} حرف)")

# ---------- 2) تحديد نوع الملف ----------
has_register = "registerRoot" in code
has_comp = "<Composition" in code
mode = "entry" if has_register else ("root" if has_comp else "wrap")
print(f"🔎 النمط المكتشف: {mode}")

comp_id, fps, width, height, duration = "AqlanaLesson", 30, 1920, 1080, 150

# في حال النمط يحتاج إعدادات افتراضية أثناء التشغيل الآلي
if mode == "entry":
    pass
elif mode == "root":
    pass
else:
    # إعدادات افتراضية للفيديو في وضع الـ Wrap الآلي
    duration = 5 * fps

# ---------- 3) تجهيز مجلد المخرجات ----------
os.makedirs(os.path.join(PROJECT, OUTPUT_DIR), exist_ok=True)

# التأكد من وجود package.json و tsconfig.json
if not os.path.exists(os.path.join(PROJECT, "package.json")):
    with open(os.path.join(PROJECT, "package.json"), "w") as f:
        json.dump({"name": "remotion-github-action", "version": "1.0.0", "private": True}, f)

if not os.path.exists(os.path.join(PROJECT, "tsconfig.json")):
    with open(os.path.join(PROJECT, "tsconfig.json"), "w") as f:
        json.dump({"compilerOptions": {"target": "ES2020", "module": "ESNext", "moduleResolution": "bundler",
                   "jsx": "react-jsx", "strict": False, "skipLibCheck": True, "esModuleInterop": True}}, f)

print("\n📦 تثبيت تبعيات Remotion...")
sh("npm install --save-exact remotion @remotion/cli react react-dom typescript @types/react @types/react-dom",
   cwd=PROJECT)

# ---------- 4) تثبيت أي مكتبات إضافية يستخدمها الكود ----------
try:
    rver = json.load(open(os.path.join(PROJECT, "node_modules/remotion/package.json")))["version"]
    pkgs = set()
    for spec in re.findall(r'''(?:from|import)\s*\(?\s*["']([^'"./][^'"/]*)["']''', code):
        parts = spec.split("/")
        pkg = "/".join(parts[:2]) if spec.startswith("@") else parts[0]
        if pkg not in ("react", "react-dom", "remotion"):
            pkgs.add(pkg)
    if pkgs:
        args = " ".join(f"{p}@{rver}" if p.startswith("@remotion/") else p for p in sorted(pkgs))
        print(f"\n📦 مكتبات إضافية مكتشفة: {sorted(pkgs)}")
        sh(f"npm install --save-exact {args}", cwd=PROJECT, check=False)
except Exception as e:
    print(f"⚠️ تنبيه أثناء فحص المكتبات الإضافية: {e}")

# ---------- 5) التصيير ----------
print(f"\n🎥 بدء تصيير الفيديو الآلي (Composition: {comp_id})...")
sh(f"npx remotion render src/{fname} {comp_id} out/video.mp4 --concurrency=2", cwd=PROJECT)

print("\n✅ تم تصيير الفيديو بنجاح وأصبح جاهزاً في مجلد out/video.mp4!")
