import { Product } from '../types';
import { generateSearchTerms } from '../utils/transliteration';

interface RawProduct {
  id: string;
  nameTamil: string;
  price: number;
  unit: Product['unit'];
  aliases: string[];
}

const rawList: RawProduct[] = [
  {
    id: 'p1',
    nameTamil: 'குங்குமம்',
    price: 20,
    unit: 'பாக்கெட்',
    aliases: ['kungumam', 'kumkum', 'kumkumam', 'kunkumam', 'kungum', 'kunkum', 'red powder']
  },
  {
    id: 'p2',
    nameTamil: 'குடம்',
    price: 150,
    unit: 'பீஸ்',
    aliases: ['kudam', 'gudam', 'brass pot', 'chembu', 'pot']
  },
  {
    id: 'p3',
    nameTamil: 'கற்பூரம்',
    price: 50,
    unit: 'பாக்கெட்',
    aliases: ['karpuram', 'karpooram', 'camphor', 'karpoora thillai', 'soodam']
  },
  {
    id: 'p4',
    nameTamil: 'குத்துவிளக்கு',
    price: 350,
    unit: 'பீஸ்',
    aliases: ['kuthuvilakku', 'kuthu vilakku', 'vilakku', 'kuthu', 'brass lamp', 'deepam']
  },
  {
    id: 'p5',
    nameTamil: 'மஞ்சள்',
    price: 30,
    unit: 'பாக்கெட்',
    aliases: ['manjal', 'man', 'manj', 'manchal', 'turmeric', 'viral manjal', 'manjal kizhangu']
  },
  {
    id: 'p6',
    nameTamil: 'மஞ்சள் பொடி',
    price: 25,
    unit: 'பாக்கெட்',
    aliases: ['manjal podi', 'manjalpodi', 'turmeric powder', 'manchal podi']
  },
  {
    id: 'p7',
    nameTamil: 'சாம்பிராணி',
    price: 40,
    unit: 'பாக்கெட்',
    aliases: ['sambrani', 'saambrani', 'samprani', 'dhoop', 'sambrani cup']
  },
  {
    id: 'p8',
    nameTamil: 'ஊதுபத்தி',
    price: 35,
    unit: 'பாக்கெட்',
    aliases: ['oothubathi', 'oothupathi', 'oothubatti', 'agarbathi', 'agarbatti', 'incense']
  },
  {
    id: 'p9',
    nameTamil: 'சந்தனம்',
    price: 30,
    unit: 'பீஸ்',
    aliases: ['santhanam', 'chandanam', 'sandanam', 'chandan', 'sandalwood']
  },
  {
    id: 'p10',
    nameTamil: 'விபூதி',
    price: 20,
    unit: 'பாக்கெட்',
    aliases: ['viboothi', 'vibhuthi', 'vibuthi', 'bhasmam', 'sacred ash']
  },
  {
    id: 'p11',
    nameTamil: 'தீப எண்ணெய்',
    price: 120,
    unit: 'லிட்டர்',
    aliases: ['deepa ennai', 'deepaennai', 'theeba ennai', 'lamp oil', 'pooja oil', 'ennai', 'oil']
  },
  {
    id: 'p12',
    nameTamil: 'திரி',
    price: 15,
    unit: 'பாக்கெட்',
    aliases: ['thiri', 'tiri', 'cotton wick', 'vilakku thiri', 'panchu thiri']
  },
  {
    id: 'p13',
    nameTamil: 'பன்னீர்',
    price: 45,
    unit: 'பீஸ்',
    aliases: ['panneer', 'paneer', 'rose water', 'rosewater', 'panneer bottle']
  },
  {
    id: 'p14',
    nameTamil: 'அட்சதை',
    price: 20,
    unit: 'பாக்கெட்',
    aliases: ['atchadhai', 'akshata', 'akshathai', 'atchathai', 'pooja rice']
  },
  {
    id: 'p15',
    nameTamil: 'ஏலக்காய்',
    price: 50,
    unit: 'கிராம்',
    aliases: ['elakkai', 'yelakkai', 'elachi', 'cardamom', 'elam']
  },
  {
    id: 'p16',
    nameTamil: 'கிராம்பு',
    price: 40,
    unit: 'கிராம்',
    aliases: ['kirambu', 'grambu', 'clove', 'lavangam']
  },
  {
    id: 'p17',
    nameTamil: 'கற்பூர தட்டு',
    price: 90,
    unit: 'பீஸ்',
    aliases: ['karpura thattu', 'sooda thattu', 'camphor plate', 'thattu', 'aarathi thattu']
  },
  {
    id: 'p18',
    nameTamil: 'மணி',
    price: 180,
    unit: 'பீஸ்',
    aliases: ['mani', 'pooja mani', 'bell', 'pooja bell', 'brass bell']
  },
  {
    id: 'p19',
    nameTamil: 'பஞ்சபாத்திரம்',
    price: 220,
    unit: 'பீஸ்',
    aliases: ['panchapaathiram', 'pancha pathiram', 'panchapatram', 'brass cup with spoon']
  },
  {
    id: 'p20',
    nameTamil: 'குரு மாலை',
    price: 80,
    unit: 'பீஸ்',
    aliases: ['guru maalai', 'gurumaalai', 'guru malai', 'rudraksha maalai', 'tulsi maalai', 'maalai']
  },
  {
    id: 'p21',
    nameTamil: 'வெற்றிலை பாக்கு',
    price: 25,
    unit: 'பாக்கெட்',
    aliases: ['vetrilai paaku', 'vettrilai', 'paaku', 'betel leaves', 'pakku']
  },
  {
    id: 'p22',
    nameTamil: 'நவதானியம்',
    price: 60,
    unit: 'பாக்கெட்',
    aliases: ['navadhanyam', 'navadhaniyam', '9 grains', 'navathaniyam']
  },
  {
    id: 'p23',
    nameTamil: 'தேங்காய்',
    price: 35,
    unit: 'பீஸ்',
    aliases: ['thengai', 'thenkai', 'coconut', 'pooja thengai']
  },
  {
    id: 'p24',
    nameTamil: 'அகல் விளக்கு',
    price: 10,
    unit: 'பீஸ்',
    aliases: ['agal vilakku', 'agal', 'clay lamp', 'mann vilakku', 'karthigai deepam']
  },
  {
    id: 'p25',
    nameTamil: 'பசு நெய்',
    price: 140,
    unit: 'பாக்கெட்',
    aliases: ['pasu nei', 'ghee', 'cow ghee', 'pooja ghee', 'nei']
  }
];

export const DEFAULT_PRODUCTS: Product[] = rawList.map(item => ({
  id: item.id,
  nameTamil: item.nameTamil,
  price: item.price,
  unit: item.unit,
  searchTerms: generateSearchTerms(item.nameTamil, item.aliases),
  createdAt: Date.now()
}));
