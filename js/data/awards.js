/**
 * Awards data configuration
 * 
 * This file contains all awards and professional service entries for the awards page.
 * To add new awards:
 * 1. Add a new entry with a unique key (use significant words from title)
 * 2. Add the category (tag), title, year, description, and optional URL
 * 
 * Format:
 *   KEY: {
 *     category: "CATEGORY",
 *     title: "Award Title",
 *     year: "YEAR",
 *     description: "Description text",
 *     url: "https://..." (optional)
 *   }
 * 
 * Service entries use a separate SERVICE_DATA object with role and description.
 */

var AWARDS_DATA = {
  'monash-scholarship': {
    category: 'SCHOLARSHIP',
    title: 'Monash Indonesia Inaugural Welcome Scholarship',
    year: '2024',
    description: 'Awarded for exceptional potential in driving regional AI innovation and high academic standing.'
  },
  'deep-learning-nanodegree': {
    category: 'SCHOLARSHIP',
    title: 'Deep Learning Nanodegree — Facebook & Udacity',
    year: '2019',
    description: 'Selected as top global applicant to master advanced PyTorch and GAN architectures.'
  },
  'microsoft-azure-hackathon': {
    category: 'CHAMPION',
    title: 'Microsoft Azure Virtual Hackathon APAC',
    year: '2020',
    description: 'Engineered HakkTaxi: ML-driven predictive routing with 6-second ETA margin of error using Azure spatial data.',
    url: 'https://news.microsoft.com/source/asia/2020/08/20/drones-data-science-and-innovation-at-the-microsoft-azure-virtual-hackathon-in-asia-pacific/'
  },
  'camvscovid': {
    category: 'TOP 3',
    title: 'CamvsCovid — University of Cambridge',
    year: '2020',
    description: 'TeleHealthMonitor: GDPR-compliant Edge AI for COVID-19 remote monitoring on resource-constrained devices.',
    url: 'https://devpost.com/software/converse-xash34'
  },
  'cal-hacks': {
    category: 'BEST COMMUNITY TRACK',
    title: 'Cal Hacks 8.0 — UC Berkeley',
    year: '2020',
    description: 'IVR solution integrated with real-time news APIs, bridging the digital divide via standard telephony.',
    url: 'https://devpost.com/software/converse-xash34'
  }
};

var SERVICE_DATA = [
  {
    role: 'Peer Reviewer',
    description: 'IEEE IGARSS 2026 — Premier global remote sensing symposium'
  },
  {
    role: 'Technical Judge',
    description: 'Cal Hacks 8.0, CruzHacks 2022, iNTUition v8.0 (2021–2022) — 50+ projects evaluated',
    urls: ['https://cal-hacks-8.devpost.com/', 'https://cruzhacks-2022.devpost.com/', 'https://intuition-v8.devpost.com/']
  },
  {
    role: 'Open Source Contributor',
    description: 'SEACrowd collective — Southeast Asian AI alignment & data democratization'
  }
];