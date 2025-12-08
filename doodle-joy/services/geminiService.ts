/**
 * Local Data for Dudel Draw
 * Replaces external AI calls with local randomization logic.
 */

const PROMPTS = [
  "Turn this blob into a grumpy cat.",
  "Make this shape into a futuristic building.",
  "Find a face hidden in the curves.",
  "Turn this shape into a delicious fruit.",
  "Draw a monster wearing a fancy hat.",
  "Transform this into a fast vehicle.",
  "Make this shape part of a landscape.",
  "Turn the blob into a musical instrument.",
  "Draw an animal sleeping on this shape.",
  "Make this into a cloud character.",
  "Turn this into a piece of furniture.",
  "Draw a robot using this shape as a body.",
  "Make it into a splashing liquid.",
  "Find a hidden letter or number.",
  "Turn this into a magical potion bottle."
];

const ADJECTIVES = [
  "Wobbly", "Abstract", "Neon", "Goofy", "Mysterious", 
  "Silent", "Loud", "Happy", "Crazy", "Geometric",
  "Bouncing", "Floating", "Sunny", "Dark", "Funny"
];

const NOUNS = [
  "Cat", "Sunset", "Machine", "Dream", "Thought", 
  "Doodle", "Shape", "Friend", "Pizza", "Invention",
  "Monster", "Rocket", "Plant", "Ghost", "Fish"
];

const COMPLIMENTS = [
  "This is so creative!",
  "I love the colors!",
  "What a unique perspective!",
  "Keep up the great work!",
  "That's a fun interpretation!",
  "Wonderful imagination!",
  "Very artistic!",
  "I see what you did there!",
  "Super cool!",
  "A true masterpiece!"
];

/**
 * Generates a creative prompt locally.
 */
export const generateCreativePrompt = async (): Promise<string> => {
  // Simulate a very short delay for UX feel, but logic is local
  await new Promise(resolve => setTimeout(resolve, 300));
  const randomIndex = Math.floor(Math.random() * PROMPTS.length);
  return PROMPTS[randomIndex];
};

/**
 * Generates a local title/compliment based on random selection.
 * No image analysis is performed locally.
 */
export const analyzeDrawing = async (base64Image: string): Promise<{title: string, comment: string}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const comment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

  return {
    title: `${adj} ${noun}`,
    comment: comment
  };
};