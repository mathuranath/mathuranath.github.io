(function () {
  var STORAGE_KEY = "portfolio_published_v2";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readProfile() {
    var fallback = window.DEFAULT_PROFILE || {};
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return Object.assign({}, fallback, parsed);
    } catch (_err) {
      return fallback;
    }
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "";
  }

  function socialIcon(label) {
    var normalized = String(label || "").toLowerCase();
    if (normalized === "github") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.8-.25.8-.57v-2.2c-3.2.7-3.88-1.55-3.88-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.76 2.71 1.25 3.37.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.44-2.27 1.18-3.08-.12-.28-.51-1.45.11-3.02 0 0 .96-.3 3.15 1.18a10.84 10.84 0 0 1 5.74 0c2.19-1.48 3.15-1.18 3.15-1.18.62 1.57.23 2.74.11 3.02.73.81 1.18 1.83 1.18 3.08 0 4.4-2.68 5.37-5.24 5.65.42.37.79 1.08.79 2.19v3.24c0 .31.21.68.8.57A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>';
    }
    if (normalized === "linkedin") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.83v1.64h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.12V21h-4v-5.52c0-1.32-.02-3.01-1.84-3.01-1.84 0-2.12 1.44-2.12 2.92V21H9z"/></svg>';
    }
    return '<span class="social-fallback">' + escapeHtml(label || "") + "</span>";
  }

  function renderNav(profile) {
    setText("navName", profile.name || "Your Name");
    setText("navRole", profile.role || "Software Engineer");

    var contactEl = document.getElementById("navContact");
    if (contactEl) {
      var contactItems = [];
      if (profile.email) {
        contactItems.push('<a href="mailto:' + escapeHtml(profile.email) + '">' + escapeHtml(profile.email) + "</a>");
      }
      if (profile.phone) {
        contactItems.push("<span>" + escapeHtml(profile.phone) + "</span>");
      }
      contactEl.innerHTML = contactItems.join(" ");
    }

    var socialEl = document.getElementById("navSocial");
    if (socialEl) {
      var socials = Array.isArray(profile.socials) ? profile.socials : [];
      socialEl.innerHTML = socials
        .map(function (s) {
          return '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(s.label) + '" title="' + escapeHtml(s.label) + '">' + socialIcon(s.label) + "</a>";
        })
        .join("");
    }

    var resumeEls = document.querySelectorAll("[data-resume-link]");
    resumeEls.forEach(function (el) {
      el.setAttribute("href", profile.resumePdf || "resume/Mathuranath-latest.pdf");
    });
  }

  function chips(items) {
    return (items || [])
      .map(function (item) {
        return '<li class="chip">' + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  function renderHome(profile) {
    setText("heroTitle", profile.tagline || "");
    setText("heroAbout", profile.aboutShort || "");
    setText("heroAboutExtra", profile.aboutCrossDiscipline || "");
    setText(
      "professionalProjectCount",
      String(profile.professionalProjectCount || (profile.projects || []).length)
    );

    var skillGroupsEl = document.getElementById("skillGroups");
    if (skillGroupsEl) {
      var groups = Array.isArray(profile.skillCategories) ? profile.skillCategories : [];
      if (!groups.length) {
        skillGroupsEl.innerHTML =
          '<article class="quick-card"><h3>Skills</h3><ul class="chips">' +
          chips(profile.featuredSkills || []) +
          "</ul></article>";
      } else {
        skillGroupsEl.innerHTML = groups
          .map(function (group) {
            return [
              '<article class="quick-card skill-group">',
              "<h3>" + escapeHtml(group.title || "") + "</h3>",
              '<ul class="chips">' + chips(group.items || []) + "</ul>",
              "</article>"
            ].join("");
          })
          .join("");
      }
    }
  }

  function setupReveal() {
    var items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    items.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index * 24, 72) + "ms";
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function renderProjects(profile) {
    var listEl = document.getElementById("projectList");
    if (!listEl) return;

    listEl.innerHTML = (profile.projects || [])
      .map(function (project) {
        var link = project.link
          ? '<a class="inline-link" href="' + escapeHtml(project.link) + '" target="_blank" rel="noopener noreferrer">View project</a>'
          : "";

        return [
          '<article class="card detail">',
          "<h3>" + escapeHtml(project.name) + "</h3>",
          '<div class="meta-row"><span>' + escapeHtml(project.type || "") + "</span><span>" + escapeHtml(project.status || "") + "</span></div>",
          "<p>" + escapeHtml(project.summary) + "</p>",
          '<p class="muted">' + escapeHtml(project.details || "") + "</p>",
          '<ul class="chips">' + chips(project.stack || []) + "</ul>",
          link,
          "</article>"
        ].join("");
      })
      .join("");
  }

  function renderExperience(profile) {
    var listEl = document.getElementById("experienceList");
    if (!listEl) return;

    listEl.innerHTML = (profile.experience || [])
      .map(function (exp) {
        var highlights = (exp.highlights || [])
          .map(function (h) {
            return "<li>" + escapeHtml(h) + "</li>";
          })
          .join("");

        return [
          '<article class="timeline-item">',
          '<p class="eyebrow">' + escapeHtml(exp.start) + " - " + escapeHtml(exp.end) + "</p>",
          "<h3>" + escapeHtml(exp.title) + "</h3>",
          '<p class="muted">' + escapeHtml(exp.company) + " | " + escapeHtml(exp.location || "") + "</p>",
          "<ul>" + highlights + "</ul>",
          '<ul class="chips">' + chips(exp.stack || []) + "</ul>",
          "</article>"
        ].join("");
      })
      .join("");
  }

  function renderResume(profile) {
    setText("resumeName", profile.name || "");
    setText("resumeRole", profile.role || "");
    setText("resumeLocation", profile.location || "");
    setText("resumeSummary", profile.aboutLong || "");

    var skillsEl = document.getElementById("resumeSkills");
    if (skillsEl) skillsEl.innerHTML = chips(profile.featuredSkills || []);

    var expEl = document.getElementById("resumeExperience");
    if (expEl) {
      expEl.innerHTML = (profile.experience || [])
        .map(function (exp) {
          var bullets = (exp.highlights || [])
            .map(function (h) {
              return "<li>" + escapeHtml(h) + "</li>";
            })
            .join("");
          return [
            '<article class="resume-item">',
            "<h3>" + escapeHtml(exp.title) + " - " + escapeHtml(exp.company) + "</h3>",
            '<p class="muted">' + escapeHtml(exp.start) + " - " + escapeHtml(exp.end) + " | " + escapeHtml(exp.location || "") + "</p>",
            "<ul>" + bullets + "</ul>",
            "</article>"
          ].join("");
        })
        .join("");
    }

    var projectEl = document.getElementById("resumeProjects");
    if (projectEl) {
      projectEl.innerHTML = (profile.projects || [])
        .map(function (project) {
          return [
            '<article class="resume-item">',
            "<h3>" + escapeHtml(project.name) + "</h3>",
            "<p>" + escapeHtml(project.summary) + "</p>",
            "</article>"
          ].join("");
        })
        .join("");
    }
  }

  function renderEducation(profile) {
    var listEl = document.getElementById("educationList");
    if (!listEl) return;

    listEl.innerHTML = (profile.education || [])
      .map(function (edu) {
        return [
          '<article class="card detail">',
          "<h3>" + escapeHtml(edu.school || "") + "</h3>",
          '<p class="muted">' + escapeHtml(edu.degree || "") + "</p>",
          '<p class="muted">' + escapeHtml(edu.period || "") + "</p>",
          edu.note ? "<p>" + escapeHtml(edu.note) + "</p>" : "",
          "</article>"
        ].join("");
      })
      .join("");
  }

  var profile = readProfile();
  renderNav(profile);

  var page = document.body.getAttribute("data-page") || "home";
  if (page === "home") renderHome(profile);
  if (page === "projects") renderProjects(profile);
  if (page === "experience") renderExperience(profile);
  if (page === "resume") renderResume(profile);
  if (page === "education") renderEducation(profile);
  setupReveal();
})();
