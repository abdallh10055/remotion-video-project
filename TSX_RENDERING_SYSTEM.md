# Flexible TSX Rendering System

## Overview

نظام مرن يسمح بـ rendering أي ملف `.tsx` بدون الحاجة لـ hardcoded compositions.
يدعم passing props ديناميكياً وعمل custom React components مباشرة.

---

## 1. Architecture

### نموذج العمل:

```
User Input (TSX Code / File Path)
        ↓
Validate & Analyze
        ↓
Inject Remotion Hooks
        ↓
Compile TypeScript
        ↓
Bundle with Webpack/esbuild
        ↓
Pass to Remotion Renderer
        ↓
Render MP4/WebM
```

---

## 2. Core Features

### ✅ يدعم:
- ✅ أي React component
- ✅ Props ديناميكية (JSON)
- ✅ استيراد external libraries
- ✅ Remotion hooks (useCurrentFrame, useVideoConfig, etc.)
- ✅ Custom CSS-in-JS
- ✅ SVG و Canvas rendering
- ✅ Multiple compositions في نفس الملف

### ❌ لا يدعم:
- ❌ React hooks من خارج Remotion (useState, useEffect) في render-time
- ❌ Browser APIs (window, document, fetch في render-time)
- ❌ Dynamic imports (يجب أن تكون static)

---

## 3. Implementation Plan

### Phase 1: TSX Analyzer & Validator

```typescript
// packages/code-analyzer/analyzer.ts

export class TSXAnalyzer {
  // تحليل الملف والتحقق من:
  // 1. هل يستخدم Remotion hooks بشكل صحيح؟
  // 2. هل هناك exports معرّفة؟
  // 3. هل لديه prop interface؟
  
  analyze(code: string): AnalysisResult {
    // - تحديد الـ components المُصدرة
    // - فحص الـ imports
    // - التحقق من الـ hooks
    // - استخراج prop types
  }

  validate(analysis: AnalysisResult): ValidationError[] {
    // - التحقق من أن كل component يقبل props
    // - التحقق من عدم استخدام browser APIs
    // - التحقق من صحة الـ TypeScript
  }
}
```

### Phase 2: Dynamic Composition Wrapper

```typescript
// packages/video-engine/dynamic-composition.tsx

export const DynamicComposition: React.FC<DynamicCompositionProps> = ({
  Component,
  inputProps,
  config,
}) => {
  return <Component {...inputProps} />;
};
```

### Phase 3: Compilation & Bundling

```typescript
// packages/compiler/compiler.ts

export class TSXCompiler {
  async compile(code: string): Promise<CompiledModule> {
    // استخدام esbuild أو SWC
    // - Transpile TypeScript → JavaScript
    // - Bundle dependencies
    // - Create runnable module
  }
}
```

### Phase 4: Remotion Integration

```typescript
// packages/remotion-wrapper/index.tsx

export async function renderDynamicTSX(options: {
  code: string;           // TSX code أو file path
  componentName: string;  // أي component يتم render
  props: Record<string, any>; // Props للـ component
  config: VideoConfig;    // Duration, width, height, fps
}): Promise<string> {
  // 1. Analyze و Validate
  // 2. Compile
  // 3. Load module
  // 4. Create Remotion Composition
  // 5. Render to file
}
```

---

## 4. Usage Examples

### Example 1: Simple Text Animation

```typescript
// user-composition.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface MyComponentProps {
  text: string;
  color: string;
  duration: number;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  text,
  color,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        opacity,
      }}
    >
      <h1 style={{ color, fontSize: 60 }}>{text}</h1>
    </AbsoluteFill>
  );
};
```

#### CLI Usage:
```bash
video-studio render-tsx \
  --file user-composition.tsx \
  --component MyComponent \
  --props '{"text":"Hello","color":"#fff","duration":60}' \
  --duration 2 \
  --output output.mp4
```

#### API Usage:
```bash
curl -X POST http://localhost:3000/api/render/tsx \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import { ... } from `remotion`; export const MyComponent = ...",
    "componentName": "MyComponent",
    "props": {"text":"Hello","color":"#fff"},
    "config": {"width":1080,"height":1920,"fps":30,"duration":60}
  }'
```

---

### Example 2: With External Libraries

```typescript
// user-composition.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import gsap from 'gsap'; // ✅ يدعم external libs

export interface AnimatedBoxProps {
  count: number;
}

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({ count }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            backgroundColor: `hsl(${(i * 360) / count}, 100%, 50%)`,
            left: `${(frame % 100)}%`,
            top: `${(i * 100) / count}%`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
```

---

### Example 3: Custom SVG Component

```typescript
// user-composition.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface SVGAnimationProps {
  strokeWidth: number;
  color: string;
}

export const SVGAnimation: React.FC<SVGAnimationProps> = ({
  strokeWidth,
  color,
}) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 150], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <svg
        width={200}
        height={200}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <circle
          cx={100}
          cy={100}
          r={80}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## 5. CLI Commands

```bash
# Render من file
video-studio render-tsx --file my-component.tsx \
  --component ComponentName \
  --props '{"prop1":"value1"}' \
  --output video.mp4

# Render من inline code
video-studio render-tsx --code 'export const C = () => <div>Hello</div>' \
  --component C \
  --output video.mp4

# مع advanced options
video-studio render-tsx --file my-component.tsx \
  --component ComponentName \
  --props-file props.json \
  --width 1080 \
  --height 1920 \
  --fps 30 \
  --duration 60 \
  --codec h264 \
  --quality 95 \
  --output video.mp4
```

---

## 6. API Endpoints

```typescript
// POST /api/render/tsx
{
  "code": "string (TSX code or file URL)",
  "componentName": "string",
  "props": { [key: string]: any },
  "config": {
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "duration": 60,
    "durationInFrames": 1800
  },
  "quality": "high|medium|low",
  "codec": "h264|vp9",
  "output": "s3://bucket/path or local path"
}

// Response:
{
  "jobId": "uuid",
  "status": "queued",
  "estimatedTime": 120,
  "progressUrl": "/api/render/uuid/progress"
}
```

---

## 7. Advanced Features

### A. Multiple Exports Support

```typescript
// user-composition.tsx
export const Component1 = () => <div>First</div>;
export const Component2 = () => <div>Second</div>;
export const Component3 = () => <div>Third</div>;

// استخدام:
video-studio render-tsx --file user-composition.tsx \
  --component Component2  # يختار Component2 فقط
```

### B. Props Validation

```typescript
// packages/validator/props-validator.ts
import { z } from 'zod';

export class PropsValidator {
  // استخراج prop types من TypeScript interface
  // التحقق من الـ runtime values
  // Provide helpful error messages
}
```

### C. Hot Reload Preview

```bash
video-studio preview --file my-component.tsx \
  --props '{"text":"Hello"}' \
  --watch true
```

يراقب الملف وإعادة preview تلقائياً عند التعديل.

### D. Component Composition

```typescript
// main.tsx
import { MyComponent } from './my-component';
import { Background } from './background';

export const Combined: React.FC = () => (
  <div>
    <Background />
    <MyComponent text="Hello" color="#fff" />
  </div>
);
```

---

## 8. Security Considerations

### ✅ Safe:
- Remotion sandbox (يعمل في Node process)
- Props validation
- Code analysis قبل execution
- No browser APIs access

### ⚠️ Risks:
- User code يمكن أن يحتوي على infinite loops
- استهلاك memory عالي
- Network calls في component

### 🛡️ Mitigation:
```typescript
// packages/sandbox/sandbox.ts

export class CodeSandbox {
  // Timeout protection (أقصى وقت للـ render)
  // Memory limits
  // Resource quota
  // Network request blocking
  
  async execute(code: string, timeout = 300000) {
    // Execute في context معزول
  }
}
```

---

## 9. File Structure

```
packages/
├── code-analyzer/
│   ├── analyzer.ts
│   ├── validator.ts
│   └── types.ts
├── compiler/
│   ├── compiler.ts
│   ├── bundler.ts
│   └── transformer.ts
├── remotion-wrapper/
│   ├── dynamic-composition.tsx
│   ├── composition-factory.ts
│   └── renderer.ts
├── sandbox/
│   ├── sandbox.ts
│   └── sandbox-worker.ts
└── tsx-renderer/
    ├── index.ts
    ├── cli.ts
    └── api.ts
```

---

## 10. Integration with Video JSON Schema

```json
{
  "composition": {
    "type": "dynamic-tsx",
    "code": "export const MyComp = () => <div>Hello</div>",
    "componentName": "MyComp",
    "props": {
      "text": "Hello",
      "color": "#fff"
    }
  }
}
```

أو:

```json
{
  "composition": {
    "type": "tsx-file",
    "path": "compositions/my-component.tsx",
    "componentName": "MyComponent",
    "props": { ... }
  }
}
```

---

## 11. Example: Complete Workflow

### 1. Create component:
```bash
cat > my-video.tsx << 'EOF'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface VideoProps {
  title: string;
  subtitle: string;
  bgColor: string;
}

export const MyVideo: React.FC<VideoProps> = ({ title, subtitle, bgColor }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.8, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <h1 style={{ fontSize: 60, color: '#fff' }}>{title}</h1>
      <p style={{ fontSize: 30, color: '#ccc' }}>{subtitle}</p>
    </AbsoluteFill>
  );
};
EOF
```

### 2. Render:
```bash
video-studio render-tsx \
  --file my-video.tsx \
  --component MyVideo \
  --props '{
    "title":"Welcome",
    "subtitle":"To My Channel",
    "bgColor":"#0f4c3a"
  }' \
  --duration 3 \
  --output welcome.mp4
```

### 3. Output:
```
✅ Analyzing component...
✅ Validating props...
✅ Compiling TypeScript...
✅ Bundling dependencies...
✅ Starting render...
⏳ Rendering 33%
⏳ Rendering 66%
✅ Render complete: welcome.mp4 (45MB)
```

---

## 12. Database Integration

```sql
CREATE TABLE tsx_compositions (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects,
  name VARCHAR,
  code TEXT,
  file_path VARCHAR,
  component_name VARCHAR,
  props_schema JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE tsx_renders (
  id UUID PRIMARY KEY,
  composition_id UUID REFERENCES tsx_compositions,
  props_used JSONB,
  output_path VARCHAR,
  status VARCHAR,
  error_message TEXT,
  render_time_ms INT,
  file_size BIGINT,
  created_at TIMESTAMP
);
```

---

## 13. Next Steps

1. [ ] Implement TSXAnalyzer
2. [ ] Implement TSXCompiler
3. [ ] Create DynamicComposition wrapper
4. [ ] Add CLI commands
5. [ ] Add API endpoints
6. [ ] Add validation & security
7. [ ] Add tests
8. [ ] Integration with Video JSON schema
9. [ ] Web UI support
10. [ ] Documentation & examples

---

## 14. Benefits

✅ **مرونة عالية**: أي code React يمكن render
✅ **سهل الاستخدام**: لا حاجة لفهم Remotion deeply
✅ **Reusable components**: write once, use anywhere
✅ **Type-safe**: TypeScript support كامل
✅ **Dynamic**: تغيير الـ props بدون recompile
✅ **Scalable**: يعمل مع queue system

---

**Version**: 1.0
**Status**: Ready for Implementation
**Priority**: High (Core Feature)
