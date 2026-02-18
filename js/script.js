// script.js – all vanilla javascript
(function () {
    // Sticky navbar + background transition
    const header = document.getElementById('mainNav');
    const backBtn = document.getElementById('backToTop');
    if (header && backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                backBtn.classList.add('visible');
            } else {
                header.classList.remove('scrolled');
                backBtn.classList.remove('visible');
            }
        });
    }

    // Mobile hamburger toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            // Toggle body scroll
            if (navMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Mobile Dropdowns
        const dropdownToggles = document.querySelectorAll('.nav-menu li > a');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 991) {
                    const dropdown = toggle.nextElementSibling;
                    if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                        e.preventDefault();
                        dropdown.classList.toggle('active-mobile');
                    }
                }
            });
        });

        // Smooth scroll navigation
        const navLinks = document.querySelectorAll('.nav-menu a');
        if (navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const dropdown = link.nextElementSibling;
                    if (window.innerWidth <= 991 && dropdown && dropdown.classList.contains('dropdown-menu')) {
                        // Don't close menu if it's a dropdown parent
                        return;
                    }
                    navMenu.classList.remove('open');
                    document.body.style.overflow = ''; // Restore scroll
                    if (mobileToggle.classList.contains('active')) {
                        mobileToggle.classList.remove('active');
                    }
                });
            });
        }
    }


    // Intersection Observer for reveals (left/right/up)
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));

    // FAQ Accordion (single open)
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems) {
        accordionItems.forEach(item => {
            const btn = item.querySelector('.accordion-header');
            if (btn) {
                btn.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    // close all others
                    accordionItems.forEach(i => i.classList.remove('active'));
                    if (!isActive) item.classList.add('active');
                });
            }
        });
    }

    // Contact form validation
    const form = document.getElementById('contactForm');
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const msgInput = document.getElementById('message');

        function showError(input, message) {
            const err = input.parentElement.querySelector('.error');
            if (err) err.textContent = message;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            // reset
            document.querySelectorAll('.error').forEach(e => e.textContent = '');

            if (!nameInput.value.trim()) {
                showError(nameInput, 'Full name is required');
                valid = false;
            }
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError(emailInput, 'Email address required');
                valid = false;
            } else if (!emailPattern.test(email)) {
                showError(emailInput, 'Enter a valid email');
                valid = false;
            }
            if (!msgInput.value.trim()) {
                showError(msgInput, 'Message cannot be blank');
                valid = false;
            }

            if (valid) {
                alert('Message sent (demo) – thank you.');
                form.reset();
            }
        });
    }

    // Back to top click
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Ensure hero is full height (mobile vh fix)
    const setHeroHeight = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setHeroHeight);
    setHeroHeight();

    // Services Accordion Interactivity (especially for mobile)
    const accItems = document.querySelectorAll('.acc-item');
    if (accItems) {
        accItems.forEach(item => {
            item.addEventListener('click', () => {
                accItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    // Gallery Modal Logic
    const openGalleryBtn = document.getElementById('openGallery');
    const closeGalleryBtn = document.getElementById('closeGallery');
    const galleryModal = document.getElementById('galleryModal');
    const modalGrid = document.getElementById('modalGrid');
    const projectItems = document.querySelectorAll('.project-item');

    // List of images for the full gallery
    const galleryImages = [
        'images/pictures/sb1.jpg',
        'images/pictures/sb2.jpeg',
        'images/pictures/sb3.jpg',
        'images/pictures/sb4.png',
        'images/pictures/sb5.jpg',
        'images/pictures/sb6.jpeg',
        'images/pictures/sb7.jpg',
        'images/pictures/sb8.jpg',
        'images/pictures/sb9.jpeg',
        'images/pictures/sb10.jpg',
        'images/pictures/sb11.jpg',
        'images/pictures/sb12.jpeg',
        'images/pictures/sb13.jpeg',
        'images/pictures/sb14.jpeg',
        'images/pictures/sb15.jpeg',
        'images/pictures/sb16.jpeg',
        'images/pictures/sb17.jpeg',
        'images/pictures/sb18.jpeg',
        'images/pictures/sb19.jpeg',
        'images/pictures/sb20.jpeg',
        'images/pictures/sb21.jpeg',
        'images/pictures/sb22.jpeg',
        'images/pictures/sb23.jpeg',
        'images/pictures/sb24.jpeg',
        'images/pictures/sb25.jpeg',
        'images/pictures/sb26.jpeg',
        'images/pictures/sb27.jpeg',
        'images/pictures/sb28.jpeg',
        'images/pictures/sb29.jpeg',


    ];

    if (openGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', openGallery);
    }

    if (closeGalleryBtn && galleryModal) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    projectItems.forEach(item => {
        item.addEventListener('click', openGallery);
    });

    function openGallery() {
        if (modalGrid && modalGrid.children.length === 0) {
            galleryImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Sbinc Project';
                img.loading = 'lazy';
                modalGrid.appendChild(img);
            });
        }
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
})();


