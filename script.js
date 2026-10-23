(function () {
  "use strict";

  var searchInput = document.getElementById("search");
  var editionSelect = document.getElementById("edition-filter");
  var clearButton = document.getElementById("clear-filters");
  var resultCount = document.getElementById("result-count");
  var emptyState = document.getElementById("empty-state");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".os-chips .chip"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".os-card"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".os-section"));

  var state = {
    query: "",
    os: "all",
    edition: "all"
  };

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function cardEdition(card) {
    var el = card.querySelector(".card-edition");
    return el ? normalize(el.textContent) : "";
  }

  function cardOs(card) {
    var section = card.closest(".os-section");
    return section ? section.getAttribute("data-os") : "";
  }

  function setChip(os) {
    chips.forEach(function (chip) {
      var active = chip.getAttribute("data-os") === os;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function syncEditionOptions() {
    editionSelect.innerHTML = "";
    var first = document.createElement("option");
    first.value = "all";
    first.textContent = "All editions";
    editionSelect.appendChild(first);

    if (state.os === "all") {
      editionSelect.disabled = true;
      state.edition = "all";
      return;
    }

    var seen = [];
    var section = sections.find(function (s) {
      return s.getAttribute("data-os") === state.os;
    });

    if (section) {
      Array.prototype.forEach.call(section.querySelectorAll(".os-card"), function (card) {
        var edition = cardEdition(card);
        if (edition && seen.indexOf(edition) === -1) {
          seen.push(edition);
          var option = document.createElement("option");
          option.value = edition;
          option.textContent = edition;
          editionSelect.appendChild(option);
        }
      });
    }

    editionSelect.disabled = false;
    if (seen.indexOf(state.edition) === -1) {
      state.edition = "all";
    }
    editionSelect.value = state.edition;
  }

  function applyFilter() {
    var query = normalize(state.query);

    var visibleCount = 0;
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-search") || "");
      var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
      var matchesOs = state.os === "all" || cardOs(card) === state.os;
      var matchesEdition = state.edition === "all" || cardEdition(card) === state.edition;
      var visible = matchesQuery && matchesOs && matchesEdition;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    sections.forEach(function (section) {
      var anyVisible = Array.prototype.some.call(section.querySelectorAll(".os-card"), function (card) {
        return !card.hidden;
      });
      section.hidden = !anyVisible;
    });

    emptyState.hidden = visibleCount !== 0;
    resultCount.textContent = visibleCount === cards.length ? "" : visibleCount + " of " + cards.length + " releases";
  }

  function clearFilters() {
    state.query = "";
    state.os = "all";
    state.edition = "all";
    searchInput.value = "";
    setChip("all");
    syncEditionOptions();
    applyFilter();
    searchInput.focus();
  }

  searchInput.addEventListener("input", function () {
    state.query = searchInput.value;
    applyFilter();
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.os = chip.getAttribute("data-os");
      setChip(state.os);
      syncEditionOptions();
      applyFilter();
    });
  });

  editionSelect.addEventListener("change", function () {
    state.edition = editionSelect.value;
    applyFilter();
  });

  clearButton.addEventListener("click", clearFilters);

  /* ===== Mobile menu ===== */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.hidden = false;
    requestAnimationFrame(function () {
      mobileMenu.classList.add("is-open");
    });
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
        if (navToggle) navToggle.focus();
      }
    });

    mobileMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        closeMobileMenu();
      }
    });
  }

  /* ===== Navbar / mobile search → main filter ===== */
  function wireSearch(formSelector, inputId) {
    var form = document.querySelector(formSelector);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById(inputId);
      if (input && searchInput) {
        searchInput.value = input.value;
        state.query = searchInput.value;
        applyFilter();
      }
      closeMobileMenu();
      var downloads = document.getElementById("downloads");
      if (downloads) {
        downloads.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  wireSearch(".nav-search", "nav-search");
  wireSearch(".mobile-search", "mobile-search");

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  syncEditionOptions();
  applyFilter();
})();
