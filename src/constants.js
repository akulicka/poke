// Game configuration constants
export const GAME_CONFIG = {
  POKEMON_PAIRS: 8,
  MAX_POKEMON_ID: 1000,
  CARD_FLIP_DELAY: 1000,
  BACKGROUND_VOLUME: 0.3,
  DEFAULT_VOLUME: 0.5,
  MIN_VOLUME: 0,
  MAX_VOLUME: 1
};

// Region audio tracks
export const REGION_AUDIO = [
  'https://vgmtreasurechest.com/soundtracks/pokemon-red-green-blue-yellow/xxzioxya/30%20Route%203.mp3',
  'https://nu.vgmsite.com/soundtracks/pokemon-gold-silver-crystal/brkurymq/46.%20Route%2034.mp3',
  'https://nu.vgmsite.com/soundtracks/pokemon-emerald-enhanced-soundtrack/wsqgwhokia/1-56%20Route%20113.mp3',
  'https://jetta.vgmsite.com/soundtracks/pokemon-diamond-and-pearl-super-music-collection/dhchohph/1-78.%20Route%20228%20%28Day%29.mp3',
  'https://jetta.vgmsite.com/soundtracks/pokemon-black-and-white-2-super-music-collection/pnzkqwrq/1-40.%20Join%20Avenue.mp3',
  'https://jetta.vgmsite.com/soundtracks/pokemon-x-y/ghnzwfkz/1-33.%20Route%204.mp3',
  'https://vgmsite.com/soundtracks/pokemon-sun-moon-super-music-collection/kglvtfbm/3-12.%20Route%2010%20on%20Ula%27ula%20Island.mp3',
  'https://vgmsite.com/soundtracks/pokemon-sword-shield-ost/obacgvkt/05%20-%20Route%201.mp3',
  'https://nu.vgmsite.com/soundtracks/pok-mon-scarlet-pok-mon-violet-2022/tiqzniaipu/47.%20East%20Province%20%28Riding%29.mp3'
];

// Region background images
export const REGION_IMAGES = [
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-kanto-region.jpg', 
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-johto-region.jpg', 
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-Hoenn-region.jpg', 
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-sinnoh-region.jpg',
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-unova-region.jpg',
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-kalos-region.jpg',
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-alola-region.jpg',
  'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/05/pokemon-galar-region.jpg',
  'https://archives.bulbagarden.net/media/upload/f/fd/Paldea_artwork.png'
];

// Fallback regions if API fails
export const FALLBACK_REGIONS = [
  'all', 'kanto', 'johto', 'hoenn', 'sinnoh', 
  'unova', 'kalos', 'alola', 'galar', 'paldea'
];
