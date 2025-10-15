// Keys
const LS = {
  USERS: "users",
  LOGGED: "loggedInUser",
  PROPS: "properties",
  BOOKS: "bookings",
};

// Seed admin user once
(function seedAdmin() {
  const users = JSON.parse(localStorage.getItem(LS.USERS)) || [];
  if (!users.some((u) => u.email === "admin@buk.com")) {
    users.push({
      name: "Administrator",
      email: "admin@buk.com",
      password: "adminpassword",
      role: "admin",
    });
    localStorage.setItem(LS.USERS, JSON.stringify(users));
  }
})();

function getUsers() {
  return JSON.parse(localStorage.getItem(LS.USERS)) || [];
}
function saveUsers(u) {
  localStorage.setItem(LS.USERS, JSON.stringify(u));
}

function getLogged() {
  return JSON.parse(localStorage.getItem(LS.LOGGED) || "null");
}
function setLogged(u) {
  if (u) localStorage.setItem(LS.LOGGED, JSON.stringify(u));
  else localStorage.removeItem(LS.LOGGED);
}

function getProps() {
  return JSON.parse(localStorage.getItem(LS.PROPS)) || [];
}
function saveProps(p) {
  localStorage.setItem(LS.PROPS, JSON.stringify(p));
}

function getBookings() {
  return JSON.parse(localStorage.getItem(LS.BOOKS)) || [];
}
function saveBookings(b) {
  localStorage.setItem(LS.BOOKS, JSON.stringify(b));
}

function genId(prefix = "p") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e5)}`;
}
function currency(n) {
  n = Number(n) || 0;
  return "₦" + n.toLocaleString();
}

function requireRole(role, redirect = "login.html") {
  const u = getLogged();
  if (!u || (Array.isArray(role) ? !role.includes(u.role) : u.role !== role)) {
    window.location.href = `${redirect}?next=${encodeURIComponent(
      location.pathname
    )}`;
  }
}

function logout() {
  setLogged(null);
  window.location.href = "index.html";
}

function navRender() {
  const u = getLogged();
  const navUser = document.getElementById("navUser");
  const navActions = document.getElementById("navActions");
  if (!navUser || !navActions) return;
  if (u) {
    navUser.textContent = `${u.name || u.email} (${u.role})`;
    navActions.innerHTML = `
      ${u.role === "admin" ? '<a href="admin.html">Admin</a>' : ""}
      ${u.role === "landlord" ? '<a href="landlord.html">Landlord</a>' : ""}
      ${u.role === "student" ? '<a href="student.html">Student</a>' : ""}
      <a href="#" id="logoutLink">Logout</a>
    `;
    setTimeout(() => {
      const link = document.getElementById("logoutLink");
      if (link)
        link.onclick = (e) => {
          e.preventDefault();
          logout();
        };
    }, 0);
  } else {
    navUser.textContent = "Guest";
    navActions.innerHTML = `<a href="login.html">Login / Signup</a>`;
  }
}
document.addEventListener("DOMContentLoaded", navRender);
