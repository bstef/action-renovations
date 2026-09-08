export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  highlights: string[];
}

export const services: Service[] = [
  {
    slug: 'kitchen-overhauls',
    name: 'Kitchen Overhauls',
    shortDescription:
      'Transform your kitchen with a comprehensive overhaul — custom cabinet installations, elegant backsplash design, and premium tile work.',
    longDescription:
      'We reimagine your kitchen through complete remodeling: custom cabinetry, elegant backsplash design, premium countertops, and expert tile work. Every detail is crafted to blend everyday functionality with a look that feels custom-built for your home.',
    image: '/images/services/kitchen.jpg',
    highlights: ['Custom cabinet installation', 'Backsplash & tile design', 'Countertops & islands', 'Layout & lighting updates'],
  },
  {
    slug: 'bathroom-makeovers',
    name: 'Bathroom Makeovers',
    shortDescription:
      'Revitalize your space with a comprehensive bathroom makeover — new layouts, modern fixtures, and premium flooring.',
    longDescription:
      'We transform outdated bathrooms through expert renovation: redesigning layouts, installing modern fixtures, and applying premium flooring solutions including hardwood installation and refinishing, for a luxurious, functional retreat.',
    image: '/images/services/bathroom.jpg',
    highlights: ['Full layout redesign', 'Modern fixture installation', 'Tile & flooring upgrades', 'Vanity & storage solutions'],
  },
  {
    slug: 'tile-flooring',
    name: 'Tile Flooring',
    shortDescription:
      'Elevate your space with expert tile flooring across kitchens, bathrooms, entryways, and living areas.',
    longDescription:
      'Our professional tile installations enhance kitchens, bathrooms, entryways, and living areas with precision craftsmanship. We work with a wide range of tile materials and designs to create durable, beautiful floors tailored to your aesthetic.',
    image: '/images/services/tile.jpg',
    highlights: ['Precision installation', 'Wide material selection', 'Entryways, baths & kitchens', 'Durable, long-lasting finishes'],
  },
  {
    slug: 'carpeting',
    name: 'Carpeting',
    shortDescription:
      'A comprehensive selection of premium carpets in various textures and fibers, expertly installed for comfort and style.',
    longDescription:
      'We offer a comprehensive selection of premium carpets in various textures, patterns, and fibers, expertly installed to enhance comfort and style — from plush bedroom retreats to durable, family-room-ready solutions.',
    image: '/images/services/carpeting.jpg',
    highlights: ['Premium carpet selection', 'Expert, flawless installation', 'Bedrooms to family rooms', 'Comfort-first materials'],
  },
  {
    slug: 'painting-and-finishing',
    name: 'Painting and Finishing',
    shortDescription:
      'Flawless interior painting, precision sheetrock installation, and custom carpentry finishes.',
    longDescription:
      'From flawless interior painting to precision sheetrock installation and custom carpentry finishes, our skilled team delivers impeccable results that transform your space with meticulous attention to detail and craftsmanship.',
    image: '/images/services/painting.jpg',
    highlights: ['Interior & trim painting', 'Sheetrock installation', 'Custom carpentry finishes', 'Detail-focused craftsmanship'],
  },
  {
    slug: 'electrical-services',
    name: 'Electrical Services',
    shortDescription:
      'Licensed electrical work — from essential upgrades and smart home integration to complete rewiring and lighting design.',
    longDescription:
      'Our licensed team expertly handles everything from essential upgrades and smart home integration to complete rewiring and lighting design. We ensure safety, efficiency, and aesthetic appeal through meticulous workmanship and modern solutions.',
    image: '/images/services/electrical.jpg',
    highlights: ['Licensed electricians', 'Smart home integration', 'Full rewiring', 'Custom lighting design'],
  },
  {
    slug: 'plumbing-services',
    name: 'Plumbing Services',
    shortDescription:
      'Fixture installations, pipe repairs, complete bathroom renovations, and water heater replacements.',
    longDescription:
      'Our expert technicians deliver solutions for every need — from fixture installations and pipe repairs to complete bathroom renovations and water heater replacements. We combine technical precision with aesthetic awareness for reliable, long-lasting results.',
    image: '/images/services/plumbing.jpg',
    highlights: ['Fixture installation & repair', 'Pipe repair & replacement', 'Water heater replacement', 'Full bathroom plumbing'],
  },
  {
    slug: 'driveways-and-walkways',
    name: 'Driveways and Walkways',
    shortDescription:
      'Stunning entrances in quality concrete, premium pavers, and elegant brickwork — plus custom decks and patios.',
    longDescription:
      "We craft stunning entrances using quality concrete, premium pavers, and elegant brickwork. Our skilled team extends your living space outdoors with custom deck and patio construction, creating functional, beautiful areas for relaxation and entertainment.",
    image: '/images/services/driveways.jpg',
    highlights: ['Concrete & paver driveways', 'Brickwork & walkways', 'Deck construction', 'Patio installation'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    shortDescription:
      'New installations, expert repairs, and routine maintenance to keep your roof durable and reliable.',
    longDescription:
      'We offer comprehensive roofing services, including new installations, expert repairs, and routine maintenance to ensure your roof remains durable and reliable, giving you peace of mind through every season.',
    image: '/images/services/roofing.jpg',
    highlights: ['New roof installation', 'Repairs & leak fixes', 'Routine maintenance', 'Storm damage response'],
  },
];

export const serviceAreas = [
  'Morristown, NJ',
  'Bernardsville, NJ',
  'Mendham, NJ',
  'Morris County, NJ',
  'Rockaway, NJ',
  'Cedar Knolls, NJ',
  'Peapack-Gladstone, NJ',
  'Far Hills, NJ',
  'Bernards Township, NJ',
  'Bedminster, NJ',
];

export const companyInfo = {
  name: 'Action Renovations LLC',
  phone: '(848) 800-2320',
  phoneHref: 'tel:+18488002320',
  tagline: 'Interior & Exterior Renovations Experts',
  serviceRegion: 'Morris County, NJ',
};
