document.addEventListener("DOMContentLoaded", async function () {
  "use strict";

  const API_URL = "https://api.github.com/repos/bkp80025-code/sarkari-result-app/contents/posts";
  const RAW_BASE = "https://raw.githubusercontent.com/bkp80025-code/sarkari-result-app/main/posts/";

  const containers = [
    "job-list-container",
    "admit-list-container",
    "result-list-container",
    "answer-list-container",
    "doc-list-container",
    "yojana-list-container"
  ];

  function cleanBranding(value = "") {
    return String(value)
      .replace(/Sarkari\s*Result/gi, "ONLINEPUR")
      .replace(/Sarkari\s*Exam/gi, "ONLINEPUR")
      .replace(/Sarkari\s*Naukri/gi, "ONLINEPUR")
      .replace(/SarkariResult/gi, "ONLINEPUR")
      .replace(/SarkariExam/gi, "ONLINEPUR");
  }

  function field(text, key) {
    const match = text.match(
      new RegExp("^" + key + ":\\s*(.*?)\\s*$", "m")
    );

    if (!match) return "";

    return match[1].trim().replace(/^(['"])(.*)\1$/, "$2");
  }

  function parseFrontmatter(text) {
    const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
    return match ? match[1] : "";
  }

  function dateValue(frontmatter, fallback) {
    const value =
      field(frontmatter, "date") ||
      field(frontmatter, "publish_date") ||
      field(frontmatter, "start_date");

    const parsed = Date.parse(value);

    return Number.isNaN(parsed) ? (fallback || 0) : parsed;
  }

  function categoryContainers(category) {
    const c = category.toLowerCase();

    if (/common|all|सभी/.test(c)) {
      return containers.slice();
    }

    const ids = [];

    if (/job|recruitment|vacancy|bharti|भर्ती|नौकरी/.test(c)) {
      ids.push("job-list-container");
    }

    if (/admit|hall.?ticket|exam.?city|call.?letter|प्रवेश.?पत्र/.test(c)) {
      ids.push("admit-list-container");
    }

    if (/result|score.?card|merit.?list|रिजल्ट|परिणाम/.test(c)) {
      ids.push("result-list-container");
    }

    if (/answer.?key|उत्तर.?कुंजी/.test(c)) {
      ids.push("answer-list-container");
    }

    if (/document|certificate|दस्तावेज|प्रमाण.?पत्र/.test(c)) {
      ids.push("doc-list-container");
    }

    if (/yojana|scheme|योजना/.test(c)) {
      ids.push("yojana-list-container");
    }

    return ids;
  }

  function addPost(containerId, title, fileName) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = "post.html?file=" + encodeURIComponent(fileName);
    a.textContent = "👉 " + cleanBranding(title);
    a.title = cleanBranding(title);

    li.appendChild(a);
    container.appendChild(li);
  }

  try {
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.replaceChildren();
    });

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("GitHub API error: " + response.status);
    }

    const files = await response.json();

    const markdownFiles = files.filter(file =>
      file.type === "file" && /\.md$/i.test(file.name)
    );

    const results = await Promise.all(
      markdownFiles.map(async file => {
        try {
          const res = await fetch(RAW_BASE + encodeURIComponent(file.name));

          if (!res.ok) return null;

          const text = await res.text();
          const frontmatter = parseFrontmatter(text);

          const title = cleanBranding(
            field(frontmatter, "title") ||
            file.name.replace(/\.md$/i, "").replace(/[-_]/g, " ")
          );

          const category = field(frontmatter, "category");

          const yearMatch = file.name.match(/20\d{2}/);

          const fallbackDate = yearMatch
            ? Date.parse(yearMatch[0] + "-01-01")
            : 0;

          return {
            fileName: file.name,
            title,
            category,
            date: dateValue(frontmatter, fallbackDate)
          };
        } catch (error) {
          console.error("Post read error:", file.name, error);
          return null;
        }
      })
    );

    results
      .filter(Boolean)
      .sort((a, b) =>
        b.date - a.date ||
        b.fileName.localeCompare(a.fileName)
      )
      .forEach(post => {
        categoryContainers(post.category).forEach(id => {
          addPost(id, post.title, post.fileName);
        });
      });

    containers.forEach(id => {
      const el = document.getElementById(id);

      if (el && !el.children.length) {
        const li = document.createElement("li");
        li.className = "empty-post-message";
        li.textContent = "अभी कोई पोस्ट उपलब्ध नहीं है।";
        el.appendChild(li);
      }
    });

  } catch (error) {
    console.error("ONLINEPUR posts loading error:", error);

    containers.forEach(id => {
      const el = document.getElementById(id);

      if (el) {
        el.replaceChildren();

        const li = document.createElement("li");
        li.textContent =
          "पोस्ट लोड नहीं हो सकी। कृपया थोड़ी देर बाद रिफ्रेश करें।";

        el.appendChild(li);
      }
    });
  }
});
