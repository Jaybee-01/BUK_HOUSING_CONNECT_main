const listEl = document.getElementById("propertyList");
const detailsOverlay = document.getElementById("detailsOverlay");
const detailsWrap = document.getElementById("detailsWrap");
const bookingModal = document.getElementById("bookingModal");

let currentProperty = null;

function renderHome() {
  const props = getProps();
  listEl.innerHTML = "";
  if (props.length === 0) {
    listEl.innerHTML = `<div class="card"><p class="center">No properties yet. Landlords can add from their dashboard.</p></div>`;
    return;
  }

  props.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = p.price;
    card.dataset.type = (p.type || "").toLowerCase();
    // card.dataset.type = p.type ? p.type.toLowerCase() : "unknown";
    card.innerHTML = `
      <img src="${
        p.image || "https://via.placeholder.com/400x220?text=Property"
      }" style="width:100%; border-radius:8px; aspect-ratio:16/9; object-fit:cover;">
      <h3>${p.title}</h3>
      <p class="location" data-location=${p.location}><strong>${currency(
      p.price
    )}</strong> • ${p.location}</p>
      <p class="mt-2"><span class="badge ${p.verified ? "ok" : "warn"}">${
      p.verified ? "Verified" : "Pending"
    }</span></p>
      <button class="btn mt-3" data-id="${p.id}">View Details</button>
    `;
    listEl.appendChild(card);
  });

  listEl.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      handleViewDetails(id);
    });
  });
}

// Handles the pricerange display
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

priceRange.addEventListener("input", () => {
  priceValue.textContent = Number(priceRange.value).toLocaleString();
});

// displays property within the price range
function setupFilters() {
  const cards = document.querySelectorAll(".card");

  priceRange.addEventListener("input", () => {
    const selectedValue = Number(priceRange.value);

    cards.forEach((card) => {
      const price = Number(card.dataset.value);
      if (price == selectedValue) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Handles the searhInput button
  document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const location = card
        .querySelector(".location")
        .getAttribute("data-location")
        .toLowerCase();

      if (location.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });


  // handles the select input
  const propertyType = document.getElementById("type");

  propertyType.addEventListener("change", () => {
    const selectedType = propertyType.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const type = (card.dataset.type || "").toLowerCase();

      if (selectedType === "all" || type === selectedType) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

function handleViewDetails(id) {
  const u = getLogged();
  if (!u || u.role !== "student") {
    alert("You must log in as a Student to view details and book.");
    location.href = "login.html?next=" + encodeURIComponent(location.pathname);
    return;
  }
  const props = getProps();
  const p = props.find((x) => x.id === id);
  if (!p) return;

  currentProperty = p;

  detailsWrap.innerHTML = `
    <div class="details-inner">
      <div class="details-header">
        <h2>${p.title}</h2>
        <div>
          <span class="badge ${p.verified ? "ok" : "warn"}">${
    p.verified ? "Verified" : "Pending"
  }</span>
          <button class="btn outline" id="closeDetails">Close</button>
        </div>
      </div>
      <img src="${
        p.image || "https://via.placeholder.com/1000x560?text=Property"
      }" style="width:100%; border-radius:12px; margin:12px 0; aspect-ratio:16/9; object-fit:cover;">
      <p><strong>Price:</strong> ${currency(p.price)}</p>
      <p><strong>Contact:</strong><a href="tel:234${p.contact}"> +234 ${p.contact}</a></p>
      <p><strong>Location:</strong> ${p.location}</p>
      <p class="mt-2">${p.description || ""}</p>
      <div class="mt-4">
        <button class="btn" id="bookNow">Book Now</button>
      </div>
    </div>
  `;
  detailsOverlay.style.display = "block";

  document.getElementById("closeDetails").onclick = () =>
    (detailsOverlay.style.display = "none");
  document.getElementById("bookNow").onclick = () => openBooking();
}

function openBooking() {
  if (!currentProperty) return;
  document.getElementById("bkTitle").textContent = currentProperty.title;
  bookingModal.style.display = "flex";
}
function closeBooking() {
  bookingModal.style.display = "none";
}

function confirmBooking() {
  const u = getLogged();
  if (!u || u.role !== "student") return alert("Login as student first.");
  const note = document.getElementById("bkNote").value.trim();
  const bookings = getBookings();
  bookings.push({
    id: genId("b"),
    propertyId: currentProperty.id,
    student: u.email,
    note,
    createdAt: new Date().toISOString(),
  });
  saveBookings(bookings);
  alert("Booking sent to landlord!");
  closeBooking();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  setupFilters();
});

window.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBooking();
});
