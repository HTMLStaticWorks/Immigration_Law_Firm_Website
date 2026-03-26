// Themes and Layout Persistence
const applySettings = () => {
    const theme = localStorage.getItem('theme') || 'light';
    const direction = localStorage.getItem('dir') || 'ltr';

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', direction);

    const themeIcons = document.querySelectorAll('.theme-toggle-icon');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcons.forEach(icon => {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        });
    } else {
        document.documentElement.classList.remove('dark');
        themeIcons.forEach(icon => {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        });
    }
};

// Toggle Theme
const toggleTheme = () => {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applySettings();
};

// Toggle Direction (RTL/LTR)
const toggleDirection = () => {
  const current = document.documentElement.getAttribute('dir');
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  localStorage.setItem('dir', next);
  applySettings();
};

// Mobile Menu Toggle
const toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
  }
};

// Smooth Scroll to Top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Expose functions globally for simple inline handlers
window.toggleTheme = toggleTheme;
window.toggleDirection = toggleDirection;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;

// Initial apply
applySettings();

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to Top visibility
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.remove('opacity-0', 'invisible');
                scrollBtn.classList.add('opacity-100', 'visible');
            } else {
                scrollBtn.classList.add('opacity-0', 'invisible');
                scrollBtn.classList.remove('opacity-100', 'visible');
            }
        });
    }

    // Initialize Global Map if present
    const mapElement = document.getElementById('global-map');
    if (mapElement && typeof L !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        const map = L.map('global-map', {
            center: [25, 10], 
            zoom: 2,
            zoomControl: false,
            attributionControl: false
        });

        const updateMapTheme = () => {
            const currentDark = document.documentElement.classList.contains('dark');
            // Using Voyager which has colorful land/water distinction
            const tileLayer = currentDark 
                ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' 
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
            
            // Clean up existing layers first if needed
            map.eachLayer(layer => {
                if (layer instanceof L.TileLayer) map.removeLayer(layer);
            });

            L.tileLayer(tileLayer, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            // Re-apply markers to ensure they are on top of new layer
            locations.forEach(loc => {
                const marker = L.marker(loc.coords, { icon: customIcon })
                    .addTo(map)
                    .bindPopup(`<b style="font-family: Outfit, sans-serif; color: #1A237E;">${loc.name}</b>`, {
                        closeButton: false,
                        offset: [0, -5]
                    });
            });
        };

        const locations = [
            { name: "Toronto HQ", coords: [43.6532, -79.3832] },
            { name: "London Office", coords: [51.5074, -0.1278] },
            { name: "Dubai Hub", coords: [25.2048, 55.2708] },
            { name: "Singapore City", coords: [1.3521, 103.8198] }
        ];

        const customIcon = L.divIcon({
            className: 'custom-marker',
            iconSize: [16, 16], // Slightly larger for prominence
            iconAnchor: [8, 8]
        });

        updateMapTheme();

        // Listen for theme changes to update map
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
                    updateMapTheme();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        // Ensure map is sized correctly on orientation change / resize
        window.addEventListener('resize', () => {
            setTimeout(() => map.invalidateSize(), 250);
        });

        // Final trigger for late-rendering containers
        setTimeout(() => map.invalidateSize(), 600);
    }

    // --- Mobile/Tab Hover Fix (Touch Support) ---
    // This replicates hover feedback on touch devices by adding an 'active-touch' class
    const touchInteractives = document.querySelectorAll('a, button, .footer-social-btn, .nav-link');
    
    touchInteractives.forEach(el => {
        el.addEventListener('touchstart', function() {
            this.classList.add('active-touch');
        }, { passive: true });

        el.addEventListener('touchend', function() {
            // Keep the effect briefly for visual feedback
            setTimeout(() => {
                this.classList.remove('active-touch');
            }, 300);
        }, { passive: true });

        el.addEventListener('touchcancel', function() {
            this.classList.remove('active-touch');
        }, { passive: true });
    });
});
