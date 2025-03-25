const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
const body = document.body;

// Check for saved theme preference or prefer-color-scheme
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
  body.classList.add('dark');
  themeToggle.checked = true;
  if (mobileThemeToggle) mobileThemeToggle.checked = true;
}

// Toggle theme function
function toggleTheme() {
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    if (themeToggle) themeToggle.checked = false;
    if (mobileThemeToggle) mobileThemeToggle.checked = false;
  } else {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
    if (mobileThemeToggle) mobileThemeToggle.checked = true;
  }
}

// Add event listeners to toggle buttons
themeToggle.addEventListener('change', toggleTheme);
if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('change', toggleTheme);
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
const mobileNavClose = document.querySelector(".mobile-nav-close");

// Function to open mobile menu
function openMobileMenu() {
  hamburger.classList.add("active");
  mobileNav.classList.add("active");
  document.body.classList.add("no-scroll");
}

// Function to close mobile menu
function closeMobileMenu() {
  hamburger.classList.remove("active");
  mobileNav.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

// Toggle menu when hamburger is clicked
mobileMenuBtn.addEventListener("click", () => {
  if (mobileNav.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close menu when close button is clicked
mobileNavClose.addEventListener("click", closeMobileMenu);

// Close menu when a link is clicked
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    mobileNav.classList.contains("active") &&
    !mobileNav.contains(e.target) &&
    !mobileMenuBtn.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Close menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileNav.classList.contains("active")) {
    closeMobileMenu();
  }
});

// Animations on Scroll
const animateElements = document.querySelectorAll(".animate");
const staggerElements = document.querySelectorAll(".stagger > *");
const skillBars = document.querySelectorAll(".skill-level-fill");

function checkInView() {
  const windowHeight = window.innerHeight;
  const windowTop = window.scrollY;
  const windowBottom = windowTop + windowHeight;

  // Regular animations
  animateElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top + windowTop;
    const elementBottom = elementTop + element.offsetHeight;

    if (elementBottom > windowTop && elementTop < windowBottom) {
      element.style.animationDelay = "0.2s";
      element.style.animationPlayState = "running";
      element.style.opacity = "1";
    }
  });

  // Staggered animations
  staggerElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top + windowTop;
    const elementBottom = elementTop + element.offsetHeight;

    if (elementBottom > windowTop && elementTop < windowBottom) {
      element.classList.add("active");
    }
  });

  // Skill bars animation
  skillBars.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top + windowTop;
    if (barTop < windowBottom) {
      bar.classList.add("animated");
    }
  });
}

// Initial check and add scroll event listener
window.addEventListener("load", checkInView);
window.addEventListener("scroll", checkInView);
window.addEventListener("resize", checkInView);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for fixed header
        behavior: "smooth",
      });
    }
  });
});