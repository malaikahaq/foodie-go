let allRestaurants = []; // Global variable to store all data

// Fetch data once at the start
fetch("restaurants.json")
  .then((response) => response.json())
  .then((data) => {
    allRestaurants = data;
    renderRestaurants(allRestaurants); // Show all by default
  })
  .catch((error) => console.error("Error loading restaurant data:", error));

function shuffleRestaurants(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

// Function to render a list of restaurants
function renderRestaurants(restaurants) {
  const container = document.querySelector(".rest-opt-container");
  container.innerHTML = ""; // Clear current items

  restaurants.forEach((restaurant) => {
    const card = document.createElement("div");
    card.classList.add("rest-option");

    card.innerHTML = `
      <div class="rest-image-container">
        <img src="${restaurant.image}" alt="${restaurant.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px;" />
      </div>
      <label class="rest-name">${restaurant.name}</label>
      <label class="rest-category">${restaurant.category}</label>
    `;

    container.appendChild(card);
  });
}

document.getElementById("show-all").addEventListener("click", (e) => {
  e.preventDefault();
  shuffleRestaurants(allRestaurants);
  renderRestaurants(allRestaurants);
});

document.querySelector("#show-sushi").addEventListener("click", () => {
  const sushiRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("sushi")
  );
  renderRestaurants(sushiRests);
});
document.querySelector("#show-breakfast").addEventListener("click", () => {
  const breakfastRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("breakfast")
  );
  renderRestaurants(breakfastRests);
});
document.querySelector("#show-pizza").addEventListener("click", () => {
  const pizzaRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("pizza")
  );
  renderRestaurants(pizzaRests);
});
document.querySelector("#show-desi").addEventListener("click", () => {
  const desiRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("desi")
  );
  renderRestaurants(desiRests);
});
document.querySelector("#show-fastfood").addEventListener("click", () => {
  const fastfoodRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("fastfood")
  );
  renderRestaurants(fastfoodRests);
});
document.querySelector("#show-dessert").addEventListener("click", () => {
  const dessertRests = allRestaurants.filter((item) =>
    item.category.toLowerCase().includes("dessert")
  );
  renderRestaurants(dessertRests);
});
