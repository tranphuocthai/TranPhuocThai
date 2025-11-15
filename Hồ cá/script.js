document.addEventListener('DOMContentLoaded', () => {
    const hoCa = document.getElementById('hoCa');
    const nhacNen = document.getElementById('nhacNen');
    const tiengVaCham = document.getElementById('tiengVaCham');
    const khuVucBongBong = document.getElementById('bongBong');
    const tatCaNhanVat = document.querySelectorAll('.fish, .diver');
    const danhSachNhac = ['music/01.mp3', 'music/02.mp3', 'music/03.mp3', 'music/04.mp3'];
    const danhSachNen = ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg', 'images/bg4.jpg'];
    let baiHienTai = 0;
    let nenHienTai = 0;
    let dangPhat = false;
    window.doiNen = function() {
        nenHienTai = (nenHienTai + 1) % danhSachNen.length;
        hoCa.style.backgroundImage = `url('${danhSachNen[nenHienTai]}')`;
    }

    window.phatDungNhac = function() {
        if (dangPhat) {
            nhacNen.pause();
        } else {
            if (!nhacNen.src) { 
                nhacNen.src = danhSachNhac[baiHienTai];
            }
            nhacNen.play().catch(e => console.log("Cần tương tác để phát nhạc"));
        }
        dangPhat = !dangPhat;
    }

    window.chuyenBaiHat = function() {
        baiHienTai = (baiHienTai + 1) % danhSachNhac.length;
        nhacNen.src = danhSachNhac[baiHienTai];
        if (dangPhat) {
            nhacNen.play();
        }
    }
    const trangThaiNhanVat = new Map();
    tatCaNhanVat.forEach(nv => {
        const style = window.getComputedStyle(nv);
        trangThaiNhanVat.set(nv, {
            x: parseFloat(style.left) || 100,
            y: parseFloat(style.top) || 100,
            dx: (Math.random() - 0.5) * 2, 
            dy: (Math.random() - 0.5) * 1, 
            img: nv.querySelector('img')
        });
    });

    function capNhatViTriNhanVat() {
        const hoCaRect = hoCa.getBoundingClientRect();

        trangThaiNhanVat.forEach((state, nv) => {
            state.x += state.dx;
            state.y += state.dy;
            let daQuayDau = false;
            if (state.x < 0 || state.x + nv.offsetWidth > hoCaRect.width) {
                state.dx *= -1;
                daQuayDau = true;
            }
            if (state.y < 0 || state.y + nv.offsetHeight > hoCaRect.height) {
                state.dy *= -1;
            }
            if(daQuayDau) {
                state.img.style.transform = `scaleX(${state.dx > 0 ? 1 : -1})`;
            }
            nv.style.left = `${state.x}px`;
            nv.style.top = `${state.y}px`;
        });

        requestAnimationFrame(capNhatViTriNhanVat); 
    }
    requestAnimationFrame(capNhatViTriNhanVat); 
    const thoiGianVaChamCuoi = new Map();
    const THOI_GIAN_CHO = 3000; 
    const XAC_SUAT_VA_CHAM = 0.2; 

    function kiemTraVaCham(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    function taoSongNuoc(x, y) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.left = `${x}px`;
        wave.style.top = `${y}px`;
        hoCa.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    }

    function kiemTraTatCaVaCham() {
        const viTriNhanVat = [];
        tatCaNhanVat.forEach(nv => viTriNhanVat.push({ 
            element: nv, 
            rect: nv.getBoundingClientRect() 
        }));

        const thoiGianHienTai = Date.now();

        for (let i = 0; i < viTriNhanVat.length; i++) {
            for (let j = i + 1; j < viTriNhanVat.length; j++) {
                const nv1 = viTriNhanVat[i];
                const nv2 = viTriNhanVat[j];

                if (kiemTraVaCham(nv1.rect, nv2.rect)) {
                    const capId = [nv1.element.id, nv2.element.id].sort().join('-');
                    const thoiGianCuoi = thoiGianVaChamCuoi.get(capId) || 0;

                    if (thoiGianHienTai - thoiGianCuoi > THOI_GIAN_CHO) {
                        if (Math.random() < XAC_SUAT_VA_CHAM) {
                            tiengVaCham.currentTime = 0;
                            tiengVaCham.play();
                            
                            const trungTamX = (nv1.rect.left + nv1.rect.right) / 2;
                            const trungTamY = (nv1.rect.top + nv1.rect.bottom) / 2;
                            taoSongNuoc(trungTamX, trungTamY);
                        }
                        thoiGianVaChamCuoi.set(capId, thoiGianHienTai);
                    }
                }
            }
        }
    }
    setInterval(kiemTraTatCaVaCham, 250); 
    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 95}vw`;
        const size = Math.random() * 15 + 5;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
        khuVucBongBong.appendChild(bubble);
        bubble.addEventListener('animationend', () => bubble.remove());
    }, 1500);
});