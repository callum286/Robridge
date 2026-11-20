
/* ==========================================
   ROBRIDGE — PRODUCT & STRIPE CHECKOUT
========================================== */

// Stripe payment links

const stripeLinks = {
  blue: "https://buy.stripe.com/fZu9AS9fVa8G4T108H7EQ00",
  orange: "https://buy.stripe.com/8x2bJ04ZFdkSgBJ9Jh7EQ01"
};

// Product elements

const colourButtons = document.querySelectorAll("[data-colour]");
const selectedColourText = document.querySelector("[data-selected-colour]");
const productVisual = document.querySelector("[data-product-visual]");
const buyButton = document.querySelector("#buy-now");

// Default colour

let selectedColour = "blue";

// Select product colour

function selectColour(colour) {

  if (!stripeLinks[colour]) return;

  selectedColour = colour;

  // Update selected colour buttons

  colourButtons.forEach(button => {

    const selected = button.dataset.colour === colour;

    button.classList.toggle("selected", selected);

    button.setAttribute(
      "aria-pressed",
      selected ? "true" : "false"
    );

  });

  // Update colour description

  if (selectedColourText) {

    selectedColourText.textContent =
      colour === "orange"
        ? "BLACK / ORANGE MIRROR"
        : "BLACK / BLUE MIRROR";

  }

  // Update product visual class

  if (productVisual) {

    productVisual.classList.toggle(
      "visual-orange",
      colour === "orange"
    );

    productVisual.classList.toggle(
      "visual-blue",
      colour === "blue"
    );

  }

}

// Listen for colour selection

colourButtons.forEach(button => {

  button.addEventListener("click", () => {

    selectColour(button.dataset.colour);

  });

});

// Buy now button

if (buyButton) {

  buyButton.addEventListener("click", () => {

    const checkoutLink = stripeLinks[selectedColour];

    if (checkoutLink) {

      window.location.href = checkoutLink;

    }

  });

}

// Start with blue selected

selectColour("blue");
