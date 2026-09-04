/**
 * Tamil Phonetic Transliteration & Search Helper Engine
 * Translates English typing -> Tamil search terms and produces phonetic aliases
 */

export const TAMIL_VOWELS: Record<string, string[]> = {
  'அ': ['a'],
  'ஆ': ['aa', 'a'],
  'இ': ['i', 'e'],
  'ஈ': ['ee', 'ii', 'i'],
  'உ': ['u', 'oo'],
  'ஊ': ['oo', 'uu', 'u'],
  'எ': ['e'],
  'ஏ': ['ae', 'ea', 'e', 'ye'],
  'ஐ': ['ai', 'ei'],
  'ஒ': ['o'],
  'ஓ': ['oa', 'oo', 'o'],
  'ஔ': ['au', 'ou']
};

export const TAMIL_CONSONANT_MAP: Record<string, string[]> = {
  // க series
  'க': ['ka', 'ga', 'ca', 'k', 'g', 'c'],
  'கா': ['kaa', 'gaa', 'ka', 'ga'],
  'கி': ['ki', 'gi'],
  'கீ': ['kee', 'kii', 'ki', 'gi'],
  'கு': ['ku', 'gu', 'cu', 'k'],
  'கூ': ['koo', 'kuu', 'ku', 'gu'],
  'கெ': ['ke', 'ge'],
  'கே': ['kae', 'gae', 'ke', 'ge'],
  'கை': ['kai', 'gai'],
  'கொ': ['ko', 'go'],
  'கோ': ['koa', 'koo', 'ko', 'go'],
  'கௌ': ['kau', 'kou'],
  'க்': ['k', 'g', 'c'],

  // ங series
  'ங': ['nga'],
  'ங்': ['ng', 'nk', 'n'],

  // ச series
  'ச': ['sa', 'cha', 'ca', 'sha', 's', 'ch', 'c'],
  'சா': ['saa', 'chaa', 'sa', 'cha', 'shaa'],
  'சி': ['si', 'chi', 'ci'],
  'சீ': ['see', 'chee', 'chii', 'si', 'chi'],
  'சு': ['su', 'chu', 'cu'],
  'சூ': ['soo', 'choo', 'su', 'chu'],
  'செ': ['se', 'che'],
  'சே': ['sae', 'chae', 'se', 'che'],
  'சை': ['sai', 'chai'],
  'சொ': ['so', 'cho'],
  'சோ': ['soa', 'choa', 'soo', 'choo', 'so', 'cho'],
  'ச்': ['s', 'ch', 'c'],

  // ஞ series
  'ஞ': ['nja', 'gna', 'ja'],
  'ஞ்': ['nj', 'gn', 'n'],

  // ட series
  'ட': ['ta', 'da', 't', 'd'],
  'டா': ['taa', 'daa', 'ta', 'da'],
  'டி': ['ti', 'di', 'tee', 'dee'],
  'டீ': ['tee', 'dee', 'ti', 'di'],
  'டு': ['tu', 'du', 'doo'],
  'டூ': ['too', 'doo', 'tu', 'du'],
  'டெ': ['te', 'de'],
  'டே': ['tae', 'dae', 'te', 'de'],
  'டை': ['tai', 'dai'],
  'டொ': ['to', 'do'],
  'டோ': ['toa', 'doa', 'to', 'do'],
  'ட்': ['t', 'd', 'th'],

  // ண series
  'ண': ['na', 'Na', 'n'],
  'ணா': ['naa', 'Naa'],
  'ணி': ['ni', 'nee'],
  'ணீ': ['nee', 'nii'],
  'ணு': ['nu'],
  'ணை': ['nai'],
  'ண்': ['n', 'nn'],

  // த series
  'த': ['tha', 'ta', 'da', 'th', 't', 'd'],
  'தா': ['thaa', 'taa', 'tha', 'ta'],
  'தி': ['thi', 'ti', 'di', 'thee', 'de'],
  'தீ': ['thee', 'thii', 'thi', 'ti', 'dee'],
  'து': ['thu', 'tu', 'du', 'dhu'],
  'தூ': ['thoo', 'tuu', 'thu'],
  'தெ': ['the', 'te', 'de'],
  'தே': ['thae', 'tae', 'the', 'te', 'dhe'],
  'தை': ['thai', 'tai'],
  'தொ': ['tho', 'to'],
  'தோ': ['thoa', 'toa', 'tho', 'to'],
  'த்': ['th', 't', 'd'],

  // ந series
  'ந': ['na', 'nah', 'n'],
  'நா': ['naa', 'na'],
  'நி': ['ni', 'nee'],
  'நீ': ['nee', 'nii', 'ni'],
  'நு': ['nu'],
  'நே': ['nae', 'ne'],
  'ந்': ['n'],

  // ப series
  'ப': ['pa', 'ba', 'fa', 'p', 'b'],
  'பா': ['paa', 'baa', 'pa', 'ba'],
  'பி': ['pi', 'bi', 'pee'],
  'பீ': ['pee', 'bee', 'pi', 'bi'],
  'பு': ['pu', 'bu', 'poo'],
  'பூ': ['poo', 'boo', 'pu', 'bu'],
  'பெ': ['pe', 'be'],
  'பே': ['pae', 'bae', 'pe', 'be'],
  'பை': ['pai', 'bai'],
  'பொ': ['po', 'bo'],
  'போ': ['poa', 'boa', 'poo', 'boo', 'po', 'bo'],
  'ப்': ['p', 'b'],

  // ம series
  'ம': ['ma', 'm'],
  'மா': ['maa', 'ma'],
  'மி': ['mi', 'mee'],
  'மீ': ['mee', 'mii', 'mi'],
  'மு': ['mu', 'moo'],
  'மூ': ['moo', 'muu', 'mu'],
  'மெ': ['me'],
  'மே': ['mae', 'me'],
  'மை': ['mai'],
  'மொ': ['mo'],
  'மோ': ['moa', 'moo', 'mo'],
  'ம்': ['m'],

  // ய series
  'ய': ['ya', 'y'],
  'யா': ['yaa', 'ya'],
  'யி': ['yi'],
  'யு': ['yu'],
  'ய்': ['y'],

  // ர series
  'ர': ['ra', 'r'],
  'ரா': ['raa', 'ra'],
  'ரி': ['ri', 'ree'],
  'ரீ': ['ree', 'rii', 'ri'],
  'ரு': ['ru', 'roo'],
  'ரூ': ['roo', 'ruu', 'ru'],
  'ரெ': ['re'],
  'ரே': ['rae', 're'],
  'ரை': ['rai'],
  'ரொ': ['ro'],
  'ரோ': ['roa', 'roo', 'ro'],
  'ர்': ['r'],

  // ல series
  'ல': ['la', 'l'],
  'லா': ['laa', 'la'],
  'லி': ['li', 'lee'],
  'லீ': ['lee', 'lii', 'li'],
  'லு': ['lu', 'loo'],
  'லூ': ['loo', 'lu'],
  'லெ': ['le'],
  'லே': ['lae', 'le'],
  'லை': ['lai'],
  'லொ': ['lo'],
  'லோ': ['loa', 'loo', 'lo'],
  'ல்': ['l'],

  // வ series
  'வ': ['va', 'wa', 'v', 'w'],
  'வா': ['vaa', 'waa', 'va', 'wa'],
  'வி': ['vi', 'wi', 'vee', 'wee'],
  'வீ': ['vee', 'wee', 'vi', 'wi'],
  'வு': ['vu', 'wu'],
  'வெ': ['ve', 'we'],
  'வே': ['vae', 'wae', 've', 'we'],
  'வை': ['vai', 'wai'],
  'வொ': ['vo', 'wo'],
  'வோ': ['voa', 'woa', 'vo', 'wo'],
  'வ்': ['v', 'w'],

  // ழ series
  'ழ': ['zha', 'za', 'la', 'zh', 'z', 'l'],
  'ழா': ['zhaa', 'zaa', 'laa'],
  'ழி': ['zhi', 'zi', 'li', 'zhee'],
  'ழீ': ['zhee', 'zee'],
  'ழு': ['zhu', 'zu', 'lu'],
  'ழூ': ['zhoo', 'zuu'],
  'ழை': ['zhai', 'zai', 'lai'],
  'ழ்': ['zh', 'z', 'l'],

  // ள series
  'ள': ['la', 'La', 'lla', 'l'],
  'ளா': ['laa', 'Laa', 'llaa'],
  'ளி': ['li', 'Li', 'lee', 'lli'],
  'ளீ': ['lee', 'lii', 'lli'],
  'ளு': ['lu', 'Lu', 'llu'],
  'ளை': ['lai', 'llai'],
  'ள்': ['l', 'L', 'll'],

  // ற series
  'ற': ['ra', 'tra', 'tta', 'r', 'tr'],
  'றா': ['raa', 'traa'],
  'றி': ['ri', 'tri', 'ree'],
  'றீ': ['ree', 'trii'],
  'று': ['ru', 'tru', 'ttu'],
  'றை': ['rai', 'trai'],
  'ற்': ['r', 't', 'tr', 'th'],

  // ன series
  'ன': ['na', 'n'],
  'னா': ['naa', 'na'],
  'னி': ['ni', 'nee'],
  'னீ': ['nee', 'nii'],
  'னு': ['nu'],
  'னை': ['nai'],
  'ன்': ['n'],

  // வடமொழி / Sanskrit grantha letters
  'ஸ': ['sa', 's'],
  'ஸி': ['si', 'see'],
  'ஸு': ['su'],
  'ஸ்': ['s'],
  'ஷ': ['sha', 'sh'],
  'ஷி': ['shi', 'shee'],
  'ஷு': ['shu'],
  'ஷ்': ['sh'],
  'ஹ': ['ha', 'h'],
  'ஹி': ['hi'],
  'ஹ்': ['h'],
  'ஜ': ['ja', 'j'],
  'ஜி': ['ji', 'jee'],
  'ஜ்': ['j'],
  'ஸ்ரீ': ['sri', 'shree', 'sree', 'shri']
};

/**
 * Splits Tamil text into proper Tamil grapheme units (Uyirmei letters together)
 */
export function segmentTamilLetters(text: string): string[] {
  const regex = /[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]?/g;
  const matches = text.match(regex);
  return matches || Array.from(text);
}

/**
 * Generate comprehensive transliterated search aliases and prefixes for a Tamil product name
 */
export function generateSearchTerms(nameTamil: string, customAliases: string[] = []): string[] {
  const primaryTerms: string[] = [];
  const secondaryTerms: string[] = [];

  // 1. Primary transliteration from Tamil name
  const words = nameTamil.trim().split(/\s+/);
  
  for (const word of words) {
    const letters = segmentTamilLetters(word);
    let currentPrefixes: string[] = [''];
    
    for (const letter of letters) {
      const translits = TAMIL_CONSONANT_MAP[letter] || TAMIL_VOWELS[letter] || [letter.toLowerCase()];
      const nextPrefixes: string[] = [];
      
      for (const prefix of currentPrefixes) {
        for (const t of translits.slice(0, 3)) {
          const combined = prefix + t;
          nextPrefixes.push(combined);
          primaryTerms.push(combined);
          
          for (let len = 1; len <= combined.length; len++) {
            primaryTerms.push(combined.slice(0, len));
          }
        }
      }
      currentPrefixes = nextPrefixes.slice(0, 6);
    }
  }

  // 2. Custom aliases (e.g. English common terms like 'camphor', 'rosewater')
  for (const alias of customAliases) {
    const clean = alias.toLowerCase().trim();
    if (clean) {
      secondaryTerms.push(clean);
      for (let i = 1; i <= clean.length; i++) {
        secondaryTerms.push(clean.slice(0, i));
      }
    }
  }

  // 3. Direct Tamil prefixes
  primaryTerms.push(nameTamil.trim().toLowerCase());
  for (let i = 1; i <= nameTamil.length; i++) {
    primaryTerms.push(nameTamil.slice(0, i).toLowerCase());
  }

  // Order with primary phonetic terms first, followed by secondary aliases
  const combinedSet = new Set([...primaryTerms, ...secondaryTerms]);
  return Array.from(combinedSet);
}
