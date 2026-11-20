
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
    setMenu(!menuButton.classList.contains("active"));
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });
}


/* ==========================================
   ROBRIDGE — REFINED CUSTOM CURSOR
========================================== */

if (window.matchMedia("(pointer: fine)").matches) {

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  /* Hide native cursor on desktop */

  const cursorStyle = document.createElement("style");

  cursorStyle.textContent = `
    @media (pointer: fine) {
      html, body, body *,
      body *::before,
      body *::after {
        cursor: none !important;
      }
    }
  `;

  document.head.appendChild(cursorStyle);

  /* Cursor position */

  let mouseX = -100;
  let mouseY = -100;

  let cursorX = -100;
  let cursorY = -100;

  let visible = false;

  /* Show cursor */

  function showCursor() {
    if (!visible) {
      visible = true;
      cursor.classList.add("visible");
    }
  }

  /* Hide cursor */

  function hideCursor() {
    visible = false;
    cursor.classList.remove("visible");
  }

  /* Detect interactive elements */

  function updateHover(event) {
    const target = event.target.closest(
      "a, button, .project-card, [role='button'], input, select, textarea"
    );

    cursor.classList.toggle("hovering", !!target);
  }

  /* Track mouse */

  document.addEventListener("pointermove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    showCursor();
    updateHover(event);
  });

  /* Hide when leaving browser */

  document.addEventListener("pointerleave", hideCursor);

  document.addEventListener("pointerenter", showCursor);

  /* Smooth cursor movement */

  function animateCursor() {

    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}
