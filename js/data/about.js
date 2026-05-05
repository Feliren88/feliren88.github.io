/**
 * About page data configuration
 * 
 * This file contains all content for the about page.
 * To update content, edit this file.
 * 
 * Format:
 *   hero: Array of paragraph strings
 *   sections: Array of { title, content, cards?: Array<{ title, description }> }
 */

var ABOUT_DATA = {
  hero: [
    "I'm an applied scientist working on <strong>multimodal AI</strong> and <strong>vision-language models</strong>, building AI that actually understands context, not just pixels.",
    "Right now, I'm doing my master's at Monash under <a href='https://research.monash.edu/en/persons/risqi-saputra/' target='_blank' rel='noreferrer'>Associate Professor Risqi Saputra</a> and <a href='https://research.monash.edu/en/persons/taufiq-asyhari/' target='_blank' rel='noreferrer'>Professor Taufiq Asyhari</a>. We're working on conformal prediction for vision-language navigation, making VLMs quantify their uncertainty reliably. When a model says it's confident, we want provable bounds, not just a number.",
    "Five years in the trenches doing geospatial AI and production ML. I have shipped systems handling millions of daily inferences. I know what it takes to take a model out of a notebook and deploy it reliably in the wild.",
    "I build open-source datasets and models for a region often overlooked by AI. We're building the foundation for multimodal AI that reflects this part of the world.",
    "I write about what I learn because I remember how hard some of this was to figure out. If something I stumbled through helps someone skip a detour, that's worth sharing."
  ],
  sections: [
    {
      title: 'What I Do',
      cards: [
        { title: 'Research', description: 'Conformal prediction for VLMs, cultural relevance in vision-language for Southeast Asia.' },
        { title: 'Engineering', description: 'Production ML systems, cloud infrastructure, scaling to real-world deployment.' },
        { title: 'Open Source', description: 'Building datasets and models that serve the research community.' },
        { title: 'Mentoring', description: 'Industry programs and university guest lectures.' }
      ]
    },
    {
      title: 'What Drives Me',
      content: "Reliability matters. Every system I've built comes down to one question: <strong>how do we know when to trust the model?</strong>"
    }
  ]
};