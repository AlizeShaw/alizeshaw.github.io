// --- Single-Page Application (SPA) Routing Logic ---
const homePage = document.getElementById('home-page');
const blogPage = document.getElementById('blog-page');
const projectsPage = document.getElementById('projects-page');

const navHome = document.getElementById('nav-home');
const navBlog = document.getElementById('nav-blog');
const navProjects = document.getElementById('nav-projects');

// Tailwind classes for active/inactive state
const activeNavClass = 'text-cyan-400-dark'; 
const inactiveNavClass = 'text-gray-500-light';

/**
 * Hides all pages and shows the one matching the current hash.
 */
function handleRouting() {
    // Get the current hash, default to 'home'
    const hash = window.location.hash.slice(1) || 'home'; 

    // Define all pages and navigation elements
    const pages = {
        'home': { element: homePage, nav: navHome },
        'blog': { element: blogPage, nav: navBlog },
        'projects': { element: projectsPage, nav: navProjects }
    };

    // Iterate over all defined pages
    for (const key in pages) {
        const page = pages[key];
        
        // Content Visibility
        if (key === hash) {
            page.element.classList.remove('hidden');
        } else {
            page.element.classList.add('hidden');
        }
        
        // Navigation Active State Styling
        if (page.nav) {
            if (key === hash) {
                // Ensure the active icon is styled correctly regardless of the parent wrapper
                page.nav.classList.add(activeNavClass);
                page.nav.classList.remove(inactiveNavClass);
            } else {
                page.nav.classList.remove(activeNavClass);
                page.nav.classList.add(inactiveNavClass);
            }
        }
    }

    // Scroll to top of the content area when changing pages
    if (document.getElementById('page-content-wrapper')) {
        document.getElementById('page-content-wrapper').scrollTo({ top: 0, behavior: 'instant' });
    }
}

// Listen for hash changes (when nav links are clicked)
window.addEventListener('hashchange', handleRouting);

// Initial run on load
window.addEventListener('load', () => {
     // If no hash is present, set it to home explicitly
    if (!window.location.hash) {
        window.location.hash = '#home';
    }
    handleRouting();
});

// --- Theme Toggle Logic ---
const htmlElement = document.documentElement;

// Selectors for the top toggle only
const themeToggleTop = document.getElementById('theme-toggle-top');

const moonIconTop = document.getElementById('moon-icon-top');
const sunIconTop = document.getElementById('sun-icon-top');

/**
 * Updates the UI elements (HTML class and icons) based on the current theme state.
 * @param {boolean} isDark - True if setting to dark mode, false for light mode.
 */
function updateThemeUI(isDark) {
    if (isDark) {
        htmlElement.classList.add('dark');
        // Set Moon icon active, Sun hidden for the top toggle
        moonIconTop.classList.remove('hidden');
        sunIconTop.classList.add('hidden');
    } else {
        htmlElement.classList.remove('dark');
        // Set Sun icon active, Moon hidden for the top toggle
        moonIconTop.classList.add('hidden');
        sunIconTop.classList.remove('hidden');
    }
}

// Initial check for theme preference and apply
const savedTheme = localStorage.getItem('theme');
const initialIsDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
updateThemeUI(initialIsDark);

// Handler function for the toggle button
const handleThemeToggle = () => {
    const isCurrentlyDark = htmlElement.classList.contains('dark');
    if (isCurrentlyDark) {
        localStorage.setItem('theme', 'light');
        updateThemeUI(false);
    } else {
        localStorage.setItem('theme', 'dark');
        updateThemeUI(true);
    }
};

// Attach listener to the top button
themeToggleTop.addEventListener('click', handleThemeToggle);

// --- Icon Interaction Logic (Push Away Effect) ---
const interactiveIcons = document.querySelectorAll('.nav-interactive-icon');
const pushDistance = '15px'; // Distance icons move away when a sibling is hovered

interactiveIcons.forEach(icon => {
    // Event when the mouse enters (hovers over) an icon
    icon.addEventListener('mouseenter', () => {
        // Find the index of the hovered icon's parent group
        const parentGroup = icon.closest('.group');
        const navbarContainer = parentGroup.parentElement;
        const groups = Array.from(navbarContainer.children).filter(el => el.classList.contains('group'));
        const index = groups.indexOf(parentGroup);

        groups.forEach((group, otherIndex) => {
            const otherIcon = group.querySelector('.nav-interactive-icon');
            if (index !== otherIndex) {
                // Icon to the left of the hovered icon -> move left
                let direction = '';
                if (otherIndex < index) {
                    // Icon to the left of the hovered icon -> move left
                    direction = `translateX(-${pushDistance})`;
                } else {
                    // Icon to the right of the hovered icon -> move right
                    direction = `translateX(${pushDistance})`;
                }
                otherIcon.style.transform = direction;
            } else {
                // The hovered icon (scales up slightly)
                otherIcon.style.transform = 'scale(1.1)';
            }
        });
    });

    // Event when the mouse leaves (stops hovering over) an icon
    icon.addEventListener('mouseleave', () => {
        // Reset all icons to their default position and scale
        const navbarContainer = icon.closest('.group').parentElement;
        const icons = navbarContainer.querySelectorAll('.nav-interactive-icon');
        icons.forEach(otherIcon => {
            otherIcon.style.transform = 'none';
        });
    });
});

// --- Experience Section Toggle Logic ---
/**
 * Toggles the visibility of detail sections in the Experience block and rotates the arrow.
 * @param {string} detailsId - The ID of the detail div to show/hide (e.g., 'alzeural-details').
 * @param {string} arrowId - The ID of the SVG arrow icon to rotate (e.g., 'alzeural-arrow').
 */
function toggleDetails(detailsId, arrowId) {
    const details = document.getElementById(detailsId);
    // arrowId is optional now; if provided, rotate the arrow element
    const arrow = arrowId ? document.getElementById(arrowId) : null;

    if (details.classList.contains('hidden')) {
        // Show details
        details.classList.remove('hidden');
        details.classList.add('animate-in'); // Simple class for potential future animation
        if (arrow) {
            arrow.style.transform = 'rotate(180deg)'; // Arrow points up
        }
    } else {
        // Hide details
        details.classList.add('hidden');
        details.classList.remove('animate-in');
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)'; // Arrow points down
        }
    }
}