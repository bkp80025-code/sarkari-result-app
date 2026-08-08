document.addEventListener("DOMContentLoaded", async function () {

  // Auto Clean / Branding Replacement Function
  function cleanBranding(text) {
    if (!text) return "";
    return text
      .replace(/Sarkari\s*Result/gi, "ONLINEPUR")
      .replace(/Sarkari\s*Exam/gi, "ONLINEPUR")
      .replace(/Sarkari\s*Naukri/gi, "ONLINEPUR")
      .replace(/SarkariResult/gi, "ONLINEPUR")
      .replace(/SarkariExam/gi, "ONLINEPUR");
  }

  // Fetch Admin Posts from GitHub
  try {
    const repoUrl = "https://api.github.com/repos/bkp80025-code/sarkari-result-app/contents/posts";
    const response = await fetch(repoUrl);

    if (response.ok) {
      const files = await response.json();

      for (const file of files) {
        if (file.name.endsWith('.md')) {
          try {
            const rawRes = await fetch(file.download_url);
            let text = await rawRes.text();

            // Auto-Replace Branding
            text = cleanBranding(text);

            const titleMatch = text.match(/title:\s*["']?(.*?)["']?$/m);
            const categoryMatch = text.match(/category:\s*["']?(.*?)["']?$/m);

            let title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');
            title = cleanBranding(title);

            const categoryName = categoryMatch ? categoryMatch[1].trim() : "";

            const postUrl = `post.html?file=${file.name}`;

            // Routing to exact container(s)
            const catLower = categoryName.toLowerCase();

            if (catLower.includes("common")) {
              // Post to ALL 6 Boxes
              addPostToDOM("job-list-container", title, postUrl);
              addPostToDOM("admit-list-container", title, postUrl);
              addPostToDOM("result-list-container", title, postUrl);
              addPostToDOM("answer-list-container", title, postUrl);
              addPostToDOM("doc-list-container", title, postUrl);
              addPostToDOM("yojana-list-container", title, postUrl);
            } else if (catLower.includes("job")) {
              addPostToDOM("job-list-container", title, postUrl);
            } else if (catLower.includes("admit")) {
              addPostToDOM("admit-list-container", title, postUrl);
            } else if (catLower.includes("result")) {
              addPostToDOM("result-list-container", title, postUrl);
            } else if (catLower.includes("answer")) {
              addPostToDOM("answer-list-container", title, postUrl);
            } else if (catLower.includes("document")) {
              addPostToDOM("doc-list-container", title, postUrl);
            } else if (catLower.includes("yojana")) {
              addPostToDOM("yojana-list-container", title, postUrl);
            }
          } catch (e) {
            console.error("Error reading file:", e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
  }

  function addPostToDOM(containerId, title, link) {
    const container = document.getElementById(containerId);
    if (container) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${link}">👉 ${title}</a>`;
      container.appendChild(li);
    }
  }
});
