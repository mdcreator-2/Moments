# Frontend UI Generation Prompts

*Use these prompts in [v0 by Vercel](https://v0.dev) or Claude 3.5 Sonnet to instantly generate React + Tailwind components for the Moments frontend. Instruct the AI to use React, TailwindCSS, Lucide-react for icons, and to output a single usable `.tsx` file.*

---

## 1. Landing & Input View (Home Page)

**Goal:** Clean, high-conversion entry point.

**Prompt:**
> Create a landing page component for an AI Web App called 'Moments'. Use a dark theme (slate-900 background) with a modern, glassmorphism aesthetic. 
> 
> Include:
> 1. A hero section with a bold, bright gradient text heading: 'Turn Long Videos into Viral Shorts.'
> 2. A subheadline explaining that AI finds the best moments and automatically crops and adds subtitles.
> 3. A large, prominent input field centered on the screen with the placeholder 'Paste YouTube URL here...'.
> 4. A primary call-to-action button next to or under the input saying 'Generate Clips' with a spark/magic icon (use Lucide-react).
> 5. Make the input area feel elevated, like a glass card.
> Ensure it is fully responsive and uses Tailwind CSS.

---

## 2. The Loading / Status Tracker (Processing Page)

**Goal:** Keep users engaged while the backend pipeline runs.

**Prompt:**
> Create a 'Processing Status' component for a dark mode dashboard. It should look like a vertical timeline or a sleek checklist of 4 steps showing the pipeline progress. 
> 
> The 4 steps are:
> 1. Downloading Video
> 2. Transcribing & Identifying Speakers
> 3. AI Analyzing for Viral Moments
> 4. Generating Clip Previews
> 
> Create prop-based states so I can pass in the `currentStep` (1 through 4). 
> - Steps before the current step should have a green checkmark icon.
> - The current step should have a pulsing blue or purple loading spinner and highlighted text.
> - Steps after the current step should be greyed out.
> Make it look modern, minimal, and centered on a dark slate background.

---

## 3. The Clip Card & Grid (Results Page)

**Goal:** Show the AI's findings and allow instant rendering.

**Prompt:**
> Create a 'Results Dashboard' component in React/Tailwind for a dark mode app. The layout should have a simple header ('Found 4 Viral Moments') and a responsive CSS Grid of 'Clip Cards' below it.
> 
> For the 'Clip Card' component, design a sleek, glass-styled card containing:
> 1. Top Section: A badge showing the time range (e.g., '01:24 - 02:15') and a circular 'Virality Score' indicator (e.g., '87/100', maybe color-coded green for high scores).
> 2. Middle Section: A bold, catchy title for the clip, followed by a lighter-colored paragraph text showing the AI's justification (e.g., 'Why it works: High energy intro with controversial hook').
> 3. Bottom Section: A full-width primary button saying 'Render Vertical Short' with a video icon.
> 
> Please also create two alternate states for the card's button:
> - A 'Rendering' state where the button is disabled and shows a loading spinner and 'Rendering...'.
> - A 'Completed' state where the button turns green and emits a success vibe, saying 'Download MP4'.
> Present this as a grid showing a few sample cards in different states.
