/**
 * Awards data configuration
 *
 * This file contains all awards and professional service entries for the awards page.
 * To add new awards:
 * 1. Add a new entry with a unique key (use significant words from title)
 * 2. Add the category (tag), title, year, description, and optional URL
 *
 * Set featured: true on the most significant award — it renders as a full-width hero card.
 *
 * Format:
 *   KEY: {
 *     category: "CATEGORY",
 *     featured: true,         (optional)
 *     title: "Award Title",
 *     year: "YEAR",
 *     description: "Description text",
 *     url: "https://..."      (optional)
 *   }
 *
 * Service entries use a separate SERVICE_DATA array with role and description.
 */

var AWARDS_DATA = {
  'microsoft-azure-hackathon': {
    category: 'CHAMPION',
    featured: true,
    title: 'Microsoft Azure Virtual Hackathon APAC',
    year: '2020',
    description: 'Regional champion across APAC with HakkTaxi — a ride-sharing demand predictor built on Azure Spatial data, delivered in 48 hours. Microsoft featured the project in their official APAC innovation announcement.',
    url: 'https://news.microsoft.com/source/asia/2020/08/20/drones-data-science-and-innovation-at-the-microsoft-azure-virtual-hackathon-in-asia-pacific/'
  },
  'monash-scholarship': {
    category: 'SCHOLARSHIP',
    title: 'Monash Indonesia Inaugural Welcome Scholarship',
    year: '2024',
    description: 'One of the inaugural recipients — awarded for research potential in regional AI and academic standing at Monash University.'
  },
  'deep-learning-nanodegree': {
    category: 'SCHOLARSHIP',
    title: 'Deep Learning Nanodegree — Facebook & Udacity',
    year: '2019',
    description: 'Competitively selected from a global applicant pool by Facebook and Udacity to study advanced deep learning and GAN architectures.'
  },
  'camvscovid': {
    category: 'TOP 3',
    title: 'CamvsCovid — University of Cambridge',
    year: '2020',
    description: 'Top 3 globally in a University of Cambridge COVID-19 response challenge. Built TeleHealthMonitor: edge AI for remote patient monitoring on resource-constrained devices without compromising data privacy.',
    url: 'https://devpost.com/software/converse-xash34'
  },
  'cal-hacks': {
    category: 'BEST COMMUNITY TRACK',
    title: 'Cal Hacks 8.0 — UC Berkeley',
    year: '2020',
    description: 'Best Community Track at UC Berkeley\'s Cal Hacks. Built an IVR system making real-time information accessible over standard phone calls — designed for communities without reliable internet access.',
    url: 'https://devpost.com/software/converse-xash34'
  }
};

var SERVICE_DATA = [
  {
    role: 'Peer Reviewer',
    description: 'IEEE IGARSS 2026 — Premier global remote sensing and geoscience symposium.'
  },
  {
    role: 'Technical Judge',
    description: 'Cal Hacks 8.0, CruzHacks 2022, iNTUition v8.0 — evaluated 50+ projects across three international hackathons.'
  },
  {
    role: 'Open Source Contributor',
    description: 'SEACrowd collective — building AI infrastructure and data democratization for Southeast Asia.'
  }
];
