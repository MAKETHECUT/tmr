/* ==============================================
Show/Hide Grid on Keypress
============================================== */
document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "G") {
        event.preventDefault(); // Prevent default behavior
        
        const gridOverlay = document.querySelector(".grid-overlay");
        if (gridOverlay) {
            gridOverlay.remove();
            console.log("Grid overlay removed");
        } else {
            createGridOverlay();
            console.log("Grid overlay created");
        }
    }
});

function createGridOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "grid-overlay";
    
    // Determine number of columns based on screen size
    const isMobile = window.innerWidth <= 650;
    const columns = isMobile ? 6 : 12;
    
    // Create grid columns
    for (let i = 0; i < columns; i++) {
        const column = document.createElement("div");
        overlay.appendChild(column);
    }
    
    document.body.appendChild(overlay);
}

// Also handle window resize to update grid columns if needed
window.addEventListener("resize", function() {
    const gridOverlay = document.querySelector(".grid-overlay");
    if (gridOverlay) {
        gridOverlay.remove();
        createGridOverlay();
    }
});
