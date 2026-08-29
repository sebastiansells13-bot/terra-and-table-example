/**
 * Build-your-own CSA box tool. All markup is server-rendered by Eleventy
 * (see src/boxes.njk) — this script only reads the quantity inputs and
 * updates a running weight/price total. No cart, no localStorage, no
 * persistence across visits: it's a same-session preview tool, a
 * deliberately simpler interaction than the ecommerce examples' cart.
 */
(function () {
  "use strict";

  function recalc() {
    var inputs = document.querySelectorAll("[data-qty]");
    if (inputs.length === 0) return; // not on the boxes page

    var config = window.BOX_CONFIG || { capacityLb: 10, basePrice: 0 };
    var totalWeight = 0;
    var totalPrice = config.basePrice;

    inputs.forEach(function (input) {
      var qty = Math.max(0, Math.min(12, Number(input.value) || 0));
      input.value = qty;
      totalWeight += qty * Number(input.dataset.weight);
      totalPrice += qty * Number(input.dataset.price);
    });

    var pct = Math.min(100, (totalWeight / config.capacityLb) * 100);
    var meter = document.getElementById("box-meter");
    var statusEl = document.getElementById("box-status");
    var reserveBtn = document.getElementById("reserve-btn");

    document.getElementById("box-weight").textContent = totalWeight.toFixed(1) + " lb";
    document.getElementById("box-total").textContent = "$" + totalPrice.toFixed(2);
    if (meter) meter.style.width = pct + "%";

    if (totalWeight === 0) {
      statusEl.textContent = "Add some produce to get started.";
      meter.classList.remove("bg-red-400");
      meter.classList.add("bg-clay-500");
      reserveBtn.disabled = true;
    } else if (totalWeight > config.capacityLb) {
      statusEl.textContent = "Over capacity by " + (totalWeight - config.capacityLb).toFixed(1) + " lb — trim something to reserve.";
      meter.classList.remove("bg-clay-500");
      meter.classList.add("bg-red-400");
      reserveBtn.disabled = true;
    } else {
      statusEl.textContent = "Looking good — " + (config.capacityLb - totalWeight).toFixed(1) + " lb of room left.";
      meter.classList.remove("bg-red-400");
      meter.classList.add("bg-clay-500");
      reserveBtn.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-qty]").forEach(function (input) {
      input.addEventListener("input", recalc);
    });
    recalc();

    var reserveBtn = document.getElementById("reserve-btn");
    if (reserveBtn) {
      reserveBtn.addEventListener("click", function () {
        var confirmEl = document.getElementById("reserve-confirm");
        if (confirmEl) confirmEl.classList.remove("hidden");
      });
    }
  });
})();
