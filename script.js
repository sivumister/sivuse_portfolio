const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  }
});

(function () {
  emailjs.init("Whxte6kLgmrpUBmHu");
})();

const form = document.getElementById("contactForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  statusMsg.textContent = "Sending...";

  emailjs.sendForm("service_lp4ykc8", "template_deejuvs", this)
    .then(() => {
      statusMsg.textContent = "✅ Message sent successfully!";
      form.reset();
    }, (error) => {
      statusMsg.textContent = "❌ Failed to send. Try again.";
      console.error(error);
    });
});

function toggleMenu() {
  const menu = document.getElementById("socialMenu");
  menu.classList.toggle("active");
}

// ------------------------------
// Automatically populated GitHub projects
// ------------------------------
const GITHUB_USERNAME = "sivumister";
const PROJECTS_PER_PAGE = 100; // GitHub's maximum page size. Newest 100 are displayed.

function projectElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function projectLink(label, href, className, iconName) {
  const link = projectElement("a", className);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const icon = projectElement("i", iconName);
  icon.setAttribute("aria-hidden", "true");
  link.append(icon, document.createTextNode(` ${label}`));
  return link;
}

function validWebsiteUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function createProjectCard(repo) {
  const column = projectElement("div", "col-12 col-md-6 col-xl-4");
  const card = projectElement("article", "card h-100 portfolio-project-card");
  const cardBody = projectElement("div", "card-body d-flex flex-column p-4");

  const top = projectElement("div", "d-flex justify-content-between align-items-start gap-2 mb-3");
  const projectIcon = projectElement("span", "project-icon");
  projectIcon.innerHTML = '<i class="fas fa-code-branch" aria-hidden="true"></i>';
  top.append(projectIcon);

  if (repo.language) {
    top.append(projectElement("span", "project-language", repo.language));
  }

  const displayName = repo.name.replace(/[_-]+/g, " ");
  const title = projectElement("h3", "h5 fw-bold project-title", displayName);
  const description = projectElement(
    "p", "project-description mb-3", repo.description?.trim() || "Explore this project and its source code on GitHub."
  );

  const topics = (Array.isArray(repo.topics) ? repo.topics : [])
    .filter(topic => topic !== "hide-from-portfolio")
    .slice(0, 3);
  const tags = projectElement("div", "project-tags d-flex flex-wrap gap-2 mb-3");
  for (const topic of topics) {
    tags.append(projectElement("span", "project-tag", topic));
  }

  const buttons = projectElement("div", "d-flex flex-wrap gap-2 mt-auto");
  buttons.append(projectLink("Source Code", repo.html_url, "btn btn-sm btn-light", "fab fa-github"));

  const demo = validWebsiteUrl(repo.homepage);
  if (demo) {
    buttons.append(projectLink("Live Demo", demo, "btn btn-sm btn-outline-light", "fas fa-arrow-up-right-from-square"));
  }

  cardBody.append(top, title, description);
  if (topics.length) cardBody.append(tags);
  cardBody.append(buttons);
  card.append(cardBody);
  column.append(card);
  return column;
}

async function loadGitHubProjects() {
  const grid = document.getElementById("githubProjects");
  const status = document.getElementById("projectStatus");
  if (!grid || !status) return;

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=created&direction=desc&per_page=${PROJECTS_PER_PAGE}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error("Unexpected GitHub response");

    const projects = repositories.filter(repo =>
      !repo.fork &&
      !repo.archived &&
      repo.name.toLowerCase() !== "sivuse_portfolio" &&
      !(Array.isArray(repo.topics) && repo.topics.includes("hide-from-portfolio"))
    );

    const fragment = document.createDocumentFragment();
    projects.forEach(repo => fragment.append(createProjectCard(repo)));
    grid.replaceChildren(fragment);
    status.textContent = projects.length
      ? `Showing ${projects.length} public GitHub project${projects.length === 1 ? "" : "s"}.`
      : "No public projects available yet.";
  } catch (error) {
    console.error("Could not fetch GitHub projects:", error);
    status.textContent = "Projects are temporarily unavailable. You can still view them using the GitHub link above.";
  }
}

loadGitHubProjects();
