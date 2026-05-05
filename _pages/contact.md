---
layout: page
title: Work With Vicky Feliren
subtitle: Speaking, Research Collaboration, Mentorship, Applied Scientist Roles
description: Available for speaking engagements, research collaboration, mentorship, and applied scientist roles internationally. Specializing in trustworthy AI and cultural AI for Southeast Asia.
permalink: /contact/
---

<p class="eyebrow">LET'S WORK TOGETHER</p>
<p class="contact-intro">{{ site.data.contact.intro }}</p>

<div id="contact-engagements" style="margin:2rem 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.2rem;max-width:56rem">
  {% for item in site.data.contact.engagements %}
  <div style="padding:1.2rem;border:1px solid var(--line);border-radius:8px">
    <h4 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:0.5rem">{{ item.type }}</h4>
    <p style="font-size:0.95rem;line-height:1.55;color:var(--muted)">{{ item.description }}</p>
  </div>
  {% endfor %}
</div>

<p class="column-title" style="margin-top:2.5rem;margin-bottom:1rem">REACH ME</p>
<div id="contact-grid" class="contact-grid">
  {% for link in site.data.contact.links %}
  <a class="contact-card" href="{{ link.url }}" target="_blank" rel="noreferrer">
    <span>{{ link.label }}</span>
    <strong>{{ link.value }}</strong>
  </a>
  {% endfor %}
</div>

<p class="column-title" style="margin-top:3rem;margin-bottom:1rem">SEND A MESSAGE</p>
<form class="contact-form" id="contact-form">
  <div class="form-group">
    <label for="from_name">Full Name</label>
    <input type="text" id="from_name" name="from_name" required placeholder="Your name">
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required placeholder="your@email.com">
  </div>
  <div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="subject" required placeholder="What's this about?">
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required placeholder="Your message..."></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Send Message</button>
  <p id="form-status" style="margin-top:1rem;font-size:0.9rem"></p>
</form>

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>
  (function() {
    emailjs.init("fOPWIK3AwtJkBQyat");
    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var btn = this.querySelector('button');
      var status = document.getElementById('form-status');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      emailjs.send("service_or7muew", "template_ah21icd", {
        from_name: document.getElementById('from_name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      }).then(function() {
        btn.textContent = 'Message Sent!';
        status.textContent = 'Thank you! Your message has been sent.';
        status.style.color = 'green';
        document.getElementById('contact-form').reset();
        setTimeout(function() {
          btn.disabled = false;
          btn.textContent = 'Send Message';
        }, 3000);
      }).catch(function(error) {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        status.textContent = 'Failed to send. Please try again.';
        status.style.color = 'red';
      });
    });
  })();
</script>

<style>
  .contact-form {
    max-width: 32rem;
    margin-top: 1rem;
  }
  .form-group {
    margin-bottom: 1.2rem;
  }
  .form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.4rem;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.7rem;
    font-size: 0.95rem;
    font-family: inherit;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text);
    transition: border-color 0.2s ease;
  }
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
  }
  .form-group textarea {
    resize: vertical;
  }
</style>
