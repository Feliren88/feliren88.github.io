/* --- Year in footer --- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* --- Disable image drag and right-click --- */
document.addEventListener("contextmenu", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
    return false;
  }
});

document.addEventListener("dragstart", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
    return false;
  }
});

/* --- Use case pipeline banners: swap dark/light PNG with theme --- */
function syncFlowBanners() {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  document.querySelectorAll(".uc-flow-img").forEach((img) => {
    const want = light ? img.getAttribute("data-src-light") : img.getAttribute("data-src-dark");
    if (want && img.getAttribute("src") !== want) img.setAttribute("src", want);
  });
}
syncFlowBanners();
new MutationObserver(syncFlowBanners).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"]
});

/* Reading content is ready without scroll-triggered animation. */
document.querySelectorAll(".reveal, .reveal-group").forEach((node) => {
  node.classList.add("in-view");
});

/* --- Active nav on scroll --- */
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sectionRefs = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return null;
    const section = document.querySelector(id);
    return section ? { link, section } : null;
  })
  .filter(Boolean);

function setActiveNav() {
  const scrollY = window.scrollY;
  let activeId = "#home";
  for (const item of sectionRefs) {
    if (item.section.offsetTop - 120 <= scrollY) {
      activeId = `#${item.section.id}`;
    }
  }
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeId);
  });
}

setActiveNav();
window.addEventListener("scroll", setActiveNav, { passive: true });

/* --- Publication filters --- */
const filterButtons = Array.from(document.querySelectorAll(".filter-pill, .filter"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectCount = document.getElementById("project-count");

function applyFilter(kind) {
  let visible = 0;
  for (const card of projectCards) {
    const kinds = (card.getAttribute("data-kind") || "").split(/\s+/);
    const isMatch = kind === "all" || kinds.includes(kind);
    card.classList.toggle("is-hidden", !isMatch);
    if (isMatch) visible += 1;
  }
  if (projectCount) {
    projectCount.textContent = visible + (visible === 1 ? ' publication' : ' publications');
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilter(button.getAttribute("data-filter") || "all");
  });
});

applyFilter("all");

/* --- Card expand/collapse --- */
const toggleButtons = Array.from(document.querySelectorAll(".card-toggle"));

function collapseAllCards(exceptCard = null) {
  for (const card of projectCards) {
    if (card === exceptCard) continue;
    card.classList.remove("expanded");
    const button = card.querySelector(".card-toggle");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Abstract ↓";
    }
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const card = button.closest(".project-card");
    if (!card) return;
    const willExpand = !card.classList.contains("expanded");
    collapseAllCards(willExpand ? card : null);
    card.classList.toggle("expanded", willExpand);
    button.setAttribute("aria-expanded", String(willExpand));
    button.textContent = willExpand ? "Collapse" : "Abstract ↓";
  });
});

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target.closest("button")) return;
    const button = card.querySelector(".card-toggle");
    if (button) button.click();
  });
});
