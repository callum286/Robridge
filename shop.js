
// ==========================================
// ROBRIDGE — STRIPE CHECKOUT
// ==========================================

const STRIPE_CHECKOUT_URL =
  "https://buy.stripe.com/fZu9AS9fVa8G4T108H7EQ00";

// Only the blue sunglasses are available for now.

// Hide the old shopping bag button
document.querySelectorAll("[data-open-bag]").forEach(button => {
  button.style.display = "none";
});

// Hide the old shopping bag drawer
document.querySelectorAll("[data-bag-drawer]").forEach(drawer => {
  drawer.style.display = "none";
});

// Hide the orange colour option
document.querySelectorAll('[data-colour="orange"]').forEach(button => {
  button.style.display = "none";
});

// Select blue automatically
document.querySelectorAll("[data-colour]").forEach(button => {
  const selected = button.dataset.colour === "blue";

  button.classList.toggle("selected", selected);
  button.setAttribute("aria-pressed", selected ? "true" : "false");
});

// Update selected colour text
document.querySelectorAll("[data-selected-colour]").forEach(element => {
  element.textContent = "BLACK / BLUE MIRROR";
});

// Remove the old quantity selector
document.querySelectorAll(
  "[data-quantity-minus], [data-quantity-plus], [data-quantity]"
).forEach(element => {
  element.style.display = "none";
});

// Change the purchase button and connect Stripe
const buyButton = document.querySelector("[data-add-to-bag]");

if (buyButton) {
  buyButton.innerHTML = 'BUY NOW <span>↗</span>';

  buyButton.addEventListener("click", () => {
    window.location.href = STRIPE_CHECKOUT_URL;
  });
}
