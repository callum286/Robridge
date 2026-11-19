
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
    if (event.key === "Escape") setMenu(false);
  });
}

/* CUSTOM CURSOR */

const cursor = document.querySelector(".custom-cursor");
const cursorLabel = document.querySelector(".cursor-label");

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.classList.add("visible");
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("visible");
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.add("visible");
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .project-card"
  );

  interactiveElements.forEach(element => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");

      if (element.classList.contains("project-card")) {
        cursorLabel.textContent = "EXPLORE";
      } else if (element.classList.contains("menu-toggle")) {
        cursorLabel.textContent = "MENU";
      } else {
        cursorLabel.textContent = "VIEW";
      }
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
      cursorLabel.textContent = "";
    });
  });
}
