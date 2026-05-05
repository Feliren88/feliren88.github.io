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
    category: 'DEEP LEARNING & MULTIMODAL AI',
    description: 'Building and deploying multimodal models from research to production.',
    skills: ['PyTorch', 'TensorFlow', 'Vision-Language Models', 'Conformal Prediction', 'Knowledge Distillation']
  },
  {
    category: 'GENERATIVE AI & LLMOps',
    description: 'End-to-end LLM application development with agentic workflows.',
    skills: ['LangChain', 'LangGraph', 'RAG', 'Vector Database', 'Agentic Workflows']
  },
  {
    category: 'COMPUTER VISION & GEOSPATIAL',
    description: 'From satellite imagery to semantic segmentation and pose estimation.',
    skills: ['OpenCV', 'Semantic Segmentation', 'Multispectral Imaging', 'Pose Estimation', 'Google Earth Engine']
  },
  {
    category: 'PRODUCTION ML & DATA ENGINEERING',
    description: 'Cloud-scale ML pipelines with distributed inference and data processing.',
    skills: ['GCP (Vertex AI, BigQuery)', 'AWS (EC2, S3, SageMaker)', 'Kubernetes', 'Docker', 'Apache Spark', 'dbt']
  },
  {
    category: 'AI-ASSISTED TOOLS',
    description: 'Leveraging AI-powered development tools for accelerated engineering.',
    skills: ['Claude Code', 'Spec-driven Dev', 'Kilo Code', 'Opencode', 'Cursor', 'CodeRabbit']
  },
  {
    category: 'LANGUAGES & FOUNDATIONS',
    description: 'Core programming and systems tooling for research and production.',
    skills: ['Python', 'Scala', 'SQL', 'R', 'Git', 'Linux/Unix']
  }
];