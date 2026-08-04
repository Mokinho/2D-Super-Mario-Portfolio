import { ABOUT, SKILLS, FEATURED_PROJECTS, ALL_PROJECTS, CONTACT, PROFILE } from '../data/content.js';

const overlay = document.getElementById('panel-overlay');
const panelBox = document.getElementById('panel-box');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');
const closeBtn = document.getElementById('panel-close');

let onCloseCallback = null;

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function projectCardHtml(p) {
  const link = p.url
    ? `<a class="pk-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Visit site →</a>`
    : `<span class="pk-link pk-link--muted">Private project</span>`;
  return `
    <div class="pk-project-card">
      <p class="pk-tag">${esc(p.tag)}</p>
      <h4>${esc(p.title)}</h4>
      <p class="pk-desc">${esc(p.desc)}</p>
      ${link}
    </div>`;
}

export function openPanel(title, bodyHtml, { onClose } = {}) {
  panelTitle.textContent = title;
  panelBody.innerHTML = bodyHtml;
  overlay.classList.add('is-open');
  onCloseCallback = onClose || null;
  closeBtn.focus();
}

export function closePanel() {
  overlay.classList.remove('is-open');
  const cb = onCloseCallback;
  onCloseCallback = null;
  if (cb) cb();
}

closeBtn.addEventListener('click', closePanel);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closePanel();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('is-open')) closePanel();
});

export function openAboutParagraph(index, onClose) {
  const text = ABOUT.paragraphs[index] || '';
  openPanel(`About Me — ${index + 1}/${ABOUT.paragraphs.length}`, `<p class="pk-lead">${esc(text)}</p>`, { onClose });
}

export function openExperience(onClose) {
  const rows = ABOUT.experience.map((e) => `
    <li class="pk-timeline-item">
      <span class="pk-date">${esc(e.date)}</span>
      <div><strong>${esc(e.role)}</strong><br><span class="pk-dim">${esc(e.org)}</span></div>
    </li>`).join('');
  openPanel('Experience', `<ul class="pk-timeline">${rows}</ul>`, { onClose });
}

export function openSkill(key, onClose) {
  const skill = SKILLS.find((s) => s.key === key);
  if (!skill) return;
  const items = skill.items.map((i) => `<li>${esc(i)}</li>`).join('');
  openPanel(skill.title, `<ul class="pk-list">${items}</ul>`, { onClose });
}

export function openProjectByIndex(index, onClose) {
  const p = FEATURED_PROJECTS[index];
  if (!p) return;
  openPanel('Featured Project', projectCardHtml(p), { onClose });
}

export function openAllProjects(onClose) {
  const cards = ALL_PROJECTS.map(projectCardHtml).join('');
  openPanel(`All Projects (${ALL_PROJECTS.length})`, `<div class="pk-project-grid">${cards}</div>`, { onClose });
}

export function openContact(onClose, { finale = false } = {}) {
  const links = CONTACT.links.map((l) => `
    <a class="pk-contact-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
      <span class="pk-contact-label">${esc(l.label)}</span>
      <span class="pk-contact-value">${esc(l.value)}</span>
    </a>`).join('');
  const finaleHtml = finale ? `
    <p class="pk-finale">🏁 You reached the end, thanks for playing! Want the plain version?</p>
    <a class="pk-link" href="${PROFILE.siteUrl}" target="_blank" rel="noopener noreferrer">Visit the classic site →</a>
  ` : '';
  openPanel('Contact', `<p class="pk-lead">${esc(CONTACT.lead)}</p><div class="pk-contact-links">${links}</div>${finaleHtml}`, { onClose });
}

export function openClassicResume() {
  const skillsHtml = SKILLS.map((s) => `
    <div class="cr-skill">
      <h4>${esc(s.title)}</h4>
      <ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  const expHtml = ABOUT.experience.map((e) => `
    <li><span class="pk-date">${esc(e.date)}</span><div><strong>${esc(e.role)}</strong><br><span class="pk-dim">${esc(e.org)}</span></div></li>`).join('');
  const projectsHtml = ALL_PROJECTS.map(projectCardHtml).join('');
  const contactHtml = CONTACT.links.map((l) => `
    <a class="pk-contact-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
      <span class="pk-contact-label">${esc(l.label)}</span><span class="pk-contact-value">${esc(l.value)}</span>
    </a>`).join('');
  const body = `
    <section class="cr-section">
      <h3>About</h3>
      ${ABOUT.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
      <h4 class="cr-sub">Experience</h4>
      <ul class="pk-timeline">${expHtml}</ul>
    </section>
    <section class="cr-section">
      <h3>Skills &amp; Expertise</h3>
      <div class="cr-skills-grid">${skillsHtml}</div>
    </section>
    <section class="cr-section">
      <h3>Selected Work</h3>
      <div class="pk-project-grid">${projectsHtml}</div>
    </section>
    <section class="cr-section">
      <h3>Contact</h3>
      <div class="pk-contact-links">${contactHtml}</div>
    </section>
  `;
  openPanel(`${PROFILE.name} — ${PROFILE.title}`, body);
}

export function isPanelOpen() {
  return overlay.classList.contains('is-open');
}
