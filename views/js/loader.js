var load = () => {
    document.getElementById("pop-up-background").style.display = "flex";
    document.getElementById("pop-up-loader").style.display = "flex";
    setTimeout(() => {
        document.getElementById("bottle-body").className = "bottle-body-targeted"
    }, 100);
}

var hideLoad = () => {
    document.getElementById("bottle").animate([
        // keyframes
        { transform: 'translateY(-100%)' },
    ], {
        // timing options
        duration: 300,
        easing: "ease-out",
        iterations: 1,
        fill: "backwards",

    });
    setTimeout(() => {
        document.getElementById("pop-up-loader").style.display = "none"
        document.getElementById("pop-up-background").style.display = "none";
        document.getElementById("bottle-body").className = "bottle-body";
    }, 300)
}
