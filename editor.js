(function () {
  var DRAFT_KEY = "portfolio_draft_v2";
  var PUBLISHED_KEY = "portfolio_published_v2";

  function byId(id) {
    return document.getElementById(id);
  }

  function read(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function lines(value) {
    return String(value || "")
      .split("\n")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function setStatus(message, isError) {
    var el = byId("status");
    el.textContent = message;
    el.style.color = isError ? "#b3261e" : "#1d5f4f";
  }

  function fill(profile) {
    byId("name").value = profile.name || "";
    byId("role").value = profile.role || "";
    byId("location").value = profile.location || "";
    byId("email").value = profile.email || "";
    byId("phone").value = profile.phone || "";
    byId("tagline").value = profile.tagline || "";
    byId("aboutShort").value = profile.aboutShort || "";
    byId("aboutLong").value = profile.aboutLong || "";
    byId("resumePdf").value = profile.resumePdf || "resume/Mathuranath-latest.pdf";
    byId("featuredSkills").value = (profile.featuredSkills || []).join("\n");
    byId("interests").value = (profile.interests || []).join("\n");
    byId("projects").value = JSON.stringify(profile.projects || [], null, 2);
    byId("experience").value = JSON.stringify(profile.experience || [], null, 2);
  }

  function parseJsonArray(text, fieldName) {
    try {
      var parsed = JSON.parse(text || "[]");
      if (!Array.isArray(parsed)) {
        throw new Error(fieldName + " must be a JSON array.");
      }
      return parsed;
    } catch (err) {
      throw new Error("Invalid " + fieldName + " JSON: " + err.message);
    }
  }

  function collect() {
    return {
      name: byId("name").value.trim(),
      role: byId("role").value.trim(),
      location: byId("location").value.trim(),
      email: byId("email").value.trim(),
      phone: byId("phone").value.trim(),
      tagline: byId("tagline").value.trim(),
      aboutShort: byId("aboutShort").value.trim(),
      aboutLong: byId("aboutLong").value.trim(),
      resumePdf: byId("resumePdf").value.trim(),
      featuredSkills: lines(byId("featuredSkills").value),
      interests: lines(byId("interests").value),
      projects: parseJsonArray(byId("projects").value, "projects"),
      experience: parseJsonArray(byId("experience").value, "experience")
    };
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(collect()));
      setStatus("Draft saved locally.");
    } catch (err) {
      setStatus(err.message, true);
    }
  }

  function publish() {
    try {
      var profile = collect();
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(profile));
      localStorage.removeItem(DRAFT_KEY);
      setStatus("Published successfully. Open Home/Experience/Projects/Resume pages to verify.");
    } catch (err) {
      setStatus(err.message, true);
    }
  }

  function download() {
    try {
      var profile = collect();
      var blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "portfolio-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus("Downloaded portfolio-data.json.");
    } catch (err) {
      setStatus(err.message, true);
    }
  }

  fill(read(DRAFT_KEY) || read(PUBLISHED_KEY) || window.DEFAULT_PROFILE || {});

  byId("saveDraft").addEventListener("click", saveDraft);
  byId("publish").addEventListener("click", publish);
  byId("download").addEventListener("click", download);
})();
