document.addEventListener("DOMContentLoaded", function () {
  const posts = [
    {
      title: "IBPS Clerk 16th Online Form 2026",
      category: "job-list-container",
      link: "latest-job/ibps.html"
    },
    {
      title: "Railway RRB Technician Recruitment 2026",
      category: "job-list-container",
      link: "#"
    },
    {
      title: "SSC GD Constable Exam Result 2026",
      category: "result-list-container",
      link: "#"
    },
    {
      title: "UP Police Constable Result 2026",
      category: "result-list-container",
      link: "#"
    },
    {
      title: "NTA NEET UG Admit Card 2026",
      category: "admit-list-container",
      link: "#"
    }
  ];

  posts.forEach(post => {
    const container = document.getElementById(post.category);
    if (container) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${post.link}">👉 ${post.title}</a>`;
      container.appendChild(li);
    }
  });
});
