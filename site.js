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
      contactEl.innerHTML = contactItems.join('<span class="dot">•</span>');
    }

    var socialEl = document.getElementById("navSocial");
    if (socialEl) {
      var socials = Array.isArray(profile.socials) ? profile.socials : [];
      socialEl.innerHTML = socials
        .map(function (s) {
          return '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(s.label) + "</a>";
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

    var featuredExperienceEl = document.getElementById("featuredExperience");
    if (featuredExperienceEl) {
      var featuredExp = (profile.experience || []).filter(function (item) {
        return item.featured;
      });
      featuredExperienceEl.innerHTML = featuredExp
        .map(function (item) {
          return [
            '<article class="card">',
            '<p class="eyebrow">' + escapeHtml(item.start) + " - " + escapeHtml(item.end) + "</p>",
            "<h3>" + escapeHtml(item.title) + " @ " + escapeHtml(item.company) + "</h3>",
            '<p class="muted">' + escapeHtml(item.location || "") + "</p>",
            "</article>"
          ].join("");
        })
        .join("");
    }

    var featuredProjectsEl = document.getElementById("featuredProjects");
    if (featuredProjectsEl) {
      var featuredProjects = (profile.projects || []).filter(function (item) {
        return item.featured;
      });
      featuredProjectsEl.innerHTML = featuredProjects
        .map(function (project) {
          var link = project.link
            ? '<a class="inline-link" href="' + escapeHtml(project.link) + '" target="_blank" rel="noopener noreferrer">Visit</a>'
            : "";
          return [
            '<article class="card">',
            "<h3>" + escapeHtml(project.name) + "</h3>",
            "<p>" + escapeHtml(project.summary) + "</p>",
            '<div class="meta-row"><span>' + escapeHtml(project.type || "") + "</span><span>" + escapeHtml(project.status || "") + "</span></div>",
            link,
            "</article>"
          ].join("");
        })
        .join("");
    }

    var skillsEl = document.getElementById("highlightSkills");
    if (skillsEl) {
      skillsEl.innerHTML = chips(profile.featuredSkills || []);
    }
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

  var profile = readProfile();
  renderNav(profile);

  var page = document.body.getAttribute("data-page") || "home";
  if (page === "home") renderHome(profile);
  if (page === "projects") renderProjects(profile);
  if (page === "experience") renderExperience(profile);
  if (page === "resume") renderResume(profile);
})();
