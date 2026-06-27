/**
 * Curated pools of Unsplash image IDs for different categories to ensure
 * every post gets a unique and deterministic image based on its ID.
 */
const IMAGE_POOLS: Record<string, string[]> = {
  internships: [
    'photo-1521791136364-7986c2953e15', // handshake
    'photo-1519085360753-af0119f7cbe7', // meeting
    'photo-1573497019940-1c28c88b4f3e', // team work
    'photo-1522071820081-009f0129c71c', // collaborators
    'photo-1531535934200-a574b2b0c03e', // group discussion
    'photo-1515378791036-0648a3ef77b2', // typing laptop
    'photo-1552581230-c01bc0d48453', // office presentation
    'photo-1556761175-4b46a572b786', // office floor chat
    'photo-1582213782179-e0d53f98f2ca', // group circle
    'photo-1573164713714-d95e436ab8d6'  // business presentation
  ],
  graduate: [
    'photo-1523050854058-8df90110c9f1', // graduation cap
    'photo-1541339907198-e08756dedf3f', // university hall
    'photo-1517486808906-6ca8b3f04846', // campus students
    'photo-1525921429624-479b6c29457f', // students walking
    'photo-1503676260728-1c00da094a0b', // teacher class
    'photo-1517245386807-bb43f82c33c4', // student team
    'photo-1527689368864-3a821dbccc34', // work discussion
    'photo-1498243691581-b148c3760a46', // library
    'photo-1509062522246-3755977927d7', // young learners
    'photo-1516321318423-f06f85e504b3'  // learning on computer
  ],
  scholarships: [
    'photo-1434030216411-0b793f4b4173', // library studying
    'photo-1456513080510-7bf3a84b82f8', // books
    'photo-1506880018603-83d5b814b5a6', // notebook
    'photo-1497633762265-9d179a990aa6', // stacked library books
    'photo-1501504905252-473c47e087f8', // studying table
    'photo-1491841573111-8578763b2f02', // campus library
    'photo-1513542789411-b6a5d4f31634', // creative sketch
    'photo-1509869175650-a1d979e25595', // books desk
    'photo-1516979187457-637abb4f9353', // learning notebook
    'photo-1544716278-ca5e3f4abd8c'  // reading glasses book
  ],
  bootcamps: [
    'photo-1517245386807-bb43f82c33c4', // classroom learning
    'photo-1531482615713-2afd69097998', // computer learning
    'photo-1524178232363-1fb2b075b655', // presentation whiteboard
    'photo-1522202176988-66273c2fd55f', // campus learners
    'photo-1523240795612-9a054b0db644', // friends learning
    'photo-1501504905252-473c47e087f8', // workspace study
    'photo-1515378791036-0648a3ef77b2', // workspace coding
    'photo-1552581230-c01bc0d48453', // classroom board
    'photo-1531535934200-a574b2b0c03e', // group table study
    'photo-1454165804606-c3d57bc86b40'  // desk paper planning
  ],
  grants: [
    'photo-1554224155-8d04cb21cd6c', // business calculation
    'photo-1579621970563-ebec7560ff3e', // coin savings
    'photo-1559526324-4b87b5e36e44', // investment chart
    'photo-1526304640581-d334cdbbf45e', // growth charts
    'photo-1560518883-ce09059eeffa', // real estate deal
    'photo-1454165804606-c3d57bc86b40', // calculating sheet
    'photo-1554224155-672d804a1438', // calculator
    'photo-1518186285589-2f7649de83e0', // analytics screen
    'photo-1628527304948-06157ee3c8a6', // business finance
    'photo-1544377193-33dcf4d68fb5'  // savings coins
  ],
  tech: [
    'photo-1518770660439-4636190af475', // chip
    'photo-1550751827-4bd374c3f58b', // cyber security server
    'photo-1605810230434-7631ac76ec81', // team programming
    'photo-1607799279861-4dd421887fb3', // coding ide
    'photo-1526374965328-7f61d4dc18c5', // matrix binary
    'photo-1531297484001-80022131f5a1', // modern laptop screen
    'photo-1488590528505-98d2b5aba04b', // dev office
    'photo-1498050108023-c5249f4df085', // designer workspace
    'photo-1504639725590-34d0984388bd', // code writing
    'photo-1515879218367-8466d910aaa4'  // python code screen
  ],
  finance: [
    'photo-1590283603385-17ffb3a7f29f', // stock chart
    'photo-1559526324-4b87b5e36e44', // investment growth
    'photo-1611974789855-9c2a0a7236a3', // trading graph screen
    'photo-1454165804606-c3d57bc86b40', // accounting sheets
    'photo-1544377193-33dcf4d68fb5', // coins graphs
    'photo-1628527304948-06157ee3c8a6', // calculating tax
    'photo-1579621970563-ebec7560ff3e', // financial savings
    'photo-1560518883-ce09059eeffa', // bank safe/keys
    'photo-1554224155-672d804a1438', // calculator desk
    'photo-1518186285589-2f7649de83e0'  // money chart
  ],
  engineering: [
    'photo-1581091226825-a6a2a5aee158', // mechanical engineering
    'photo-1537462715879-360eeb61a0bc', // mechanical workshop
    'photo-1581092160607-ee22621dd758', // technical drawing
    'photo-1581092335397-9583fe92d232', // automation robot
    'photo-1581091226027-c1d4cb8001be', // technical blueprints
    'photo-1498084393753-b411b2d26b34', // digital blueprint
    'photo-1581091870622-0c9f7a26f0ef', // factory screen
    'photo-1581092162384-8987c1d64718', // automation arm
    'photo-1581092162522-83b6c2057d60', // control screen
    'photo-1563986768609-322da13575f3'  // business blueprints
  ],
  marketing: [
    'photo-1460925895917-afdab827c52f', // analytics chart screen
    'photo-1551836022-d5d88e9218df', // customer call center
    'photo-1432888498266-38ffec3eaf0a', // office presentation graphs
    'photo-1519389950473-47ba0277781c', // business brainstorming
    'photo-1557804506-669a67965ba0', // metrics targets
    'photo-1542744094-3a31f103e35f', // stats board
    'photo-1551288049-bebda4e38f71', // marketing screens
    'photo-1454165804606-c3d57bc86b40', // calculation paper
    'photo-1533750516457-a7f992034fec', // sales targets
    'photo-1517245386807-bb43f82c33c4'  // startup team meeting
  ],
  blog: [
    'photo-1454165804606-c3d57bc86b40', // career guide table
    'photo-1506784983877-45594efa4cbe', // calendar planning
    'photo-1434030216411-0b793f4b4173', // writing note
    'photo-1455390582262-044cdead277a', // writing pen
    'photo-1522202176988-66273c2fd55f', // students discussion
    'photo-1517245386807-bb43f82c33c4', // group coding learning
    'photo-1506880018603-83d5b814b5a6', // workspace reading
    'photo-1498050108023-c5249f4df085', // design screen
    'photo-1518186285589-2f7649de83e0', // analytical work
    'photo-1531482615713-2afd69097998'  // learning dashboard
  ],
  general: [
    'photo-1486406146926-c627a92ad1ab', // office sky-high building
    'photo-1497366216548-37526070297c', // corporate office interior
    'photo-1497215728101-856f4ea42174', // clean office workspace
    'photo-1497366811353-6870744d04b2', // clean meeting room
    'photo-1504384308090-c894fdcc538d', // creative startup office
    'photo-1454165804606-c3d57bc86b40', // table setup office
    'photo-1513829096996-512061f1c717', // creative workspace
    'photo-1531973576160-7125cd663d86', // office hallway
    'photo-1549923746-c502d488f3aa', // team discussion
    'photo-1556761175-4b46a572b786'  // group corridor chat
  ]
};

/**
 * Returns a deterministic, unique category image URL based on the category name
 * or keywords in the title, using the post ID as a modulo seed.
 */
export function getCategoryImage(category: string = 'General', title: string = '', postId: number = 0): string {
  const normCategory = category.toLowerCase().trim();
  const normTitle = title.toLowerCase().trim();

  let poolKey = 'general';

  // Keyword check in title first for high specificity
  if (normTitle.includes('data') || normTitle.includes('analyst')) {
    poolKey = 'finance';
  } else if (normTitle.includes('write') || normTitle.includes('copywrite') || normTitle.includes('content') || normTitle.includes('social media')) {
    poolKey = 'blog';
  } else if (normTitle.includes('design') || normTitle.includes('ui') || normTitle.includes('ux') || normTitle.includes('creative') || normTitle.includes('graphic')) {
    poolKey = 'marketing';
  } else if (normCategory.includes('intern') || normCategory.includes('nysc')) {
    poolKey = 'internships';
  } else if (normCategory.includes('graduate') || normCategory.includes('trainee')) {
    poolKey = 'graduate';
  } else if (normCategory.includes('scholarship')) {
    poolKey = 'scholarships';
  } else if (normCategory.includes('bootcamp') || normCategory.includes('training')) {
    poolKey = 'bootcamps';
  } else if (normCategory.includes('grant')) {
    poolKey = 'grants';
  } else if (normCategory.includes('tech') || normCategory.includes('developer') || normCategory.includes('engineer') || normCategory.includes('software')) {
    poolKey = 'tech';
  } else if (normCategory.includes('finance') || normCategory.includes('account') || normCategory.includes('audit')) {
    poolKey = 'finance';
  } else if (normCategory.includes('engineering') || normCategory.includes('operations')) {
    poolKey = 'engineering';
  } else if (normCategory.includes('marketing') || normCategory.includes('sales')) {
    poolKey = 'marketing';
  } else if (normCategory.includes('blog') || normCategory.includes('guide')) {
    poolKey = 'blog';
  }

  // Fallback to general if pool doesn't exist
  const pool = IMAGE_POOLS[poolKey] || IMAGE_POOLS.general;

  // Use postId % pool.length to select a deterministic photo ID
  const seed = Math.max(0, Math.floor(postId));
  const photoId = pool[seed % pool.length];

  return `https://images.unsplash.com/${photoId}?q=80&w=600&auto=format&fit=crop`;
}
