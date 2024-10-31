"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const messageDiv = document.getElementById("message");

  document.getElementById("main").addEventListener("click", (e) => {
    e.target.classList.toggle("text-bg");

    const p = document.createElement("p");
    p.textContent = `You clicked the ${e.target.tagName.toLowerCase()} element.`;

    messageDiv.replaceChildren();
    messageDiv.appendChild(p);
  });
});
