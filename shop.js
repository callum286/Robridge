
/* ==========================================
   ROBRIDGE — CMS PRODUCT CONNECTION
========================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const DATA_URL = "/data/products.json";

  let products;

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) throw new Error("Could not load products");

    const data = await response.json();
    products = data.products || [];

  } catch (error) {
    console.error("Robridge CMS:", error);
    return;
  }

  const product = products.find(item =>
    item.published === true
  );

  function getKey(variant) {
    return variant.name.toLowerCase().includes("orange")
      ? "orange"
      : "blue";
  }

  function getVariant(colour) {
    return product.variants.find(v => getKey(v) === colour);
  }

  function money(value) {
    return "£" + Number(value).toFixed(2);
  }

  function addImage(container, src, alt) {
    if (!container || !src) return;

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    container.replaceChildren(img);
  }

  if (!product) return;

  /* ==========================================
     SHOP COLLECTION
  ========================================== */

  const grid = document.querySelector(".product-grid");

  if (grid) {
    grid.replaceChildren();

    const card = document.createElement("a");
    card.className = "shop-product";
    card.href = "product.html?slug=" +
      encodeURIComponent(product.slug);

    const visual = document.createElement("div");
    visual.className = "product-visual visual-blue";
    visual.style.position = "relative";

    addImage(
      visual,
      product.images?.[0],
      product.name
    );

    const index = document.createElement("span");
    index.className = "product-index";
    index.textContent = "01 / 01";

    const quick = document.createElement("span");
    quick.className = "quick-view";
    quick.textContent = "VIEW PRODUCT ↗";

    visual.append(index, quick);

    const info = document.createElement("div");
    info.className = "product-info";

    const details = document.createElement("div");

    const heading = document.createElement("h2");
    heading.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = "Blue & Orange Mirror";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = money(product.price);

    details.append(heading, description);
    info.append(details, price);
    card.append(visual, info);
    grid.append(card);

    const count = document.querySelector(".collection-count");
    if (count) count.textContent = "01 — 01";
  }

  /* ==========================================
     PRODUCT PAGE
  ========================================== */

  const buyButton = document.querySelector("#buy-now");

  if (!buyButton) return;

  const params = new URLSearchParams(window.location.search);

  let selectedColour = params.get("colour") || "blue";

  const colourButtons =
    document.querySelectorAll("[data-colour]");

  const selectedColourText =
    document.querySelector("[data-selected-colour]");

  const productVisual =
    document.querySelector("[data-product-visual]");

  const priceElement =
    document.querySelector(".detail-price");

  const descriptionElement =
    document.querySelector(".detail-description");

  const titleElement =
    document.querySelector(".product-details h1");

  if (priceElement) {
    priceElement.textContent = money(product.price);
  }

  if (descriptionElement) {
    descriptionElement.textContent = product.description;
  }

  if (titleElement) {
    titleElement.textContent = product.name + ".";
  }

  const gallery = document.querySelector(".gallery-secondary");

  function updateColour(colour) {
    const variant = getVariant(colour);

    if (!variant) return;

    selectedColour = colour;

    const available = Number(variant.stock) > 0;

    colourButtons.forEach(button => {
      const selected = button.dataset.colour === colour;

      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));

      const buttonVariant = getVariant(button.dataset.colour);

      button.disabled =
        !buttonVariant || Number(buttonVariant.stock) <= 0;
    });

    if (selectedColourText) {
      selectedColourText.textContent =
        colour === "orange"
          ? "BLACK / ORANGE MIRROR"
          : "BLACK / BLUE MIRROR";
    }

    if (productVisual) {
      productVisual.classList.toggle(
        "visual-orange",
        colour === "orange"
      );

      productVisual.classList.toggle(
        "visual-blue",
        colour === "blue"
      );

      const imageIndex = colour === "orange" ? 1 : 0;

      addImage(
        productVisual,
        product.images?.[imageIndex] || product.images?.[0],
        product.name + " " + colour + " lenses"
      );
    }

    let stockNote = document.querySelector("[data-stock-note]");

    if (!stockNote) {
      stockNote = document.createElement("p");
      stockNote.dataset.stockNote = "";
      stockNote.className = "detail-smallprint";

      const variantBlock =
        document.querySelector(".variant-block");

      if (variantBlock) {
        variantBlock.append(stockNote);
      }
    }

    if (stockNote) {
      stockNote.textContent = available
        ? variant.stock + " available"
        : "Currently sold out";
    }

    buyButton.disabled = !available;
    buyButton.style.opacity = available ? "1" : "0.5";
    buyButton.textContent = available
      ? "BUY NOW ↗"
      : "SOLD OUT";
  }

  colourButtons.forEach(button => {
    button.addEventListener("click", () => {
      updateColour(button.dataset.colour);
    });
  });

  // If the requested colour is sold out, choose
  // the other colour if it is available.

  const requestedVariant = getVariant(selectedColour);

  if (!requestedVariant || Number(requestedVariant.stock) <= 0) {
    const alternative = product.variants.find(
      v => Number(v.stock) > 0
    );

    selectedColour = alternative
      ? getKey(alternative)
      : "blue";
  }

  buyButton.addEventListener("click", () => {
    const variant = getVariant(selectedColour);

    if (!variant || Number(variant.stock) <= 0) {
      return;
    }

    if (variant.stripe_link) {
      window.location.href = variant.stripe_link;
    }
  });

  updateColour(selectedColour);

  if (gallery && product.images?.[1]) {
    const detail = document.createElement("div");
    addImage(detail, product.images[1], "Robridge sunglasses detail");
    gallery.replaceChildren(detail);
  }
});
