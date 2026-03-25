// Themes and Layout Persistence
const applySettings = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const direction = localStorage.getItem('dir') || 'ltr';
  
  // Update data attributes for custom CSS selectors
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('dir', direction);
  
  // Tailwind 'dark' class MUST be on the root (html) element for darkMode: 'class' to work
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
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
});
