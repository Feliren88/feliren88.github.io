/**
 * Skills data configuration
 * 
 * This file contains all skill categories and items for the skills page.
 * To add new skills:
 * 1. Add a new entry to the SKILLS_DATA array
 * 2. Include category title, description, and list of skills
 * 
 * Format:
 *   {
 *     category: "CATEGORY TITLE",
 *     description: "Description text",
 *     skills: ["Skill 1", "Skill 2", ...]
 *   }
 */

var SKILLS_DATA = [
  {
    category: 'RESEARCH: TRUSTWORTHY AI',
    description: 'Uncertainty quantification and reliability for deployed AI systems — the gap between calibration and provable guarantees.',
    skills: ['Conformal Prediction', 'Uncertainty Quantification', 'Vision-Language Models', 'Knowledge Distillation', 'Model Evaluation']
  },
  {
    category: 'RESEARCH: CULTURAL & GEOSPATIAL AI',
    description: 'AI systems for underrepresented regions and environments — from satellite imagery to multilingual vision-language benchmarks.',
    skills: ['Semantic Segmentation', 'Multispectral Imaging', 'Google Earth Engine', 'Cultural Benchmarking', 'Vision-Language Adaptation']
  },
  {
    category: 'ENGINEERING: DEEP LEARNING',
    description: 'Model development from architecture design to production — multimodal, generative, and geospatial systems.',
    skills: ['PyTorch', 'TensorFlow', 'LangChain / LangGraph', 'RAG & Agentic Workflows', 'OpenCV']
  },
  {
    category: 'ENGINEERING: PRODUCTION ML',
    description: 'Cloud-scale ML pipelines with distributed inference — built and operated across GCP and AWS.',
    skills: ['GCP (Vertex AI, BigQuery)', 'AWS (EC2, S3, SageMaker)', 'Kubernetes', 'Docker', 'Apache Spark', 'dbt']
  },
  {
    category: 'LANGUAGES & FOUNDATIONS',
    description: 'Core tooling for research and systems engineering.',
    skills: ['Python', 'Scala', 'SQL', 'R', 'Git', 'Linux/Unix']
  }
];