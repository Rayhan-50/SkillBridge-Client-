import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconResolverProps {
  iconName?: string | null;
  className?: string;
}

export function CategoryIconResolver({ iconName, className }: CategoryIconResolverProps) {
  // Check if iconName is a valid URL (for custom uploaded icons, if any)
  if (iconName && (iconName.startsWith('http://') || iconName.startsWith('https://'))) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={iconName} alt="Category Icon" className={className} />;
  }

  // Try to find matching Lucide icon, fallback to 'BookOpen'
  // Common mappings or direct matches
  let IconComponent: any = Icons.BookOpen;
  
  if (iconName) {
    // PascalCase the input e.g. "data-science" -> "DataScience", "book-open" -> "BookOpen"
    const formattedName = iconName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
      
    // @ts-ignore - dynamic access
    if (Icons[formattedName]) {
      // @ts-ignore
      IconComponent = Icons[formattedName];
    } else if (iconName.toLowerCase() === 'programming' || iconName.toLowerCase() === 'coding') {
      IconComponent = Icons.Code;
    } else if (iconName.toLowerCase() === 'mathematics' || iconName.toLowerCase() === 'math') {
      IconComponent = Icons.Calculator;
    } else if (iconName.toLowerCase() === 'languages') {
      IconComponent = Icons.Globe;
    } else if (iconName.toLowerCase() === 'sciences') {
      IconComponent = Icons.FlaskConical;
    } else if (iconName.toLowerCase() === 'business') {
      IconComponent = Icons.Briefcase;
    } else if (iconName.toLowerCase() === 'design' || iconName.toLowerCase() === 'art') {
      IconComponent = Icons.Palette;
    }
  }

  return <IconComponent className={className} />;
}
