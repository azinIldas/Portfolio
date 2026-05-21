/**
 * Portfolio V2 - Main Script
 * Lädt statische Inhalte aus data.json und aktuelle Projekte aus Sanity.
 */

/* ----------------------------------------------------------
   Sanity Konfiguration
   ---------------------------------------------------------- */
const SANITY = {
    projectId: "sj84f28g",
    dataset: "production",
    apiVersion: "2024-01-01",
};

/**
 * Holt die aktuellen Projekte aus Sanity (read-only, public dataset).
 * Gibt ein Array zurück oder null, wenn Sanity nicht erreichbar ist.
 */
async function fetchSanityCurrentProjects() {
    const query = `*[_type == "currentProject"] | order(order asc, _createdAt desc){
        title,
        subtitle,
        description,
        "image": image.asset->url,
        tags,
        video,
        github
    }`;

    const url =
        `https://${SANITY.projectId}.api.sanity.io/v${SANITY.apiVersion}` +
        `/data/query/${SANITY.dataset}?query=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return Array.isArray(json.result) ? json.result : [];
    } catch (err) {
        console.warn(
            "Sanity-Fetch fehlgeschlagen – nutze Fallback aus data.json:",
            err
        );
        return null;
    }
}

function loadContent(data) {
    // Hero
    document.getElementById("heroName").textContent = data.hero.name;
    document.getElementById("heroSubtitle").textContent = data.hero.subtitle;

    // About
    document.getElementById("aboutText1").textContent = data.about.p1;
    document.getElementById("aboutText2").textContent = data.about.p2;
    document.getElementById("aboutText3").textContent = data.about.p3;

    // Skills (gruppiert nach Kategorien)
    renderSkills(data.skills);

    // Projekte
    renderCurrentProjects(data.currentProjects);
    renderSchoolProjects(data.schoolProjects);

    // Kontakt
    renderContactLinks(data.contact);

    // Footer
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    document.getElementById("footerName").textContent = data.footer.name;
}

/* ----------------------------------------------------------
   Skills (Kategorien)
   ---------------------------------------------------------- */
function renderSkills(skills) {
    const list = document.getElementById("skillsList");
    if (!list || !Array.isArray(skills)) return;
    list.innerHTML = "";

    // Backward-kompatibel: falls skills ein Array von Strings ist, in eine Kategorie verpacken
    const groups = skills.every((s) => typeof s === "string")
        ? [{ category: "", items: skills }]
        : skills;

    groups.forEach((group) => {
        const wrapper = document.createElement("div");
        wrapper.className = "skill-category";

        const titleHtml = group.category
            ? `<h4 class="skill-category-title">${escapeHtml(group.category)}</h4>`
            : "";

        const tagsHtml = (group.items || [])
            .map((item) => `<span class="skill-chip">${escapeHtml(item)}</span>`)
            .join("");

        wrapper.innerHTML = `
            ${titleHtml}
            <div class="skill-chips">${tagsHtml}</div>
        `;
        list.appendChild(wrapper);
    });
}

/* ----------------------------------------------------------
   Aktuelle Projekte (z. B. später via Sanity gefüllt)
   ---------------------------------------------------------- */
function renderCurrentProjects(projects) {
    const grid = document.getElementById("currentProjectsGrid");
    const emptyState = document.getElementById("currentProjectsEmpty");
    if (!grid) return;

    grid.innerHTML = "";
    if (!Array.isArray(projects) || projects.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }
    if (emptyState) emptyState.classList.add("hidden");

    projects.forEach((project) => {
        grid.appendChild(buildProjectCard(project, { mode: "current" }));
    });
}

/* ----------------------------------------------------------
   Schulprojekte (alte 4) — standardmäßig zugeklappt
   ---------------------------------------------------------- */
function renderSchoolProjects(projects) {
    const grid = document.getElementById("schoolProjectsGrid");
    if (!grid || !Array.isArray(projects)) return;
    grid.innerHTML = "";
    projects.forEach((project) => {
        grid.appendChild(buildProjectCard(project, { mode: "school" }));
    });
}

/* ----------------------------------------------------------
   Card-Builder — zeigt Buttons nur, wenn der Link vorhanden ist
   ---------------------------------------------------------- */
function buildProjectCard(project, options = {}) {
    const { mode } = options;
    const card = document.createElement("article");
    card.className = "project-card group";

    const tagsHtml = (project.tags || [])
        .map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`)
        .join("");

    const imageHtml = project.image
        ? `<div class="project-image-wrapper">
               <img src="${escapeHtml(project.image)}" alt="${escapeHtml(
              project.title
          )}" loading="lazy" />
           </div>`
        : "";

    // Aktuelle Projekte: video + github (beides optional)
    // Schulprojekte: demo + github
    const buttons = [];
    if (mode === "current") {
        if (project.video) {
            buttons.push(videoButton(project.video, "Video ansehen"));
        }
        if (project.github) {
            buttons.push(actionButton(project.github, "Quellcode", "github", "secondary"));
        }
    } else {
        if (project.demo) {
            buttons.push(actionButton(project.demo, "Live Demo", "play"));
        }
        if (project.github) {
            buttons.push(actionButton(project.github, "Quellcode", "github", "secondary"));
        }
    }

    const actionsHtml = buttons.length
        ? `<div class="project-actions">${buttons.join("")}</div>`
        : "";

    card.innerHTML = `
        ${imageHtml}
        <div class="project-body">
            ${
                project.subtitle
                    ? `<p class="project-subtitle">${escapeHtml(project.subtitle)}</p>`
                    : ""
            }
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-description">${escapeHtml(project.description || "")}</p>
            ${tagsHtml ? `<div class="project-tags">${tagsHtml}</div>` : ""}
            ${actionsHtml}
        </div>
    `;

    return card;
}

function actionButton(href, label, icon, variant = "primary") {
    const iconSvg = icon === "github" ? ICON_GITHUB : ICON_PLAY;
    return `
        <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"
            class="btn btn-${variant}">
            ${iconSvg}
            ${escapeHtml(label)}
        </a>
    `;
}

const ICON_PLAY = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
</svg>`;

const ICON_GITHUB = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
</svg>`;

/* ----------------------------------------------------------
   Video-Button (öffnet Modal statt neuem Tab)
   ---------------------------------------------------------- */
function videoButton(videoUrl, label) {
    return `
        <button type="button" data-video-url="${escapeHtml(videoUrl)}"
            class="btn btn-primary video-trigger">
            ${ICON_PLAY}
            ${escapeHtml(label)}
        </button>
    `;
}

/* ----------------------------------------------------------
   Video-Modal: erkennt YouTube / Vimeo / MP4-Direktlinks
   ---------------------------------------------------------- */
function buildVideoEmbed(url) {
    if (!url) return "";

    // YouTube (auch youtu.be und Shorts)
    const yt = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
    );
    if (yt) {
        return `<iframe src="https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1"
            title="YouTube Video Player" frameborder="0" allow="autoplay; encrypted-media;
            picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    }

    // Vimeo
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) {
        return `<iframe src="https://player.vimeo.com/video/${vm[1]}?autoplay=1"
            title="Vimeo Video Player" frameborder="0" allow="autoplay; fullscreen;
            picture-in-picture" allowfullscreen></iframe>`;
    }

    // Loom
    const loom = url.match(/loom\.com\/share\/([\w-]+)/);
    if (loom) {
        return `<iframe src="https://www.loom.com/embed/${loom[1]}?autoplay=1"
            title="Loom Video Player" frameborder="0" allow="autoplay; fullscreen"
            allowfullscreen></iframe>`;
    }

    // Direkter Video-File-Link (MP4, WebM, OGG) – absolut oder relativ
    if (/\.(mp4|webm|ogg)(?:\?.*)?$/i.test(url)) {
        // Bei relativen Pfaden ggf. Leerzeichen / Umlaute URL-encoden,
        // ohne bereits encodierte Zeichen kaputt zu machen.
        const isAbsolute = /^https?:\/\//i.test(url);
        const safeSrc = isAbsolute ? url : encodeURI(url);
        return `<video src="${escapeHtml(safeSrc)}" controls autoplay playsinline
                    style="background:#000;"></video>`;
    }

    // Fallback: einfache Verlinkung
    return `<div style="display:flex;align-items:center;justify-content:center;
        height:100%;color:#fff;text-align:center;padding:2rem;">
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"
            style="color:#fff;text-decoration:underline;">
            Video in neuem Tab öffnen ↗
        </a>
    </div>`;
}

function openVideoModal(url) {
    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoModalFrame");
    if (!modal || !frame) return;
    frame.innerHTML = buildVideoEmbed(url);
    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function closeVideoModal() {
    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoModalFrame");
    if (!modal || !frame) return;
    modal.classList.add("hidden");
    frame.innerHTML = ""; // stoppt das Video (iframe wird entfernt)
    document.body.classList.remove("no-scroll");
}

function initVideoModal() {
    document.addEventListener("click", (e) => {
        const trigger = e.target.closest(".video-trigger");
        if (trigger) {
            e.preventDefault();
            openVideoModal(trigger.dataset.videoUrl);
            return;
        }
        if (e.target.closest("[data-close-video]")) {
            closeVideoModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeVideoModal();
    });
}

/* ----------------------------------------------------------
   Kontakt
   ---------------------------------------------------------- */
function renderContactLinks(contact) {
    const contactLinks = document.getElementById("contactLinks");
    contactLinks.innerHTML = `
        <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer"
            class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <svg class="icon text-blue-700 mr-3" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
        </a>
        <a href="mailto:${contact.email_private}"
            class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <svg class="icon text-gray-700 mr-3 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>E-Mail</span>
        </a>
    `;
}

/* ----------------------------------------------------------
   Schulprojekte Toggle
   ---------------------------------------------------------- */
function initSchoolProjectsToggle() {
    const toggleBtn = document.getElementById("schoolProjectsToggle");
    const wrapper = document.getElementById("schoolProjectsWrapper");
    if (!toggleBtn || !wrapper) return;

    toggleBtn.addEventListener("click", () => {
        const expanded = wrapper.classList.toggle("expanded");
        toggleBtn.classList.toggle("open", expanded);
        toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");

        const label = toggleBtn.querySelector(".toggle-label");
        if (label) {
            label.textContent = expanded
                ? "Schulprojekte ausblenden"
                : "Schulprojekte ansehen";
        }
    });
}

/* ----------------------------------------------------------
   Utilities
   ---------------------------------------------------------- */
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ----------------------------------------------------------
   Theme & Form
   ---------------------------------------------------------- */
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIconMoon = document.getElementById("theme-icon-moon");
    const themeIconSun = document.getElementById("theme-icon-sun");
    const htmlElement = document.documentElement;

    function updateThemeIcon(isDarkMode) {
        if (isDarkMode) {
            themeIconMoon.classList.add("hidden");
            themeIconSun.classList.remove("hidden");
        } else {
            themeIconMoon.classList.remove("hidden");
            themeIconSun.classList.add("hidden");
        }
    }

    const currentTheme = localStorage.getItem("theme");
    let isDarkMode = false;
    if (currentTheme === "dark") {
        htmlElement.classList.add("dark");
        isDarkMode = true;
    } else if (currentTheme === "light") {
        htmlElement.classList.remove("dark");
        isDarkMode = false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        htmlElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        isDarkMode = true;
    }
    updateThemeIcon(isDarkMode);

    themeToggle.addEventListener("click", () => {
        const isCurrentlyDark = htmlElement.classList.toggle("dark");
        localStorage.setItem("theme", isCurrentlyDark ? "dark" : "light");
        updateThemeIcon(isCurrentlyDark);
    });
}

/* ----------------------------------------------------------
   Kontaktformular – verschickt echte Mails via Web3Forms
   Setup: https://web3forms.com  → E-Mail eingeben → Access Key
   kopieren und unten in CONTACT_FORM.accessKey einsetzen.
   ---------------------------------------------------------- */
const CONTACT_FORM = {
    accessKey: "13415390-6f8a-4004-8ced-1ce445fda12f",
    endpoint: "https://api.web3forms.com/submit",
};

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const successEl = document.getElementById("formSuccess");
    const errorEl = document.getElementById("formError");
    const submitBtn = form.querySelector('button[type="submit"]');

    function showStatus(el, message) {
        [successEl, errorEl].forEach((e) => e && e.classList.add("hidden"));
        if (!el) return;
        if (message) el.textContent = message;
        el.classList.remove("hidden");
        setTimeout(() => el.classList.add("hidden"), 7000);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!CONTACT_FORM.accessKey) {
            console.warn(
                "Kein Web3Forms Access Key gesetzt. Anleitung siehe README.md."
            );
            showStatus(
                errorEl,
                "Das Kontaktformular ist noch nicht konfiguriert. Bitte nutze einen der Links rechts."
            );
            return;
        }

        const originalBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Senden …";
        }

        try {
            const formData = new FormData(form);
            formData.append("access_key", CONTACT_FORM.accessKey);
            formData.append("subject", "Neue Nachricht von deinem Portfolio");
            formData.append("from_name", "Portfolio Azin");

            const res = await fetch(CONTACT_FORM.endpoint, {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json.success) {
                showStatus(
                    successEl,
                    "Danke! Deine Nachricht wurde gesendet – ich melde mich so schnell wie möglich."
                );
                form.reset();
            } else {
                showStatus(
                    errorEl,
                    "Ups, das hat nicht geklappt: " +
                        (json.message || "Unbekannter Fehler") +
                        ". Bitte schreib mir direkt per E-Mail oder LinkedIn."
                );
            }
        } catch (err) {
            console.error("Kontaktformular Fehler:", err);
            showStatus(
                errorEl,
                "Netzwerkfehler. Bitte versuch's später noch einmal oder schreib mir direkt per E-Mail."
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}

/* ----------------------------------------------------------
   Bootstrap
   ---------------------------------------------------------- */
async function bootstrap() {
    try {
        const [data, sanityProjects] = await Promise.all([
            fetch("data.json").then((r) => r.json()),
            fetchSanityCurrentProjects(),
        ]);

        // Sanity hat Vorrang für die "Aktuellen Projekte".
        // Wenn Sanity (noch) leer oder nicht erreichbar ist, fällt
        // das UI auf data.json.currentProjects zurück.
        if (Array.isArray(sanityProjects) && sanityProjects.length > 0) {
            data.currentProjects = sanityProjects;
        }

        loadContent(data);
    } catch (err) {
        console.error("Fehler beim Initialisieren des Portfolios:", err);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    bootstrap();
    initTheme();
    initContactForm();
    initSchoolProjectsToggle();
    initVideoModal();
});
