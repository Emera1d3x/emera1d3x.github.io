document.addEventListener("DOMContentLoaded", () => {
    const hoverText = document.querySelector("#selfProclaimedTitle");
    const textQueue = [
        "Competitive Programmer",
        "Software Engineer",
        "Tech Enthusiast",
        "Web Developer",
        "a chill guy",
        "Creator"
    ];

    let currentIndex = 0;

    hoverText.addEventListener("mouseover", () => {
        currentIndex = (currentIndex + 1) % textQueue.length;
        hoverText.textContent = textQueue[currentIndex];
    });
    var intervalID = window.setInterval(myCallback, 2500);
    function myCallback() {
        currentIndex = (currentIndex + 1) % textQueue.length;
        hoverText.textContent = textQueue[currentIndex];
    }
});