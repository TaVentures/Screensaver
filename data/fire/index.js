(()=>{
    'use strict';
    const canvas = document.querySelector("canvas"),
        ctx = canvas.getContext('2d', {lowLatency: true, alpha: false}),
        scale = 7,
        intensity = 1200,
        cooling = 0.48;

    let play = true,
        imageData,
        matrix,
        w,
        h;

    const loop = () => {
        for (let i = 0; i < matrix.length; i++) {
            const pixel = i + w - Math.random() + 1.5 >> 0,
                sum = matrix[pixel] + matrix[pixel + 1] + matrix[pixel - w] + matrix[pixel - w + 1],
                value = i < matrix.length - w ? sum * cooling * Math.random() + 0.5 >> 0 : intensity * Math.random();
            matrix[i] = value;
            imageData.data[i * 4] = value * 4;
            imageData.data[i * 4 + 1] = value;
            imageData.data[i * 4 + 2] = value * 0.25 + 0.5 >> 0;
        }
        ctx.putImageData(imageData, 0, 0);
        play && requestAnimationFrame(loop);
    };

    const resize = () => {
        w = canvas.width = window.innerWidth / scale >> 0;
        h = canvas.height = window.innerHeight / scale >> 0;
        ctx.fillRect(0, 0, w, h);
        imageData = ctx.getImageData(0, 0, w, h);
        matrix = new Uint16Array(w * h);
    };

    const move = (event) => {
        let x,y,p = event;
        if (event.type === "touchmove") {
            event.preventDefault();
            p = event.targetTouches[0];
        }
        [x,y] = [Math.round((p.clientX - canvas.offsetLeft) / scale),Math.round((p.clientY - canvas.offsetTop) / scale)];
        matrix[y * w + x] = 8192 * Math.random();
    };

    canvas.addEventListener("mousemove", move, false);
    canvas.addEventListener("touchmove", move, false);
    window.addEventListener("resize", resize, false);

    resize();
    loop();
})();
