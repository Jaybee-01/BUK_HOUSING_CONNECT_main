requireRole("admin");

const propsBody = document.getElementById("allPropsTBody");
const lordsBody = document.getElementById("landlordsTBody");

function renderAdmin(){
  renderProps();
  renderLandlords();
}

function renderProps(){
  const props = getProps();
  propsBody.innerHTML = "";
  if (props.length === 0){
    propsBody.innerHTML = `<tr><td colspan="8" class="center">No properties found.</td></tr>`;
    return;
  }
  props.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.title}</td>
      <td>${currency(p.price)}</td>
      <td>${p.location}</td>
      <td>${p.landlord}</td>
      <td>${p.verified ? '<span class="badge ok">Yes</span>' : '<span class="badge warn">No</span>'}</td>
      <td>${new Date(p.createdAt).toLocaleString()}</td>
      <td><button class="btn ok" data-verify="${p.id}">${p.verified ? 'Unverify' : 'Verify'}</button></td>
      <td><button class="btn danger" data-del="${p.id}">Delete</button></td>
    `;
    propsBody.appendChild(tr);
  });

  propsBody.querySelectorAll("[data-verify]").forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.getAttribute("data-verify");
      const all = getProps();
      const i = all.findIndex(x=>x.id===id);
      if (i>=0){ all[i].verified = !all[i].verified; saveProps(all); renderProps(); }
    };
  });

  propsBody.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = ()=>{
      if (!confirm("Delete this property?")) return;
      const id = btn.getAttribute("data-del");
      saveProps(getProps().filter(x=>x.id!==id));
      renderProps();
    };
  });
}

function renderLandlords(){
  const users = getUsers().filter(u=>u.role==="landlord");
  lordsBody.innerHTML = "";
  if (users.length === 0){
    lordsBody.innerHTML = `<tr><td colspan="4" class="center">No landlords found.</td></tr>`;
    return;
  }
  users.forEach(u=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name || "-"}</td>
      <td>${u.email}</td>
      <td>${u.contact}</td>
      <td>landlord</td>
      <td><button class="btn danger" data-remove="${u.email}">Remove</button></td>
    `;
    lordsBody.appendChild(tr);
  });

  lordsBody.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.onclick = ()=>{
      const email = btn.getAttribute("data-remove");
      if (!confirm(`Remove landlord ${email}? Their properties will also be removed.`)) return;

      const users = getUsers().filter(x=>x.email !== email);
      saveUsers(users);
      saveProps(getProps().filter(p=>p.landlord !== email));

      renderLandlords();
      renderProps();
    };
  });
}

document.addEventListener("DOMContentLoaded", renderAdmin);