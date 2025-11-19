import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Box",
    story: "Hi Oscar! I am Bit. We need to build a spaceship. A spaceship starts as a box. In code, a box is called a 'div'.",
    mission: "Type exactly this code to make a box:",
    concept: "Making a Box",
    initialCode: ``,
    guideSnippet: "<div></div>",
    solutionPattern: "<div",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 2,
    title: "Red Paint",
    story: "Good job! But the box is invisible. Let's paint it RED so we can see it.",
    mission: "Change your code to look like this:",
    concept: "Colors",
    initialCode: `<div></div>`,
    guideSnippet: `<div style="background: red;"></div>`,
    solutionPattern: "background:\\s*red",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 3,
    title: "Big Ship",
    story: "The ship is too small! We need to make it BIG. We use 'padding' to make things big.",
    mission: "Add padding like this:",
    concept: "Size",
    initialCode: `<div style="background: red;"></div>`,
    guideSnippet: `<div style="background: red; padding: 50px;"></div>`,
    solutionPattern: "padding:\\s*50px",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 4,
    title: "Blue Window",
    story: "We need a window to see the stars. The window goes INSIDE the ship.",
    mission: "Put a blue box inside your red box.",
    concept: "Inside / Outside",
    initialCode: `<div style="background: red; padding: 50px;">
  <!-- Window goes here -->
</div>`,
    guideSnippet: `<div style="background: blue;"></div>`,
    solutionPattern: "<div.*<div",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 5,
    title: "Captain Oscar",
    story: "Who is flying the ship? You are! Let's write your name on the screen.",
    mission: "Use the 'p' tag to write your name.",
    concept: "Writing Text",
    initialCode: `<div style="background: red; padding: 50px;">
  <div style="background: blue;"></div>
  
</div>`,
    guideSnippet: `<p>Captain Oscar</p>`,
    solutionPattern: "<p>.*Oscar.*</p>",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; font-size: 24px; color: white; }"
  }
];

export const GEMINI_SYSTEM_INSTRUCTION = `You are Bit, a robot helper for a 7-year-old named Oscar.
He is just learning to read and type.
When you check his code:
1. Be super happy and simple.
2. If he makes a mistake, tell him exactly which letter or symbol is missing.
3. Keep sentences tiny. Example: "You missed a < symbol!"
4. Return JSON.
`;