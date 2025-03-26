// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark');
    if (themeToggle) themeToggle.checked = true;
  }

  // Toggle theme function
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      if (themeToggle.checked) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const hamburger = document.querySelector('.hamburger');

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
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileNav.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close menu when close button is clicked
  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMobileMenu);
  }

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

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      const recipient = contactForm.querySelector('input[name="recipient"]').value;
      
      // Here you would normally send the data to a server
      // For now, we'll just show an alert
      alert(`Thank you for your message! We'll send it to ${recipient} and get back to you soon.`);
      
      // Reset the form
      contactForm.reset();
    });
  }

  // Progress bar animation for skills section
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    const percentageTexts = document.querySelectorAll('.skill-percentage');
    
    progressBars.forEach((progressBar, index) => {
      const percentage = progressBar.getAttribute('data-percentage');
      const percentageText = percentageTexts[index];
      
      // Animate the progress bar width
      progressBar.style.width = percentage + '%';
      
      // Animate the percentage text
      let startValue = 0;
      const endValue = parseInt(percentage);
      const duration = 1500;
      const increment = Math.floor(duration / endValue);
      
      let counter = setInterval(() => {
        startValue += 1;
        percentageText.textContent = startValue + '%';
        if (startValue >= endValue) {
          clearInterval(counter);
          percentageText.textContent = endValue + '%';
        }
      }, increment);
    });
  }

  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Trigger animation when skills section is in viewport
  function checkSkillsScroll() {
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection && isInViewport(skillsSection)) {
      animateProgressBars();
      window.removeEventListener('scroll', checkSkillsScroll);
    }
  }

  // Check on page load and scroll for skills animation
  document.addEventListener('DOMContentLoaded', checkSkillsScroll);
  window.addEventListener('scroll', checkSkillsScroll);
});