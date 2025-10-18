function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document
    .getElementById("signupEmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  if (!name || !email || !password) return alert("Fill all signup fields.");

  const users = getUsers();
  if (users.some((u) => u.email === email))
    return alert("User already exists.");

  users.push({ name, email, password, role });
  saveUsers(users);
  alert("Signup successful. You can log in now.");
}

function login() {
  const email = (
    document.getElementById("loginEmail").value || ""
  ).toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return alert("Invalid credentials.");

  setLogged(user);

  if (user.role === "admin") location.href = "admin.html";
  else if (user.role === "landlord") location.href = "landlord.html";
  else if (user.role === "student") location.href = "student.html";
  else location.href = "index.html";
}

// switching between both forms
const navBtn = document.getElementById("loginNavBtn");
const navBtn2 = document.getElementById("signupNavBtn");
const loginform = document.getElementById("loginForm");
const signupform = document.getElementById("signupForm");
const loginformBtn = document.getElementById("loginformBtn");
const signupformBtn = document.getElementById("signupformBtn");
const logSecondBtn = document.getElementById("logSecondBtn");
const signSecondBtn = document.getElementById("signSecondBtn");

loginformBtn.addEventListener("click", () => {
  loginform.classList.add("active");
  signupform.classList.remove("active");
  loginformBtn.classList.add("active");
  signupformBtn.classList.remove("active");
});

signupformBtn.addEventListener("click", () => {
  loginform.classList.remove("active");
  signupform.classList.add("active");
  logSecondBtn.classList.remove("active");
  signSecondBtn.classList.add("active");
});

logSecondBtn.addEventListener("click", () => {
  loginform.classList.add("active");
  signupform.classList.remove("active");
  logSecondBtn.classList.add("active");
  signSecondBtn.classList.remove("active");
});

signSecondBtn.addEventListener("click", () => {
  loginform.classList.remove("active");
  signupform.classList.add("active");
  loginformBtn.classList.remove("active");
  signupformBtn.classList.add("active");
});

navBtn.addEventListener("click", () => {
  loginform.classList.add("active");
  signupform.classList.remove("active");
  loginformBtn.classList.add("active");
  signupformBtn.classList.remove("active");
});

navBtn2.addEventListener("click", () => {
  loginform.classList.remove("active");
  signupform.classList.add("active");
  loginformBtn.classList.remove("active");
  signupformBtn.classList.add("active");
});
