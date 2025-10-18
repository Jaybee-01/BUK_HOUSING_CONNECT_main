requireRole("landlord");

const form = document.getElementById("propForm");
const myTableBody = document.getElementById("myPropsTBody");
const me = getLogged();

function renderMyProps() {
  const props = getProps().filter((p) => p.landlord === me.email);
  myTableBody.innerHTML = "";
  if (props.length === 0) {
    myTableBody.innerHTML = `<tr><td colspan="6" class="center">No properties yet.</td></tr>`;
    return;
  }
  props.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.title}</td>
      <td>${currency(p.price)}</td>
      <td>${p.contact}</td>
      <td>${p.location}</td>
      <td>${p.verified ? "Yes" : "No"}</td>
      <td>${new Date(p.createdAt).toLocaleString()}</td>
      <td>
        <button class="btn danger" data-del="${p.id}">Delete</button>
      </td>
    `;
    myTableBody.appendChild(tr);
  });

  myTableBody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("Delete this property?")) return;
      const id = btn.getAttribute("data-del");
      const all = getProps().filter((x) => x.id !== id);
      saveProps(all);
      renderMyProps();
    };
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const prop = {
    id: genId("prop"),
    title: fd.get("title").toString().trim(),
    price: Number(fd.get("price") || 0),
    contact: Number(fd.get("contact")),
    type: fd.get("type")?.toString().trim().toLowerCase() || "apartment",
    location: fd.get("location").toString().trim(),
    description: fd.get("description").toString().trim(),
    image: fd.get("image").toString().trim(),
    landlord: me.email,
    verified: false,
    createdAt: new Date().toISOString(),
  };
  if (!prop.title || !prop.contact || !prop.price || !prop.location)
    return alert("Title, price, contact and location are required.");

  const props = getProps();
  props.push(prop);
  saveProps(props);

  form.reset();
  alert(
    "Property added! It’s now visible on the homepage (Pending verification)."
  );
  renderMyProps();
});

document.addEventListener("DOMContentLoaded", renderMyProps);
