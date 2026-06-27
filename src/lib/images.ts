/**
 * Returns a high-quality category image URL based on the category name
 * or keywords in the opportunity title.
 */
export function getCategoryImage(category: string = 'General', title: string = ''): string {
  const normCategory = category.toLowerCase().trim();
  const normTitle = title.toLowerCase().trim();

  // Keyword check in title first for high specificity
  if (normTitle.includes('data') || normTitle.includes('analyst')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'; // analytics screen
  }
  if (normTitle.includes('write') || normTitle.includes('copywrite') || normTitle.includes('content')) {
    return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop'; // writing on notebook
  }
  if (normTitle.includes('design') || normTitle.includes('ui') || normTitle.includes('ux') || normTitle.includes('creative')) {
    return 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop'; // color palette / design workspace
  }

  // Category mapping
  switch (normCategory) {
    case 'internships':
    case 'internship':
    case 'intern':
      return 'https://images.unsplash.com/photo-1521791136364-7986c2953e15?q=80&w=600&auto=format&fit=crop'; // Collaborative work / office handshake

    case 'graduate programs':
    case 'graduate trainee':
    case 'trainee':
      return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'; // Graduation cap / university

    case 'scholarships':
    case 'scholarship':
      return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'; // Studying / library desk

    case 'bootcamps':
    case 'bootcamp':
      return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop'; // Group coding / seminar

    case 'grants':
    case 'grant':
      return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop'; // Finance growth / funding

    case 'tech':
    case 'technology':
    case 'software':
    case 'developer':
      return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'; // Electronics / circuit code

    case 'finance':
    case 'accounting':
    case 'audit':
      return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop'; // Stock chart / trading screens

    case 'engineering':
    case 'operations':
      return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop'; // Engineering / mechanics

    case 'marketing':
    case 'sales':
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'; // Advertising graphs

    case 'career guide':
    case 'blog':
    case 'guide':
      return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'; // Professional laptop / workplace

    default:
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'; // Modern office architecture
  }
}
