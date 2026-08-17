/* ============================================================
   AJAY SONAWANE — PORTFOLIO MAIN JS
   Handles: Cursor, Navbar, Particles, Scroll Reveals,
   Skill Bars, Tech Tabs, Project Modal, Terminal, Roadmap
============================================================ */

(function () {
  'use strict';

  // ─── Reduced Motion Check ────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth <= 768;
  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

  // ─── Footer Year ─────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Custom Cursor ───────────────────────────────────────
  if (!isTouchDevice() && !prefersReducedMotion) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, .tech-card, .project-card, .contact-card, .edu-card, .cert-card, .roadmap-step, .magnetic';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
    });
  }

  // ─── Scroll Progress Bar ─────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ─── Navbar Scroll Effect ────────────────────────────────
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ─── Active Nav Link ─────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((s) => navObserver.observe(s));

  // ─── Mobile Menu ─────────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      mobileMenu.style.display = isOpen ? 'block' : 'none';
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── Hero Particle Canvas ────────────────────────────────
  function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const PARTICLE_COUNT = isMobile() ? 40 : 90;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 10;
        this.size = Math.random() * 1.5 + 0.4;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.6 ? '#6366f1' : Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    if (!prefersReducedMotion) loop();
  }
  initParticles();

  // ─── Profile Image 3D Tilt ───────────────────────────────
  function initTilt() {
    const tiltEl = document.getElementById('profile-tilt');
    if (!tiltEl || isMobile() || prefersReducedMotion) return;

    let bounds;
    tiltEl.addEventListener('mouseenter', () => { bounds = tiltEl.getBoundingClientRect(); });

    document.addEventListener('mousemove', (e) => {
      if (!bounds) return;
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const dx = (e.clientX - centerX) / (bounds.width / 2);
      const dy = (e.clientY - centerY) / (bounds.height / 2);
      const maxTilt = 10;
      tiltEl.style.transform = `perspective(800px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg)`;
    });

    tiltEl.addEventListener('mouseleave', () => {
      tiltEl.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
      tiltEl.style.transition = 'transform 0.5s ease';
      setTimeout(() => { tiltEl.style.transition = ''; }, 500);
    });
  }
  initTilt();

  // ─── Scroll Reveal ───────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach((el, i) => {
    // Stagger siblings in same parent
    const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = (idx * 0.07) + 's';
    revealObserver.observe(el);
  });

  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // ─── Skill Bar Animation ─────────────────────────────────
  const skillBars = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width || '0%';
        setTimeout(() => { bar.style.width = width; }, 200);
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });
  skillBars.forEach((bar) => skillObserver.observe(bar));

  // ─── Tech Category Tabs ──────────────────────────────────
  const techTabs = document.querySelectorAll('.tech-tab');
  const techCards = document.querySelectorAll('.tech-card');

  techTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      techTabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const selected = tab.dataset.tab;

      techCards.forEach((card) => {
        if (selected === 'all' || card.dataset.category === selected) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── Magnetic Buttons ────────────────────────────────────
  if (!isMobile() && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.2,0,0,1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  // ─── Project Modal Data ──────────────────────────────────
  const projectData = {
    jobportal: {
      title: 'Job Portal System',
      stack: 'Python · Flask · MySQL · HTML · CSS · JavaScript',
      overview: 'A comprehensive, multi-role job portal built with Flask and MySQL, designed to serve three distinct user types with tailored dashboards and workflows.',
      problem: 'Traditional job boards lack role separation and admin oversight. Recruiters, job seekers, and administrators all need fundamentally different interfaces and capabilities in a single unified platform.',
      solution: 'Built a Flask-based MVC application with role-based authentication, session management, CSV/PDF reporting, and a recruiter dashboard for managing candidate applications end-to-end.',
      architecture: 'Flask blueprints for route separation, SQLAlchemy ORM with MySQL, Jinja2 templates for server-side rendering, and role-based middleware for access control.',
      technologies: ['Python', 'Flask', 'MySQL', 'SQLAlchemy', 'HTML', 'CSS', 'JavaScript', 'Jinja2'],
      features: [
        'Role-based authentication — Admin, Recruiter, Job Seeker',
        'Job posting and search with filters',
        'Resume upload and storage',
        'Recruiter dashboard for managing applications',
        'Candidate application tracking',
        'CSV and PDF report generation',
      ],
      challenges: 'Managing session state across three distinct user roles while keeping the codebase clean. Implemented Flask Blueprints to separate concerns and used a middleware pattern for authorization checks.',
      learned: 'Deepened understanding of Flask application factory patterns, SQLAlchemy relationships, and the importance of role-driven UI/UX design for multi-stakeholder systems.',
    },
    student: {
      title: 'Student Record Management System',
      stack: 'Python · FastAPI · MySQL',
      overview: 'A high-performance CRUD API for managing student records, built with FastAPI and backed by persistent MySQL storage.',
      problem: 'Educational institutions need clean, reliable APIs for managing student data — creates, updates, deletions — with proper validation and persistent storage without the overhead of a full framework.',
      solution: 'Built a FastAPI service with Pydantic models for validation, SQLAlchemy ORM for MySQL integration, and auto-generated Swagger documentation for ease of testing and integration.',
      architecture: 'FastAPI router structure, SQLAlchemy ORM with session management, Pydantic schemas for request/response validation, and dependency injection for database sessions.',
      technologies: ['Python', 'FastAPI', 'MySQL', 'SQLAlchemy', 'Pydantic', 'Uvicorn', 'Swagger UI'],
      features: [
        'Full CRUD — Create, Read, Update, Delete operations',
        'FastAPI async backend with Uvicorn',
        'MySQL persistent storage with SQLAlchemy ORM',
        'Pydantic model validation',
        'Auto-generated Swagger & ReDoc API docs',
        'Proper HTTP status codes and error handling',
      ],
      challenges: 'Ensuring proper session lifecycle management in SQLAlchemy with FastAPI\'s dependency injection system, and writing clean Pydantic schemas that handled both create and update payloads gracefully.',
      learned: 'FastAPI\'s dependency injection is elegant for database session management. Gained confidence with async Python patterns and the importance of OpenAPI documentation for backend APIs.',
    },
  };

  // ─── Open / Close Modal ──────────────────────────────────
  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  window.openModal = function (key, e) {
    if (e) e.stopPropagation();
    const data = projectData[key];
    if (!data || !modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <p class="modal-tag" style="font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.15em;color:var(--accent);margin-bottom:12px;">PROJECT CASE STUDY</p>
      <h2 class="modal-body-title">${data.title}</h2>
      <p class="modal-body-stack">${data.stack}</p>
      <div class="modal-section">
        <h4>Overview</h4>
        <p>${data.overview}</p>
      </div>
      <div class="modal-section">
        <h4>Problem</h4>
        <p>${data.problem}</p>
      </div>
      <div class="modal-section">
        <h4>Solution</h4>
        <p>${data.solution}</p>
      </div>
      <div class="modal-section">
        <h4>Architecture</h4>
        <p>${data.architecture}</p>
      </div>
      <div class="modal-section">
        <h4>Technologies</h4>
        <div class="modal-tech-tags">${data.technologies.map((t) => `<span>${t}</span>`).join('')}</div>
      </div>
      <div class="modal-section">
        <h4>Key Features</h4>
        <ul>${data.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <h4>Challenges</h4>
        <p>${data.challenges}</p>
      </div>
      <div class="modal-section">
        <h4>What I Learned</h4>
        <p>${data.learned}</p>
      </div>
    `;

    modalOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { modalOverlay.classList.add('open'); });
    });
  };

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalOverlay.setAttribute('hidden', ''); }, 360);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && !modalOverlay.hasAttribute('hidden')) closeModal();
  });

  // Project card click (opens modal)
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-btn') || e.target.closest('.project-btn-outline')) return;
      openModal(card.dataset.project, e);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.project, e);
      }
    });
  });

  // ─── Terminal Typing Animation ───────────────────────────
  function initTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    const commands = [
      { prompt: '~', cmd: 'whoami', output: 'ajay-sonawane' },
      { prompt: '~', cmd: 'echo $ROLE', output: 'Python Developer · Backend · AI/ML Enthusiast' },
      { prompt: '~', cmd: 'echo $FOCUS', output: 'Python Backend Development' },
      { prompt: '~', cmd: 'echo $LEARNING', output: 'AI / ML · LLMs · RAG Systems' },
      { prompt: '~', cmd: 'ls tools/', output: 'Flask  FastAPI  MySQL  Git  Postman  Jupyter' },
      { prompt: '~', cmd: 'cat status.txt', output: '🟢 Open to work — Python · Backend · Software Engineer roles' },
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let phase = 'typing'; // typing | output | pause
    let currentLine = null;
    let outputLine = null;
    let cursorEl = null;

    function getPromptHTML(prompt, cmd = '') {
      return `<div class="t-line"><span class="t-prompt">ajay@dev</span><span style="color:#475569"> ${prompt} </span><span class="t-prompt">$</span>&nbsp;<span class="t-cmd" id="active-cmd">${cmd}</span></div>`;
    }

    function addOutputLine(text) {
      const div = document.createElement('div');
      div.className = 't-output';
      div.style.color = '#94a3b8';
      div.style.paddingLeft = '0';
      div.style.display = 'block';
      div.textContent = text;
      body.appendChild(div);
      return div;
    }

    function addCursor() {
      if (cursorEl) cursorEl.remove();
      cursorEl = document.createElement('span');
      cursorEl.className = 't-cursor';
      body.appendChild(cursorEl);
    }

    function scrollBottom() {
      body.parentElement.scrollTop = body.parentElement.scrollHeight;
    }

    function startNextCommand() {
      if (cmdIndex >= commands.length) {
        // Restart after pause
        setTimeout(() => {
          body.innerHTML = '';
          cmdIndex = 0;
          charIndex = 0;
          phase = 'typing';
          currentLine = null;
          startNextCommand();
        }, 3000);
        return;
      }

      const { prompt, cmd } = commands[cmdIndex];
      const wrapper = document.createElement('div');
      wrapper.innerHTML = getPromptHTML(prompt, '');
      body.appendChild(wrapper);
      currentLine = wrapper.querySelector('#active-cmd');
      if (cursorEl) cursorEl.remove();
      cursorEl = null;

      charIndex = 0;
      phase = 'typing';
      typeChar();
    }

    function typeChar() {
      const { cmd, output } = commands[cmdIndex];

      if (phase === 'typing') {
        if (charIndex < cmd.length) {
          currentLine.textContent += cmd[charIndex];
          charIndex++;
          scrollBottom();
          setTimeout(typeChar, 55 + Math.random() * 50);
        } else {
          // Done typing, show output after brief pause
          phase = 'output';
          setTimeout(() => {
            addOutputLine(output);
            addBlankLine();
            cmdIndex++;
            charIndex = 0;
            scrollBottom();
            setTimeout(startNextCommand, 600);
          }, 350);
        }
      }
    }

    function addBlankLine() {
      const br = document.createElement('div');
      br.style.height = '4px';
      body.appendChild(br);
    }

    // Start after element is visible
    const terminalObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(startNextCommand, 500);
        terminalObserver.disconnect();
      }
    }, { threshold: 0.3 });

    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) terminalObserver.observe(terminalWindow);
  }

  if (!prefersReducedMotion) {
    initTerminal();
  } else {
    // Static fallback for reduced motion
    const body = document.getElementById('terminal-body');
    if (body) {
      body.innerHTML = `
        <div class="t-line"><span class="t-prompt">ajay@dev ~ $</span>&nbsp;<span class="t-cmd">whoami</span></div>
        <div class="t-output">ajay-sonawane</div>
        <div class="t-line"><span class="t-prompt">ajay@dev ~ $</span>&nbsp;<span class="t-cmd">echo $FOCUS</span></div>
        <div class="t-output">Python Backend Development</div>
        <div class="t-line"><span class="t-prompt">ajay@dev ~ $</span>&nbsp;<span class="t-cmd">cat status.txt</span></div>
        <div class="t-output">🟢 Open to work</div>
      `;
    }
  }

  // ─── Timeline Animation ──────────────────────────────────
  const timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    const tlObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timelineLine.style.animation = 'timelineGrow 1.2s ease forwards';
        tlObserver.disconnect();
      }
    }, { threshold: 0.1 });
    tlObserver.observe(timelineLine);
  }

  // ─── Roadmap Step Animation ──────────────────────────────
  document.querySelectorAll('.roadmap-step').forEach((step, i) => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          step.style.borderColor = 'rgba(99,102,241,0.4)';
          step.style.background = 'rgba(99,102,241,0.06)';
        }, i * 150);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(step);
  });

  // ─── Contact Form Validation ─────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const fields = {
      name: { el: document.getElementById('cf-name'), err: document.getElementById('name-error') },
      email: { el: document.getElementById('cf-email'), err: document.getElementById('email-error') },
      message: { el: document.getElementById('cf-message'), err: document.getElementById('message-error') },
    };

    function validateEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

    function validateField(key) {
      const { el, err } = fields[key];
      let msg = '';
      if (!el.value.trim()) {
        msg = key === 'name' ? 'Name is required.' : key === 'email' ? 'Email is required.' : 'Message is required.';
      } else if (key === 'email' && !validateEmail(el.value.trim())) {
        msg = 'Please enter a valid email address.';
      } else if (key === 'message' && el.value.trim().length < 10) {
        msg = 'Message must be at least 10 characters.';
      }
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      return !msg;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validateField(key);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const valid = Object.keys(fields).map(validateField).every(Boolean);
      if (!valid) return;

      const submitBtn = document.getElementById('form-submit');
      const successEl = document.getElementById('form-success');
      const submitText = submitBtn.querySelector('.submit-text');

      submitText.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Simulate submission (no backend in static site)
      setTimeout(() => {
        submitText.textContent = 'Send Message';
        submitBtn.disabled = false;
        successEl.removeAttribute('hidden');
        contactForm.reset();
        Object.keys(fields).forEach((k) => fields[k].el.classList.remove('error'));
        setTimeout(() => { successEl.setAttribute('hidden', ''); }, 5000);
      }, 1400);
    });
  }

  // ─── Mobile Menu Close on nav click ─────────────────────
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (menuToggle) menuToggle.classList.remove('open');
      if (mobileMenu) {
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // ─── Add Timeline Grow Animation via CSS ─────────────────
  const style = document.createElement('style');
  style.textContent = `
    .timeline-line {
      transform-origin: top;
      transform: scaleY(0);
    }
    @keyframes timelineGrow {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .timeline-line { transform: scaleY(1); animation: none !important; }
    }
  `;
  document.head.appendChild(style);

})();
