
/* ==========================================
   ROBRIDGE — NAVIGATION
========================================== */

const menuButton = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuLinks = document.querySelectorAll(".menu-links a");

function setMenu(open) {
  if (!menuButton || !menuOverlay) return;

  menuButton.classList.toggle("active", open);
  menuOverlay.classList.toggle("open", open);

  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu"
  );

  menuOverlay.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("menu-open", open);
}

if (menuButton && menuOverlay) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.classList.contains("active");
    setMenu(!isOpen);
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });
}


/* ==========================================
   ROBRIDGE — CUSTOM CURSOR
========================================== */

if (window.matchMedia("(pointer: fine)").matches) {

  // Create cursor automatically if it is missing
  let cursor = document.querySelector(".custom-cursor");

  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);
  }

  // Remove any old cursor label
  cursor.innerHTML = "";

  // Rolls-Royce-inspired cursor styling
  Object.assign(cursor.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "46px",
    height: "46px",
    border: "1px solid rgba(255,255,255,0.95)",
    borderRadius: "50%",
    background: "transparent",
    pointerEvents: "none",
    zIndex: "99999",
    opacity: "0",
    mixBlendMode: "difference",
    transform: "translate3d(-100px,-100px,0)",
    transition: "opacity .2s ease, width .35s ease, height .35s ease",
    willChange: "transform"
  });

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  let isVisible = false;
  let isHovering = false;

  function showCursor() {
    if (!isVisible) {
      isVisible = true;
      cursor.style.opacity = "1";
    }
  }

  function hideCursor() {
    isVisible = false;
    cursor.style.opacity = "0";
  }

  function updateHoverState(hovering) {
    if (isHovering === hovering) return;

    isHovering = hovering;

    const size = hovering ? 68 : 46;

    cursor.style.width = `${size}px`;
    cursor.style.height = `${size}px`;
  }

  document.addEventListener("pointermove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  });

  document.addEventListener("pointerleave", hideCursor);
  document.addEventListener("pointerenter", showCursor);

  // Detect links and buttons, including dynamically added elements
  document.addEventListener("pointerover", event => {
    const target = event.target.closest(
      "a, button, .project-card, [role='button']"
    );

    if (target) {
      updateHoverState(true);
    }
  });

  document.addEventListener("pointerout", event => {
    const target = event.target.closest(
      "a, button, .project-card, [role='button']"
    );

    if (target && !target.contains(event.relatedTarget)) {
      updateHoverState(false);
    }
  });

  // Smooth movement
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;

    cursor.style.transform =
      `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}
