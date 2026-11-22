
const photos = [
    {
        src: "anilar/fotograf1.jpg",
        caption: "İlk güzel anımız 🤍"
    },
    {
        src: "anilar/fotograf2.jpg",
        caption: "Seninle her şey güzel ❤️"
    },
    {
        src: "anilar/fotograf3.jpg",
        caption: "Unutulmaz bir gün 🥹"
    }
];

const videos = [
    {
        src: "anilar/video1.mp4",
        caption: "En güzel anlarımız 🎬"
    },
    {
        src: "anilar/video2.mp4",
        caption: "Birlikte mutluyuz 🤍"
    }
];

const photoGallery = document.getElementById("photoGallery");
const videoGallery = document.getElementById("videoGallery");

// Fotoğrafları göster
photos.forEach(photo => {
    const card = document.createElement("div");
    card.className = "photo-card";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = photo.caption;

    card.appendChild(img);
    card.appendChild(caption);

    photoGallery.appendChild(card);
});

// Videoları göster
videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";

    const player = document.createElement("video");
    player.src = video.src;
    player.controls = true;
    player.preload = "metadata";
    player.playsInline = true;

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = video.caption;

    card.appendChild(player);
    card.appendChild(caption);

    videoGallery.appendChild(card);
});

// Uçuşan kalpler
function createHeart() {
    const heart = document.createElement("div");

    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (12 + Math.random() * 20) + "px";
    heart.style.animationDuration = (5 + Math.random() * 5) + "s";

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 500);
