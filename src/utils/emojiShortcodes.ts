// Import custom emoji images
import sadcatImg from "../assets/emojis/sadcat.jpg";
import thumbsupCryingCatImg from "../assets/emojis/thumbsup_crying_cat.jpg";

// Type definitions for emoji system
export type ImageEmoji = {
  type: "image";
  src: string;
  alt: string;
};

export type TextEmoji = {
  type: "text";
  value: string;
};

export type EmojiValue = string | ImageEmoji;

export const emojiShortcodes: Record<string, EmojiValue> = {
  // Custom Image Emojis
  sadcat: { type: "image", src: sadcatImg, alt: "sad cat" },
  sadcatthumbsup: {
    type: "image",
    src: thumbsupCryingCatImg,
    alt: "crying cat thumbs up",
  },

  // Greetings & Common
  hello: "👋",
  hi: "👋",
  wave: "👋",
  bye: "👋",

  // Emotions - Happy
  smile: "😊",
  happy: "😊",
  grin: "😁",
  laugh: "😂",
  joy: "😂",
  lol: "😂",
  rofl: "🤣",
  love: "😍",
  heart: "❤️",
  hearts: "💕",
  kiss: "😘",
  wink: "😉",
  blush: "😊",
  hug: "🤗",
  star: "🤩",

  // Emotions - Sad/Negative
  sad: "😢",
  cry: "😭",
  tears: "😭",
  angry: "😠",
  mad: "😡",
  rage: "😡",
  worried: "😟",
  fear: "😨",
  scared: "😱",
  shock: "😱",
  tired: "😴",
  sleep: "😴",
  sick: "🤢",

  // Emotions - Neutral/Other
  thinking: "🤔",
  think: "🤔",
  hmm: "🤔",
  cool: "😎",
  sunglasses: "😎",
  nerd: "🤓",
  party: "🥳",
  celebrate: "🥳",
  confused: "😕",
  surprised: "😮",
  wow: "😮",

  // Gestures
  thumbsup: "👍",
  thumbup: "👍",
  like: "👍",
  thumbsdown: "👎",
  thumbdown: "👎",
  dislike: "👎",
  ok: "👌",
  okay: "👌",
  clap: "👏",
  applause: "👏",
  pray: "🙏",
  thanks: "🙏",
  please: "🙏",
  muscle: "💪",
  strong: "💪",
  flex: "💪",
  point: "👉",
  victory: "✌️",
  peace: "✌️",
  fist: "✊",
  punch: "👊",

  // Animals
  dog: "🐶",
  cat: "🐱",
  mouse: "🐭",
  rabbit: "🐰",
  bunny: "🐰",
  fox: "🦊",
  bear: "🐻",
  panda: "🐼",
  lion: "🦁",
  tiger: "🐯",
  cow: "🐮",
  pig: "🐷",
  frog: "🐸",
  monkey: "🐵",
  chicken: "🐔",
  bird: "🐦",
  penguin: "🐧",
  duck: "🦆",
  eagle: "🦅",
  owl: "🦉",
  bat: "🦇",
  wolf: "🐺",
  horse: "🐴",
  unicorn: "🦄",
  bee: "🐝",
  bug: "🐛",
  butterfly: "🦋",
  snail: "🐌",
  snake: "🐍",
  turtle: "🐢",
  fish: "🐟",
  octopus: "🐙",

  // Food & Drink
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  lemon: "🍋",
  watermelon: "🍉",
  grapes: "🍇",
  strawberry: "🍓",
  peach: "🍑",
  pineapple: "🍍",
  coconut: "🥥",
  tomato: "🍅",
  avocado: "🥑",
  corn: "🌽",
  carrot: "🥕",
  bread: "🍞",
  cheese: "🧀",
  egg: "🥚",
  bacon: "🥓",
  burger: "🍔",
  fries: "🍟",
  pizza: "🍕",
  hotdog: "🌭",
  taco: "🌮",
  burrito: "🌯",
  sushi: "🍣",
  cake: "🍰",
  cookie: "🍪",
  chocolate: "🍫",
  candy: "🍬",
  icecream: "🍦",
  coffee: "☕",
  tea: "🍵",
  beer: "🍺",
  wine: "🍷",
  cocktail: "🍹",

  // Activities & Sports
  soccer: "⚽",
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  tennis: "🎾",
  volleyball: "🏐",
  golf: "⛳",
  bike: "🚴",
  bicycle: "🚲",
  run: "🏃",
  swim: "🏊",
  gym: "🏋️",
  yoga: "🧘",
  dance: "💃",
  music: "🎵",
  guitar: "🎸",
  game: "🎮",
  dice: "🎲",
  trophy: "🏆",
  medal: "🏅",
  win: "🏆",

  // Travel & Places
  car: "🚗",
  taxi: "🚕",
  bus: "🚌",
  train: "🚆",
  plane: "✈️",
  rocket: "🚀",
  ship: "🚢",
  boat: "⛵",
  home: "🏠",
  house: "🏠",
  office: "🏢",
  school: "🏫",
  hospital: "🏥",
  hotel: "🏨",
  beach: "🏖️",
  mountain: "⛰️",
  camping: "🏕️",
  tent: "⛺",

  // Objects & Tech
  phone: "📱",
  computer: "💻",
  laptop: "💻",
  keyboard: "⌨️",
  computermouse: "🖱️",
  camera: "📷",
  video: "📹",
  tv: "📺",
  radio: "📻",
  watch: "⌚",
  clock: "🕐",
  alarm: "⏰",
  battery: "🔋",
  light: "💡",
  bulb: "💡",
  book: "📖",
  pen: "✒️",
  pencil: "✏️",
  mail: "✉️",
  email: "📧",
  gift: "🎁",
  present: "🎁",
  balloon: "🎈",
  money: "💰",
  dollar: "💵",
  credit: "💳",
  key: "🔑",
  lock: "🔒",
  unlock: "🔓",

  // Weather & Nature
  sun: "☀️",
  sunny: "☀️",
  moon: "🌙",
  cloud: "☁️",
  rain: "🌧️",
  rainy: "🌧️",
  snow: "❄️",
  snowy: "❄️",
  thunder: "⚡",
  lightning: "⚡",
  fire: "🔥",
  hot: "🔥",
  water: "💧",
  ocean: "🌊",
  tree: "🌲",
  flower: "🌸",
  rose: "🌹",
  plant: "🌱",
  leaf: "🍃",

  // Symbols
  check: "✅",
  yes: "✅",
  x: "❌",
  no: "❌",
  warning: "⚠️",
  alert: "⚠️",
  question: "❓",
  exclamation: "❗",
  info: "ℹ️",
  plus: "➕",
  minus: "➖",
  arrow: "➡️",
  up: "⬆️",
  down: "⬇️",
  left: "⬅️",
  right: "➡️",
  recycle: "♻️",
  infinity: "♾️",
  copyright: "©️",
  tm: "™️",

  // Numbers
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
  six: "6️⃣",
  seven: "7️⃣",
  eight: "8️⃣",
  nine: "9️⃣",
  ten: "🔟",
  hundred: "💯",
};

// Helper function to check if an emoji is an image emoji
export const isImageEmoji = (emoji: EmojiValue): emoji is ImageEmoji => {
  return typeof emoji === "object" && emoji.type === "image";
};

// Helper function to get display value for autocomplete
export const getEmojiDisplay = (emoji: EmojiValue): string | ImageEmoji => {
  if (isImageEmoji(emoji)) {
    return emoji;
  }
  return emoji;
};

// Search emojis by keyword
export const searchEmojisByKeyword = (
  keyword: string
): Array<{ shortcode: string; emoji: EmojiValue }> => {
  const lowerKeyword = keyword.toLowerCase();
  const results: Array<{ shortcode: string; emoji: EmojiValue }> = [];

  for (const [shortcode, emoji] of Object.entries(emojiShortcodes)) {
    if (shortcode.includes(lowerKeyword)) {
      results.push({ shortcode, emoji });
    }
  }

  return results.slice(0, 10); // Limit to 10 suggestions
};
