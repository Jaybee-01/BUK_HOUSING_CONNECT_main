requireRole("student");

const sList = document.getElementById("sPropertyList");
const sDetailsOverlay = document.getElementById("sDetailsOverlay");
const sDetailsWrap = document.getElementById("sDetailsWrap");
const sBookingModal = document.getElementById("sBookingModal");
let currentProp = null;

function sRender(){
  const props = getProps().filter(p=>p.verified);
  sList.innerHTML = "";
  if (props.length === 0){
    sList.innerHTML = `<div class="card"><p class="center">No verified properties yet.</p></div>`;
    return;
  }
  props.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/400x220?text=Property'}" style="width:100%; border-radius:8px; aspect-ratio:16/9; object-fit:cover;">
      <h3>${p.title}</h3>
      <p><strong>${currency(p.price)}</strong> • ${p.location}</p>
      <button class="btn mt-3" data-id="${p.id}">View Details</button>
    `;
    sList.appendChild(card);
  });

  sList.querySelectorAll("button[data-id]").forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.getAttribute("data-id");
      const p = getProps().find(x=>x.id===id);
      if (!p) return;
      currentProp = p;
      sDetailsWrap.innerHTML = `
        <div class="details-inner mt-details">
          <div class="details-header">
            <h2>${p.title}</h2>
            <button class="btn outline" id="sCloseDetails">Close</button>
          </div>
          <img src="${p.image || 'https://via.placeholder.com/1000x560?text=Property'}" style="width:100%; border-radius:12px; margin:12px 0; aspect-ratio:16/9; object-fit:cover;">
          <p><strong>Price:</strong> ${currency(p.price)}</p>
          <p><strong>Contact:</strong><a href="tel:234${p.contact}"> +234 ${p.contact}</a></p>
          <p><strong>Location:</strong> ${p.location}</p>
          <p class="mt-2">${p.description || ''}</p>
          <div class="mt-4">
            <button class="btn" id="sBookNow">Book Now</button>
          </div>
        </div>
      `;
      sDetailsOverlay.style.display = "block";
      document.getElementById("sCloseDetails").onclick = ()=> sDetailsOverlay.style.display="none";
      document.getElementById("sBookNow").onclick = ()=> sBookingModal.style.display="flex";
    };
  });
}

function sConfirmBooking(){ 
  const u = getLogged();
  const note = document.getElementById("sBkNote").value.trim();
  const bookings = getBookings();
  bookings.push({
    id: genId("b"),
    propertyId: currentProp.id,
    student: u.email,
    note,
    createdAt: new Date().toISOString()
  });
  saveBookings(bookings);
  alert("Booking sent!");
  document.getElementById("sBkNote").value = "";
  sBookingModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", sRender);

window.addEventListener("click", (e)=>{
  if (e.target === sBookingModal) sBookingModal.style.display = "none";
});