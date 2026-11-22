
const startDate = new Date(2026, 8, 22, 0, 0, 0);

function updateCounter() {
    const now = new Date();
    const difference = now - startDate;

    if (difference < 0) {
        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

setInterval(updateCounter, 1000);
updateCounter();

// Uçuşan beyaz kalpler
function createHeart() {
    const heart = document.createElement("div");

    heart.className = "floating-heart";
    heart.innerHTML = "♥";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (12 + Math.random() * 25) + "px";
    heart.style.animationDuration = (5 + Math.random() * 6) + "s";

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 11000);
}

setInterval(createHeart, 350);
