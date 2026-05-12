// ============================================================
//  沉香基因 · 数据库
// ============================================================

// ---------- 问卷题目 ----------
const QUESTIONS = [
  {
    id: 'mood',
    step: '第一题 · 情绪感知',
    title: '此刻，你的内心状态更像哪首歌？',
    subtitle: '选一个最接近你当下感受的',
    type: 'single',
    layout: 'cols-1',
    options: [
      {
        id: 'relax',
        emoji: '🌅',
        label: '《彩虹》——有点疲惫，渴望温暖与慰藉',
        desc: '需要放松、被治愈的感觉',
        vector: { sweet: 0.9, woody: 0.6, cool: 0.1, milk: 0.8, spicy: 0.1, fruity: 0.3 }
      },
      {
        id: 'focus',
        emoji: '☀️',
        label: '《晴天》——清爽愉快，充满能量与专注',
        desc: '需要清醒、高效工作的状态',
        vector: { sweet: 0.3, woody: 0.7, cool: 0.8, milk: 0.2, spicy: 0.6, fruity: 0.5 }
      },
      {
        id: 'meditate',
        emoji: '🌙',
        label: '《夜曲》——内敛沉静，享受独处与冥想',
        desc: '需要安静、深度思考的时刻',
        vector: { sweet: 0.4, woody: 0.9, cool: 0.2, milk: 0.5, spicy: 0.3, fruity: 0.1 }
      },
      {
        id: 'social',
        emoji: '🎉',
        label: '《稻香》——自然朴实，享受当下的简单快乐',
        desc: '轻松愉悦，喜欢分享与陪伴',
        vector: { sweet: 0.7, woody: 0.5, cool: 0.4, milk: 0.4, spicy: 0.2, fruity: 0.8 }
      }
    ]
  },
  {
    id: 'color',
    step: '第二题 · 颜色联觉',
    title: '哪种颜色最能打动你的心？',
    subtitle: '颜色偏好映射你的嗅觉基因',
    type: 'single',
    layout: 'cols-2',
    optionType: 'color',
    options: [
      {
        id: 'deep_ocean',
        emoji: '',
        color: 'linear-gradient(135deg, #1a3a5c, #2d6a8a)',
        label: '深海蓝',
        desc: '沉稳、内敛、深邃',
        vector: { sweet: 0.3, woody: 0.9, cool: 0.5, milk: 0.4, spicy: 0.4, fruity: 0.1 }
      },
      {
        id: 'warm_amber',
        emoji: '',
        color: 'linear-gradient(135deg, #C9963A, #E8B96A)',
        label: '琥珀金',
        desc: '温暖、富足、甘甜',
        vector: { sweet: 0.9, woody: 0.6, cool: 0.1, milk: 0.8, spicy: 0.2, fruity: 0.4 }
      },
      {
        id: 'forest_green',
        emoji: '',
        color: 'linear-gradient(135deg, #2d5a3d, #6DA87A)',
        label: '深林绿',
        desc: '自然、清新、生命力',
        vector: { sweet: 0.4, woody: 0.8, cool: 0.7, milk: 0.2, spicy: 0.5, fruity: 0.6 }
      },
      {
        id: 'misty_purple',
        emoji: '',
        color: 'linear-gradient(135deg, #6b5b8e, #b09cc8)',
        label: '云雾紫',
        desc: '神秘、浪漫、空灵',
        vector: { sweet: 0.6, woody: 0.7, cool: 0.6, milk: 0.7, spicy: 0.1, fruity: 0.3 }
      },
      {
        id: 'ivory_cream',
        emoji: '',
        color: 'linear-gradient(135deg, #f0e6d0, #faf3e8)',
        label: '象牙白',
        desc: '纯净、雅致、温柔',
        vector: { sweet: 0.7, woody: 0.5, cool: 0.3, milk: 0.9, spicy: 0.1, fruity: 0.5 }
      },
      {
        id: 'ink_black',
        emoji: '',
        color: 'linear-gradient(135deg, #1a0e06, #3d2010)',
        label: '墨沉黑',
        desc: '极致、稀有、收藏级',
        vector: { sweet: 0.2, woody: 1.0, cool: 0.2, milk: 0.3, spicy: 0.6, fruity: 0.0 }
      }
    ]
  },
  {
    id: 'scene',
    step: '第三题 · 使用场景',
    title: '你最想在哪个场景用香？',
    subtitle: '可以选择最主要的一种',
    type: 'single',
    layout: 'cols-2',
    options: [
      {
        id: 'sleep',
        emoji: '🛌',
        label: '睡前助眠',
        desc: '让香气抚平一天的疲惫',
        sceneTags: ['🌙 睡前30分钟', '🕯️ 卧室营造', '😴 深度睡眠'],
        vector: { sweet: 0.8, woody: 0.5, cool: 0.1, milk: 0.9, spicy: 0.1, fruity: 0.3 }
      },
      {
        id: 'work',
        emoji: '💼',
        label: '工作专注',
        desc: '清醒头脑，提升效率',
        sceneTags: ['☕ 晨间启动', '📚 书房伴侣', '🎯 高效专注'],
        vector: { sweet: 0.2, woody: 0.8, cool: 0.9, milk: 0.1, spicy: 0.7, fruity: 0.3 }
      },
      {
        id: 'meditate',
        emoji: '🧘',
        label: '冥想打坐',
        desc: '净化空间，收摄身心',
        sceneTags: ['🌿 冥想空间', '🙏 禅意修行', '✨ 净化气场'],
        vector: { sweet: 0.3, woody: 1.0, cool: 0.3, milk: 0.4, spicy: 0.2, fruity: 0.0 }
      },
      {
        id: 'tea',
        emoji: '🍵',
        label: '茶道品茗',
        desc: '以香入茶，雅致生活',
        sceneTags: ['🍵 茶桌相伴', '🎨 艺术氛围', '🌸 雅集分享'],
        vector: { sweet: 0.6, woody: 0.8, cool: 0.4, milk: 0.5, spicy: 0.3, fruity: 0.4 }
      },
      {
        id: 'gift',
        emoji: '🎁',
        label: '送礼收藏',
        desc: '有品位的高端礼品',
        sceneTags: ['🎁 商务礼赠', '💎 收藏价值', '🏆 品质象征'],
        vector: { sweet: 0.4, woody: 0.9, cool: 0.3, milk: 0.5, spicy: 0.5, fruity: 0.2 }
      },
      {
        id: 'daily',
        emoji: '🏠',
        label: '日常居家',
        desc: '让家充满温馨香气',
        sceneTags: ['🏠 日常空间', '🌅 早晚仪式', '💆 身心舒缓'],
        vector: { sweet: 0.7, woody: 0.6, cool: 0.4, milk: 0.6, spicy: 0.2, fruity: 0.5 }
      }
    ]
  },
  {
    id: 'music',
    step: '第四题 · 音乐感知',
    title: '你的耳机里最常播放哪类音乐？',
    subtitle: '音乐品味与香气偏好高度相关',
    type: 'single',
    layout: 'cols-2',
    options: [
      {
        id: 'jazz_classic',
        emoji: '🎷',
        label: '爵士 / 古典',
        desc: '层次丰富，复杂精妙',
        vector: { sweet: 0.5, woody: 0.9, cool: 0.3, milk: 0.6, spicy: 0.5, fruity: 0.2, complexity: 0.9 }
      },
      {
        id: 'folk_acoustic',
        emoji: '🎸',
        label: '民谣 / 轻音乐',
        desc: '自然纯朴，贴近生活',
        vector: { sweet: 0.7, woody: 0.7, cool: 0.5, milk: 0.4, spicy: 0.2, fruity: 0.7, complexity: 0.5 }
      },
      {
        id: 'electronic_pop',
        emoji: '🎧',
        label: '电子 / 流行',
        desc: '活力四射，时尚潮流',
        vector: { sweet: 0.6, woody: 0.3, cool: 0.8, milk: 0.3, spicy: 0.4, fruity: 0.8, complexity: 0.4 }
      },
      {
        id: 'meditation_ambient',
        emoji: '🔔',
        label: '冥想 / 空灵音',
        desc: '内观静默，超越时空',
        vector: { sweet: 0.3, woody: 1.0, cool: 0.4, milk: 0.5, spicy: 0.1, fruity: 0.0, complexity: 0.8 }
      }
    ]
  },
  {
    id: 'budget',
    step: '第五题 · 品质选择',
    title: '你愿意为一款适合自己的沉香投入多少？',
    subtitle: '不同价位对应不同稀缺程度与品质',
    type: 'budget',
    layout: 'cols-1',
    tiers: [
      { min: 0,    max: 200,  label: '入门探索', desc: '香片·线香·小样', id: 'entry' },
      { min: 200,  max: 600,  label: '品质生活', desc: '精选香木·熏香套装', id: 'quality' },
      { min: 600,  max: 1500, label: '文化收藏', desc: '老料·沉水·雕件', id: 'culture' },
      { min: 1500, max: 5000, label: '顶级臻品', desc: '极品沉水·珍稀原料', id: 'premium' }
    ]
  }
]

// ---------- 沉香产品数据库 ----------
const PRODUCTS = [
  {
    id: 'vn_fusheng',
    name: '越南富森红土沉香',
    origin: '🇻🇳 越南 · 富森',
    icon: '🌿',
    priceRange: [800, 3000],
    priceTier: ['culture', 'premium'],
    desc: '顶级产区富森的红土沉香，香韵醇厚悠长，甘甜中带有迷人蜜韵，为沉香中的极品之选。',
    aromaDesc: '甘甜木质 × 浓郁蜜香 × 悠远回甘',
    effects: ['镇静放松', '助眠安神', '高端送礼'],
    vector: { sweet: 0.9, woody: 0.85, cool: 0.1, milk: 0.75, spicy: 0.2, fruity: 0.3 },
    personality: ['meditate', 'sleep', 'gift'],
    tags: ['🏆 顶级产区', '💧 油脂饱满', '🌙 助眠首选']
  },
  {
    id: 'vn_nhatrang',
    name: '越南芽庄天然沉香',
    origin: '🇻🇳 越南 · 芽庄',
    icon: '🍃',
    priceRange: [400, 1200],
    priceTier: ['quality', 'culture'],
    desc: '芽庄产区经典之作，香气清甜自然，带有淡雅果香，层次丰富，性价比极高。',
    aromaDesc: '清甜果香 × 木质底韵 × 清新回甘',
    effects: ['提神醒脑', '情绪愉悦', '日常用香'],
    vector: { sweet: 0.75, woody: 0.65, cool: 0.5, milk: 0.4, spicy: 0.3, fruity: 0.7 },
    personality: ['daily', 'work', 'tea'],
    tags: ['🌸 清甜果香', '☀️ 适合日常', '💰 高性价比']
  },
  {
    id: 'brunei_sinked',
    name: '文莱沉水级沉香',
    origin: '🇧🇳 文莱 · 达鲁萨兰',
    icon: '💧',
    priceRange: [1500, 8000],
    priceTier: ['culture', 'premium'],
    desc: '文莱国宝级沉水沉香，油脂密度极高可沉于水，奶甜香与木质香完美融合，稀世珍品。',
    aromaDesc: '奶甜乳香 × 深沉木质 × 幽幽凉意',
    effects: ['深度冥想', '净化气场', '珍稀收藏'],
    vector: { sweet: 0.6, woody: 1.0, cool: 0.35, milk: 0.85, spicy: 0.2, fruity: 0.1 },
    personality: ['meditate', 'gift', 'tea'],
    tags: ['💧 沉水级别', '💎 稀世珍品', '🙏 冥想圣品']
  },
  {
    id: 'indo_kalimantan',
    name: '印尼加里曼丹沉香',
    origin: '🇮🇩 印尼 · 加里曼丹',
    icon: '🌴',
    priceRange: [200, 600],
    priceTier: ['entry', 'quality'],
    desc: '印尼热带雨林出产，香气清爽果甜，带有热带风情的清新气息，入门佳品。',
    aromaDesc: '清爽果香 × 轻甜木质 × 热带气息',
    effects: ['清新提神', '愉悦心情', '空间净化'],
    vector: { sweet: 0.65, woody: 0.5, cool: 0.7, milk: 0.3, spicy: 0.3, fruity: 0.85 },
    personality: ['daily', 'work', 'social'],
    tags: ['🌴 热带风情', '🌿 清新果香', '🎯 入门首选']
  },
  {
    id: 'hainan_wild',
    name: '海南野生奇楠',
    origin: '🇨🇳 中国 · 海南',
    icon: '⭐',
    priceRange: [3000, 20000],
    priceTier: ['premium'],
    desc: '国内极稀罕的海南野生奇楠，集奇香、凉意、甜润于一体，被誉为"香中之王"。',
    aromaDesc: '清凉辛香 × 甜润奶香 × 奇特层次',
    effects: ['极致冥想', '辟邪祈福', '顶级收藏'],
    vector: { sweet: 0.7, woody: 0.8, cool: 0.8, milk: 0.7, spicy: 0.8, fruity: 0.2 },
    personality: ['meditate', 'gift'],
    tags: ['⭐ 香中之王', '🌿 野生奇楠', '🏆 顶级收藏']
  },
  {
    id: 'malaysia_sabah',
    name: '马来西亚沙巴沉香',
    origin: '🇲🇾 马来西亚 · 沙巴',
    icon: '🌺',
    priceRange: [300, 900],
    priceTier: ['entry', 'quality'],
    desc: '沙巴产区出产，油脂线条优美，木质香底蕴扎实，奶甜香气持久，综合表现均衡。',
    aromaDesc: '温润木质 × 奶甜持久 × 均衡层次',
    effects: ['平心静气', '日常熏香', '茶道相伴'],
    vector: { sweet: 0.7, woody: 0.75, cool: 0.3, milk: 0.8, spicy: 0.2, fruity: 0.4 },
    personality: ['daily', 'sleep', 'tea'],
    tags: ['🌺 均衡香气', '⏳ 持久留香', '🍵 茶道首选']
  },
  {
    id: 'vn_binh_phuoc',
    name: '越南平福生香',
    origin: '🇻🇳 越南 · 平福',
    icon: '🌱',
    priceRange: [100, 300],
    priceTier: ['entry'],
    desc: '适合沉香初学者的入门之选，香气清新自然，价格亲民，让你轻松开启沉香之旅。',
    aromaDesc: '清新木香 × 淡甜草本 × 自然气息',
    effects: ['新手入门', '日常使用', '了解沉香'],
    vector: { sweet: 0.55, woody: 0.6, cool: 0.5, milk: 0.3, spicy: 0.2, fruity: 0.5 },
    personality: ['daily', 'work'],
    tags: ['🌱 新手友好', '💰 亲民价格', '🎓 入门必备']
  },
  {
    id: 'indo_papua',
    name: '印尼巴布亚深山沉香',
    origin: '🇮🇩 印尼 · 巴布亚',
    icon: '🏔️',
    priceRange: [500, 1500],
    priceTier: ['quality', 'culture'],
    desc: '来自巴布亚原始雨林深处，香气野性浓郁，辛香与木质完美交织，独特而迷人。',
    aromaDesc: '野性辛香 × 浓郁木质 × 大地气息',
    effects: ['提神集中', '力量感受', '独特体验'],
    vector: { sweet: 0.3, woody: 0.9, cool: 0.4, milk: 0.2, spicy: 0.85, fruity: 0.2 },
    personality: ['work', 'meditate', 'tea'],
    tags: ['🏔️ 原始雨林', '💪 浓郁辛香', '🔥 独特个性']
  }
]

// ---------- 香气人格体系 ----------
const PERSONALITIES = {
  '沉静探索者': {
    icon: '🌙',
    color: '#2C1A0E',
    desc: '你有着深邃的内心世界，偏爱内敛而有层次的香气。在沉香的醇厚木质香中，你找到了自己独处时的安宁与智慧。',
    traits: ['深度冥想', '内观独处', '品质收藏'],
    coreVector: { sweet: 0.4, woody: 0.95, cool: 0.3, milk: 0.5, spicy: 0.3, fruity: 0.1 }
  },
  '温润治愈者': {
    icon: '🌅',
    color: '#8B5E3C',
    desc: '你有着温暖包容的心，香气对你而言是情绪的抚慰剂。甜润的蜜香与奶香让你放松，是最懂你的生活伴侣。',
    traits: ['情绪疗愈', '睡眠助眠', '温暖陪伴'],
    coreVector: { sweet: 0.9, woody: 0.55, cool: 0.1, milk: 0.9, spicy: 0.1, fruity: 0.4 }
  },
  '清新活力派': {
    icon: '☀️',
    color: '#3D6B4F',
    desc: '你充满活力与创造力，喜欢清爽提神的香气氛围。清凉的果香与辛香让你头脑清醒，随时保持最佳状态。',
    traits: ['高效专注', '清醒提神', '积极生活'],
    coreVector: { sweet: 0.45, woody: 0.55, cool: 0.85, milk: 0.2, spicy: 0.65, fruity: 0.8 }
  },
  '雅致品鉴家': {
    icon: '🍵',
    color: '#5C3317',
    desc: '你对生活有着极高的审美标准，香气是你精致生活方式的重要组成。在茶道与香道的结合中，你体验东方文化的精髓。',
    traits: ['茶道文化', '雅致审美', '精品收藏'],
    coreVector: { sweet: 0.6, woody: 0.82, cool: 0.4, milk: 0.6, spicy: 0.35, fruity: 0.35 }
  },
  '神秘感性者': {
    icon: '✨',
    color: '#6b5b8e',
    desc: '你有着敏锐的感官与浪漫的灵魂，被复杂而神秘的香气所吸引。奇楠与极品沉水的层次变化，正是你内心丰富世界的映射。',
    traits: ['感官敏锐', '层次丰富', '顶级珍稀'],
    coreVector: { sweet: 0.65, woody: 0.85, cool: 0.6, milk: 0.7, spicy: 0.45, fruity: 0.25 }
  },
  '自然生活家': {
    icon: '🌿',
    color: '#3D6B4F',
    desc: '你热爱自然，生活简单而充实。果甜清新的香气让你时刻感受大自然的馈赠，香气是你日常生活美学的一部分。',
    traits: ['自然清新', '日常生活', '简单愉悦'],
    coreVector: { sweet: 0.72, woody: 0.58, cool: 0.55, milk: 0.4, spicy: 0.2, fruity: 0.82 }
  }
}

// ---------- 香气维度标签 ----------
const AROMA_LABELS = {
  sweet:  { name: '甘甜度', emoji: '🍯' },
  woody:  { name: '木质感', emoji: '🪵' },
  cool:   { name: '清凉感', emoji: '❄️' },
  milk:   { name: '奶甜韵', emoji: '🥛' },
  spicy:  { name: '辛香度', emoji: '🌶️' },
  fruity: { name: '果香感', emoji: '🍑' }
}
