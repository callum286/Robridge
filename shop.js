// Robridge shopping bag and product interactions

const STORAGE_KEY = "robridge-shopping-bag";
const PRICE = 34.99;

let bag = [];

try {
  bag = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (error) {
  bag = [];
}

function saveBag() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
  updateBag();
}

function getColourName(colour) {
  return colour === "orange" ? "BLACK / ORANGE MIRROR" : "BLACK / BLUE MIRROR";
}

function updateBag() {
  const count = bag.reduce((total, item) => total + item.quantity, 0);
  const total = bag.reduce((sum, item) => sum + item.quantity * PRICE, 0);

  document.querySelectorAll("[data-bag-count]").forEach(element => {
    element.textContent = count;
  });

  document.querySelectorAll("[data-bag-total]").forEach(element => {
    element.textContent = `£${total.toFixed(2)}`;
  });

  document.querySelectorAll("[data-bag-items]").forEach(container => {
    if (bag.length === 0) {
      container.innerHTML = '<p class="bag-empty">Your bag is currently empty.</p>';
      return;
    }

    container.innerHTML = bag.map((item, index) => `
      <div class="bag-item">
        <div class="bag-item-thumb">ROBRIDGE</div>
        <div>
          <h3>Performance Sunglasses</h3>
          <p>${getColourName(item.colour)}</p>
          <p>Quantity: ${item.quantity}</p>
          <button class="remove-item" type="button" data-remove-item="${index}">Remove</button>
        </div>
        <span class="bag-item-price">£${(PRICE * item.quantity).toFixed(2)}</span>
      </div>
    `).join("");
  });
}

function openBag() {
  const drawer = document.querySelector("[data-bag-drawer]");
  if (!drawer) return;

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeBag() {
  const drawer = document.querySelector("[data-bag-drawer]");
  if (!drawer) return;

  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-bag]").forEach(button => {
  button.addEventListener("click", openBag);
});

document.querySelectorAll("[data-close-bag]").forEach(button => {
  button.addEventListener("click", closeBag);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeBag();
});

document.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove-item]");

  if (removeButton) {
    bag.splice(Number(removeButton.dataset.removeItem), 1);
    saveBag();
  }
});

// Product page colour selection

const colourButtons = document.querySelectorAll("[data-colour]");
const selectedColourText = document.querySelector("[data-selected-colour]");
const productVisual = document.querySelector("[data-product-visual]");

const params = new URLSearchParams(window.location.search);
let selectedColour = params.get("colour") === "orange" ? "orange" : "blue";

function selectColour(colour) {
  selectedColour = colour;

  colourButtons.forEach(button => {
    const selected = button.dataset.colour === colour;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });

  if (selectedColourText) {
    selectedColourText.textContent = getColourName(colour);
  }

  if (productVisual) {
    productVisual.classList.toggle("visual-orange", colour === "orange");
    productVisual.classList.toggle("visual-blue", colour === "blue");
  }
}

colourButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectColour(button.dataset.colour);
  });
});

selectColour(selectedColour);

// Quantity selection

let quantity = 1;
const quantityOutput = document.querySelector("[data-quantity]");

function updateQuantity() {
  if (quantityOutput) quantityOutput.textContent = quantity;
}

document.querySelector("[data-quantity-minus]")?.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateQuantity();
});

document.querySelector("[data-quantity-plus]")?.addEventListener("click", () => {
  quantity = Math.min(10, quantity + 1);
  updateQuantity();
});

// Add product to bag

document.querySelector("[data-add-to-bag]")?.addEventListener("click", () => {
  const existingItem = bag.find(item => item.colour === selectedColour);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    bag.push({
      colour: selectedColour,
      quantity: quantity
    });
  }

  saveBag();
  openBag();

  quantity = 1;
  updateQuantity();
});

updateBag();
