/* ==========================================================================
   NOIR MOTORS — main.js
   Header state, mobile menu, scroll reveals, collection filter,
   FAQ accordion, form handling. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- header */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------- mobile menu */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) setNav(false);
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    revealEls.forEach(function (el) {
      // Anything already on screen at load reveals immediately.
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92) el.classList.add("is-in");
      else io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ------------------------------------------------------- FAQ accordion */
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        var b = other.querySelector(".faq-q");
        if (b) b.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* --------------------------------------------------- collection filters */
  var filterBtns = document.querySelectorAll(".filter");
  var carsWrap = document.getElementById("cars");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".car-card"));
  var emptyNote = null;

  if (filterBtns.length && cards.length) {
    var applyFilter = function (key) {
      var shown = 0;

      cards.forEach(function (card) {
        var match = key === "all" || card.dataset.cat === key;
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });

      if (shown === 0) {
        if (!emptyNote) {
          emptyNote = document.createElement("p");
          emptyNote.className = "lede";
          emptyNote.style.textAlign = "center";
          emptyNote.style.margin = "0 auto";
          emptyNote.textContent =
            "No vehicles in this category right now — call the concierge and we will source one.";
          carsWrap.appendChild(emptyNote);
        }
      } else if (emptyNote) {
        emptyNote.remove();
        emptyNote = null;
      }
    };

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        applyFilter(btn.dataset.filter);
      });
    });
  }

  /* ------------------------------------------------------------ date bits */
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var isoToday = today.toISOString().slice(0, 10);

  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    if (!input.min) input.min = isoToday;
  });

  function prettyDate(value) {
    var d = new Date(value + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function dayCount(from, to) {
    var a = new Date(from + "T00:00:00");
    var b = new Date(to + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  /* -------------------------------------------------------- booking panel */
  var bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    var bookingNote = document.getElementById("bookingNote");
    var pickup = document.getElementById("booking-pickup");
    var dropoff = document.getElementById("booking-return");

    if (pickup && dropoff) {
      pickup.addEventListener("change", function () {
        if (pickup.value) {
          dropoff.min = pickup.value;
          if (dropoff.value && dropoff.value < pickup.value) dropoff.value = "";
        }
      });
    }

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      bookingNote.className = "form-note";

      if (!pickup.value || !dropoff.value) {
        bookingNote.classList.add("is-error");
        bookingNote.textContent = "Choose both your pick-up and return dates.";
        return;
      }

      var days = dayCount(pickup.value, dropoff.value);

      if (days < 1) {
        bookingNote.classList.add("is-error");
        bookingNote.textContent = "The return date must come after the pick-up date.";
        return;
      }

      var carField = document.getElementById("booking-car");
      var car = carField && carField.value ? carField.value : "the collection";

      bookingNote.classList.add("is-ok");
      bookingNote.textContent =
        "Available — " +
        car +
        ", " +
        prettyDate(pickup.value) +
        " to " +
        prettyDate(dropoff.value) +
        " (" +
        days +
        (days === 1 ? " day" : " days") +
        "). The concierge will confirm within the hour.";
    });
  }

  /* ------------------------------------------------------- enquiry form */
  var enquiryForm = document.getElementById("enquiryForm");

  if (enquiryForm) {
    var enquiryNote = document.getElementById("enquiryNote");
    var nameField = document.getElementById("fullname");
    var phoneField = document.getElementById("phone");
    var emailField = document.getElementById("email");
    var vehicleField = document.getElementById("vehicle");

    // Prefill the vehicle when arriving from a "Reserve" link.
    var requested = new URLSearchParams(window.location.search).get("vehicle");
    if (requested && vehicleField) {
      var wanted = requested.trim().toLowerCase();
      Array.prototype.forEach.call(vehicleField.options, function (opt) {
        if (opt.value && opt.value.toLowerCase() === wanted) vehicleField.value = opt.value;
      });
    }

    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      enquiryNote.className = "form-note";

      if (!nameField.value.trim()) {
        enquiryNote.classList.add("is-error");
        enquiryNote.textContent = "Please tell us your name.";
        nameField.focus();
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value.trim());
      if (!emailOk) {
        enquiryNote.classList.add("is-error");
        enquiryNote.textContent = "That e-mail address does not look right.";
        emailField.focus();
        return;
      }

      if (phoneField.value.replace(/[^\d]/g, "").length < 8) {
        enquiryNote.classList.add("is-error");
        enquiryNote.textContent = "Please add a phone number we can reach you on.";
        phoneField.focus();
        return;
      }

      var first = nameField.value.trim().split(" ")[0];

      enquiryNote.classList.add("is-ok");
      enquiryNote.textContent =
        "Thank you, " + first + ". Your enquiry is with the concierge — expect a reply within the hour.";

      enquiryForm.reset();
    });
  }
})();
