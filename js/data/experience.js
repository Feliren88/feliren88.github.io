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
    description: 'Contributed cross-functional workgroups across 50+ researchers and 5+ countries to curate SEA-VL, a multicultural vision-language benchmark. Co-developed VLM adaptation paradigms improving cultural relevance.'
  },
  {
    dates: 'FEB 2025 – NOV 2025',
    title: 'Artefact - Senior Data Scientist',
    location: 'French-based AI consulting · Founding member, Jakarta office',
    description: 'Pioneered end-to-end predictive Share of Voice system on Vertex AI, scaling inference across 6 markets within 2 months. As inaugural Jakarta hire, codified engineering protocols for scalable applied AI operations.'
  },
  {
    dates: 'DEC 2022 – JAN 2025',
    title: 'Monash University - Research Associate',
    location: 'Top 50 global research university',
    description: 'Directed geospatial AI pipelines across global consortia (UQ, UCL, Nottingham). Designed progressive cross-attention network for flood segmentation informing policy. First-authored IEEE GRSL Q1.'
  },
  {
    dates: 'JUN 2021 – JUN 2023',
    title: 'GDP Labs (GLAIR.ai) - Senior Data Scientist / ML Engineer',
    location: 'AI firm backed by major Indonesian conglomerate',
    description: 'Achieved 99.99% reliability for biometric systems handling 1M+ daily financial inferences. Reduced delivery timelines by 30% through automated ML pipelines. Fast-tracked to Senior in 12 months.'
  },
  {
    dates: 'JAN 2021 – JUN 2021',
    title: 'Jakarta Smart City - Data Scientist',
    location: "Indonesia's smart city ecosystem",
    description: 'Developed probabilistic forecasting models for waste logistics, improving efficiency by 15% for 10M+ residents. Presented at IEEE-sponsored conference to 500+ attendees.'
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