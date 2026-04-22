const video = document.createElement("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const audio = document.getElementById("audioKicau");
const statusTxt = document.getElementById("status");

// --- GANTI NAMA FILE DISINI ---
const FILE_VIDEO_KUCING = "kucing.mp4"; 
let sedangAksi = false;

const modelParams = {
    flipHorizontal: true,   
    maxNumBoxes: 1,        
    iouThreshold: 0.5,     
    scoreThreshold: 0.7,    
};

function aksiKicauMania() {
    if (sedangAksi) return;
    sedangAksi = true;
    
    audio.currentTime = 0;
    audio.play().catch(() => {
        statusTxt.innerText = "Klik layar dulu buat aktifin suara!";
    });

    for (let i = 0; i < 5; i++) {
        const vid = document.createElement("video");
        vid.src = FILE_VIDEO_KUCING;
        vid.className = "stiker-video";
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;

        const x = Math.random() * (window.innerWidth - 150);
        const y = Math.random() * (window.innerHeight - 150);
        
        vid.style.left = `${x}px`;
        vid.style.top = `${y}px`;
        
        document.body.appendChild(vid);

        setTimeout(() => {
            vid.style.opacity = "0";
            vid.style.transition = "0.5s";
            setTimeout(() => vid.remove(), 500);
        }, 4000);
    }
    setTimeout(() => { sedangAksi = false; }, 2000);
}

function deteksiSekarang(model) {
    model.detect(video).then(predictions => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions.length > 0) {
            aksiKicauMania();
        }
        requestAnimationFrame(() => deteksiSekarang(model));
    });
}

handTrack.startVideo(video).then(status => {
    if (status) {
        statusTxt.innerText = "Memuat AI...";
        handTrack.load(modelParams).then(lmodel => {
            statusTxt.innerText = "SIAP! Gerakkan tanganmu!";
            canvas.width = video.width;
            canvas.height = video.height;
            deteksiSekarang(lmodel);
        });
    }
});

window.addEventListener('click', () => {
    audio.load();
    statusTxt.innerText = "Audio Aktif!";
}, { once: true });
