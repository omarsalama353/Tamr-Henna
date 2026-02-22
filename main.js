document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation using IntersectionObserver
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));

    // 4. Parallax / Tilt Effect for Experience Photos
    const tiltItems = document.querySelectorAll('.tilt-effect');

    tiltItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const multiplier = 0.05;
            const tiltX = -y * multiplier;
            const tiltY = x * multiplier;

            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transition = 'transform 0.4s ease-out';
            item.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;

            // Remove transition after it finished so it doesn't interfere with mousemove
            setTimeout(() => {
                item.style.transition = '';
            }, 400);
        });
    });

    // 5. Video Carousel Background
    const heroVideo = document.getElementById('hero-video');

    // Array of our premium custom videos
    const videoSources = [
        'dark-espresso-shot.mp4',
        'hazelnut-brew-complete.mp4',
        'vanilla-french-complete.mp4'
    ];

    let currentVideoIndex = 0;

    if (heroVideo) {
        // Listen for when a video naturally concludes
        heroVideo.addEventListener('ended', () => {

            // 1. Start the fade out
            heroVideo.classList.add('fading');

            // 2. Wait for the CSS transition (0.8s) to finish before swapping source
            setTimeout(() => {
                currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
                heroVideo.src = videoSources[currentVideoIndex];

                // Play the new video
                heroVideo.play().then(() => {
                    // 3. Fade back in once the new video has started playing
                    heroVideo.classList.remove('fading');
                }).catch(err => {
                    console.error("Video auto-play was prevented:", err);
                    heroVideo.classList.remove('fading');
                });

            }, 800); // 800ms matches our CSS transition time
        });
    }

    // 6. Language Toggle (Bilingual Support)
    const langToggle = document.getElementById('lang-toggle');
    const langEnBtn = document.querySelector('.lang-en');
    const langArBtn = document.querySelector('.lang-ar');
    const langAwareElements = document.querySelectorAll('.lang-aware');

    // Check local storage for preference, default to English
    let currentLang = localStorage.getItem('siteLang') || 'en';

    // Function to apply translation
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('siteLang', lang); // Save preference

        // Update Document configuration
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // Update Toggle Button UI
        if (lang === 'ar') {
            langArBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        } else {
            langEnBtn.classList.add('active');
            langArBtn.classList.remove('active');
        }

        // Swap all texts with nice, slight fade if desired, here just instant update
        document.querySelectorAll('.lang-aware').forEach(el => {
            // we use innerHTML because some translations include HTML tags (like <br> or <em>)
            const translatedText = el.getAttribute(`data-${lang}`);
            if (translatedText) {
                el.innerHTML = translatedText;
            }
        });
    };

    // Apply initially
    if (currentLang !== 'en') {
        setLanguage(currentLang);
    }

    // Listen for toggle clicks
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const nextLang = (currentLang === 'en') ? 'ar' : 'en';
            setLanguage(nextLang);
        });
    }

    // 7. Dynamic Menu Rendering from menu-data.js
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid && typeof menuData !== 'undefined') {
        menuData.forEach((category, index) => {
            // Delay for stagger animation
            const delay = (index + 1) * 0.1;

            // Create category container
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'menu-category reveal-up';
            categoryDiv.id = category.categoryId;
            categoryDiv.style.transitionDelay = `${delay}s`;

            if (category.bgImage) {
                categoryDiv.style.backgroundImage = `url('${category.bgImage}')`;
            }

            // Create header
            const header = document.createElement('h3');
            header.className = 'lang-aware';
            header.setAttribute('data-en', category.categoryNameEn);
            header.setAttribute('data-ar', category.categoryNameAr);
            header.innerHTML = currentLang === 'en' ? category.categoryNameEn : category.categoryNameAr;
            categoryDiv.appendChild(header);

            // Create items
            category.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';

                const itemHead = document.createElement('div');
                itemHead.className = 'item-head';

                const title = document.createElement('h4');
                title.className = 'lang-aware';
                title.setAttribute('data-en', item.nameEn);
                title.setAttribute('data-ar', item.nameAr);
                title.innerHTML = currentLang === 'en' ? item.nameEn : item.nameAr;

                const price = document.createElement('span');
                price.className = 'price';
                price.innerHTML = item.price;

                itemHead.appendChild(title);
                itemHead.appendChild(price);
                itemDiv.appendChild(itemHead);

                categoryDiv.appendChild(itemDiv);
            });

            menuGrid.appendChild(categoryDiv);
        });

        // Re-observe the newly added reveal-up elements for scroll animation
        const newRevealElements = menuGrid.querySelectorAll('.reveal-up');
        newRevealElements.forEach(el => observer.observe(el));
    }
});
