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
    "I'm an applied scientist working at the intersection of <strong>multimodal AI</strong>, <strong>vision-language models</strong>, and <strong>remote sensing</strong> — with a focus on building AI that actually understands the world outside the Western bubble.",
    "My journey started in Jakarta, trying to make sense of the Citarum River — one of the world's most polluted rivers. That project on flood segmentation in Indonesia's Bandung taught me something I've carried ever since: <strong>the best AI doesn't just see pixels; it understands context, culture, and consequence.</strong>",
    "Now at <strong>SEACrowd</strong>, I work with researchers across Southeast Asia to build datasets and models that reflect our languages, our images, our stories. We're not just filling gaps — we're creating the foundation for AI that belongs to this region.",
    "Before this, I built production systems at Artefact, shipping ML pipelines across 6 markets. Before that, Monash University — where I first-authored my IEEE paper on progressive cross-attention networks. And before that, GDP Labs and Jakarta Smart City, where I learned that the hardest problems aren't the algorithms — they're the data, the infrastructure, the humans.",
    "I write about what I learn along the way — not to show off, but because I believe <strong>knowledge shared is knowledge multiplied</strong>. If something I figured out can help someone else skip a detour, it's worth writing down."
  ],
  sections: [
    {
      title: 'What I Do',
      cards: [
        { title: 'Research', description: 'Building vision-language models that understand cultural context, especially for Southeast Asia.' },
        { title: 'Engineering', description: 'Scaling ML from prototype to production — cloud pipelines, inference optimization, reliable systems.' },
        { title: 'Open Source', description: 'Contributing to datasets and models that outlast any single paper or company.' },
        { title: 'Mentoring', description: 'Teaching the next generation — through Bangkit Academy and university guest lectures.' }
      ]
    },
    {
      title: 'What Drives Me',
      content: 'I believe AI should serve everyone, not just the places that built it. Every mining footprint I mapped from space, every flood I predicted, every vision-language model I\'ve tuned for cultural relevance — they all point toward the same question: <strong>how do we make AI that actually works for people who need it?</strong>'
    }
  ]
};