/**
 * Theme Switcher - Toggle between dark and light themes
 * Uses CSS variables and localStorage for persistence
 * Portfolio JavaScript - Internship Week 5
 */

(function () {
  'use strict';

  // ============= Configuration =============
  const STORAGE_KEY = 'portfolio-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const DARK_ICON = '🌙';
  const LIGHT_ICON = '☀️';

  // ============= DOM Elements =============
  const themeToggleBtn = document.querySelector('.header__theme-toggle');
  const htmlElement = document.documentElement;

  // ============= Theme Functions =============

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getCurrentTheme() {
    return htmlElement.getAttribute('data-theme') || DARK_THEME;
  }

  function updateToggleIcon(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === DARK_THEME ? LIGHT_ICON : DARK_ICON;
      themeToggleBtn.setAttribute('aria-label', 
        theme === DARK_THEME ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  // ============= Scroll Reveal =============

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (!revealElements.length) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  // ============= Skill Bar Animation =============

  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              bar.style.width = width;
            }, 200);
          }
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach((bar) => observer.observe(bar));
  }

  // ============= Header Scroll Effect =============

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;

    let lastScroll = 0;

    function handleScroll() {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ============= Mobile Menu =============

  function initMobileMenu() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('mobile-nav--active');
      
      // Toggle hamburger animation
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach((span) => span.classList.toggle('active'));
    });

    // Close menu when clicking a link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-nav--active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('mobile-nav--active');
      }
    });
  }

  // ============= Smooth Scroll =============

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============= Active Navigation Link =============

  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link, .mobile-nav__link');

    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // ============= Contact Form =============

  function initContactForm() {
    const form = document.querySelector('.contact__form');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = form.querySelector('input[type="text"]');
      const email = form.querySelector('input[type="email"]');
      const message = form.querySelector('textarea');

      if (name?.value && email?.value && message?.value) {
        // Show success message
        const btn = form.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = 'var(--color-green)';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
    });
  }

  // ============= Typing Effect (Optional) =============

  function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let index = 0;
    function type() {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      }
    }
    
    type();
  }

  // ============= Counter Animation =============

  function initCounters() {
    const counters = document.querySelectorAll('.coding-profile__count');
    
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = counter.textContent;
          const numericValue = parseInt(target.replace(/\D/g, ''));
          const suffix = target.replace(/[0-9]/g, '');
          
          let current = 0;
          const increment = numericValue / 50;
          const duration = 1500;
          const stepTime = duration / 50;

          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              counter.textContent = numericValue + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  }

  // ============= Initialization =============

  function init() {
    // Apply saved theme
    const savedTheme = getSavedTheme() || DARK_THEME;
    applyTheme(savedTheme);

    // Theme toggle event
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Initialize all features
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLinks();
    initScrollReveal();
    initSkillBars();
    initContactForm();
    initCounters();

    console.log('✨ Portfolio initialized successfully!');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
