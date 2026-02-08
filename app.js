(function () {
  var STORAGE_KEY = "portfolio_published_v1";

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
    } catch (err) {
      console.warn("Invalid published portfolio data. Falling back to defaults.", err);
      return fallback;
    }
  }

  function render(profile) {
    document.title = profile.name + " | Portfolio";

    var nameEl = document.getElementById("name");
    var roleEl = document.getElementById("role");
    var taglineEl = document.getElementById("tagline");
    var aboutEl = document.getElementById("about");
    var contactEl = document.getElementById("contact");
    var projectsEl = document.getElementById("projects");
    var skillsEl = document.getElementById("skills");
    var interestsEl = document.getElementById("interests");
    var resumeLinkEl = document.getElementById("resumeLink");
    var footerNameEl = document.getElementById("footerName");

    nameEl.textContent = profile.name || "Your Name";
    footerNameEl.textContent = profile.name || "Your Name";
    roleEl.textContent = [profile.role, profile.location].filter(Boolean).join(" • ");
    taglineEl.textContent = profile.tagline || "";
    aboutEl.textContent = profile.about || "";
    contactEl.innerHTML = [
      profile.email ? '<a href="mailto:' + escapeHtml(profile.email) + '">' + escapeHtml(profile.email) + "</a>" : "",
      profile.phone ? '<span>' + escapeHtml(profile.phone) + "</span>" : ""
    ]
      .filter(Boolean)
      .join("<span class=\"sep\">|</span>");

    resumeLinkEl.setAttribute("href", profile.resumePdf || "resume/Mathuranath-latest.pdf");

    var projects = Array.isArray(profile.projects) ? profile.projects : [];
    if (projects.length) {
      projectsEl.innerHTML = projects
        .map(function (project) {
          var stack = Array.isArray(project.stack) ? project.stack : [];
          var stackHtml = stack
            .map(function (item) {
              return '<li class="chip">' + escapeHtml(item) + "</li>";
            })
            .join("");
          var linkHtml = project.link
            ? '<a class="project-link" href="' + escapeHtml(project.link) + '" target="_blank" rel="noopener noreferrer">View project</a>'
            : "";
          return [
            '<article class="card">',
            "<h3>" + escapeHtml(project.name) + "</h3>",
            "<p>" + escapeHtml(project.summary) + "</p>",
            '<ul class="chips">' + stackHtml + "</ul>",
            linkHtml,
            "</article>"
          ].join("");
        })
        .join("");
    } else {
      projectsEl.innerHTML = '<article class="card"><p>Add projects from the edit page.</p></article>';
    }

    var skills = Array.isArray(profile.skills) ? profile.skills : [];
    skillsEl.innerHTML = skills.length
      ? skills
          .map(function (skill) {
            return '<li class="chip">' + escapeHtml(skill) + "</li>";
          })
          .join("")
      : '<li class="chip">Add skills from the edit page</li>';

    var interests = Array.isArray(profile.interests) ? profile.interests : [];
    interestsEl.innerHTML = interests.length
      ? interests
          .map(function (interest) {
            return "<li>" + escapeHtml(interest) + "</li>";
          })
          .join("")
      : "<li>Add interests from the edit page.</li>";
  }

  render(readProfile());
})();
