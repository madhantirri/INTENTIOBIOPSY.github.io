/* -----------------------------------------------------
   MEDICAL 3D INTERFACE | Intentio Biopsy
   ----------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    /* --- NAVIGATION LOGIC --- */
    const hamburger = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    const navbar = document.querySelector('.navbar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Smart Scroll for Navbar
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    });


    /* --- THREE.JS BACKGROUND: "The Medical Web" --- */
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('canvas-container');

        // 1. Scene & Camera
        const scene = new THREE.Scene();
        // Soft white fog for depth fading
        scene.fog = new THREE.Fog(0xf0f4f8, 10, 50);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Sharp on retina
        container.appendChild(renderer.domElement);


        // 2. Objects: "Connected Nodes" (Simulating Tissue/Bone Matrix)
        const geometry = new THREE.BufferGeometry();
        const particleCount = 200; // Fewer particles, cleaner look

        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
            sizes[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Custom attribute

        // Custom Shader Material for soft circles
        // Using standard PointsMaterial for simplicity and performance first
        const material = new THREE.PointsMaterial({
            color: 0x0077b6, // Medical Blue
            size: 0.45,       // Slightly larger for visibility
            transparent: true,
            opacity: 0.8      // Increased opacity
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Lines connecting close particles (The "Network")
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00b4d8, // Cyan Accent
            transparent: true,
            opacity: 0.25 // Increased
        });

        // We'll update line logic in animate loop if needed, but for performance let's use a fixed complex wireframe or predefined lines
        // Better Approach for static connectivity: DNA Helix or simple grid? 
        // Let's do a large faint Icosahedron cage that rotates slowly

        const cageGeo = new THREE.IcosahedronGeometry(15, 1);
        const cageMat = new THREE.MeshBasicMaterial({
            color: 0x0096c7, // Darker Cyan for better contrast on light bg
            wireframe: true,
            transparent: true,
            opacity: 0.15     // Increased from 0.05
        });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        scene.add(cage);

        const innerCageGeo = new THREE.IcosahedronGeometry(8, 0);
        const innerCageMat = new THREE.MeshBasicMaterial({
            color: 0x023e8a, // Darker Blue
            wireframe: true,
            transparent: true,
            opacity: 0.2      // Increased from 0.1
        });
        const innerCage = new THREE.Mesh(innerCageGeo, innerCageMat);
        scene.add(innerCage);


        // 3. User Interaction (Parallax)
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        });

        // 4. Animation Loop
        const animate = function () {
            requestAnimationFrame(animate);

            // Subtle Rotation
            particles.rotation.y += 0.0005;
            cage.rotation.y -= 0.001;
            cage.rotation.x += 0.0005;
            innerCage.rotation.y += 0.002;

            // Smooth Camera Sway
            camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // 5. Resize Handling
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }


    /* --- SCROLL REVEAL (Professional Fade) --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.card, .feature-box, .section-header, .team-member, .product-showcase, .contact-card, .clay-card, .clay-image, .award-item');
    hiddenElements.forEach((el) => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });

    /* --- DARK MODE TOGGLE --- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark');
            } else {
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Inject CSS for scroll animation dynamically if not present
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .hidden-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    /* --- PRELOADER (Wait for full load + animation) --- */
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');

        // Initial Load Animation
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Do NOT remove preloader so we can reuse it
            }, 1800); // 1.8s delay (faster)
        }

        // Awards Animation Trigger
        const awardsLink = document.querySelector('a[href="#avenues"]');
        const awardLoader = document.getElementById('award-loader');

        if (awardsLink && awardLoader) {
            awardsLink.addEventListener('click', (e) => {
                // Show Award Loader (Lottie)
                awardLoader.classList.remove('fade-out');

                // Hide after 2 seconds
                setTimeout(() => {
                    awardLoader.classList.add('fade-out');
                }, 2000);
            });
        }
    }); /* End Load Event */

    /* --- LIGHTBOX LOGIC --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    // Select both IP images and media images
    const lightboxImages = document.querySelectorAll('.ip-card img, .media-img');

    if (lightbox && lightboxImg) {
        // Open
        lightboxImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('show');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

});
