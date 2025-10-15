function signup(){
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  if (!name || !email || !password) return alert("Fill all signup fields.");

  const users = getUsers();
  if (users.some(u => u.email === email)) return alert("User already exists.");

  users.push({ name, email, password, role });
  saveUsers(users);
  alert("Signup successful. You can log in now.");
}

function login(){
  const email = (document.getElementById("loginEmail").value || "").toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return alert("Invalid credentials.");

  setLogged(user);

  if (user.role === "admin") location.href = "admin.html";
  else if (user.role === "landlord") location.href = "landlord.html";
  else if (user.role === "student") location.href = "student.html";
  else location.href = "index.html";
}