const guestName = new URLSearchParams(window.location.search).get("name");
const displayName = guestName && guestName.trim() ? guestName.trim() : "[name]";
const invitation = document.querySelector(".invitation");
const enterLink = document.querySelector(".enter-link");
const bioSection = document.querySelector(".page-bio");
const bioReveals = document.querySelectorAll(".bio-card, .bio-title");
const storySection = document.querySelector(".page-story");
const storyVideo = document.querySelector(".story-video");
const eventSection = document.querySelector(".page-event");
const eventReveals = document.querySelectorAll(".event-title, .event-block");
const giftSection = document.querySelector(".page-gift");
const giftReveals = document.querySelectorAll(".gift-reveal");
const closingSection = document.querySelector(".page-closing");
const closingReveals = document.querySelectorAll(".closing-reveal");
const wishNameInput = document.querySelector(".wish-name");
const wishesForm = document.querySelector(".wishes-form");
const wishMessageInput = document.querySelector(".wish-message");
const wishesCount = document.querySelector("[data-wishes-count]");
const wishesList = document.querySelector("[data-wishes-list]");
const weddingMusic = document.querySelector(".wedding-music");
const musicToggle = document.querySelector(".music-toggle");
const wishesStorageKey = "remmy-intan-wedding-wishes-v2";
const countdownTarget = new Date("2026-07-01T02:00:00Z").getTime();
const countdownElements = {
  days: document.querySelector("[data-countdown-days]"),
  hours: document.querySelector("[data-countdown-hours]"),
  minutes: document.querySelector("[data-countdown-minutes]"),
  seconds: document.querySelector("[data-countdown-seconds]"),
};
let musicStarted = false;

document.querySelector("[data-guest-name]").textContent = displayName;
wishNameInput.value = displayName === "[name]" ? "Guest" : displayName;

weddingMusic.volume = 0.55;

function getStoredWishes() {
  try {
    const savedWishes = JSON.parse(localStorage.getItem(wishesStorageKey) || "[]");
    return Array.isArray(savedWishes) ? savedWishes : [];
  } catch {
    return [];
  }
}

function saveStoredWishes(wishes) {
  localStorage.setItem(wishesStorageKey, JSON.stringify(wishes));
}

function formatWishDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function renderWishes() {
  const wishes = getStoredWishes();
  wishesCount.textContent = `${wishes.length} ${wishes.length === 1 ? "Wish" : "Wishes"}`;
  wishesList.replaceChildren();

  if (wishes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "wishes-empty";
    emptyMessage.textContent = "No wishes yet.";
    wishesList.append(emptyMessage);
    return;
  }

  for (const wish of wishes) {
    const article = document.createElement("article");
    article.className = "wish-item";

    const author = document.createElement("strong");
    author.className = "wish-author";
    author.textContent = wish.name || "Guest";

    const message = document.createElement("p");
    message.className = "wish-text";
    message.textContent = wish.message || "";

    const date = document.createElement("time");
    date.className = "wish-date";
    date.dateTime = wish.createdAt || "";
    date.textContent = formatWishDate(wish.createdAt);

    article.append(author, message, date);
    wishesList.append(article);
  }
}

function setCountdownValue(key, value) {
  countdownElements[key].textContent = String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = Math.max(0, countdownTarget - Date.now());
  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
}

function syncMusicButton() {
  const isMuted = weddingMusic.muted || weddingMusic.paused;
  musicToggle.classList.toggle("is-muted", isMuted);
  musicToggle.setAttribute("aria-pressed", String(isMuted));
  musicToggle.setAttribute("aria-label", isMuted ? "Unmute music" : "Mute music");
}

function startMusic() {
  weddingMusic.muted = false;
  const playPromise = weddingMusic.play();

  if (playPromise) {
    playPromise
      .then(() => {
        musicStarted = true;
        syncMusicButton();
      })
      .catch(() => {
        weddingMusic.muted = true;
        syncMusicButton();
      });
  } else {
    musicStarted = true;
    syncMusicButton();
  }
}

function showQuotePage() {
  invitation.classList.add("show-quote");
  invitation.setAttribute("aria-label", "Quran verse");
}

function showCoverPage() {
  invitation.classList.remove("show-quote");
  invitation.setAttribute("aria-label", "Wedding invitation cover");
}

function syncPageToHash() {
  if (
    window.location.hash === "#quote" ||
    window.location.hash === "#couple" ||
    window.location.hash === "#story" ||
    window.location.hash === "#event" ||
    window.location.hash === "#gift" ||
    window.location.hash === "#closing"
  ) {
    showQuotePage();
    if (window.location.hash === "#couple") {
      requestAnimationFrame(() => bioSection.scrollIntoView());
    }
    if (window.location.hash === "#story") {
      requestAnimationFrame(() => storySection.scrollIntoView());
    }
    if (window.location.hash === "#event") {
      requestAnimationFrame(() => eventSection.scrollIntoView());
    }
    if (window.location.hash === "#gift") {
      requestAnimationFrame(() => giftSection.scrollIntoView());
    }
    if (window.location.hash === "#closing") {
      requestAnimationFrame(() => closingSection.scrollIntoView());
    }
  } else {
    showCoverPage();
  }
}

enterLink.addEventListener("click", (event) => {
  event.preventDefault();
  startMusic();
  showQuotePage();
  history.pushState(null, "", "#quote");
});

musicToggle.addEventListener("click", () => {
  if (!musicStarted || weddingMusic.paused) {
    startMusic();
    return;
  }

  weddingMusic.muted = !weddingMusic.muted;
  syncMusicButton();
});

wishesForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = wishMessageInput.value.trim();
  if (!message) {
    wishMessageInput.focus();
    return;
  }

  const wishes = getStoredWishes();
  wishes.unshift({
    id: String(Date.now()),
    name: wishNameInput.value.trim() || "Guest",
    message,
    createdAt: new Date().toISOString(),
  });
  saveStoredWishes(wishes);
  wishMessageInput.value = "";
  renderWishes();
});

syncMusicButton();
renderWishes();
updateCountdown();
setInterval(updateCountdown, 1000);

window.addEventListener("popstate", syncPageToHash);
syncPageToHash();

const bioObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      bioReveals.forEach((element) => element.classList.add("is-visible"));
      bioObserver.disconnect();
    }
  }
}, { threshold: 0.28 });

bioObserver.observe(bioSection);

const videoObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      storyVideo.play().catch(() => {});
    } else {
      storyVideo.pause();
    }
  }
}, { threshold: 0.45 });

videoObserver.observe(storySection);

const eventObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      eventReveals.forEach((element) => element.classList.add("is-visible"));
      eventObserver.disconnect();
    }
  }
}, { threshold: 0.28 });

eventObserver.observe(eventSection);

const giftObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      giftReveals.forEach((element) => element.classList.add("is-visible"));
      giftObserver.disconnect();
    }
  }
}, { threshold: 0.28 });

giftObserver.observe(giftSection);

const closingObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      closingReveals.forEach((element) => element.classList.add("is-visible"));
      closingObserver.disconnect();
    }
  }
}, { threshold: 0.28 });

closingObserver.observe(closingSection);
