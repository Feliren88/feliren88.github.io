---
layout: page
title: High Agency
subtitle: My notes on George Mack's essay, turned into exercises
description: Test how you respond to unclear problems, weak answers, untested limits, rumination, and goals that feel too large to begin.
permalink: /high-agency/
date: 2026-08-22
last_modified_at: 2026-08-25
layout-class: page high-agency
extra_css: /css/high-agency.css
extra_js: /js/components/high-agency.js
motion_scene: agency
---

<div class="ha-progress" aria-hidden="true"><span id="ha-progress-fill"></span></div>

<nav class="ha-story-rail" id="ha-story-rail" aria-label="High Agency story progress">
  <a href="#see-it" data-ha-act="1"><b>I</b><span>See the system</span></a>
  <a href="#software" data-ha-act="2"><b>II</b><span>Reject the default</span></a>
  <a href="#tools" data-ha-act="3"><b>III</b><span>Move through it</span></a>
</nav>
{% include high-agency-icons.html %}

<a class="ha-hud" id="ha-hud" href="#badges" hidden><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-medal"></use></svg><span class="ha-hud-num"><b id="ha-hud-n">0</b>/12</span><span class="ha-hud-track" aria-hidden="true"><i id="ha-hud-fill"></i></span></a>
<div class="ha-toast" id="ha-toast" role="status" aria-live="polite"></div>

<div class="ha-story-hero" aria-labelledby="ha-story-title">
  <div class="ha-story-copy">
    <div class="ha-story-title" id="ha-story-title" role="heading" aria-level="1">Ask what can<br><i>still be moved.</i></div>
    <p>A rule, price, route, person, or skill may change the situation.</p>
  </div>
  <svg class="ha-route" viewBox="0 0 560 430" role="img" aria-label="A route reaches a wall, searches along it, finds a movable hinge, and continues on the other side.">
    <defs><marker id="ha-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z"/></marker></defs>
    <path class="route-before" d="M40 335C115 335 118 255 190 255h56"/>
    <path class="wall" d="M270 65v305"/>
    <path class="route-search" d="M246 255c-60 0-56-102 8-102"/>
    <circle class="hinge" cx="270" cy="153" r="12"/>
    <path class="route-after" d="M282 153c62 0 52-70 118-70s71 69 120 69" marker-end="url(#ha-arrow)"/>
    <text x="40" y="368">the assigned route</text><text x="286" y="350">“impossible”</text><text x="298" y="138">a variable moves</text><text x="405" y="61">changed reality</text>
  </svg>
</div>

<div class="note-block" role="note">
  <span class="note-badge">Source</span>
  <p>These are my notes on <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">High Agency</a>
  by George Mack. The ideas, stories, and framing are his. I turned the main claims into
  diagrams and exercises you can test for yourself.
  Read <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">the original</a> first if you have thirty minutes.
  Nothing on this page is stored anywhere. What you type stays in your browser.</p>
</div>

<div class="ha-toc">
  <div class="ha-toc-grid">
    <a href="#see-it"><span class="k">00</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-eye"></use></svg><span>See it first</span></a>
    <a href="#spectrum"><span class="k">01</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-wheel"></use></svg><span>The spectrum</span></a>
    <a href="#diagnose"><span class="k">02</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-gauge"></use></svg><span>Do you have agency?</span></a>
    <a href="#software"><span class="k">03</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-chip"></use></svg><span>Five lines of software</span></a>
    <a href="#wilbur"><span class="k">04</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-plane"></use></svg><span>The Wilbur case</span></a>
    <a href="#traps"><span class="k">05</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-trap"></use></svg><span>The five traps</span></a>
    <a href="#game"><span class="k">06</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-gamepad"></use></svg><span>Trap diagnostic</span></a>
    <a href="#tools"><span class="k">07</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-toolbox"></use></svg><span>Five tools</span></a>
    <a href="#exercise"><span class="k">08</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-clipboard"></use></svg><span>The exercise</span></a>
    <a href="#library"><span class="k">09</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-books"></use></svg><span>The library</span></a>
    <a href="#why"><span class="k">10</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-compass"></use></svg><span>Why I keep this</span></a>
    <a href="#badges"><span class="k">★</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-medal"></use></svg><span>Your progress</span></a>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════
     00 · SEE IT FIRST
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="see-it">
  <h2><span class="n">00</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-eye"></use></svg> See it first</h2>
  <p class="ha-deck">It is easier to recognise high agency in a person than to define it. The essay
  starts with examples, so this note does too.</p>

  <p>In 1964, a judge said he could not define obscenity and knew it when he saw it.
  High agency can feel the same. You have probably met someone who has it, even if you
  never named the trait.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>You wake up in a foreign jail cell</h5>
      </div>
      <span class="ha-lab-hint">One name. First instinct.</span>
    </div>
    <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0 0 var(--gap-2)">
      You get one phone call. No lawyer, no embassy, no money. One person you actually know.
      Do not think about who deserves it or who would be upset to be left out. Who do you call?</p>
    <div class="ha-call">
      <label class="ha-sr" for="ha-anchor-input">The person you would call</label>
      <input class="ha-input" id="ha-anchor-input" type="text" placeholder="Type a name" autocomplete="off">
      <button class="ha-btn is-primary" id="ha-anchor-btn" type="button">Make the call</button>
    </div>
    <p class="ha-call-out" id="ha-anchor-out" role="status"></p>
  </div>

  <p>You probably chose that person because you trust them to find a way through an unclear
  situation. Their title, income, and intelligence matter less than whether they can act
  without a map.</p>

  <div class="ha-quote">
    <p>When you're told that something is impossible, is that the end of the conversation,
    or does that start a second dialogue in your mind?</p>
    <cite>Eric Weinstein, quoted in the essay</cite>
  </div>

  <h3 id="spotting"><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-verify"></use></svg>How to spot them</h3>
  <p>The essay lists ten common signs. Select the ones your recent behaviour supports.
  Your answers stay in your browser.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Ten signals</h5>
      </div>
      <span class="ha-lab-hint">Tap any card to read why it counts</span>
    </div>
    <div class="ha-signals" id="ha-signals">
      <button class="ha-signal" type="button" data-sig="hobby" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-puzzle"></use></svg><span class="name">Weird teenage hobbies</span></span>
        <p class="why">Teenagers face strong pressure to fit in. Someone who keeps an unusual
        interest then may be more willing to think independently later.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="treadmill" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-bolt"></use></svg><span class="name">Treadmill energy</span></span>
        <p class="why">You meet them tired and flat. You leave wanting to run up a hill. They add
        energy to a room and leave it stronger.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="unguessable" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-dice"></use></svg><span class="name">Unguessable opinions</span></span>
        <p class="why">Their interests and views do not match an easy stereotype. They formed
        their own opinions.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="immigrant" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-suitcase"></use></svg><span class="name">Immigrant mentality</span></span>
        <p class="why">Leaving your town takes judgement. Leaving your country takes judgement,
        logistics and a willingness to be nobody again for a while.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="niche" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-send"></use></svg><span class="name">Sends you niche things</span></span>
        <p class="why">They judge an idea before checking whether it is popular. That is how
        people find useful things early.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="inverted" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-shield"></use></svg><span class="name">Blunt to you, loyal behind you</span></span>
        <p class="why">They give you honest feedback in private and defend you in public.
        Both choices carry a social cost.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="quit" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-door"></use></svg><span class="name">Quit something prestigious</span></span>
        <p class="why">Walking away means beating momentum, sunk cost and the opinion of everyone
        who was impressed by the old title.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="verify" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-verify"></use></svg><span class="name">They verify</span></span>
        <p class="why">They ask who “they” are and request the paper behind “research shows.”
        They check a claim before adopting it.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="selftaught" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-book-open"></use></svg><span class="name">Self-taught anything</span></span>
        <p class="why">A song on the saxophone, a 3D printer, tax law. They start at zero and climb
        without waiting for an institution to say go.</p>
      </button>
      <button class="ha-signal" type="button" data-sig="question" aria-pressed="false">
        <span class="top"><span class="box" aria-hidden="true"></span><svg class="ha-i ha-sig-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-question"></use></svg><span class="name">They question the question</span></span>
        <p class="why">A right answer to the wrong question is worse than silence, because it feels
        like progress and takes you further away.</p>
      </button>
    </div>
    <p class="ha-tally" id="ha-signal-tally" role="status"></p>
  </div>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-suitcase"></use></svg>Low agency in one image</h3>
  <p>People reached the moon in 1969. Bernard Sadow filed his
  <a href="https://patents.google.com/patent/US3653474A/en" target="_blank" rel="noreferrer">rolling-luggage patent in 1970</a>.
  An ordinary inconvenience can remain obvious for years without anyone treating it as a
  problem worth solving.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Two dates</h5>
      </div>
      <span class="ha-lab-hint">One year apart</span>
    </div>
    <div class="ha-dates">
      <div class="ha-date is-hard">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-rocket"></use></svg>
        <span class="yr">1969</span>
        <p>People land on the moon and come home.</p>
      </div>
      <div class="ha-date-link" aria-hidden="true"><span>one year</span></div>
      <div class="ha-date is-easy">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-suitcase"></use></svg>
        <span class="yr">1970</span>
        <p>Somebody puts wheels on a suitcase.</p>
      </div>
    </div>
    <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:var(--gap-2) 0 0">
      People solved powered flight before they solved the suitcase people carried every day.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     01 · THE SPECTRUM
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="spectrum">
  <h2><span class="n">01</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-wheel"></use></svg> Three wheels</h2>
  <p class="ha-deck">The essay defines agency as three traits: clear thinking, action, and
  willingness to reject a weak answer.</p>

  <p>Optimism calls the glass half full. Pessimism calls it half empty. Agency turns on the tap.
  The people you would call from that jail cell may differ in age,
  education, politics, and temperament. They share a habit of shaping events. They refuse to
  wait for events to shape them.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Three readings of one glass</h5>
      </div>
      <span class="ha-lab-hint">Turn the tap</span>
    </div>
    <svg class="ha-tapfig" id="ha-tapfig" viewBox="0 0 560 250" role="img" aria-label="Three glasses filled to the same level. The first is read as half full, the second as half empty, and the third is filled from a tap.">
      <defs>
        <clipPath id="ha-clip-a"><path d="M64 96h56l-7 88H71Z"/></clipPath>
        <clipPath id="ha-clip-b"><path d="M252 96h56l-7 88h-42Z"/></clipPath>
        <clipPath id="ha-clip-c"><path d="M440 96h56l-7 88h-42Z"/></clipPath>
      </defs>

      <g class="pane">
        <rect class="water" x="56" y="96" width="72" height="88" clip-path="url(#ha-clip-a)" transform="translate(0,44)"/>
        <path class="glass" d="M64 96h56l-7 88H71Z"/>
        <line class="mark" x1="52" y1="140" x2="132" y2="140"/>
        <text class="cap" x="92" y="212">Half full</text>
        <text class="sub" x="92" y="231">optimism</text>
      </g>

      <g class="pane">
        <rect class="water" x="244" y="96" width="72" height="88" clip-path="url(#ha-clip-b)" transform="translate(0,44)"/>
        <rect class="void" x="244" y="96" width="72" height="44" clip-path="url(#ha-clip-b)"/>
        <path class="glass" d="M252 96h56l-7 88h-42Z"/>
        <line class="mark" x1="240" y1="140" x2="320" y2="140"/>
        <text class="cap" x="280" y="212">Half empty</text>
        <text class="sub" x="280" y="231">pessimism</text>
      </g>

      <g class="pane" id="ha-tap-pane">
        <path class="pipe" d="M404 44h64"/>
        <path class="pipe" d="M468 44v22"/>
        <path class="handle" d="M420 44v-15h18v15"/>
        <g class="drops"><circle cx="468" cy="76" r="3.5"/><circle cx="468" cy="88" r="3"/></g>
        <g class="fill"><rect class="water" x="432" y="96" width="72" height="88" clip-path="url(#ha-clip-c)"/></g>
        <path class="glass" d="M440 96h56l-7 88h-42Z"/>
        <text class="cap" x="468" y="212">Turn the tap</text>
        <text class="sub" x="468" y="231">agency</text>
      </g>
    </svg>
    <div class="ha-btn-row"><button class="ha-btn is-primary" id="ha-tap-btn" type="button">Turn the tap</button></div>
    <p class="ha-tally" id="ha-tap-say" role="status">The tap changes how much water there is.</p>
  </div>

  <p>The essay breaks it into clear thinking, a bias to action, and disagreeability, and calls
  the combination a tricycle. Take a wheel off and see what you get.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Deflate a wheel</h5>
      </div>
      <span class="ha-lab-hint">Click any wheel</span>
    </div>
    <div class="ha-trike-wrap">
      <svg class="ha-trike" id="ha-trike" viewBox="0 0 440 250" role="img" aria-label="A tricycle with three wheels labelled clear thinking, bias to action and disagreeability. Selecting a wheel removes it.">
        <path class="frame" d="M80 150 L220 70 L360 150 M220 70 L220 150"/>
        <rect class="frame" x="198" y="56" width="44" height="9" rx="4" fill="none"/>

        <g data-wheel="think" class="wheel-hit" tabindex="0" role="button" aria-pressed="false" aria-label="Clear thinking wheel">
          <circle class="rim" cx="80" cy="150" r="50"/>
          <line class="spoke" x1="30" y1="150" x2="130" y2="150"/>
          <line class="spoke" x1="36.7" y1="125" x2="123.3" y2="175"/>
          <line class="spoke" x1="55" y1="106.7" x2="105" y2="193.3"/>
          <line class="spoke" x1="80" y1="100" x2="80" y2="200"/>
          <line class="spoke" x1="105" y1="106.7" x2="55" y2="193.3"/>
          <line class="spoke" x1="123.3" y1="125" x2="36.7" y2="175"/>
          <circle class="hub" cx="80" cy="150" r="6"/>
          <g class="flat-mark">
            <line x1="66" y1="82" x2="94" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
            <line x1="94" y1="82" x2="66" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
          </g>
          <text class="wlabel" x="80" y="230">Clear thinking</text>
        </g>

        <g data-wheel="act" class="wheel-hit" tabindex="0" role="button" aria-pressed="false" aria-label="Bias to action wheel">
          <circle class="rim" cx="220" cy="150" r="50"/>
          <line class="spoke" x1="170" y1="150" x2="270" y2="150"/>
          <line class="spoke" x1="176.7" y1="125" x2="263.3" y2="175"/>
          <line class="spoke" x1="195" y1="106.7" x2="245" y2="193.3"/>
          <line class="spoke" x1="220" y1="100" x2="220" y2="200"/>
          <line class="spoke" x1="245" y1="106.7" x2="195" y2="193.3"/>
          <line class="spoke" x1="263.3" y1="125" x2="176.7" y2="175"/>
          <circle class="hub" cx="220" cy="150" r="6"/>
          <g class="flat-mark">
            <line x1="206" y1="82" x2="234" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
            <line x1="234" y1="82" x2="206" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
          </g>
          <text class="wlabel" x="220" y="230">Bias to action</text>
        </g>

        <g data-wheel="disagree" class="wheel-hit" tabindex="0" role="button" aria-pressed="false" aria-label="Disagreeability wheel">
          <circle class="rim" cx="360" cy="150" r="50"/>
          <line class="spoke" x1="310" y1="150" x2="410" y2="150"/>
          <line class="spoke" x1="316.7" y1="125" x2="403.3" y2="175"/>
          <line class="spoke" x1="335" y1="106.7" x2="385" y2="193.3"/>
          <line class="spoke" x1="360" y1="100" x2="360" y2="200"/>
          <line class="spoke" x1="385" y1="106.7" x2="335" y2="193.3"/>
          <line class="spoke" x1="403.3" y1="125" x2="316.7" y2="175"/>
          <circle class="hub" cx="360" cy="150" r="6"/>
          <g class="flat-mark">
            <line x1="346" y1="82" x2="374" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
            <line x1="374" y1="82" x2="346" y2="110" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
          </g>
          <text class="wlabel" x="360" y="230">Disagreeability</text>
        </g>
      </svg>
      <div>
        <div class="ha-trike-verdict" id="ha-trike-verdict" role="status"></div>
        <div class="ha-btn-row"><button class="ha-btn" type="button" id="ha-trike-reset">Reinflate all three</button></div>
      </div>
    </div>
  </div>

  <p>The three traits can work against each other. Careful thinkers may delay action.
  Fast movers may act before checking the goal. Agreeable teammates may accept the first no.
  High agency requires balancing all three.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     02 · DIAGNOSE
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="diagnose">
  <h2><span class="n">02</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-gauge"></use></svg> Do you have agency?</h2>
  <p class="ha-deck">Most people do not begin with high agency, but the habit can change.</p>

  <p>People learn early to follow social rules, avoid risk, and wait for permission.
  Schools often reward the same habits. Low agency is common because those habits are common.
  They can still be examined and changed.</p>

  <p>The essay treats agency as a habit you can practise.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Twelve questions, three wheels</h5>
      </div>
      <span class="ha-lab-hint" id="ha-quiz-progress">0 of 12 answered</span>
    </div>
    <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0 0 var(--gap-2)">
      Rate each statement from 1 (never true of me) to 5 (always true). Answer for the last
      three months. Answer from your record of action; future plans do not count. Your answers stay in this browser.</p>
    <div id="ha-quiz"></div>
    <div class="ha-btn-row">
      <button class="ha-btn is-primary" id="ha-quiz-score" type="button" disabled>Show my three wheels</button>
      <button class="ha-btn" id="ha-quiz-reset" type="button">Clear</button>
    </div>

    <div class="ha-result" id="ha-quiz-result">
      <div class="ha-result-grid">
        <svg class="ha-radar" viewBox="0 0 320 250" role="img" aria-label="Triangle chart of your three agency scores">
          <polygon class="web" points="160,56 243.1,200 76.9,200"/>
          <polygon class="web" points="160,80 222.4,188 97.6,188"/>
          <polygon class="web" points="160,104 201.6,176 118.4,176"/>
          <polygon class="web" points="160,128 180.8,164 139.2,164"/>
          <line class="axis" x1="160" y1="152" x2="160" y2="56"/>
          <line class="axis" x1="160" y1="152" x2="243.1" y2="200"/>
          <line class="axis" x1="160" y1="152" x2="76.9" y2="200"/>
          <polygon class="blob" id="ha-radar-blob" points="160,152 160,152 160,152"/>
          <text class="rlabel" x="160" y="44">Think</text>
          <text class="rlabel" x="252" y="220">Act</text>
          <text class="rlabel" x="68" y="220">Refuse</text>
        </svg>
        <div class="ha-bars">
          <div class="ha-bar-row">
            <div class="lab"><span>Clear thinking</span><span><b id="ha-num-think">0</b></span></div>
            <div class="ha-bar-track"><div class="ha-bar-fill" id="ha-bar-think"></div></div>
          </div>
          <div class="ha-bar-row">
            <div class="lab"><span>Bias to action</span><span><b id="ha-num-act">0</b></span></div>
            <div class="ha-bar-track"><div class="ha-bar-fill" id="ha-bar-act"></div></div>
          </div>
          <div class="ha-bar-row">
            <div class="lab"><span>Disagreeability</span><span><b id="ha-num-disagree">0</b></span></div>
            <div class="ha-bar-track"><div class="ha-bar-fill" id="ha-bar-disagree"></div></div>
          </div>
          <div class="ha-verdict" id="ha-quiz-verdict"></div>
        </div>
      </div>
    </div>
  </div>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-grid"></use></svg>Where that puts you</h3>
  <p>Two axes are enough to place someone. Clarity is whether you can name the problem.
  Will is whether you move on it and keep moving when told no. Hover any quadrant to read it.
  If you scored the questions above, your marker is already on the field.</p>

  <div class="ha-lab">
    <svg class="ha-spectrum" id="ha-spectrum" viewBox="0 0 520 300" role="img" aria-label="A two by two field. The horizontal axis is will to move, the vertical axis is clarity.">
      <g class="qcell" data-quad="commentator" tabindex="0" role="button" aria-label="The commentator quadrant">
        <rect class="quad" x="70" y="50" width="190" height="100"/>
        <text class="qname" x="165" y="94" text-anchor="middle">The commentator</text>
        <text class="qdesc" x="165" y="112" text-anchor="middle">sees it clearly, from the stands</text>
      </g>
      <g class="qcell" data-quad="live" tabindex="0" role="button" aria-label="Live player quadrant">
        <rect class="quad" x="260" y="50" width="190" height="100"/>
        <text class="qname" x="355" y="94" text-anchor="middle">Live player</text>
        <text class="qdesc" x="355" y="112" text-anchor="middle">names it, moves on it, keeps going</text>
      </g>
      <g class="qcell" data-quad="drift" tabindex="0" role="button" aria-label="Drift quadrant">
        <rect class="quad" x="70" y="150" width="190" height="100"/>
        <text class="qname" x="165" y="194" text-anchor="middle">Drift</text>
        <text class="qdesc" x="165" y="212" text-anchor="middle">life happens to you</text>
      </g>
      <g class="qcell" data-quad="blur" tabindex="0" role="button" aria-label="The blur quadrant">
        <rect class="quad" x="260" y="150" width="190" height="100"/>
        <text class="qname" x="355" y="194" text-anchor="middle">The blur</text>
        <text class="qdesc" x="355" y="212" text-anchor="middle">motion without a target</text>
      </g>

      <rect class="field" x="70" y="50" width="380" height="200"/>
      <line class="field" x1="260" y1="50" x2="260" y2="250"/>
      <line class="field" x1="70" y1="150" x2="450" y2="150"/>

      <line class="arrow" x1="70" y1="266" x2="450" y2="266"/>
      <path class="arrow" d="M444 261 L452 266 L444 271"/>
      <text class="axlabel" x="70" y="286">Will to move (action plus refusal to accept no)</text>

      <line class="arrow" x1="56" y1="250" x2="56" y2="50"/>
      <path class="arrow" d="M51 56 L56 48 L61 56"/>
      <text class="axlabel" x="0" y="0" transform="translate(46,250) rotate(-90)">Clarity about the problem</text>

      <g class="you" id="ha-you" transform="translate(260,150)" style="opacity:0">
        <circle r="6"/>
        <text y="-13">You</text>
      </g>
    </svg>
    <p class="ha-tally" id="ha-spectrum-say" role="status">Hover or tap a quadrant.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     03 · FIVE LINES OF SOFTWARE
     ═══════════════════════════════════════════════════════ -->
<div class="ha-turn" data-turn="II"><span>Act II</span><b>The first answer describes the current arrangement. It does not define the edge of the possible.</b></div>
<section class="ha-part ha-prose" id="software">
  <h2><span class="n">03</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-chip"></use></svg> Five lines of software</h2>
  <p class="ha-deck">The essay names five beliefs that support independent action.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Five lines, one install</h5>
      </div>
      <span class="ha-lab-hint" id="ha-os-hint">0 of 5 installed</span>
    </div>
    <div class="ha-os" id="ha-os">
      <div class="ha-os-row" data-line="1">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-unlock"></use></svg>
        <a class="nm" href="#soft-1">There is no unsolvable problem</a>
        <span class="say">Does the fix break a law of physics?</span>
        <button class="ha-os-btn" type="button" aria-pressed="false">Install</button>
      </div>
      <div class="ha-os-row" data-line="2">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-fork"></use></svg>
        <a class="nm" href="#soft-2">There is no way</a>
        <span class="say">A routine works when it fits the person.</span>
        <button class="ha-os-btn" type="button" aria-pressed="false">Install</button>
      </div>
      <div class="ha-os-row" data-line="3">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-no-adults"></use></svg>
        <a class="nm" href="#soft-3">There are no adults</a>
        <span class="say">Nobody holds the full picture.</span>
        <button class="ha-os-btn" type="button" aria-pressed="false">Install</button>
      </div>
      <div class="ha-os-row" data-line="4">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-asterisk"></use></svg>
        <a class="nm" href="#soft-4">There is no normal</a>
        <span class="say">People remember the odd choice.</span>
        <button class="ha-os-btn" type="button" aria-pressed="false">Install</button>
      </div>
      <div class="ha-os-row" data-line="5">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-clock"></use></svg>
        <a class="nm" href="#soft-5">There is only now</a>
        <span class="say">Your time to act is always now.</span>
        <button class="ha-os-btn" type="button" aria-pressed="false">Install</button>
      </div>
    </div>
    <div class="ha-os-track" aria-hidden="true"><i id="ha-os-fill"></i></div>
  </div>

  <h3 id="soft-1">1. There is no unsolvable problem</h3>
  <p>Your mind follows the question you give it. Ask what is wrong and it produces problems.
  Ask what is working and it finds different evidence. The quality of the question shapes
  the answer.</p>

  <p>The essay's question is a good one. Does this defy the laws of physics? The answer is
  almost always no, and saying it out loud clears the board.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>The physics gate</h5>
      </div>
      <span class="ha-lab-hint">Four questions, no advice</span>
    </div>
    <div class="ha-field">
      <label class="ha-label" for="ha-gate-input">A problem you have quietly filed as impossible</label>
      <input class="ha-input" id="ha-gate-input" type="text" placeholder="Say it in one line" autocomplete="off">
    </div>
    <div class="ha-btn-row"><button class="ha-btn is-primary" id="ha-gate-btn" type="button">Run the gate</button></div>
    <div class="ha-gate-steps">
      <div class="ha-gate-step">
        <p class="q">Does <span class="ha-gate-echo ha-echo">this</span> break a law of physics?</p>
        <p class="a">Difficulty, cost, and embarrassment do not make a problem physically
        impossible. If the solution obeys physics, a solution can exist.</p>
      </div>
      <div class="ha-gate-step">
        <p class="q">Has any human ever done something in this class?</p>
        <p class="a">In 1961 Claude Shannon and Ed Thorp decided that beating roulette was a
        physics problem they could measure. They built the first wearable computer,
        hid it in a shoe, timed the wheel with a toe switch, and took an edge off the house.
        <a href="https://escholarship.org/content/qt8342j4k0/qt8342j4k0_noSplash_0f0b570acb850337795f8d10911160e8.pdf" target="_blank" rel="noreferrer">Thorp later documented the system</a>.</p>
      </div>
      <div class="ha-gate-step">
        <p class="q">Who told you <span class="ha-gate-echo ha-echo">this</span> was impossible?</p>
        <p class="a">Name the source. Ask what they tested. Many claims of impossibility describe
        one person's failed attempt. That does not establish a physical limit.</p>
      </div>
      <div class="ha-gate-step">
        <p class="q">If it is possible, what is the first hour of work?</p>
        <p class="a">You have moved <span class="ha-gate-echo ha-echo">this</span> from impossible
        to unstarted. Now define the first hour of work.</p>
      </div>
    </div>
  </div>

  <p>David Deutsch explains this with an asteroid. With penguins in charge, the outcome follows
  the rock's physics. With people in charge, the odds change as they learn and act. Drag the slider.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>An asteroid, one year out</h5>
      </div>
      <span class="ha-lab-hint">Illustrative figures only</span>
    </div>
    <label class="ha-label" for="ha-asteroid">How much human agency gets pointed at it</label>
    <input class="ha-range" id="ha-asteroid" type="range" min="0" max="100" value="0" step="1">
    <div class="ha-odds">
      <div class="ha-odds-card">
        <p class="who">Penguins in charge</p>
        <div class="val">100%</div>
        <div class="ha-bar-track"><div class="ha-bar-fill" style="width:100%"></div></div>
        <p class="cap">Fixed. The rock's trajectory is the whole story.</p>
      </div>
      <div class="ha-odds-card">
        <p class="who">Humans in charge</p>
        <div class="val" id="ha-odds-human">100%</div>
        <div class="ha-bar-track"><div class="ha-bar-fill" id="ha-odds-human-bar" style="width:100%"></div></div>
        <p class="cap" id="ha-odds-say">Nobody acts. The rock arrives on schedule.</p>
      </div>
    </div>
    <p style="font-size:var(--fs-2xs);color:var(--muted);margin-top:var(--gap-2);line-height:1.6">
      The numbers are made up. They show why you cannot give fixed odds for anything humans
      are still working on.</p>
  </div>

  <h3 id="soft-2">2. There is no way</h3>
  <p>In <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">the essay's account</a>, Matthew
  Syed describes watching them warm up before Wimbledon. Nadal attacked the practice court
  and soaked his shirt. Djokovic calibrated, shot by shot, without expression. You could hear
  Federer laughing before you saw him, trying trick shots for his own amusement.</p>

  <p>Three routines with nothing in common except that each one belonged to the person doing it.</p>

  <p><a href="https://www.highagency.com/" target="_blank" rel="noreferrer">The essay also recounts</a> a conversation between Leonard Cohen and Bob Dylan in a Paris cafe.
  Dylan asked how long Hallelujah took. Cohen said a couple of years, and was playing it down.
  It took him closer to seven. Cohen asked how long Just Like a Woman took. Fifteen minutes.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Time to write one great song</h5>
      </div>
      <span class="ha-lab-hint">Log scale, or Dylan would be invisible</span>
    </div>
    <div class="ha-dur">
      <div class="ha-dur-row">
        <div class="who">Bob Dylan<small>Just Like a Woman</small></div>
        <div class="ha-dur-bar" data-minutes="15">15 minutes</div>
      </div>
      <div class="ha-dur-row">
        <div class="who">Leonard Cohen<small>Hallelujah</small></div>
        <div class="ha-dur-bar" data-minutes="3679200">about 7 years</div>
      </div>
    </div>
    <p style="font-size:var(--fs-sm);color:var(--muted);margin-top:var(--gap-2);line-height:1.7">
      Both songs endured. Their methods could hardly be more different. A routine works only
      when it fits the person doing the work.</p>
  </div>

  <h3 id="soft-3">3. There are no adults</h3>
  <p>Passivity often comes from believing that competent adults are handling the problem.
  We stop believing in Santa and the tooth fairy, yet keep believing in an unseen group of
  adults who fully understand the situation.</p>

  <p>The cards below summarise examples collected in <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">the original essay</a>. Their mistakes do not cancel their work; they show why no accomplished person should be treated as infallible. Tap a card.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Kill your gurus</h5>
      </div>
      <span class="ha-lab-hint">Tap to see the human underneath</span>
    </div>
    <div class="ha-pedestal" id="ha-pedestal">
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-rocket"></use></svg>Founder</p>
        <p class="nm">Steve Jobs</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Delayed conventional treatment for pancreatic cancer for around nine
        months in favour of diet and alternative medicine. He later told his biographer he
        regretted it.</p>
      </button>
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-music"></use></svg>Composer</p>
        <p class="nm">Mozart</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Earned well and spent worse. He wrote a run of increasingly desperate
        begging letters to a fellow freemason while deep in debt.</p>
      </button>
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-atom"></use></svg>Physicist</p>
        <p class="nm">Isaac Newton</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Left behind roughly a million words on alchemy. His heirs kept the
        papers out of print for generations because they were embarrassing.</p>
      </button>
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-spiral"></use></svg>Philosopher</p>
        <p class="nm">Friedrich Nietzsche</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Proposed to Lou Salome, was refused, and never really recovered. His
        books sold in tiny numbers while he was alive to see it.</p>
      </button>
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-factory"></use></svg>Industrialist</p>
        <p class="nm">Henry Ford</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Used the Dearborn Independent to promote an antisemitic campaign. The
        <a href="https://www.loc.gov/item/2013218776/" target="_blank" rel="noreferrer">Library of Congress documents the paper and its record</a>.</p>
      </button>
      <button class="ha-hero-card" type="button" aria-pressed="false">
        <p class="role"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-feather"></use></svg>Novelist</p>
        <p class="nm">Fyodor Dostoevsky</p>
        <p class="flip-hint">Tap</p>
        <p class="human">Gambled away what he had, signed contracts on terrible terms to cover
        it, and agreed to deadlines no writer could meet.</p>
      </button>
    </div>
    <div class="ha-btn-row"><button class="ha-btn" type="button" id="ha-pedestal-all" data-open="false">Kill your gurus</button></div>
    <p style="font-size:var(--fs-sm);color:var(--muted);margin-top:var(--gap-2);line-height:1.7">
      Their mistakes do not erase their work. They show that accomplished people remain human.
      You do not need to wait for a flawless expert to act.</p>
  </div>

  <h3 id="soft-4">4. There is no normal</h3>
  <p>Trying to look normal has a hidden cost. People hide unusual interests to gain approval,
  then become easier to forget.</p>

  <p>Conventional behaviour is easy in the moment and often forgotten. Unusual acts may feel
  awkward now but become lasting stories. At funerals, people remember specific choices and
  personal quirks.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>What people remember</h5>
      </div>
      <span class="ha-lab-hint">Drag through time</span>
    </div>
    <svg class="ha-decay" viewBox="0 0 520 250" role="img" aria-label="Two curves showing how normal behaviour is forgotten quickly while unusual behaviour persists in memory.">
      <line class="grid" x1="54" y1="40" x2="480" y2="40"/>
      <line class="grid" x1="54" y1="82.5" x2="480" y2="82.5"/>
      <line class="grid" x1="54" y1="125" x2="480" y2="125"/>
      <line class="grid" x1="54" y1="167.5" x2="480" y2="167.5"/>
      <line class="ax" x1="54" y1="30" x2="54" y2="210"/>
      <line class="ax" x1="54" y1="210" x2="486" y2="210"/>
      <text class="tick" x="47" y="44" text-anchor="end">100%</text>
      <text class="tick" x="47" y="214" text-anchor="end">0%</text>
      <text class="tick" x="54" y="230">that evening</text>
      <text class="tick" x="480" y="230" text-anchor="end">at your funeral</text>
      <path class="curve-weird" id="ha-curve-weird"/>
      <path class="curve-normal" id="ha-curve-normal"/>
      <text class="clab" x="300" y="80" fill="var(--cta)">Weird behaviour</text>
      <text class="clab" x="200" y="200" fill="var(--muted)">Normal behaviour</text>
      <line class="scrub" id="ha-decay-scrub" x1="54" y1="30" x2="54" y2="210"/>
      <circle class="dot-normal" id="ha-decay-dot-normal" cx="54" cy="40" r="4.5"/>
      <circle class="dot-weird" id="ha-decay-dot-weird" cx="54" cy="40" r="4.5"/>
    </svg>
    <label class="ha-sr" for="ha-decay-range">Time since the event</label>
    <input class="ha-range" id="ha-decay-range" type="range" min="0" max="100" value="0" step="1">
    <div class="ha-decay-read">
      <div><div class="k">Looking back</div><div class="v" id="ha-decay-when">that evening</div></div>
      <div><div class="k">Normal recalled</div><div class="v" id="ha-decay-val-normal">100%</div></div>
      <div><div class="k">Weird recalled</div><div class="v" id="ha-decay-val-weird">100%</div></div>
    </div>
    <div class="ha-grid cols-3" style="margin-top:var(--gap-3)">
      <div class="ha-card"><span class="tag">Short term</span><h5>Shock</h5><p>You pay for everyone at the table and the table is embarrassed.</p></div>
      <div class="ha-card"><span class="tag">Short term</span><h5>Protest</h5><p>You fly across the world for a birthday and hear you did not have to.</p></div>
      <div class="ha-card"><span class="tag">Short term</span><h5>Anger</h5><p>You give fully honest feedback on someone's idea and they go quiet.</p></div>
      <div class="ha-card"><span class="tag">Long term</span><h5>Their favourite story about you</h5><p>Told at your wedding and, later, at your funeral.</p></div>
      <div class="ha-card"><span class="tag">Long term</span><h5>The thing they tell people</h5><p>Repeated for years, usually with the details improved.</p></div>
      <div class="ha-card"><span class="tag">Long term</span><h5>One of the few they trust</h5><p>Honesty is priced badly in the moment and correctly over a decade.</p></div>
    </div>
  </div>

  <h3 id="soft-5">5. There is only now</h3>
  <p>We remember the past and imagine the future in the present. Our time to act is always now,
  and that time is limited.</p>

  <p><a href="https://www.highagency.com/" target="_blank" rel="noreferrer">The essay recounts a story from film director Kevin Smith</a>. His father spent
  a working life cancelling stamps in a post office to keep a family fed. Smith got a call at
  six in the morning, arrived at the hospital, and read his mother's face before anyone spoke.
  Then his brother told him their father had died screaming. Not as a figure of speech.
  The conclusion Smith drew was that a man can follow every rule and still end that way, so
  the sensible move is to chase the things you actually want while you can.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Your life in months</h5>
      </div>
      <span class="ha-lab-hint">One square is one month</span>
    </div>
    <div class="ha-age-row">
      <label for="ha-age">Your age</label>
      <input id="ha-age" type="number" min="0" max="90" step="1" value="30">
      <span style="font-size:var(--fs-2xs);color:var(--muted)">The grid uses ninety years as a simple planning assumption.</span>
    </div>
    <div class="ha-nows" id="ha-nows" aria-hidden="true"></div>
    <div class="ha-nows-legend">
      <span><i style="background:var(--muted);opacity:0.55"></i>spent</span>
      <span><i style="background:var(--cta)"></i>now</span>
      <span><i style="background:color-mix(in srgb, var(--muted) 16%, transparent)"></i>not yet</span>
    </div>
    <p class="ha-nows-stat" id="ha-nows-stat" role="status"></p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     04 · WILBUR
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="wilbur">
  <h2><span class="n">04</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-plane"></use></svg> The Wilbur case</h2>
  <p class="ha-deck">Wilbur Wright shows all five beliefs in practice. The account below follows
  the <a href="https://airandspace.si.edu/explore/stories/researching-wright-way" target="_blank" rel="noreferrer">Smithsonian's history of the Wrights' research</a>
  and its <a href="https://airandspace.si.edu/stories/editorial/wright-brothers-made-history-kitty-hawk" target="_blank" rel="noreferrer">record of the 1903 flights</a>.</p>

  <p>In 1885 Wilbur Wright was eighteen, healthy, well loved and expected at Yale. Then a boy
  from the neighbourhood hit him in the face with a hockey stick during a skating game. The
  injuries kept coming back. Wilbur spent years unwell with heart palpitations and depression,
  and Yale quietly disappeared from the plan. His mother was dying of tuberculosis in the same
  house. He nursed her until she died in 1889.</p>

  <div class="ha-timeline">
    <div class="ha-tl-item is-low"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-anchor"></use></svg><span class="yr">1885</span><p>Injured in a skating accident at eighteen. Yale is cancelled. <b>Life happening to Wilbur.</b></p></div>
    <div class="ha-tl-item is-low"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-anchor"></use></svg><span class="yr">1886 to 1889</span><p>Largely housebound. Nursing his mother through her final illness.</p></div>
    <div class="ha-tl-item"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-book-open"></use></svg><span class="yr">1890s</span><p>Reads everything. Writes to the Smithsonian in 1899 for every publication they hold on flight. <b>The first act of agency.</b></p></div>
    <div class="ha-tl-item"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-map"></use></svg><span class="yr">1900</span><p>Picks Kitty Hawk from weather data and travels seven hundred miles to a sand bar with a glider.</p></div>
    <div class="ha-tl-item"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-wind"></use></svg><span class="yr">1901 to 1902</span><p>Builds a wind tunnel. Tests around two hundred wing shapes. Rewrites the published aerodynamic tables that were wrong.</p></div>
    <div class="ha-tl-item"><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-plane"></use></svg><span class="yr">17 December 1903</span><p><b>Powered flight.</b> Wilbur's fourth flight of the day lasts 59 seconds and covers 852 feet.</p></div>
  </div>

  <p>During his recovery, Wilbur studied birds as evidence that controlled flight was possible.
  Earlier attempts had failed, sometimes fatally. Public confidence in powered flight remained
  low. The engineering question remained unchanged.</p>

  <p>There was no search engine and no aeronautics degree to enrol in. Wilbur wrote to
  libraries and to the Smithsonian and asked them to send him everything. Then he reasoned in
  a straight line.</p>

  <div class="ha-syllogism" id="ha-syllogism">
    <div class="ha-syl-step"><span class="ix">01</span><span>Birds fly.</span></div>
    <div class="ha-syl-step"><span class="ix">02</span><span>So flight <b>does not defy the laws of physics</b>.</span></div>
    <div class="ha-syl-step"><span class="ix">03</span><span>So a machine can fly.</span></div>
    <div class="ha-syl-step"><span class="ix">04</span><span>So <b>I</b> can build one.</span></div>
  </div>

  <p>The fourth step required personal commitment. Wilbur brought in his brother Orville, and
  they built full-size gliders behind their bicycle shop. They treated each new problem as an
  engineering task.</p>

  <div class="ha-problems">
    <div class="ha-problem">
      <button type="button" aria-expanded="false">
        <span class="pn">P1</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-wind"></use></svg>
        <span class="pt">Dayton, Ohio has the wrong weather for flying</span>
        <span class="chev">&rsaquo;</span>
      </button>
      <div class="ha-problem-body">
        <div class="row"><span class="k">The constraint</span><p class="v">They calculated that they needed steady wind of around fifteen miles an hour and soft sand to crash into. Ohio has neither.</p></div>
        <div class="row"><span class="k">What they did</span><p class="v">Wrote to the US Weather Bureau, got the station data, and read the whole country from first principles. The answer came back as Kitty Hawk, North Carolina.</p></div>
        <div class="row"><span class="k">The move</span><p class="v">They turned a vague complaint about conditions into a query against a dataset that already existed and that anyone could have asked for.</p></div>
      </div>
    </div>
    <div class="ha-problem">
      <button type="button" aria-expanded="false">
        <span class="pn">P2</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-map"></use></svg>
        <span class="pt">Kitty Hawk is seven hundred miles from home</span>
        <span class="chev">&rsaquo;</span>
      </button>
      <div class="ha-problem-body">
        <div class="row"><span class="k">The constraint</span><p class="v">Neither brother had really left Ohio. There was no convenient way to move a glider across the country.</p></div>
        <div class="row"><span class="k">What they did</span><p class="v">Packed the glider, spent days on trains and a boat, and camped in a tent on the dunes for the season. Repeatedly, for four years.</p></div>
        <div class="row"><span class="k">The move</span><p class="v">They acted despite the travel and discomfort. Local opinion did not change the plan.</p></div>
      </div>
    </div>
    <div class="ha-problem">
      <button type="button" aria-expanded="false">
        <span class="pn">P3</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-axes"></use></svg>
        <span class="pt">Nobody knows how to control an aircraft in the air</span>
        <span class="chev">&rsaquo;</span>
      </button>
      <div class="ha-problem-body">
        <div class="row"><span class="k">The constraint</span><p class="v">Everyone else was chasing stability and power. Control in three axes was an unsolved problem that had killed people.</p></div>
        <div class="row"><span class="k">What they did</span><p class="v">Copied birds. Wilbur watched buzzards twist their wingtips to roll, and built wing warping to do the same thing with cable and cloth.</p></div>
        <div class="row"><span class="k">The move</span><p class="v">They also stopped trusting the published lift tables when their gliders underperformed, built a wind tunnel in the shop, and tested around two hundred wing shapes to produce their own numbers.</p></div>
      </div>
    </div>
    <div class="ha-problem">
      <button type="button" aria-expanded="false">
        <span class="pn">P4</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-cog"></use></svg>
        <span class="pt">Every engine that exists is too heavy to leave the ground</span>
        <span class="chev">&rsaquo;</span>
      </button>
      <div class="ha-problem-body">
        <div class="row"><span class="k">The constraint</span><p class="v">They wrote to manufacturers with their power and weight requirement. Nobody could supply it.</p></div>
        <div class="row"><span class="k">What they did</span><p class="v">Their mechanic Charlie Taylor built one in the shop in about six weeks, with an aluminium crankcase to save weight.</p></div>
        <div class="row"><span class="k">The move</span><p class="v">When suppliers could not meet the requirement, they built the part themselves. They also designed propellers because marine theory did not transfer to air.</p></div>
      </div>
    </div>
  </div>

  <p class="mt-md">The four years were difficult. Gliders broke. Calculations turned out to be
  wrong, including ones taken from the recognised authorities. One bad day in 1901 Wilbur told
  Orville that man would not fly in a thousand years. The next morning he was drawing again.</p>

  <div class="ha-quote">
    <p>Not within a thousand years would man ever fly.</p>
    <cite>Wilbur Wright, on the train home from Kitty Hawk, 1901</cite>
  </div>

  <p>On 17 December 1903, they <a href="https://airandspace.si.edu/stories/editorial/wright-brothers-made-history-kitty-hawk" target="_blank" rel="noreferrer">flew four times</a>. Orville's first flight lasted 12 seconds.
  Wilbur's longest lasted 59 seconds and covered 852 feet. They succeeded without institutional
  funding or an aeronautics degree.</p>

  <p>You said you would ring <span class="ha-echo-name">the person you named</span> from that
  cell. Wilbur is the other name on that list, and he never met you.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     05 · THE TRAPS
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="traps">
  <h2><span class="n">05</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-trap"></use></svg> Five low agency traps</h2>
  <p class="ha-deck">The same framework names five habits that weaken agency.</p>

  <p>Low agency can mean staying stuck on a searchable problem, delaying an important call,
  or letting the room's average opinion replace your own judgement.</p>

  <p>Each trap below includes a description, what it sounds like from the inside, and the one
  question that gets you out.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>Five traps, five questions</h5>
      </div>
      <span class="ha-lab-hint">Every card jumps to its escape route</span>
    </div>
    <div class="ha-trapmap">
      <a class="ha-trapcard" href="#trap-vague">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-fog"></use></svg>
        <span class="tn">Trap 01</span>
        <b>Vague</b>
        <span class="ask">Get it out of your head.</span>
      </a>
      <a class="ha-trapcard" href="#trap-midwit">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-bellcurve"></use></svg>
        <span class="tn">Trap 02</span>
        <b>Midwit</b>
        <span class="ask">Invert it.</span>
      </a>
      <a class="ha-trapcard" href="#trap-attachment">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-anchor"></use></svg>
        <span class="tn">Trap 03</span>
        <b>Attachment</b>
        <span class="ask">Ten times the agency.</span>
      </a>
      <a class="ha-trapcard" href="#trap-rumination">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-loop"></use></svg>
        <span class="tn">Trap 04</span>
        <b>Rumination</b>
        <span class="ask">Act on it now.</span>
      </a>
      <a class="ha-trapcard" href="#trap-overwhelm">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-mountain"></use></svg>
        <span class="tn">Trap 05</span>
        <b>Overwhelm</b>
        <span class="ask">Find level one.</span>
      </a>
    </div>
  </div>

  <!-- Vague -->
  <div class="ha-trap" id="trap-vague">
    <h4><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-fog"></use></svg><span class="tn">TRAP 01</span> The vague trap</h4>
    <p>The vague trap avoids stating the problem clearly. A person can think for years without
    defining what needs to change. Images and moods feel important but give action no target.</p>
    <p class="sounds">Things have not really been right for a while and I am not sure what to do about it.</p>
    <div class="ha-escape">
      <span class="k">Escape route</span>
      <p class="ask">Get the problem out of your head and into another medium.</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0">Write it down.
      Draw it. Use a whiteboard. Say it out loud to someone who will interrupt you. Giving the
      thought a form exposes what is unclear. Walt Disney mapped the whole
      empire on one sheet in 1957. Christopher Nolan drew the plot of Inception because it
      could not be held in a sentence.</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0.6rem 0 0">
      Vague problems usually come from vague questions. <b style="color:var(--text)">What career
      should I choose</b> gives you nothing. <b style="color:var(--text)">What does my ideal week
      look like hour by hour, what does my worst week look like, and where is my current week
      sitting between them</b> gives you something to act on this evening.</p>
    </div>
  </div>

  <!-- Midwit -->
  <div class="ha-trap" id="trap-midwit">
    <h4><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-bellcurve"></use></svg><span class="tn">TRAP 02</span> The midwit trap</h4>
    <p>The midwit trap makes a simple task needlessly complex. One person takes the obvious
    action. Another studies the problem and returns to that same action. The person in the
    middle mistakes complexity for intelligence.</p>
    <p class="sounds">Before I start, I should understand everything properly.</p>

    <div class="ha-lab">
      <div class="ha-lab-head">
        <div><h5>The curve</h5></div>
        <span class="ha-lab-hint">Hover or tap a point</span>
      </div>
      <svg class="ha-midwit" id="ha-midwit" viewBox="0 0 520 220" role="img" aria-label="A bell curve with three points marked: left tail, midwit, right tail.">
        <path class="bell" d="M40 180 C150 180, 170 40, 260 40 C350 40, 370 180, 480 180 Z"/>
        <line class="base" x1="30" y1="180" x2="490" y2="180"/>
        <g class="mw" data-mw="left" tabindex="0" role="button" aria-label="Left tail">
          <circle cx="100" cy="155" r="22" fill="transparent"/>
          <circle class="mwdot" cx="100" cy="155" r="7"/>
          <text class="mwlab" x="100" y="202">Left tail</text>
        </g>
        <g class="mw" data-mw="mid" tabindex="0" role="button" aria-label="Midwit">
          <circle cx="260" cy="52" r="22" fill="transparent"/>
          <circle class="mwdot" cx="260" cy="52" r="7"/>
          <text class="mwlab" x="260" y="202">Midwit</text>
        </g>
        <g class="mw" data-mw="right" tabindex="0" role="button" aria-label="Right tail">
          <circle cx="420" cy="155" r="22" fill="transparent"/>
          <circle class="mwdot" cx="420" cy="155" r="7"/>
          <text class="mwlab" x="420" y="202">Right tail</text>
        </g>
      </svg>
      <div class="ha-midwit-say" id="ha-midwit-say" role="status">
        <p class="who">The goal</p>
        <p>I want to become a better writer. Tap each point on the curve to see what they do about it.</p>
      </div>
    </div>

    <div class="ha-escape">
      <span class="k">Escape route</span>
      <p class="ask">What would the person on the left do? Find it by inverting.</p>
      <div class="ha-lab" style="margin-top:0.8rem">
        <div class="ha-field">
          <label class="ha-label" for="ha-invert-input">Something you want to get better at</label>
          <input class="ha-input" id="ha-invert-input" type="text" placeholder="For example: become a better writer" autocomplete="off">
        </div>
        <div class="ha-btn-row"><button class="ha-btn is-primary" id="ha-invert-btn" type="button">Invert it</button></div>
        <div class="ha-invert-out" id="ha-invert-out">
          <div class="ha-invert-cols">
            <div class="ha-invert-col bad" id="ha-invert-bad" tabindex="-1">
              <h6>How to guarantee failure at <span class="ha-invert-goal">this</span></h6>
              <ul>
                <li>Do not do it at all</li>
                <li>Do it inconsistently, in bursts, then stop</li>
                <li>Only do the parts that bore you</li>
                <li>Never show it to anyone who would tell you the truth</li>
                <li>Wait for the conditions to be right first</li>
              </ul>
            </div>
            <div class="ha-invert-col good">
              <h6>Flip each one</h6>
              <ul>
                <li>Do it</li>
                <li>Do it consistently, on a schedule you can keep</li>
                <li>Do the parts that genuinely interest you</li>
                <li>Show it to one person who will be honest</li>
                <li>Start under the conditions you have today</li>
              </ul>
            </div>
          </div>
          <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:var(--gap-2) 0 0">
            The right column is simple. Try it before adding another layer to the plan.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Attachment -->
  <div class="ha-trap" id="trap-attachment">
    <h4><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-anchor"></use></svg><span class="tn">TRAP 03</span> The attachment trap</h4>
    <p>The attachment trap treats old assumptions as facts. Once the frame feels fixed, every
    new fact gets forced into it. The essay calls this “last principles” thinking: reasoning
    from an assumption that was never tested.</p>
    <p class="sounds">People like me do not get into rooms like that.</p>
    <div class="ha-escape">
      <span class="k">Escape route</span>
      <p class="ask">What would I do if I had ten times the agency?</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0">The question
      forces you to inspect the assumptions. The frame may be creating the limit.</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0.6rem 0 0">
      The bouncer says you are not coming in tonight. You can accept that as a fact about
      reality, or you can ask the question and watch options appear. Go round the back. Find
      who owns the venue. Come back in a different outfit. Arrive with a camera crew and let
      the club decide whether it wants footage of itself turning someone away.</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0.6rem 0 0">
      A version that works better for some people: imagine an identical twin whose only job is
      to have ten times your agency. What would they try this week?</p>
    </div>
  </div>

  <!-- Rumination -->
  <div class="ha-trap" id="trap-rumination">
    <h4><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-loop"></use></svg><span class="tn">TRAP 04</span> The rumination trap</h4>
    <p>The rumination trap repeats “what if it goes wrong?” until time runs out. No option is
    perfect, so the person delays every option.</p>
    <p class="sounds">I have spent five years thinking about moving. Every version I imagine has something wrong with it.</p>

    <div class="ha-lab">
      <div class="ha-lab-head">
        <div><h5>The loop</h5></div>
        <span class="ha-lab-hint">It only ends one way</span>
      </div>
      <svg class="ha-loop" id="ha-loop" viewBox="0 0 340 240" role="img" aria-label="A circular loop of ruminating thoughts, with an exit marked take one action.">
        <circle class="ring spin" cx="170" cy="120" r="80"/>
        <g class="exit">
          <line x1="170" y1="120" x2="312" y2="52"/>
          <path d="M312 52 L298 50 L303 62 Z" fill="var(--cta)" stroke="none"/>
          <text x="248" y="34">Take one action</text>
        </g>
        <ellipse class="node" cx="170" cy="40" rx="60" ry="20"/>
        <text class="ntext" x="170" y="44">what if it goes wrong</text>
        <ellipse class="node" cx="262" cy="120" rx="52" ry="20"/>
        <text class="ntext" x="262" y="124">need more info</text>
        <ellipse class="node" cx="170" cy="200" rx="60" ry="20"/>
        <text class="ntext" x="170" y="204">not the right time</text>
        <ellipse class="node" cx="78" cy="120" rx="52" ry="20"/>
        <text class="ntext" x="78" y="124">think it through</text>
      </svg>
      <div class="ha-btn-row"><button class="ha-btn is-primary" id="ha-loop-btn" type="button">Take one action now</button></div>
      <p class="ha-tally" id="ha-loop-say" role="status">Round and round. Each lap feels like progress because it uses the same energy as thinking.</p>
    </div>

    <div class="ha-escape">
      <span class="k">Escape route</span>
      <p class="ask">How can I take action on this now?</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0">Treat
      rumination as a warning. Respond with an action that can produce useful evidence.</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0.6rem 0 0">
      Turn the decision into an experiment. If you are 60% confident that another city would
      suit you better, visit it and collect evidence. Running the test is progress. Five years
      of thought cannot replace direct experience.</p>
    </div>
  </div>

  <!-- Overwhelm -->
  <div class="ha-trap" id="trap-overwhelm">
    <h4><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-mountain"></use></svg><span class="tn">TRAP 05</span> The overwhelm trap</h4>
    <p>The overwhelm trap compares where you are now with the final goal in one step.
    Learning quantum mechanics, earning a black belt, or building an aeroplane then feels
    like one impossible action.</p>
    <p class="sounds">I would not even know where to begin.</p>
    <p>Games begin at level one. The first task is small enough to begin
    and useful enough to lead into the second.</p>

    <div class="ha-lab">
      <div class="ha-lab-head">
        <div><h5>Build the first five levels</h5></div>
        <span class="ha-lab-hint">Level 100 goes in the box</span>
      </div>
      <div class="ha-field">
        <label class="ha-label" for="ha-level-input">The thing that feels too big</label>
        <input class="ha-input" id="ha-level-input" type="text" placeholder="For example: teach myself quantum mechanics" autocomplete="off">
      </div>
      <div class="ha-btn-row"><button class="ha-btn is-primary" id="ha-level-btn" type="button">Generate the ladder</button></div>
      <div class="ha-levels" id="ha-levels"></div>
    </div>

    <div class="ha-escape">
      <span class="k">Escape route</span>
      <p class="ask">What is the smallest first step I can take?</p>
      <p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7;margin:0">Level one is
      small enough to do today. It may be no more than writing possible levels two to five.
      You need a first step before you need a complete map.</p>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     06 · THE GAME
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="game">
  <h2><span class="n">06</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-gamepad"></use></svg> Which trap is yours?</h2>
  <p class="ha-deck">Six ordinary situations. Four plausible responses each. One of them is the
  high agency move and the other three are traps wearing sensible clothes.</p>

  <p>Answer the way you would actually behave on a normal Tuesday. The pattern at the end is
  worth more than any single answer.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div><h5>Six situations</h5></div>
      <span class="ha-lab-hint">No right answer is announced until you pick</span>
    </div>
    <div class="ha-game-stage" id="ha-game-stage"></div>
    <div class="ha-game-summary" id="ha-game-summary"></div>
    <div class="ha-game-meta">
      <div class="ha-pips" id="ha-game-pips" aria-hidden="true"></div>
      <div class="ha-btn-row" style="margin:0">
        <button class="ha-btn is-primary" id="ha-game-next" type="button" disabled>Next situation</button>
        <button class="ha-btn" id="ha-game-restart" type="button">Play again</button>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     07 · TOOLS
     ═══════════════════════════════════════════════════════ -->
<div class="ha-turn" data-turn="III"><span>Act III</span><b>Agency becomes visible when analysis ends and contact with reality begins.</b></div>
<section class="ha-part ha-prose" id="tools">
  <h2><span class="n">07</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-toolbox"></use></svg> Five tools</h2>
  <p class="ha-deck">The essay closes with practical tools. I made the first one clickable because
  using a flow chart teaches you more than looking at one.</p>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-flow"></use></svg>Tool 1. The high agency flow chart</h3>
  <p>Bring one stuck problem. Answer honestly. Every terminal node is either a named trap with
  an escape route, or the news that you already have agency here and can stop diagnosing.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div><h5>Walk the chart</h5></div>
      <span class="ha-lab-hint">Click a lit node to jump back</span>
    </div>
    <div class="ha-flow-wrap">
      <svg class="ha-flow" id="ha-flow" viewBox="0 0 620 560" role="img" aria-label="A decision flow chart routing a stuck problem to one of five low agency traps or to a clear outcome.">
        <!-- edges: left column -->
        <line class="fedge" data-from="n0" data-to="n1" x1="150" y1="48" x2="150" y2="76"/>
        <line class="fedge" data-from="n1" data-to="n2" x1="150" y1="116" x2="150" y2="144"/>
        <line class="fedge" data-from="n2" data-to="n3" x1="150" y1="184" x2="150" y2="212"/>
        <line class="fedge" data-from="n3" data-to="n4" x1="150" y1="252" x2="150" y2="280"/>
        <line class="fedge" data-from="n4" data-to="n5" x1="150" y1="320" x2="150" y2="348"/>
        <line class="fedge" data-from="n5" data-to="n6" x1="150" y1="388" x2="150" y2="416"/>
        <line class="fedge" data-from="n6" data-to="n7" x1="150" y1="456" x2="150" y2="484"/>
        <!-- edges: to outcomes -->
        <line class="fedge" data-from="n1" data-to="o1" x1="255" y1="96" x2="350" y2="96"/>
        <line class="fedge" data-from="n2" data-to="o2" x1="255" y1="164" x2="350" y2="164"/>
        <line class="fedge" data-from="n3" data-to="o3" x1="255" y1="232" x2="350" y2="232"/>
        <line class="fedge" data-from="n4" data-to="o4" x1="255" y1="300" x2="350" y2="300"/>
        <line class="fedge" data-from="n5" data-to="o5" x1="255" y1="368" x2="350" y2="368"/>
        <line class="fedge" data-from="n6" data-to="o6" x1="255" y1="436" x2="350" y2="436"/>
        <!-- edge labels -->
        <text class="elabel" data-from="n1" data-to="n2" x="157" y="134">Yes</text>
        <text class="elabel" data-from="n2" data-to="n3" x="157" y="202">No</text>
        <text class="elabel" data-from="n3" data-to="n4" x="157" y="270">No</text>
        <text class="elabel" data-from="n4" data-to="n5" x="157" y="338">No</text>
        <text class="elabel" data-from="n5" data-to="n6" x="157" y="406">Yes</text>
        <text class="elabel" data-from="n6" data-to="n7" x="157" y="474">Yes</text>
        <text class="elabel" data-from="n1" data-to="o1" x="302" y="90" text-anchor="middle">No</text>
        <text class="elabel" data-from="n2" data-to="o2" x="302" y="158" text-anchor="middle">Yes</text>
        <text class="elabel" data-from="n3" data-to="o3" x="302" y="226" text-anchor="middle">Yes</text>
        <text class="elabel" data-from="n4" data-to="o4" x="302" y="294" text-anchor="middle">Yes</text>
        <text class="elabel" data-from="n5" data-to="o5" x="302" y="362" text-anchor="middle">No</text>
        <text class="elabel" data-from="n6" data-to="o6" x="302" y="430" text-anchor="middle">No</text>

        <!-- left column nodes -->
        <g class="fnode" data-node="n0"><rect x="45" y="10" width="210" height="38" rx="8"/><text x="150" y="34">Something is stuck</text></g>
        <g class="fnode" data-node="n1"><rect x="45" y="76" width="210" height="40" rx="8"/><text x="150" y="92">Can you say it in</text><text x="150" y="107">one plain sentence?</text></g>
        <g class="fnode" data-node="n2"><rect x="45" y="144" width="210" height="40" rx="8"/><text x="150" y="160">Does the fix defy</text><text x="150" y="175">the laws of physics?</text></g>
        <g class="fnode" data-node="n3"><rect x="45" y="212" width="210" height="40" rx="8"/><text x="150" y="228">Are you assuming a</text><text x="150" y="243">limit you never tested?</text></g>
        <g class="fnode" data-node="n4"><rect x="45" y="280" width="210" height="40" rx="8"/><text x="150" y="296">Is the plan bigger</text><text x="150" y="311">than the goal?</text></g>
        <g class="fnode" data-node="n5"><rect x="45" y="348" width="210" height="40" rx="8"/><text x="150" y="372">Do you know what level one is?</text></g>
        <g class="fnode" data-node="n6"><rect x="45" y="416" width="210" height="40" rx="8"/><text x="150" y="440">Have you done level</text><text x="150" y="455">one today?</text></g>
        <g class="fnode is-term" data-node="n7"><rect x="45" y="484" width="210" height="38" rx="8"/><text x="150" y="508">You have agency here</text></g>

        <!-- outcomes -->
        <g class="fnode is-term" data-node="o1"><rect x="350" y="78" width="235" height="36" rx="8"/><text x="467" y="101">The vague trap</text></g>
        <g class="fnode is-term" data-node="o2"><rect x="350" y="144" width="235" height="40" rx="8"/><text x="467" y="160">A genuine limit.</text><text x="467" y="175">Spend your agency elsewhere</text></g>
        <g class="fnode is-term" data-node="o3"><rect x="350" y="214" width="235" height="36" rx="8"/><text x="467" y="237">The attachment trap</text></g>
        <g class="fnode is-term" data-node="o4"><rect x="350" y="282" width="235" height="36" rx="8"/><text x="467" y="305">The midwit trap</text></g>
        <g class="fnode is-term" data-node="o5"><rect x="350" y="350" width="235" height="36" rx="8"/><text x="467" y="373">The overwhelm trap</text></g>
        <g class="fnode is-term" data-node="o6"><rect x="350" y="418" width="235" height="36" rx="8"/><text x="467" y="441">The rumination trap</text></g>
      </svg>
    </div>
    <div class="ha-flow-say" id="ha-flow-say" role="status"></div>
  </div>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-users"></use></svg>Tool 2. The Swedish House Mafia technique</h3>
  <p>This technique comes from <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">the original essay</a>.
  Gather the sharpest people you know. State the real problem without protecting your pride.
  Shut the door, put the phones away, test ideas against one another, and act on the strongest
  option before the group leaves.</p>
  <div class="ha-grid cols-4 ha-mafia" id="ha-mafia">
    <button type="button" class="ha-card" data-ha-mafia="0"><span class="tag">Step 1</span><h5><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-users"></use></svg>Gather</h5><p>Invite people who will challenge your thinking.</p></button>
    <button type="button" class="ha-card" data-ha-mafia="1"><span class="tag">Step 2</span><h5><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-message"></use></svg>Confess</h5><p>The real problem, stated plainly.</p></button>
    <button type="button" class="ha-card" data-ha-mafia="2"><span class="tag">Step 3</span><h5><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-door"></use></svg>Seal</h5><p>Door shut. Phones down.</p></button>
    <button type="button" class="ha-card" data-ha-mafia="3"><span class="tag">Step 4</span><h5><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-bolt"></use></svg>Rally</h5><p>Ideas back and forth. Act before you leave.</p></button>
  </div>
  <p class="ha-mafia-read" id="ha-mafia-read" role="status">Run the room in order. The method ends in action, not a better meeting.</p>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-razor"></use></svg>Tool 3. The story razor</h3>
  <p>When two options are otherwise equal, ask which one makes the better story. The essay
  attributes this rule to <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">Amjad Masad</a>.
  Use it only as a tie-breaker after evaluating risk. If both choices are sound, choose the one
  that puts you in the active role.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div><h5>Apply the razor</h5></div>
      <span class="ha-lab-hint">Two live options</span>
    </div>
    <svg class="ha-scale" id="ha-scale" viewBox="0 0 520 176" role="img" aria-label="A balance scale with a pan for option A and a pan for option B. Choosing an option tips the beam towards it.">
      <path class="stand" d="M212 162h96M260 162V90"/>
      <path class="pivot" d="m260 62 15 28h-30Z"/>
      <g class="beam" id="ha-scale-beam">
        <line class="arm" x1="110" y1="64" x2="410" y2="64"/>
        <g class="pan pan-a">
          <line class="cord" x1="110" y1="64" x2="110" y2="96"/>
          <path class="dish" d="M74 96h72l-13 22H87Z"/>
          <text class="plab" x="110" y="113">A</text>
        </g>
        <g class="pan pan-b">
          <line class="cord" x1="410" y1="64" x2="410" y2="96"/>
          <path class="dish" d="M374 96h72l-13 22h-46Z"/>
          <text class="plab" x="410" y="113">B</text>
        </g>
      </g>
      <text class="slab" x="110" y="146">the sensible one</text>
      <text class="slab" x="410" y="146">the one that scares you</text>
    </svg>
    <div class="ha-razor">
      <div class="ha-razor-opt">
        <label class="ha-label" for="ha-razor-a">Option A</label>
        <input class="ha-input" id="ha-razor-a" type="text" placeholder="The sensible one" autocomplete="off">
        <div class="ha-btn-row"><button class="ha-btn" type="button" data-razor="a">Better story</button></div>
      </div>
      <div class="ha-razor-opt">
        <label class="ha-label" for="ha-razor-b">Option B</label>
        <input class="ha-input" id="ha-razor-b" type="text" placeholder="The one that scares you" autocomplete="off">
        <div class="ha-btn-row"><button class="ha-btn" type="button" data-razor="b">Better story</button></div>
      </div>
    </div>
    <p class="ha-razor-verdict" id="ha-razor-out" role="status"></p>
  </div>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-message"></use></svg>Tool 4. Ask for help, properly</h3>
  <p><a href="https://sive.rs/ment" target="_blank" rel="noreferrer">Derek Sivers describes having three mentors</a>. When he gets stuck he writes the problem out
  for them: the context, the options, and what he thinks about each one, compressed so as not
  to waste their time. Then he predicts their reply and edits the note to address it. Then he
  predicts the reply to that. By the end the answer is usually obvious and he does not send it.
  None of the three know they are mentors.</p>
  <div class="ha-quote">
    <p>Writing for a demanding reader can expose the answer before you send the question.</p>
    <cite>My reading of Sivers</cite>
  </div>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>The draft that answers itself</h5>
      </div>
      <span class="ha-lab-hint">Four passes, nothing sent</span>
    </div>
    <div class="ha-drafts">
      <div class="ha-draft">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-pen"></use></svg>
        <span class="s">Pass 1</span><b>Write it out</b>
        <small>Context, options, your read on each.</small>
      </div>
      <i aria-hidden="true">→</i>
      <div class="ha-draft">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-message"></use></svg>
        <span class="s">Pass 2</span><b>Predict the reply</b>
        <small>You know these three people well enough.</small>
      </div>
      <i aria-hidden="true">→</i>
      <div class="ha-draft">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-checklist"></use></svg>
        <span class="s">Pass 3</span><b>Edit to answer it</b>
        <small>The weak part of the note shows itself here.</small>
      </div>
      <i aria-hidden="true">→</i>
      <div class="ha-draft">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-loop"></use></svg>
        <span class="s">Pass 4</span><b>Predict that reply</b>
        <small>Run the same move on the sharper draft.</small>
      </div>
      <i aria-hidden="true">→</i>
      <div class="ha-draft is-out">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-check"></use></svg>
        <span class="s">Outcome</span><b>You know the answer</b>
        <small>The note stays in drafts.</small>
      </div>
    </div>
  </div>

  <h3><svg class="ha-i ha-i-h3" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-lens"></use></svg>Tool 5. A change of perspective is worth fifty IQ points</h3>
  <p><a href="https://www.highagency.com/" target="_blank" rel="noreferrer">The essay uses this parable</a>: a wealthy man walks into a New York bank and asks to borrow five thousand dollars for two
  weeks. The bank wants security, so he hands over the keys to a Rolls Royce. Staff laugh about
  it after he leaves and park the car in the basement. He returns, repays the loan with about
  fifteen dollars of interest, and is asked why a millionaire needed five thousand dollars.
  His answer is that he could not find anywhere else in Manhattan to park for two weeks at that
  price.</p>
  <p>Whether or not the story happened, pricing the transaction as parking reveals an option
  that the loan frame hides.</p>

  <div class="ha-lab">
    <div class="ha-lab-head">
      <div>
        <h5>One transaction, two frames</h5>
      </div>
      <span class="ha-lab-hint">Nothing about the facts changed</span>
    </div>
    <div class="ha-reframe">
      <div class="ha-frame">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-coins"></use></svg>
        <span class="k">The obvious frame</span>
        <b>A small loan against a car</b>
        <p>The bank sees security, paperwork, and about fifteen dollars of interest.</p>
      </div>
      <div class="ha-frame-swap" aria-hidden="true">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-lens"></use></svg>
        <span>same facts</span>
      </div>
      <div class="ha-frame is-on">
        <svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-key"></use></svg>
        <span class="k">The better frame</span>
        <b>Two weeks of secure parking</b>
        <p>The same paperwork, priced against every garage in Manhattan.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     08 · THE EXERCISE
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="exercise">
  <h2><span class="n">08</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-clipboard"></use></svg> Turn intention into action</h2>
  <p class="ha-deck">Reading changes nothing by itself. This ten-minute exercise asks you to act.</p>

  <p><a href="https://www.highagency.com/" target="_blank" rel="noreferrer">The essay proposes starting from a value</a>,
  then turning it into visible action. Choose something you care about. Write ten concrete ways
  to express it. Pick one that stretches you, divide it into small steps, and begin now.</p>

  <div class="ha-lab" id="ha-worksheet">
    <div class="ha-lab-head">
      <div><h5>Your sheet</h5></div>
      <span class="ha-lab-hint" id="ha-ws-status">Stays in this browser</span>
    </div>

    <div class="ha-ws-step" data-step="1">
      <h6>Name a value</h6>
      <p class="sub">Something vague and real. Gratitude, loyalty, courage, curiosity, love, ambition.</p>
      <label class="ha-sr" for="ha-ws-value">Your value</label>
      <input class="ha-input" id="ha-ws-value" type="text" placeholder="For example: gratitude" autocomplete="off">
    </div>

    <div class="ha-ws-step" data-step="2">
      <h6>Ten specific ways to make it real</h6>
      <p class="sub">Write quickly. Each line must describe an action another person could observe.</p>
      <div class="ha-dump-list" id="ha-ws-dump"></div>
    </div>

    <div class="ha-ws-step" data-step="3">
      <h6>Pick one</h6>
      <p class="sub">Choose one that matters and feels slightly uncomfortable. Do not confuse danger with useful discomfort.</p>
      <p id="ha-ws-chosen" style="font-size:var(--fs-sm);line-height:1.7;margin:0;color:var(--muted)"></p>
    </div>

    <div class="ha-ws-step" data-step="4">
      <h6>Break it into micro steps</h6>
      <p class="sub">Find the address. Write the thing. Press send. Small enough that none of them can be argued with.</p>
      <div class="ha-micro-list" id="ha-ws-micro"></div>
    </div>

    <div class="ha-ws-step" data-step="5">
      <h6>Do them now</h6>
      <p class="sub">Not tonight. Not this weekend. Tick them off above as they happen.</p>
      <div class="ha-btn-row">
        <button class="ha-btn is-primary" id="ha-ws-export" type="button">Copy my sheet</button>
        <button class="ha-btn" id="ha-ws-clear" type="button">Clear the sheet</button>
      </div>
    </div>

    <div class="ha-ws-step" data-step="6">
      <h6>Notice what it feels like</h6>
      <p class="sub">Record what you completed. Return tomorrow and repeat it. Your actions provide
      stronger evidence about your priorities than your intentions do.</p>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     09 · LIBRARY
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="library">
  <h2><span class="n">09</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-books"></use></svg> The library</h2>
  <p class="ha-deck">Examples collected in <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">the original essay</a>, followed by my lesson from each. Unless another source is linked, treat them as the essay's accounts.</p>

  <div class="ha-lib">
    <div class="ha-lib-card">
      <h5>A truck driver and a photocopier</h5>
      <p>A twenty year old lorry driver wanted to make films and could not pay for film school.
      Between shifts he sat in the USC library, pulled the staples out of film students' theses,
      and photocopied them. Six months of that gave him an education in effects and cinematography.
      His name is James Cameron.</p>
      <p class="lesson">Film-school tuition was closed to him. The theses in its library were available.</p>
    </div>
    <div class="ha-lib-card">
      <h5>A six year old and a YouTube search</h5>
      <p>Cole Summers asked his father how people get rich. His father, recovering from a long run
      of surgeries, told him to go and watch videos about Warren Buffett. He set up a company at
      seven breeding rabbits, taught himself corporate tax at nine, and bought and renovated a
      house at ten using YouTube for the trades.</p>
      <p class="lesson">Nobody checked whether he was old enough to begin. He did not check either.</p>
    </div>
    <div class="ha-lib-card">
      <h5>Burn the boats</h5>
      <p>Good intentions do not guarantee action. A public commitment can add a real social cost
      to quitting. The added cost can help, although it does not guarantee follow-through.</p>
      <p class="lesson">Design the consequence before you need the motivation.</p>
    </div>
    <div class="ha-lib-card">
      <h5>The ticking clock</h5>
      <p>The essay's example is an offer structured so the payment falls every month it goes
      undelivered. You do not need to feel motivated when the cost of a slow week is written on
      the wall in front of you.</p>
      <p class="lesson">Put urgency into the terms of the commitment.</p>
    </div>
    <div class="ha-lib-card">
      <h5>The trillion dollar test</h5>
      <p>If solving this paid a trillion dollars, and failing carried a death sentence, would you
      find a way? If the answer is yes, the problem was never capability. It was price.</p>
      <p class="lesson">“Impossible” may mean that the current cost exceeds your commitment.</p>
    </div>
    <div class="ha-lib-card">
      <h5>The suitcase</h5>
      <p>People walked on the moon before wheeled luggage became a commercial product. Bernard
      Sadow filed his <a href="https://patents.google.com/patent/US3653474A/en" target="_blank" rel="noreferrer">rolling-luggage patent in 1970</a>.</p>
      <p class="lesson">Ordinary objects can carry obvious problems for years.</p>
    </div>
  </div>

  <div class="ha-lab" id="hafig-gate">
    <div class="ha-lab-head">
      <div><h5>What stood in the way</h5></div>
      <span class="ha-lab-hint">Pick a case</span>
    </div>
    <div class="hg-pick" id="hg-pick" role="group" aria-label="Choose a case"></div>
    <div class="hg-gates">
      <div class="hg-gate assumed"><span class="k">What looked like the barrier</span><b id="hg-assumed">&nbsp;</b></div>
      <div class="hg-gate real"><span class="k">What stopped them</span><b id="hg-real">&nbsp;</b></div>
    </div>
    <p class="ha-tally" id="hg-say" role="status">Six cases, one shape. Select any of them.</p>
  </div>

  <div class="ha-lab" id="hafig-test">
    <div class="ha-lab-head">
      <div><h5>Test the gate</h5></div>
      <span class="ha-lab-hint">Drag how many you push on</span>
    </div>
    <div class="hg-row" id="hgt-row"><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Film school tuition</em><em class="open">the theses sat in an open library</em></span><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Being six years old</em><em class="open">nobody asked his age</em></span><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Unreliable motivation</em><em class="open">a public commitment supplied the cost</em></span><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Not feeling urgent</em><em class="open">the terms could carry a clock</em></span><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Not capable enough</em><em class="open">the price was the obstacle</em></span><span class="hgt-cell"><i aria-hidden="true"></i><em class="shut">Luggage must be carried</em><em class="open">nothing held the wheels off</em></span></div>
    <label class="hg-ctl" for="hgt-range">How many of the six barriers you test</label>
    <input class="ha-range" id="hgt-range" type="range" min="0" max="6" value="0" step="1">
    <div class="hg-read">
      <div><b id="hgt-open">0</b><span>found open</span></div>
      <div><b id="hgt-shut">6</b><span>still assumed shut</span></div>
      <p id="hgt-say" role="status"></p>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     10 · WHY I KEEP THIS
     ═══════════════════════════════════════════════════════ -->
<section class="ha-part ha-prose" id="why">
  <h2><span class="n">10</span><svg class="ha-i ha-i-h2" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-compass"></use></svg> Why I keep this page</h2>

  <p>My research measures how safety alignment changes a model's calibration and where the cost
  is greatest. That work connects directly to this essay.</p>

  <p>In my work, vague questions often hide behind “more thinking,” while over-scoping hides
  behind “being thorough.” I make progress when I can state a claim plainly enough to test and
  disprove it. The essay demands the same discipline.</p>

  <p>There is one place I would push back. Disagreeability is a real ingredient and it is also
  the one most easily faked. Refusing to update looks identical to independent thinking from
  the inside, and it feels better. The version I want is the one Wilbur had. He distrusted the
  published lift tables enough to build a wind tunnel. The brothers tested their assumptions and
  produced more accurate data, as the <a href="https://airandspace.si.edu/explore/stories/researching-wright-way" target="_blank" rel="noreferrer">Smithsonian record explains</a>. They verified the claim themselves and had the
  nerve to act on the result.</p>

  <p>The other line I keep is that limits are the work. If the honest answer is that you cannot
  yet do the thing, that is a finding, and findings are useful in both directions.</p>

  <div class="ha-coda" aria-label="The high-agency loop: see the situation, locate the movable constraint, act, and let reality answer">
    <div class="ha-coda-path">
      <div><span>01</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-eye"></use></svg><b>See what is true</b><small>not what is customary</small></div>
      <i aria-hidden="true">→</i>
      <div><span>02</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-key"></use></svg><b>Find what can move</b><small>a rule, price, path, person, or skill</small></div>
      <i aria-hidden="true">→</i>
      <div><span>03</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-target"></use></svg><b>Make contact</b><small>test it in the world</small></div>
      <i aria-hidden="true">→</i>
      <div class="answer"><span>04</span><svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#hai-verify"></use></svg><b>Let reality answer</b><small>then update without vanity</small></div>
    </div>
    <p class="ha-coda-line">Test the route before treating the limit as fixed.</p>
  </div>

  <div class="ha-badges" id="badges">
    <div class="ha-badges-head">
      <div>
        <h5>Twelve things this page asks you to do</h5>
      </div>
      <span class="ha-badges-count"><b id="ha-badge-n">0</b> of 12</span>
    </div>
    <div class="ha-badges-track" aria-hidden="true"><i id="ha-badge-fill"></i></div>
    <div class="ha-badge-grid" id="ha-badge-grid" role="list" aria-label="Progress badges"></div>
    <p class="ha-badges-foot" id="ha-badge-foot" role="status"></p>
    <div class="ha-btn-row"><button class="ha-btn" id="ha-badge-reset" type="button">Reset my progress</button></div>
  </div>

  <div class="ha-credit">
    <p><b style="color:var(--text)">Credit.</b> Every idea, story and framing on this page comes
    from <a href="https://www.highagency.com/" target="_blank" rel="noreferrer">High Agency</a>
    by <a href="https://x.com/george__mack" target="_blank" rel="noreferrer">George Mack</a>,
    The words, diagrams, and interactions here are my interpretation; the central ideas are his.
    Read the original.</p>
    <p>Historical details on the Wright brothers are checked against the
    <a href="https://airandspace.si.edu/stories/editorial/wright-brothers-made-history-kitty-hawk" target="_blank" rel="noreferrer">Smithsonian record</a> rather
    than taken from the essay, and one date and distance differ slightly as a result.
    The page labels every illustrative figure so readers can distinguish it from measured data.</p>
    <p>Nothing you type here is transmitted anywhere. The quiz, the checklist and the worksheet
    are held in your browser's local storage and clearing your browser data removes them.</p>
  </div>
</section>
