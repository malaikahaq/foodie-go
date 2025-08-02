// Global state
let allRestaurants = [];
const cart = [];
let selectedItem = null;

// Helper: Shuffle array
function shuffleRestaurants(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

// ------------------ Shared (Both Pages) ------------------

window.adjustQuantity = function (index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCartOverlay();
};

window.goToCheckout = function () {
  alert("Redirecting to checkout...");
};

// ------------------ Page 1: restaurants.html ------------------

function renderRestaurants(restaurants) {
  const container = document.querySelector(".rest-opt-container");
  if (!container) return;

  container.innerHTML = "";
  const countElement = document.getElementById("restCount");
  if (countElement) {
    countElement.textContent = `Order from ${restaurants.length} places`;
  }

  restaurants.forEach((restaurant) => {
    const card = document.createElement("div");
    card.classList.add("rest-option");
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="rest-image-container">
        <img src="${restaurant.image}" alt="${restaurant.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px;" />
      </div>
      <label class="rest-name">${restaurant.name}</label>
      <label class="rest-category">${restaurant.category}</label>
    `;

    card.addEventListener("click", () => {
      const restaurantIndex = allRestaurants.indexOf(restaurant);
      window.location.href = `restaurant.html?index=${restaurantIndex}`;
    });

    container.appendChild(card);
  });
}

function setupRestaurantFilters() {
  const filters = [
    {
      id: "show-all",
      action: () => {
        shuffleRestaurants(allRestaurants);
        renderRestaurants(allRestaurants);
      },
    },
    { id: "show-sushi", filter: "sushi" },
    { id: "show-breakfast", filter: "breakfast" },
    { id: "show-pizza", filter: "pizza" },
    { id: "show-desi", filter: "desi" },
    { id: "show-fastfood", filter: "fastfood" },
    { id: "show-dessert", filter: "dessert" },
  ];

  filters.forEach(({ id, filter, action }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      // Remove 'selected' from all
      document.querySelectorAll(".food-icon-container").forEach((btn) => {
        btn.classList.remove("selected");
      });

      // Add 'selected' to current
      el.classList.add("selected");
      if (action) return action();
      const filtered = allRestaurants.filter((item) =>
        item.category.toLowerCase().includes(filter)
      );
      renderRestaurants(filtered);
    });
  });
}

function resetSearch() {
  const input = document.getElementById("food-search");
  if (input) {
    input.value = "";
    renderRestaurants(allRestaurants);
    const restCount = document.getElementById("restCount");
    if (restCount) {
      restCount.textContent = `Order from ${allRestaurants.length} places`;
    }
  }
}

function nothingFound() {
  const header = document.getElementById("restCount");
  if (header) {
    header.innerHTML = `
      <div style="text-align: center; padding: 40px; margin-top: 70px;">
        <img src="icons/Search-icon.svg" alt="Not Found Icon" style="width: 55px; height: 55px; margin-bottom: 20px;">
        <h2 style="font-weight: bold; font-size: 22px; margin: 0;">We didn't find a match for "<span style="color: black;">Sushi 1234</span>"</h2>
        <p style="color: #666; margin: 10px 0; font-size: 14px;">Try searching for something else instead</p>
        <button onclick="resetSearch()" style="background: #27ae60; color: white; padding: 6px 14px; border: none; border-radius: 20px; font-size: 14px; font-weight: 500; cursor: pointer;">
          Reset search
        </button>
      </div>
    `;
  }
}

// Setup search functionality - only for restaurants.html
function setupSearch() {
  const searchInput = document.querySelector("#food-search");
  if (!searchInput) return; // Exit if element doesn't exist

  searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    if (!query) {
      renderRestaurants(allRestaurants);
      const restCount = document.getElementById("restCount");
      if (restCount) {
        restCount.textContent = `Order from ${allRestaurants.length} places`;
      }
      return;
    }
    const filtered = allRestaurants.filter((restaurant) =>
      restaurant.menu.some((item) => item.name.toLowerCase().includes(query))
    );
    if (filtered.length === 0) {
      renderRestaurants([]); // optional: clear restaurant cards
      nothingFound(); // replaces the header text
    } else {
      renderRestaurants(filtered);
      const restCount = document.getElementById("restCount");
      if (restCount) {
        restCount.textContent = `Order from ${filtered.length} places`;
      }
    }
  });
}

// ------------------ Page 2: restaurant.html ------------------

function renderRestaurantPage(restaurant) {
  console.log("Rendering restaurant page for:", restaurant.name);

  const headerImg = document.querySelector(".rest-header-img");
  if (!headerImg) {
    console.error("Could not find .rest-header-img element");
    return;
  }

  headerImg.style.backgroundImage = `url(${restaurant.image})`;
  headerImg.style.height = "270px";
  headerImg.style.backgroundSize = "cover";
  headerImg.style.borderRadius = "20px";

  const headerName = document.querySelector(".rest-header-name");
  if (headerName) {
    headerName.innerHTML = `
      <h2>${restaurant.name}</h2>
      <p>${restaurant.category}</p>
    `;
  }

  const restDeets = document.querySelector(".rest-deets");
  if (restDeets) {
    restDeets.innerHTML = `
      <p><span>⭐ ${restaurant.rating}</span> &bull; <span>${restaurant.time}</span> &bull; <span>${restaurant.price}</span></p>
    `;
  }

  const menuContainer = document.querySelector(".menu");
  if (!menuContainer) {
    console.error("Could not find .menu element");
    return;
  }

  menuContainer.innerHTML = ""; // Clear existing content

  if (restaurant.menu?.length > 0) {
    restaurant.menu.forEach((item) => {
      const itemBox = document.createElement("div");
      itemBox.classList.add("menu-item");

      itemBox.innerHTML = `
        <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 20px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); align-items: center;">
          <div>
            <h4>${item.name}</h4>
            <p style="font-weight: bold;">${item.price}$</p>
            <p style="color: #555;">${item.description}</p>
          </div>
          <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;" />
        </div>
      `;

      itemBox.addEventListener("click", () => {
        selectedItem = {
          name: item.name,
          price: parseFloat(item.price),
        };
        const confirmText = document.getElementById("confirmText");
        if (confirmText) {
          confirmText.textContent = `Add "${selectedItem.name}" to cart for $${selectedItem.price}?`;
        }
        const confirmDialog = document.getElementById("confirmationDialog");
        if (confirmDialog) {
          confirmDialog.classList.remove("hidden");
        }
      });

      menuContainer.appendChild(itemBox);
    });
  } else {
    menuContainer.innerHTML =
      "<p style='padding: 20px;'>No menu available.</p>";
  }
}

function updateCartOverlay() {
  const cartOverlay = document.getElementById("cartOverlay");
  if (!cartOverlay) return;

  if (cart.length === 0) {
    cartOverlay.innerHTML = "<p style='padding: 20px;'>Your cart is empty.</p>";
    return;
  }

  let subtotal = 0;
  cartOverlay.innerHTML = `<h3 style="padding: 16px 20px 0 20px;">Your Cart</h3>`;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    cartOverlay.innerHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-bottom: 1px solid #ddd;">
        <div>
          <strong>${item.quantity} ${item.name}</strong>
          <div style="color: gray; font-size: 14px;">$${item.price.toFixed(
            2
          )}</div>
        </div>
        <div>
          <button onclick="adjustQuantity(${index}, -1)">−</button>
          <button onclick="adjustQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });

  cartOverlay.innerHTML += `
    <div style="padding: 20px;">
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Delivery: <strong>Free</strong></p>
      <p><strong>Total: $${subtotal.toFixed(2)}</strong></p>
      <button onclick="goToCheckout()" style="background: green; color: white; padding: 10px 20px; border-radius: 10px; border: 1px solid green;">Go to checkout</button>
    </div>
  `;
}

// Setup cart functionality for restaurant page
function setupRestaurantPageCart() {
  const cartBtn = document.getElementById("cartBtn");
  const dialog = document.getElementById("confirmationDialog");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const cartOverlay = document.getElementById("cartOverlay");
      if (cartOverlay) {
        cartOverlay.classList.toggle("hidden");
      }
    });
  }

  const confirmYes = document.getElementById("confirmYes");
  if (confirmYes) {
    confirmYes.addEventListener("click", () => {
      if (selectedItem) {
        const existing = cart.find((item) => item.name === selectedItem.name);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ ...selectedItem, quantity: 1 });
        }
        updateCartOverlay();
        selectedItem = null;
      }
      if (dialog) {
        dialog.classList.add("hidden");
      }
    });
  }

  const confirmNo = document.getElementById("confirmNo");
  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      selectedItem = null;
      if (dialog) {
        dialog.classList.add("hidden");
      }
    });
  }
}

// ------------------ Page Detection & Load Logic ------------------

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const index = parseInt(urlParams.get("index"));

  fetch("restaurants.json")
    .then((res) => res.json())
    .then((data) => {
      allRestaurants = data;

      if (isNaN(index)) {
        // We're on restaurants.html
        console.log("Loading restaurants page");
        renderRestaurants(allRestaurants);
        setupRestaurantFilters();
        setupSearch(); // Only setup search on restaurants page
      } else {
        // We're on restaurant.html
        console.log("Loading restaurant page with index:", index);
        const restaurant = data[index];
        if (!restaurant) {
          alert("Invalid restaurant!");
          return;
        }
        renderRestaurantPage(restaurant);
        setupRestaurantPageCart(); // Only setup cart on restaurant page
      }
    })
    .catch((err) => console.error("Error loading restaurants.json", err));
});
