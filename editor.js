(function () {
  var DRAFT_KEY = "portfolio_draft_v1";
  var PUBLISHED_KEY = "portfolio_published_v1";

  function getField(id) {
    return document.getElementById(id);
  }

  function linesToArray(value) {
    return String(value || "")
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function projectBlocksToText(projects) {
    return (projects || [])
      .map(function (project) {
        var header = [
          project.name || "",
          (project.stack || []).join(", "),
          project.link || ""
        ]
          .map(function (part) {
            return part.trim();
          })
          .join(" | ");
        return header + "\n" + (project.summary || "") + "\n";
      })
      .join("\n")
      .trim();
  }

  function textToProjectBlocks(text) {
    var clean = String(text || "").trim();
    if (!clean) return [];

    return clean
      .split(/\n\s*\n/g)
      .map(function (block) {
        var rows = block
          .split("\n")
          .map(function (line) {
            return line.trim();
          })
          .filter(Boolean);
        if (!rows.length) return null;

        var headerParts = rows[0].split("|").map(function (part) {
          return part.trim();
        });

        return {
          name: headerParts[0] || "Untitled Project",
          stack: (headerParts[1] || "")
            .split(",")
            .map(function (item) {
              return item.trim();
            })
            .filter(Boolean),
          link: headerParts[2] || "",
          summary: rows.slice(1).join(" ")
        };
      })
      .filter(Boolean);
  }

  function readStorage(key) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (_err) {
      return null;
    }
  }

  function fillForm(profile) {
    getField("name").value = profile.name || "";
    getField("role").value = profile.role || "";
    getField("location").value = profile.location || "";
    getField("email").value = profile.email || "";
    getField("phone").value = profile.phone || "";
    getField("tagline").value = profile.tagline || "";
    getField("about").value = profile.about || "";
    getField("resumePdf").value = profile.resumePdf || "resume/Mathuranath-latest.pdf";
    getField("projects").value = projectBlocksToText(profile.projects || []);
    getField("skills").value = (profile.skills || []).join("\n");
    getField("interests").value = (profile.interests || []).join("\n");
  }

  function collectForm() {
    return {
      name: getField("name").value.trim(),
      role: getField("role").value.trim(),
      location: getField("location").value.trim(),
      email: getField("email").value.trim(),
      phone: getField("phone").value.trim(),
      tagline: getField("tagline").value.trim(),
      about: getField("about").value.trim(),
      resumePdf: getField("resumePdf").value.trim() || "resume/Mathuranath-latest.pdf",
      projects: textToProjectBlocks(getField("projects").value),
      skills: linesToArray(getField("skills").value),
      interests: linesToArray(getField("interests").value)
    };
  }

  function setStatus(message) {
    getField("status").textContent = message;
  }

  function saveDraft() {
    var profile = collectForm();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(profile));
    setStatus("Draft saved locally.");
  }

  function publish() {
    var profile = collectForm();
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(profile));
    localStorage.removeItem(DRAFT_KEY);
    setStatus("Published. Open the portfolio page to verify.");
  }

  function downloadJson() {
    var profile = collectForm();
    var blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setStatus("Downloaded portfolio-data.json.");
  }

  var startingData = readStorage(DRAFT_KEY) || readStorage(PUBLISHED_KEY) || window.DEFAULT_PROFILE || {};
  fillForm(startingData);

  getField("saveDraft").addEventListener("click", saveDraft);
  getField("publish").addEventListener("click", publish);
  getField("downloadJson").addEventListener("click", downloadJson);
})();
