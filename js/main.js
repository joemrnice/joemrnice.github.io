/* ==========================================================================
   joemrnice — Joseph Lahai Kanu portfolio
   Vanilla JS + GSAP (optional) + Three.js (optional, lazy)
   Everything degrades gracefully if a CDN script fails to load.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------ */
  /* Preloader                                                          */
  /* ------------------------------------------------------------------ */
  function runPreloader() {
    var pre = document.getElementById("preloader");
    var fill = document.getElementById("preloader-fill");
    var count = document.getElementById("preloader-count");
    if (!pre) return;

    if (reduceMotion) {
      pre.classList.add("hidden");
      return;
    }

    var progress = 0;
    var duration = 1400; // ms, well under the 2s ceiling
    var start = performance.now();

    function tick(now) {
      var elapsed = now - start;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (fill) fill.style.width = progress + "%";
      if (count) count.textContent = progress + "%";
      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          pre.classList.add("hidden");
        }, 150);
      }
    }
    requestAnimationFrame(tick);

    // Safety valve: never hold the user hostage on a slow connection.
    setTimeout(function () { pre.classList.add("hidden"); }, 2000);
  }

  /* ------------------------------------------------------------------ */
  /* Mobile nav                                                         */
  /* ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hero heading + role rotator                                        */
  /* ------------------------------------------------------------------ */
  function initHeroText() {
    var lines = document.querySelectorAll(".hero h1 .letters");
    if (hasGSAP && !reduceMotion) {
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.3,
      });
    }

    var roles = [
      "Software Engineer",
      "Technical Research Specialist",
      "Tech Educator",
      "8+ Years of Experience",
      "Building at CodeZerra",
    ];
    var el = document.getElementById("role-rotator");
    if (!el) return;
    var i = 0;
    if (reduceMotion) {
      el.textContent = roles[0];
      return;
    }
    setInterval(function () {
      i = (i + 1) % roles.length;
      el.style.opacity = 0;
      setTimeout(function () {
        el.textContent = roles[i];
        el.style.opacity = 1;
      }, 250);
    }, 2600);
    el.style.transition = "opacity 0.25s ease";
  }

  /* ------------------------------------------------------------------ */
  /* Three.js hero geometry — lazy, mouse-reactive, degrades on mobile  */
  /* ------------------------------------------------------------------ */
  function initHeroScene() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || typeof window.THREE === "undefined") return;
    if (window.innerWidth < 760) return; // static hero on small screens

    var THREE = window.THREE;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      return; // no WebGL — hero still works without it
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 6;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    resize();
    window.addEventListener("resize", resize);

    var geo = new THREE.IcosahedronGeometry(2.1, 1);
    var wire = new THREE.WireframeGeometry(geo);
    var mat = new THREE.LineBasicMaterial({ color: 0xe8873a, transparent: true, opacity: 0.55 });
    var shape = new THREE.LineSegments(wire, mat);
    scene.add(shape);

    var target = { x: 0, y: 0 };
    window.addEventListener("mousemove", function (e) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
    });

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      shape.rotation.y = t * 0.15 + target.x;
      shape.rotation.x = t * 0.08 + target.y;
      renderer.render(scene, camera);
    }
    if (!reduceMotion) {
      animate();
    } else {
      renderer.render(scene, camera);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Magnetic buttons                                                    */
  /* ------------------------------------------------------------------ */
  function initMagnetic() {
    if (reduceMotion) return;
    var els = document.querySelectorAll("[data-magnetic]");
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.setProperty("--magnet-x", x * 0.25 + "px");
        el.style.setProperty("--magnet-y", y * 0.25 + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--magnet-x", "0px");
        el.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Animated stat counters                                              */
  /* ------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduceMotion) {
          el.textContent = target + suffix;
        } else {
          var startTime = null;
          var duration = 1200;
          function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min(1, (ts - startTime) / duration);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Projects — live GitHub API with graceful fallback                  */
  /* ------------------------------------------------------------------ */
  var CONCEPT_PROJECTS = [
    {
      name: "Freetown Transit API",
      language: "Concept",
      description: "A proposed open API for Freetown's poda-poda and taxi routes — concept stage.",
      html_url: "https://github.com/joemrnice",
      concept: true,
    },
    {
      name: "Krio Language Learning App",
      language: "Concept",
      description: "An idea for a bite-sized app teaching Krio vocabulary to new residents and visitors.",
      html_url: "https://github.com/joemrnice",
      concept: true,
    },
    {
      name: "SL Tech Community Hub",
      language: "Concept",
      description: "A directory concept connecting Sierra Leone's developers, meetups, and mentors.",
      html_url: "https://github.com/joemrnice",
      concept: true,
    },
  ];

  var LANG_COLORS = {
    JavaScript: "#e8873a",
    CSS: "#2bbfae",
    EJS: "#a06fd1",
    HTML: "#e8873a",
    Python: "#2bbfae",
    Concept: "#8f9aa8",
  };

  function projectCard(repo) {
    var card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-lang", repo.language || "Other");

    var color = LANG_COLORS[repo.language] || "#8f9aa8";
    card.innerHTML =
      '<div class="project-card-top">' +
        "<h3></h3>" +
        (repo.concept ? '<span class="badge-concept">concept</span>' : "") +
      "</div>" +
      '<p class="desc"></p>' +
      '<div class="project-card-meta">' +
        '<span class="lang-dot"><i style="background:' + color + '"></i><span class="lang-label"></span></span>' +
        (repo.concept
          ? "<span>Idea stage</span>"
          : '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer">★ ' + (repo.stargazers_count || 0) + " · View repo</a>") +
      "</div>";

    card.querySelector("h3").textContent = repo.name;
    card.querySelector(".desc").textContent = repo.description || "No description provided yet.";
    card.querySelector(".lang-label").textContent = repo.language || "Multi-language";

    // 3D tilt on hover
    card.addEventListener("mousemove", function (e) {
      if (reduceMotion) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", px * 8 + "deg");
      card.style.setProperty("--rx", (-py * 8) + "deg");
    });
    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });

    return card;
  }

  function buildFilters(languages) {
    var wrap = document.getElementById("project-filters");
    if (!wrap) return;
    languages.forEach(function (lang) {
      var btn = document.createElement("button");
      btn.className = "chip";
      btn.setAttribute("data-filter", lang);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.textContent = lang;
      wrap.appendChild(btn);
    });

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      wrap.querySelectorAll(".chip").forEach(function (c) {
        c.classList.remove("active");
        c.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      var filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".project-card").forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-lang") === filter;
        card.style.display = show ? "" : "none";
      });
    });
  }

  function renderProjects(repos, statusText) {
    var grid = document.getElementById("project-grid");
    var status = document.getElementById("projects-status");
    if (!grid) return;
    grid.innerHTML = "";
    repos.forEach(function (repo) { grid.appendChild(projectCard(repo)); });
    if (status) status.textContent = statusText || "";

    var languages = Array.from(new Set(repos.map(function (r) { return r.language || "Other"; })));
    buildFilters(languages);
  }

  function loadProjects() {
    var status = document.getElementById("projects-status");
    fetch("https://api.github.com/users/joemrnice/repos?sort=updated&per_page=12")
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API responded with " + res.status);
        return res.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos) || repos.length === 0) {
          renderProjects(CONCEPT_PROJECTS, "Repositories are sparse right now — here are a few concepts in the pipeline.");
          return;
        }
        var real = repos
          .filter(function (r) { return !r.fork; })
          .sort(function (a, b) { return (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)); })
          .slice(0, 9);
        var combined = real.length >= 3 ? real : real.concat(CONCEPT_PROJECTS);
        renderProjects(combined, "Live from GitHub · updated " + new Date().toLocaleDateString());
      })
      .catch(function () {
        renderProjects(CONCEPT_PROJECTS, "Couldn't reach the GitHub API just now — showing concept projects instead.");
        if (status) status.textContent = "Couldn't reach the GitHub API just now — showing concept projects instead.";
      });
  }

  /* ------------------------------------------------------------------ */
  /* Testimonial carousel                                                */
  /* ------------------------------------------------------------------ */
  function initTestimonials() {
    var track = document.getElementById("testimonial-track");
    var prev = document.getElementById("testimonial-prev");
    var next = document.getElementById("testimonial-next");
    if (!track || !prev || !next) return;
    var index = 0;
    var cards = track.children.length;

    function perView() { return window.innerWidth >= 760 ? 2 : 1; }

    function update() {
      var maxIndex = Math.max(0, cards - perView());
      index = Math.max(0, Math.min(index, maxIndex));
      var pct = (100 / perView()) * index;
      track.style.transform = "translateX(-" + pct + "%)";
    }
    prev.addEventListener("click", function () { index--; update(); });
    next.addEventListener("click", function () { index++; update(); });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* Freetown local clock (GMT)                                         */
  /* ------------------------------------------------------------------ */
  function initClock() {
    var el = document.getElementById("local-time");
    if (!el) return;
    function tick() {
      var now = new Date();
      var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // Freetown = GMT/UTC
      var h = String(utc.getHours()).padStart(2, "0");
      var m = String(utc.getMinutes()).padStart(2, "0");
      el.textContent = h + ":" + m;
    }
    tick();
    setInterval(tick, 15000);
  }

  /* ------------------------------------------------------------------ */
  /* Misc: footer year, back-to-top                                     */
  /* ------------------------------------------------------------------ */
  function initMisc() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    var toTop = document.getElementById("to-top");
    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        if (form.action.indexOf("your-form-id") !== -1) {
          e.preventDefault();
          alert("This form is a template — connect a real Formspree endpoint (or mailto fallback) before going live.");
        }
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    runPreloader();
    initNav();
    initHeroText();
    initHeroScene();
    initMagnetic();
    initReveal();
    initCounters();
    loadProjects();
    initTestimonials();
    initClock();
    initMisc();
  });
})();
