import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Ship's Hull",
    story: "Hi Oscar! I'm Bit, your robot buddy. We're stuck on this asteroid! We need to build a spaceship to fly home. First, we need a body for our ship. In code, we call this a box or a 'div'.",
    mission: "Create a <div> element to start the ship.",
    concept: "HTML Structure",
    initialCode: `<!-- Type your code below -->
`,
    solutionPattern: "<div",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 2,
    title: "Painting the Ship",
    story: "Great job, Oscar! We have a hull, but it's invisible! Let's paint it using 'style'. We need a cool color so aliens can see us.",
    mission: "Add a style to make the background 'orange' and give it a width and height of '200px'.",
    concept: "CSS Styles (background, width, height)",
    initialCode: `<div style="background-color: ; width: ; height: ;">
  <!-- The Ship -->
</div>`,
    solutionPattern: "background-color",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 3,
    title: "Captain's Chair",
    story: "The ship looks awesome! Now we need a place for you to sit. We need to put a chair INSIDE the ship.",
    mission: "Put a <div> inside your ship <div> for the chair. Give it a different color!",
    concept: "Nested Elements",
    initialCode: `<div style="background-color: orange; width: 300px; height: 300px; padding: 20px;">
  <!-- Put your chair code here -->

</div>`,
    solutionPattern: "<div.*<div",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 4,
    title: "Engine Alignment",
    story: "We have three engines, but they are all over the place! We need to use 'Flexbox' to line them up in a row so we fly straight.",
    mission: "Add 'display: flex' and 'gap: 10px' to the engine container.",
    concept: "Flexbox Basics",
    initialCode: `<div style="background-color: #333; padding: 20px; border-radius: 10px; ">
  <div style="width: 50px; height: 50px; background: cyan;">Left</div>
  <div style="width: 50px; height: 50px; background: cyan;">Center</div>
  <div style="width: 50px; height: 50px; background: cyan;">Right</div>
</div>`,
    solutionPattern: "display:\\s*flex",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }"
  },
  {
    id: 5,
    title: "The Text Display",
    story: "Communications are down! We need to send a message to Earth. Use a <p> tag (paragraph) to write your name.",
    mission: "Add a <p> tag that says 'Captain Oscar'.",
    concept: "Text Tags",
    initialCode: `<div style="background-color: white; color: black; padding: 20px; border-radius: 8px;">
  <h1>Transmission:</h1>
  
</div>`,
    solutionPattern: "<p>.*Oscar.*</p>",
    previewBaseStyles: "body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; }"
  }
];

export const GEMINI_SYSTEM_INSTRUCTION = `You are Bit, a friendly robot coding tutor for a 7-year-old boy named Oscar. 
Your goal is to check his HTML/CSS code. 
When checking code:
1. Be very encouraging and enthusiastic.
2. If the code is correct (matches the mission requirements visually and structurally), return success: true.
3. If the code is incorrect, give a gentle hint appropriate for a 7-year-old. Don't just give the answer, guide him.
4. Return the response strictly as JSON.
5. Keep feedback short (under 2 sentences).
`;