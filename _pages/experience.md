---
layout: page
title: Experience & Education
subtitle: Work History and Background
description: Research Associate at Monash University, Senior Data Scientist at Artefact, ML Engineer at GDP Labs. IEEE Q1 first author, ACL 2025 contributor.
permalink: /work/
---

<style>
#experience-timeline {
  margin-top: 2rem;
  position: relative;
  min-height: 700px;
}
#experience-timeline svg {
  width: 100%;
  height: 750px;
}
.timeline-node rect {
  fill: rgba(11, 20, 31, 0.56);
  stroke: rgba(114, 130, 152, 0.24);
  stroke-width: 1;
  rx: 8;
  ry: 8;
}
.timeline-node:hover rect {
  stroke: #7792af;
}
.timeline-node .title {
  fill: #d3dceb;
  font-size: 14px;
  font-weight: 700;
}
.timeline-node .period {
  fill: #7792af;
  font-size: 11px;
}
.timeline-node .location {
  fill: #8b9db5;
  font-size: 11px;
}
.timeline-axis {
  stroke: rgba(114, 130, 152, 0.34);
  stroke-width: 2;
}
</style>

<p class="eyebrow">TRACK RECORD</p>
<p class="section-note">Five years spanning academic research, AI consulting, and production ML engineering — published in IEEE, ACL, and Remote Sensing of Environment, with systems deployed at scale across Southeast Asia and APAC.</p>

<div id="experience-timeline"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const timelineData = [
    { id: "seacrowd", title: "SEACrowd - Researcher, Multimodal & Vision-Language", period: "OCT 2024 – PRESENT", location: "Open-science research collective", y: 50 },
    { id: "artefact", title: "Artefact - Senior Data Scientist", period: "FEB 2025 – NOV 2025", location: "French AI consulting · Jakarta", y: 130 },
    { id: "monash-ra", title: "Monash University - Research Associate", period: "DEC 2022 – JAN 2025", location: "Global research consortium", y: 210 },
    { id: "glair", title: "GDP Labs (GLAIR.ai) - Senior Data Scientist", period: "JUN 2021 – JUN 2023", location: "AI consulting", y: 290 },
    { id: "jakartasmartcity", title: "Jakarta Smart City - Data Scientist", period: "JAN 2021 – JUN 2021", location: "Indonesia's smart city govt initiative", y: 370 },
    { id: "msc", title: "Master of Data Science", period: "EXPECTED SEPT 2026", location: "Monash University", y: 450 },
    { id: "bsc", title: "Bachelor of Computer Science", period: "DECEMBER 2019", location: "Monash University", y: 530 },
    { id: "patent", title: "Fish & Shrimp Pond Detection via Satellite", period: "ISSUED JUNE 2025", location: "IDS000010594", y: 580 },
    { id: "teaching", title: "Bangkit Academy - ML Instructor", period: "JAN 2024 – JAN 2025", location: "Google, Gojek, Traveloka", y: 630 }
  ];

  const margin = { top: 20, right: 30, bottom: 50, left: 200 };
  const width = document.getElementById('experience-timeline').offsetWidth - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const svg = d3.select("#experience-timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Vertical axis line
  g.append("line")
    .attr("class", "timeline-axis")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height);

  // Create nodes
  const nodes = g.selectAll(".timeline-node")
    .data(timelineData)
    .enter()
    .append("g")
    .attr("class", "timeline-node")
    .attr("transform", d => `translate(20,${d.y})`);

  // Node rectangles
  nodes.append("rect")
    .attr("width", width - 40)
    .attr("height", 60)
    .attr("rx", 8)
    .attr("ry", 8);

  // Node content
  nodes.append("text")
    .attr("class", "title")
    .attr("x", 12)
    .attr("y", 20)
    .text(d => d.title);

  nodes.append("text")
    .attr("class", "period")
    .attr("x", 12)
    .attr("y", 38)
    .text(d => d.period);

  nodes.append("text")
    .attr("class", "location")
    .attr("x", width - 12)
    .attr("y", 38)
    .attr("text-anchor", "end")
    .text(d => d.location);
});
</script>