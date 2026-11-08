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
      // Anything already on screen at load reveals with a short beat,
      // so the entrance transition is actually visible.
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92) {
        window.setTimeout(function () {
          el.classList.add("is-in");
        }, 40);
      } else {
        io.observe(el);
      }
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

  /* ============================================================ AUTH MODAL */
  var AUTH_KEY = "noir.client";
  var authModal = null;
  var authMode = "login";
  var lastFocus = null;

  function readSession() {
    try {
      return JSON.parse(window.localStorage.getItem(AUTH_KEY) || "null");
    } catch (err) {
      return null;
    }
  }

  function writeSession(session) {
    try {
      if (session) window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(AUTH_KEY);
    } catch (err) {
      /* storage blocked — session simply won't persist */
    }
  }

  function buildAuthModal() {
    var el = document.createElement("div");
    el.className = "auth";
    el.id = "authModal";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "authTitle");
    el.innerHTML =
      '<div class="auth__scrim" data-auth-close></div>' +
      '<div class="auth__panel">' +
      '<button class="auth__close" type="button" data-auth-close aria-label="Close"></button>' +
      '<span class="eyebrow">Client Access</span>' +
      '<h2 class="auth__title" id="authTitle">Welcome back</h2>' +
      '<form class="auth__form" id="authForm" novalidate>' +
      '<div class="field" id="authNameField" hidden>' +
      '<label for="authName">Full Name</label>' +
      '<input id="authName" name="name" type="text" autocomplete="name" placeholder="Your name">' +
      "</div>" +
      '<div class="field">' +
      '<label for="authEmail">Email Address</label>' +
      '<input id="authEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>' +
      "</div>" +
      '<div class="field">' +
      '<label for="authPassword">Password</label>' +
      '<input id="authPassword" name="password" type="password" autocomplete="current-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required>' +
      "</div>" +
      '<button class="btn btn--gold btn--block auth__submit" type="submit">Log In</button>' +
      '<p class="form-note" id="authNote" role="status" aria-live="polite"></p>' +
      "</form>" +
      '<p class="auth__switch" id="authSwitch">New to Noir? ' +
      '<button type="button" data-auth-mode="signup">Create an account</button></p>' +
      "</div>";
    document.body.appendChild(el);
    return el;
  }

  function setAuthMode(mode) {
    authMode = mode === "signup" ? "signup" : "login";
    if (!authModal) return;

    var isSignup = authMode === "signup";
    var nameField = authModal.querySelector("#authNameField");
    var note = authModal.querySelector("#authNote");
    var pw = authModal.querySelector("#authPassword");

    nameField.hidden = !isSignup;
    authModal.querySelector("#authTitle").textContent = isSignup
      ? "Create your account"
      : "Welcome back";
    authModal.querySelector(".auth__submit").textContent = isSignup
      ? "Create Account"
      : "Log In";
    authModal.querySelector("#authSwitch").innerHTML = isSignup
      ? 'Already a client? <button type="button" data-auth-mode="login">Log in</button>'
      : 'New to Noir? <button type="button" data-auth-mode="signup">Create an account</button>';

    pw.setAttribute("autocomplete", isSignup ? "new-password" : "current-password");
    note.className = "form-note";
    note.textContent = "";
  }

  function focusAuthField() {
    if (!authModal) return;
    var target = authModal.querySelector(
      authMode === "signup" ? "#authName" : "#authEmail"
    );
    if (target) target.focus();
  }

  function openAuth(mode) {
    if (!authModal) return;
    lastFocus = document.activeElement;
    setAuthMode(mode);
    setNav(false);
    authModal.classList.add("is-open");
    document.body.classList.add("auth-open");
    window.setTimeout(focusAuthField, 340);
  }

  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove("is-open");
    document.body.classList.remove("auth-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function renderAuthState() {
    var session = readSession();
    var areas = document.querySelectorAll(".js-auth-area");

    Array.prototype.forEach.call(areas, function (area) {
      var frag = document.createDocumentFragment();

      if (session && session.name) {
        var chip = document.createElement("span");
        chip.className = "user-chip";
        chip.textContent = "Welcome, " + session.name;

        var out = document.createElement("button");
        out.type = "button";
        out.className = "btn btn--sm";
        out.setAttribute("data-auth", "logout");
        out.textContent = "Log Out";

        frag.appendChild(chip);
        frag.appendChild(out);
      } else {
        var login = document.createElement("button");
        login.type = "button";
        login.className = "btn btn--sm";
        login.setAttribute("data-auth", "login");
        login.textContent = "Log In";

        var signup = document.createElement("button");
        signup.type = "button";
        signup.className = "btn btn--sm btn--gold-line";
        signup.setAttribute("data-auth", "signup");
        signup.textContent = "Sign Up";

        frag.appendChild(login);
        frag.appendChild(signup);
      }

      area.innerHTML = "";
      area.appendChild(frag);
    });
  }

  if (document.querySelector(".js-auth-area")) {
    authModal = buildAuthModal();
    renderAuthState();

    var authForm = authModal.querySelector("#authForm");

    authForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var note = authModal.querySelector("#authNote");
      var name = authModal.querySelector("#authName");
      var email = authModal.querySelector("#authEmail");
      var pass = authModal.querySelector("#authPassword");
      var isSignup = authMode === "signup";

      note.className = "form-note";

      if (isSignup && name.value.trim().length < 2) {
        note.classList.add("is-error");
        note.textContent = "Please enter your full name.";
        name.focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        note.classList.add("is-error");
        note.textContent = "That e-mail address does not look right.";
        email.focus();
        return;
      }

      if (pass.value.length < 6) {
        note.classList.add("is-error");
        note.textContent = "Use at least 6 characters for your password.";
        pass.focus();
        return;
      }

      var address = email.value.trim();
      var display = isSignup
        ? name.value.trim().split(/\s+/)[0]
        : address.split("@")[0];

      writeSession({
        name: display.charAt(0).toUpperCase() + display.slice(1),
        email: address,
        at: Date.now()
      });

      renderAuthState();

      note.classList.add("is-ok");
      note.textContent = isSignup
        ? "Account created — welcome to Noir, " + display + "."
        : "Signed in. Welcome back, " + display + ".";

      authForm.reset();

      window.setTimeout(closeAuth, 1100);
    });

    // Close on scrim / X, switch mode, log in, log out — one delegated listener.
    document.addEventListener("click", function (e) {
      var node = e.target.closest
        ? e.target.closest("[data-auth], [data-auth-mode], [data-auth-close]")
        : null;
      if (!node) return;

      if (node.hasAttribute("data-auth-close")) {
        e.preventDefault();
        closeAuth();
        return;
      }

      if (node.hasAttribute("data-auth-mode")) {
        e.preventDefault();
        setAuthMode(node.getAttribute("data-auth-mode"));
        window.setTimeout(focusAuthField, 60);
        return;
      }

      var action = node.getAttribute("data-auth");

      if (action === "logout") {
        e.preventDefault();
        writeSession(null);
        renderAuthState();
        return;
      }

      if (action === "login" || action === "signup") {
        e.preventDefault();
        openAuth(action);
      }
    });

    // Keyboard: Esc closes, Tab stays inside the dialog.
    document.addEventListener("keydown", function (e) {
      if (!authModal.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeAuth();
        return;
      }

      if (e.key !== "Tab") return;

      var focusables = Array.prototype.filter.call(
        authModal.querySelectorAll(
          'button:not([disabled]), input:not([disabled]):not([type="hidden"]), [href]'
        ),
        function (el) {
          return el.offsetParent !== null;
        }
      );
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Deep links: #login / #signup open the dialog directly.
    var authHash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (authHash === "login" || authHash === "signup") openAuth(authHash);
  }

  /* ------------------------------------------------------------- parallax */
  var heroVisual = document.querySelector(".hero__visual");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroVisual && !reduceMotion) {
    var parallaxTick = false;

    var applyParallax = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      heroVisual.style.setProperty(
        "--py",
        (window.innerWidth > 1024 ? y * 0.13 : 0).toFixed(2) + "px"
      );
      parallaxTick = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!parallaxTick) {
          parallaxTick = true;
          window.requestAnimationFrame(applyParallax);
        }
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", applyParallax);
    applyParallax();
  }
})();
