/**
 * Experience data configuration
 * 
 * This file contains all work experience, education, patent, and teaching entries for the experience page.
 * To add new entries:
 * 1. Add to the appropriate array (workExperience, education, patents, teaching)
 * 2. Include dates, title, location, and description
 * 
 * Format (workExperience):
 *   {
 *     dates: "DATE RANGE",
 *     title: "Role  Company",
 *     location: "Location · Additional info",
 *     description: "Description text"
 *   }
 */

var WORK_EXPERIENCE_DATA = [
  {
    dates: 'OCT 2024 – PRESENT',
    title: 'SEACrowd - Researcher, Multimodal & Vision-Language',
    location: 'Open-science research collective · seacrowd.github.io',
    description: 'Co-built SEA-VL with 50+ researchers across 5+ countries — a multicultural vision-language benchmark for Southeast Asia published at ACL 2025. Contributed to VLM adaptation methods improving cultural relevance across the region.'
  },
  {
    dates: 'FEB 2025 – NOV 2025',
    title: 'Artefact - Senior Data Scientist',
    location: 'French-based AI consulting · Founding member, Jakarta office',
    description: 'Built an end-to-end predictive Share of Voice system on Vertex AI, live across 6 markets within two months. Joined as the first hire in Jakarta, establishing engineering practices for the team\'s applied AI operations.'
  },
  {
    dates: 'DEC 2022 – JAN 2025',
    title: 'Monash University - Research Associate',
    location: 'Top 50 global research university',
    description: 'Led geospatial AI research across a global consortium (UQ, UCL, Nottingham). Designed ProCANet, a progressive cross-attention architecture for multispectral flood segmentation informing regional policy — published first-authored in IEEE GRSL (Q1).'
  },
  {
    dates: 'JUN 2021 – JUN 2023',
    title: 'GDP Labs (GLAIR.ai) - Senior Data Scientist / ML Engineer',
    location: 'AI firm backed by major Indonesian conglomerate',
    description: 'Built and operated biometric inference systems at 99.99% reliability, handling 1M+ daily financial transactions. Automated ML delivery pipelines, cutting deployment cycles by 30%.'
  },
  {
    dates: 'JAN 2021 – JUN 2021',
    title: 'Jakarta Smart City - Data Scientist',
    location: "Indonesia's smart city ecosystem",
    description: 'Developed probabilistic forecasting models for waste logistics across a city of 10M+ residents, improving operational efficiency by 15%. Presented findings at an IEEE-sponsored conference to 500+ attendees.'
  }
];

var EDUCATION_DATA = [
  {
    dates: 'EXPECTED SEPT 2026',
    title: 'Monash University',
    location: 'Master of Data Science · GPA: 4.0/4.0',
    description: 'Thesis: Conformal prediction approach to vision-language navigation (VLN)'
  },
  {
    title: 'Monash University',
    location: 'Bachelor of Computer Science',
    description: 'Student Exchange at NTU Singapore'
  }
];

var PATENTS_DATA = [
  {
    dates: 'ISSUED JUNE 2025',
    title: 'Fish & Shrimp Pond Detection via Satellite Imagery',
    location: 'IDS000010594',
    description: 'Proprietary computer vision pipeline for high-resolution aquaculture monitoring using novel spectral indices.'
  }
];

var TEACHING_DATA = [
  {
    dates: 'JAN 2024 – JAN 2025',
    title: 'Bangkit Academy (Google, Gojek, Traveloka)',
    location: 'ML Instructor & Capstone Advisor',
    description: 'Mentored 150+ students; supervised 5+ capstone projects deploying ML to Cloud Run.'
  },
  {
    dates: 'NOV 2023',
    title: 'Bina Nusantara University',
    location: 'Guest Lecturer, Computer Vision',
    description: 'Sessions on CNNs to Transformers and semantic segmentation for 100+ seniors.'
  }
];