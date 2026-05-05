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
    "I'm an applied scientist working on <strong>multimodal AI</strong> and <strong>vision-language models</strong> — building AI that actually understands context, not just pixels.",
    "Right now, I'm doing my master's at Monash under <a href='https://research.monash.edu/en/persons/risqi-saputra/' target='_blank' rel='noreferrer'>Associate Professor Risqi Saputra</a> and <a href='https://research.monash.edu/en/persons/taufiq-asyhari/' target='_blank' rel='noreferrer'>Professor Taufiq Asyhari</a>. We're working on conformal prediction for vision-language navigation — basically making VLMs tell you how confident they are, not just guess. If a robot says it's 90% sure it's walking into a room, we want to know what that 10% actually means. That's trustworthiness you can bet on.",
    "I came to this from the other side. At Artefact, I shipped ML pipelines across 6 markets in 2 months — Vertex AI production systems handling real traffic, not benchmarks. At Monash before that, I published on flood segmentation. Before that, biometric systems at GDP Labs doing 1M+ inferences daily. I know what it takes to take a model out of a notebook and put it in production.",
    "Currently I'm also with <strong>SEACrowd</strong>, building vision-language datasets for Southeast Asia. We're not fixing a gap — we're building the foundation for AI that belongs to this region.",
    "I write about what I learn because I remember how hard some of this was to figure out. If something I stumbled through helps someone skip a detour, that's worth sharing."
  ],
  sections: [
    {
      title: 'What I Do',
      cards: [
        { title: 'Research', description: 'Conformal prediction for VLMs, cultural relevance in vision-language for Southeast Asia.' },
        { title: 'Engineering', description: 'Vertex AI, cloud pipelines, scaling to production traffic across markets.' },
        { title: 'Open Source', description: 'Building datasets and models that outlast any single paper or company.' },
        { title: 'Mentoring', description: 'Bangkit Academy, guest lectures at Binus.' }
      ]
    },
    {
      title: 'What Drives Me',
      content: "If we can't trust the numbers, what's the point? Every flood model I built, every biometric check at GDP Labs — they all came down to one question: <strong>how do we know when to trust the model?</strong>"
    }
  ]
};