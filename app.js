// --- STATE MANAGEMENT ---
let storeState = {
    products: [],
    selectedCategory: 'all',
    searchQuery: '',
    selectedProduct: null,
    selectedPackage: null,
    selectedPayment: null
};

// --- DOM ELEMENTS ---
const dom = {
    productsContainer: document.getElementById('products-container'),
    searchInput: document.getElementById('game-search'),
    categoryTabs: document.getElementById('category-tabs'),
    checkoutModal: document.getElementById('checkout-modal'),
    closeModal: document.getElementById('close-modal'),
    modalGameImg: document.getElementById('modal-game-img'),
    modalGameName: document.getElementById('modal-game-name'),
    modalGameCategory: document.getElementById('modal-game-category'),
    packagesContainer: document.getElementById('packages-container'),
    paymentContainer: document.getElementById('payment-container'),
    checkoutTotal: document.getElementById('checkout-total'),
    topupForm: document.getElementById('topup-form'),
    userIdFields: document.getElementById('user-id-fields'),
    userIdInput: document.getElementById('user-id'),
    zoneIdInput: document.getElementById('zone-id'),
    idHelp: document.getElementById('id-help'),
    successScreen: document.getElementById('success-screen'),
    successMessage: document.getElementById('success-message'),
    backToShopBtn: document.getElementById('back-to-shop'),
    submitBtn: document.getElementById('submit-purchase-btn'),
    gusionHero: document.getElementById('gusion-hero-overlay')
};

// Set Gusion Image Background
dom.gusionHero.style.backgroundImage = "url('assets/gusion.png')";

// --- THREE.JS 3D BACKGROUND SYSTEM ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07050f, 0.04);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Ambient and Point Lights
    const ambientLight = new THREE.AmbientLight(0x0e0b24, 1.5);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8a2be2, 5, 20);
    purpleLight.position.set(5, 5, 3);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x00f5d4, 4, 15);
    cyanLight.position.set(-5, -3, 2);
    scene.add(cyanLight);

    // Particle Stars System
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPurple = new THREE.Color(0x8a2be2);
    const colorCyan = new THREE.Color(0x00f5d4);

    for (let i = 0; i < particleCount; i++) {
        // Position
        particlePositions[i * 3] = (Math.random() - 0.5) * 20;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        // Mix Purple and Cyan colors for energy feel
        const mixedColor = colorPurple.clone().lerp(colorCyan, Math.random());
        particleColors[i * 3] = mixedColor.r;
        particleColors[i * 3 + 1] = mixedColor.g;
        particleColors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starParticles);

    // Procedural 3D Dagger Generator (Gusion's Daggers)
    const create3DDagger = () => {
        const daggerGroup = new THREE.Group();

        // 1. Blade (Cone Geometry - Extruded profile)
        const bladeGeo = new THREE.ConeGeometry(0.18, 1.4, 4);
        const bladeMat = new THREE.MeshPhongMaterial({
            color: 0x241145,
            emissive: 0x7a22e0,
            shininess: 90,
            transparent: true,
            opacity: 0.9,
            specular: 0x00ffff
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.7; // shift pivot
        daggerGroup.add(blade);

        // 2. Crossguard (Box Geometry)
        const guardGeo = new THREE.BoxGeometry(0.5, 0.06, 0.12);
        const guardMat = new THREE.MeshStandardMaterial({
            color: 0x00f5d4,
            roughness: 0.2,
            metalness: 0.8
        });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        daggerGroup.add(guard);

        // 3. Hilt/Handle (Cylinder Geometry)
        const hiltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
        const hiltMat = new THREE.MeshStandardMaterial({
            color: 0x18142c,
            roughness: 0.8
        });
        const hilt = new THREE.Mesh(hiltGeo, hiltMat);
        hilt.position.y = -0.2;
        daggerGroup.add(hilt);

        // 4. Pommel (Sphere Geometry)
        const pommelGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const pommelMat = new THREE.MeshStandardMaterial({
            color: 0x00f5d4,
            metalness: 0.9
        });
        const pommel = new THREE.Mesh(pommelGeo, pommelMat);
        pommel.position.y = -0.4;
        daggerGroup.add(pommel);

        // Scale handle
        daggerGroup.scale.set(0.8, 0.8, 0.8);
        return daggerGroup;
    };

    // Spawn multiple floating 3D Daggers
    const daggers = [];
    const daggerCount = 6;
    
    for (let i = 0; i < daggerCount; i++) {
        const d = create3DDagger();
        
        // Random layout coordinates
        d.position.x = (Math.random() - 0.5) * 12;
        d.position.y = (Math.random() - 0.5) * 8;
        d.position.z = (Math.random() - 0.5) * 5;
        
        // Random spin offsets
        d.rotation.x = Math.random() * Math.PI * 2;
        d.rotation.y = Math.random() * Math.PI * 2;
        d.rotation.z = Math.random() * Math.PI * 2;
        
        // Random velocity factors
        d.userData = {
            spinX: (Math.random() - 0.5) * 0.01,
            spinY: (Math.random() - 0.5) * 0.015,
            spinZ: (Math.random() - 0.5) * 0.01,
            driftSpeed: 0.002 + Math.random() * 0.003,
            driftDir: Math.random() * Math.PI * 2,
            initialY: d.position.y
        };

        scene.add(d);
        daggers.push(d);
    }

    // Interactive mouse trackers
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    window.addEventListener('mousemove', (e) => {
        // Normalize mouse to [-1, 1] range
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Parallax tilt logic for foreground Gusion image
        const parallaxX = mouse.targetX;
        const parallaxY = -mouse.targetY; // flip coordinate
        
        dom.gusionHero.style.transform = `translate(${parallaxX * 25}px, ${parallaxY * 20}px) rotateY(${parallaxX * -15}deg) rotateX(${parallaxY * 10}deg)`;
    });

    // Resize viewport handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Smooth cursor tracking (lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Apply camera subtle lag rotation
        camera.position.x = mouse.x * 1.5;
        camera.position.y = mouse.y * 1.2;
        camera.lookAt(0, 0, 0);

        // Spin particle system
        starParticles.rotation.y = time * 0.02;
        starParticles.rotation.x = time * 0.01;

        // Animate floating daggers
        daggers.forEach((d) => {
            // Spin on axes
            d.rotation.x += d.userData.spinX;
            d.rotation.y += d.userData.spinY;
            d.rotation.z += d.userData.spinZ;

            // Float up and down smoothly
            d.position.y = d.userData.initialY + Math.sin(time + d.position.x) * 0.4;
            
            // Attract slightly towards cursor
            d.position.x += (mouse.x * 0.1 - d.position.x) * 0.005;
        });

        renderer.render(scene, camera);
    };

    animate();
};

// --- DATA FETCHING & API INTERFACE ---
const fetchProducts = async () => {
    // Show skeleton loaders
    dom.productsContainer.innerHTML = Array(8).fill('<div class="skeleton-card"></div>').join('');
    
    try {
        const url = `api/products.php?category=${storeState.selectedCategory}&q=${encodeURIComponent(storeState.searchQuery)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.ok ? await response.json() : [];
        storeState.products = data;
        renderProducts();
    } catch (err) {
        console.error('Error fetching catalog data:', err);
        dom.productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--danger)">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
                <p>Gagal memuat katalog produk game. Pastikan server Apache & PHP aktif.</p>
            </div>
        `;
    }
};

// Fetch dynamic top-up configurations for a specific game
const fetchGameDetails = async (gameId) => {
    try {
        const response = await fetch(`api/products.php?game_id=${gameId}`);
        if (!response.ok) throw new Error('Failed to fetch details');
        
        const details = await response.json();
        
        // Reset selected items
        storeState.selectedPackage = null;
        storeState.selectedPayment = null;
        dom.submitBtn.disabled = true;
        
        renderModalDetails(details);
    } catch (err) {
        console.error('Error getting game details:', err);
        alert('Gagal mengambil formulir top-up.');
    }
};

// --- FRONTEND UI RENDERING ---
const renderProducts = () => {
    if (storeState.products.length === 0) {
        dom.productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted)">
                <i class="fa-solid fa-circle-question" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary)"></i>
                <p>Katalog game tidak ditemukan. Coba kata kunci pencarian lain.</p>
            </div>
        `;
        return;
    }

    dom.productsContainer.innerHTML = storeState.products.map(product => `
        <div class="card-item" data-id="${product.id}">
            <div class="card-img-container">
                <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy">
            </div>
            <h4 class="card-name">${product.name}</h4>
        </div>
    `).join('');

    // Attach click events on catalog cards
    document.querySelectorAll('.card-item').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-id');
            const foundProduct = storeState.products.find(p => p.id === gameId);
            storeState.selectedProduct = foundProduct;
            
            // Show modal and fetch package specs
            dom.checkoutModal.classList.add('open');
            fetchGameDetails(gameId);
        });
    });
};

// Format currency numeric to Rupiah style (Rp X.XXX)
const formatRupiah = (value) => {
    return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Render checkout form contents inside modal
const renderModalDetails = (details) => {
    const { game, packages, payment_methods } = details;
    
    // Set Header
    dom.modalGameImg.src = game.image;
    dom.modalGameName.textContent = game.name;
    
    let catText = 'Game Mobile';
    if (game.category === 'pc') catText = 'Game PC';
    if (game.category === 'vouchers') catText = 'Voucher & Aplikasi';
    dom.modalGameCategory.textContent = catText;

    // Show/Hide Account Zone ID based on game name (specifically for Mobile Legends / custom)
    const lowerName = game.name.toLowerCase();
    if (lowerName.includes('mobile legends') || lowerName.includes('mlbb') || lowerName.includes('magic chess')) {
        dom.userIdFields.innerHTML = `
            <input type="text" class="input-field" id="user-id" placeholder="Masukkan User ID" required>
            <input type="text" class="input-field" id="zone-id" placeholder="Zone ID" required>
        `;
        dom.idHelp.textContent = 'Contoh: 12345678 (1234). Untuk menemukan ID Anda, ketuk ikon profil di sudut kiri atas layar game Anda.';
    } else {
        dom.userIdFields.innerHTML = `
            <input type="text" class="input-field" id="user-id" placeholder="Masukkan User ID / Game Account / Email" required>
        `;
        dom.idHelp.textContent = 'Masukkan ID akun, nomor telepon, atau email game Anda dengan benar sesuai format.';
    }

    // Render Packages Grid
    dom.packagesContainer.innerHTML = packages.map(pkg => `
        <div class="package-card" data-pkg-id="${pkg.id}" data-price="${pkg.price}">
            ${pkg.promo ? `<span class="promo-badge">${pkg.promo_text}</span>` : ''}
            <div class="package-name">${pkg.name}</div>
            <div class="package-price">${formatRupiah(pkg.price)}</div>
        </div>
    `).join('');

    // Attach click events on package buttons
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            storeState.selectedPackage = {
                id: card.getAttribute('data-pkg-id'),
                name: card.querySelector('.package-name').textContent,
                price: parseInt(card.getAttribute('data-price'))
            };
            
            updateTotalPrice();
        });
    });

    // Render Payments Grid
    dom.paymentContainer.innerHTML = payment_methods.map(pm => `
        <div class="payment-card" data-pm-id="${pm.id}" data-fee="${pm.fee}">
            <div class="payment-details">
                <img src="${pm.image}" alt="${pm.name}" class="payment-logo">
                <div>
                    <div class="payment-name">${pm.name}</div>
                    <div class="payment-fee">${pm.fee === 0 ? 'Tanpa Biaya Admin' : `Biaya: ${formatRupiah(pm.fee)}`}</div>
                </div>
            </div>
            <div class="select-indicator"></div>
        </div>
    `).join('');

    // Attach click events on payment options
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            storeState.selectedPayment = {
                id: card.getAttribute('data-pm-id'),
                name: card.querySelector('.payment-name').textContent,
                fee: parseInt(card.getAttribute('data-fee'))
            };
            
            updateTotalPrice();
        });
    });

    // Set dynamic default checkout total label
    dom.checkoutTotal.textContent = 'Rp 0';
};

// Recalculate price summation of item and channel fee
const updateTotalPrice = () => {
    if (!storeState.selectedPackage) {
        dom.checkoutTotal.textContent = 'Rp 0';
        dom.submitBtn.disabled = true;
        return;
    }

    let finalPrice = storeState.selectedPackage.price;
    if (storeState.selectedPayment) {
        finalPrice += storeState.selectedPayment.fee;
        dom.submitBtn.disabled = false; // Enabled only when both package and payment selected
    } else {
        dom.submitBtn.disabled = true;
    }

    dom.checkoutTotal.textContent = formatRupiah(finalPrice);
};

// --- EVENTS AND SYSTEM LISTENERS ---
const setupEventListeners = () => {
    
    // 1. Live Instant Search Listener
    let searchTimeout = null;
    dom.searchInput.addEventListener('input', (e) => {
        storeState.searchQuery = e.target.value;
        
        // Debounce to optimize API requests
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchProducts();
        }, 300);
    });

    // 2. Category Tab Switches
    dom.categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        storeState.selectedCategory = btn.getAttribute('data-category');
        fetchProducts();
    });

    // 3. Modal Close Triggers
    dom.closeModal.addEventListener('click', () => {
        dom.checkoutModal.classList.remove('open');
        dom.successScreen.classList.remove('active');
    });

    dom.checkoutModal.addEventListener('click', (e) => {
        if (e.target === dom.checkoutModal) {
            dom.checkoutModal.classList.remove('open');
            dom.successScreen.classList.remove('active');
        }
    });

    // 4. Submit checkout order trigger (Simulated transaction)
    dom.topupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userIdVal = document.getElementById('user-id').value;
        const zoneIdElement = document.getElementById('zone-id');
        const zoneIdVal = zoneIdElement ? zoneIdElement.value : '';

        // Form validation checks
        if (!userIdVal || (!zoneIdVal && zoneIdElement)) {
            alert('Silakan lengkapi formulir ID akun.');
            return;
        }

        // Animate processing button loaders
        dom.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        dom.submitBtn.disabled = true;

        setTimeout(() => {
            // Restore button styling
            dom.submitBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Bayar Sekarang';
            dom.submitBtn.disabled = false;

            // Generate detailed success invoice message
            const targetAccount = zoneIdVal ? `${userIdVal} (${zoneIdVal})` : userIdVal;
            const detailMsg = `Top-Up <strong>${storeState.selectedPackage.name}</strong> untuk game <strong>${storeState.selectedProduct.name}</strong> (Akun ID: <strong>${targetAccount}</strong>) berhasil diproses melalui pembayaran <strong>${storeState.selectedPayment.name}</strong> sebesar <strong>${dom.checkoutTotal.textContent}</strong>. Terima kasih!`;
            
            dom.successMessage.innerHTML = detailMsg;
            dom.successScreen.classList.add('active');
        }, 1500);
    });

    // 5. Back to store list button from invoice popup
    dom.backToShopBtn.addEventListener('click', () => {
        dom.successScreen.classList.remove('active');
        dom.checkoutModal.classList.remove('open');
        
        // Reset inputs
        dom.topupForm.reset();
        storeState.selectedPackage = null;
        storeState.selectedPayment = null;
        updateTotalPrice();
    });
};

// --- SYSTEM INITIALIZER RUN ---
window.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    setupEventListeners();
    fetchProducts();
});
