// --- 1. FUNKTION ZUM LADEN DER INHALTE ---
// Diese Funktion nimmt die Daten aus der JSON-Datei entgegen und füllt das HTML.
function loadContent(data) {
    // Hero-Sektion
    document.getElementById('heroName').textContent = data.hero.name;
    document.getElementById('heroSubtitle').textContent = data.hero.subtitle;

    // Über Mich Sektion
    document.getElementById('aboutText1').textContent = data.about.p1;
    document.getElementById('aboutText2').textContent = data.about.p2;
    document.getElementById('aboutText3').textContent = data.about.p3;

    // Skills-Liste
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = ''; // Leeren für den Fall eines Neuladens
    data.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        // Hinzufügen der Dark-Mode-Klassen für die Skills
        skillTag.className = 'bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm dark:bg-gray-700 dark:text-gray-200';
        skillTag.textContent = skill;
        skillsList.appendChild(skillTag);
    });

    // Kontakt-Links
    const contactLinks = document.getElementById('contactLinks');
    // Hinzufügen der Dark-Mode-Klassen für die Kontakt-Links
    contactLinks.innerHTML = `
        <a href="${data.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <!-- LinkedIn SVG Icon -->
            <svg class="icon text-blue-700 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
        </a>
        <a href="mailto:${data.contact.email_business}" class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <!-- E-Mail SVG Icon -->
            <svg class="icon text-gray-700 mr-3 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>E-Mail Geschäftlich</span>
        </a>
        <a href="mailto:${data.contact.email_private}" class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <!-- Home/Private SVG Icon -->
            <svg class="icon text-gray-700 mr-3 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>E-Mail Privat</span>
        </a>
    `;
    
    // Footer
    document.getElementById('footerYear').textContent = new Date().getFullYear();
    document.getElementById('footerName').textContent = data.footer.name;
}

// --- 2. EVENT LISTENER ---

// Warten, bis das HTML-Dokument vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {

    // Inhalte aus der JSON-Datei laden und die Seite füllen
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadContent(data);
        })
        .catch(error => console.error('Fehler beim Laden der Inhaltsdaten:', error));

    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const htmlElement = document.documentElement; // Das <html>-Element

    // Funktion zum Aktualisieren der Icons
    function updateThemeIcon(isDarkMode) {
        if (isDarkMode) {
            themeIconMoon.classList.add('hidden');
            themeIconSun.classList.remove('hidden');
        } else {
            themeIconMoon.classList.remove('hidden');
            themeIconSun.classList.add('hidden');
        }
    }

    // Gespeichertes Theme beim Laden prüfen und anwenden
    const currentTheme = localStorage.getItem('theme');
    let isDarkMode = false; // Standard-Annahme

    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
        isDarkMode = true;
    } else if (currentTheme === 'light') {
        htmlElement.classList.remove('dark');
        isDarkMode = false;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Wenn kein Theme gespeichert ist, prüfe die Systemeinstellung
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // Systemeinstellung als Standard speichern
        isDarkMode = true;
    }

    // Initiales Icon-Update beim Laden der Seite
    updateThemeIcon(isDarkMode);

    // Event Listener für den Toggle-Button
    themeToggle.addEventListener('click', () => {
        // Wechsle die 'dark'-Klasse auf dem <html>-Element
        const isCurrentlyDark = htmlElement.classList.toggle('dark');
        // Speichere die Auswahl im localStorage
        localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');
        // Aktualisiere das Icon
        updateThemeIcon(isCurrentlyDark);
    });
    // --- End of Dark Mode Logic ---


    // Event Listener für den Bild-Uploader
    document.getElementById('imageUploader').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('heroImage').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Event Listener für das Kontaktformular
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite
        
        // Formulardaten sammeln
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Daten in der Konsole anzeigen (für Debugging)
        console.log("Formulardaten:", data);
        
        // Erfolgsmeldung anzeigen
        document.getElementById('formSuccess').classList.remove('hidden');
        
        // Formular zurücksetzen
        this.reset();
        
        // Meldung nach 5 Sekunden ausblenden
        setTimeout(() => {
            document.getElementById('formSuccess').classList.add('hidden');
        }, 5000);
    });
    
});