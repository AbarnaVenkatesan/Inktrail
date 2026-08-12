/* ============================================================
   InkTrail — shared utilities used across every page
============================================================ */

// ---------- toast notifications ----------
function toast(message, kind = "ok") {
  const host = document.getElementById("toast-host") || (() => {
    const el = document.createElement("div");
    el.id = "toast-host";
    document.body.appendChild(el);
    return el;
  })();
  const t = document.createElement("div");
  t.className = `toast toast--${kind}`;
  t.textContent = message;
  host.appendChild(t);
  requestAnimationFrame(() => t.classList.add("toast--in"));
  setTimeout(() => {
    t.classList.remove("toast--in");
    setTimeout(() => t.remove(), 250);
  }, 2800);
}

// ---------- date / reading time ----------
function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function readingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
function excerpt(markdown, len = 140) {
  const plain = markdown
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > len ? plain.slice(0, len).trim() + "…" : plain;
}

// ---------- tiny markdown-lite renderer (headers, bold, italic, links, lists, breaks) ----------
function renderMarkdown(src) {
  if (!src) return "";
  const escaped = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = escaped.split("\n");
  let html = "";
  let inList = false;

  for (let raw of lines) {
    const line = raw.trim();
    const listMatch = line.match(/^-\s+(.*)/);
    if (listMatch) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inlineMd(listMatch[1])}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (/^###\s+/.test(line)) html += `<h3>${inlineMd(line.replace(/^###\s+/, ""))}</h3>`;
    else if (/^##\s+/.test(line)) html += `<h2>${inlineMd(line.replace(/^##\s+/, ""))}</h2>`;
    else if (/^#\s+/.test(line)) html += `<h1>${inlineMd(line.replace(/^#\s+/, ""))}</h1>`;
    else if (line === "") html += "";
    else html += `<p>${inlineMd(line)}</p>`;
  }
  if (inList) html += "</ul>";
  return html;
}
function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// ---------- nav: reflect auth state + mobile menu + active link ----------
function initNav() {
  const user = DB.currentUser();
  const authSlot = document.querySelector("[data-auth-slot]");
  if (authSlot) {
    if (user) {
      authSlot.innerHTML = `
        <a class="nav-link" href="dashboard.html">Dashboard</a>
        <a class="nav-link" href="create.html">Write</a>
        <button class="btn btn--ghost" data-logout>Log out</button>
        <span class="nav-user" title="${user.email}">${initials(user.name)}</span>
      `;
      authSlot.querySelector("[data-logout]").addEventListener("click", () => {
        DB.clearSession();
        toast("Logged out. See you soon.");
        setTimeout(() => (location.href = "index.html"), 500);
      });
    } else {
      authSlot.innerHTML = `
        <a class="nav-link" href="login.html">Log in</a>
        <a class="btn btn--primary" href="register.html">Start writing</a>
      `;
    }
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .nav-brand-link").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("is-active");
  });

  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
}
function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ---------- route guard for protected pages ----------
function requireAuth() {
  if (!DB.currentUser()) {
    sessionStorage.setItem("inktrail_redirect", location.pathname.split("/").pop());
    location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", initNav);
