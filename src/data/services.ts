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
      'We transform outdated bathrooms through expert renovation: redesigning layouts, installing modern fixtures, and upgrading to premium tile and flooring, for a luxurious, functional retreat.',
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
      'Fixture installations, pipe repairs, water heater replacements, and full bathroom plumbing.',
    longDescription:
      'Our expert technicians deliver solutions for every need — from fixture installations and pipe repairs to water heater replacements and the full plumbing behind bathroom renovations. We combine technical precision with aesthetic awareness for reliable, long-lasting results.',
    image: '/images/services/plumbing.jpg',
    highlights: ['Fixture installation & repair', 'Pipe repair & replacement', 'Water heater replacement', 'Full bathroom plumbing'],
  },
  {
    slug: 'driveways-and-walkways',
    name: 'Driveways, Patios & Decks',
    shortDescription:
      'Driveways and walkways in quality concrete, premium pavers, and elegant brickwork — plus custom patios and decks.',
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
      'We offer comprehensive roofing services, including new installations, expert repairs, storm damage response, and routine maintenance to ensure your roof remains durable and reliable, giving you peace of mind through every season.',
    image: '/images/services/roofing.jpg',
    highlights: ['New roof installation', 'Repairs & leak fixes', 'Routine maintenance', 'Storm damage response'],
  },
];

export interface ServiceAreaPin {
  name: string;
  lat: number;
  lng: number;
}

/** Towns we serve — drives the service-area map pins and every town list on the site (via serviceAreas). */
export const serviceAreaPins: ServiceAreaPin[] = [
  { name: 'Morristown, NJ', lat: 40.7968, lng: -74.4815 },
  { name: 'Bernardsville, NJ', lat: 40.7187, lng: -74.5657 },
  { name: 'Mendham, NJ', lat: 40.7748, lng: -74.5993 },
  { name: 'Rockaway, NJ', lat: 40.9043, lng: -74.5163 },
  { name: 'Cedar Knolls, NJ', lat: 40.8377, lng: -74.4335 },
  { name: 'Peapack-Gladstone, NJ', lat: 40.7015, lng: -74.6485 },
  { name: 'Far Hills, NJ', lat: 40.6987, lng: -74.6371 },
  { name: 'Bernards Township, NJ', lat: 40.7048, lng: -74.5443 },
  { name: 'Bedminster, NJ', lat: 40.6821, lng: -74.6363 },
];

export const serviceAreas = serviceAreaPins.map((pin) => pin.name);

export const companyInfo = {
  name: 'Action Renovations LLC',
  phone: '(848) 800-2320',
  phoneHref: 'tel:+18488002320',
  tagline: 'Interior & Exterior Renovation Experts',
  serviceRegion: 'Morris & Northern Somerset County, NJ',
  njHicLicense: '13VH14111800',
  // Housecall Pro customer portal — the token is a stable, per-account API key (not a
  // per-session/per-customer token), confirmed by inspecting the same link on the live
  // actionrenovations.net site, so it's safe to use as a permanent link here.
  customerPortalUrl: 'https://client.housecallpro.com/customer_portal/request-link?token=8d1d2e82676d4b66b7740847c5f84670',
  // Housecall Pro online booking widget — opens an in-page modal (via HCPWidget.openModal()).
  hcpBookingToken: '3a86fe0e3aa144b9beef091769cbb72a',
  hcpOrgName: 'Action-Renovations-LLC',
  bookingUrl: 'https://book.housecallpro.com/book/Action-Renovations-LLC/3a86fe0e3aa144b9beef091769cbb72a?v2=true',
  // Housecall Pro organization UUID — used by the chat bubble (Layout.astro) and the reviews widget
  // (/reviews). Same value the old Duda site looked up at runtime for its chat widget.
  hcpOrganizationUuid: 'd75767bd-bcf6-461b-b507-4d85f1b9a7e7',
};

export interface SocialLink {
  name: string;
  /** Shown under the platform name, e.g. an @handle. */
  display: string;
  url: string;
  blurb: string;
  /** Button label on /social. */
  cta: string;
  /** Simple Icons path (CC0), drawn in a 24x24 viewBox. */
  iconPath: string;
}

/** Facebook/Instagram are the accounts linked from the old actionrenovations.net site. Drives /social and the footer icons. */
export const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    display: '@actionrenovationsusa',
    url: 'https://www.facebook.com/actionrenovationsusa/',
    blurb: 'Project updates, before-and-afters, and news from the team.',
    cta: 'Follow on Facebook',
    iconPath:
      'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  },
  {
    name: 'Instagram',
    display: '@action.renovations',
    url: 'https://www.instagram.com/action.renovations/',
    blurb: 'Photos and short videos of our latest projects.',
    cta: 'Follow on Instagram',
    iconPath:
      'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
  },
  {
    name: 'Google',
    // Public Maps listing for the Google Business Profile. The business.google.com/n/... manager URL
    // only works for the signed-in owner; its fid (156498696644813430) is this listing's CID.
    display: 'Google Business Profile',
    url: 'https://www.google.com/maps?cid=156498696644813430',
    blurb: 'Find us on Google Maps, get directions, and read or leave a review.',
    cta: 'View on Google',
    iconPath:
      'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  },
];
