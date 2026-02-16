document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        document.body.classList.add('preloader-active');
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.classList.remove('preloader-active');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            }, { once: true });
        }, 1500);
    }

    const navbar = document.querySelector('.nav-glass');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.style.display = 'block';
            setTimeout(() => mobileMenu.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }, 250);
        };

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        gsap.to(scrollProgress, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }


    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            gsap.to(this, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformStyle: 'preserve-3d'
            });
        });
        card.addEventListener('mouseleave', function () {
            gsap.to(this, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });


    const icons = [
        ...document.querySelectorAll('.problem-icon'),
        ...document.querySelectorAll('.service-icon'),
        ...document.querySelectorAll('.usp-icon'),
        ...document.querySelectorAll('.benefit-icon')
    ];
    icons.forEach((icon, index) => {
        gsap.to(icon, {
            y: -12,
            duration: 2 + (index % 3) * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.15
        });
    });


    document.querySelectorAll('.step-number').forEach((num, index) => {
        ScrollTrigger.create({
            trigger: num,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo(num,
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', delay: index * 0.1 }
                );
            },
            once: true
        });
    });


    document.querySelectorAll('.nav-links a').forEach(el => {
        el.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(this, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        el.addEventListener('mouseleave', function () {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });


    gsap.utils.toArray('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            y: () => -80 * (i + 1),
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });
    });



    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px;
        border-radius: 50%; background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(50, 184, 198, 0.3);
        color: #21808D; font-size: 24px; font-weight: 800;
        cursor: pointer; opacity: 0; pointer-events: none;
        transition: all 0.3s ease; z-index: 999;
        box-shadow: 0 8px 32px rgba(33, 128, 141, 0.25);
    `;
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('mouseenter', () => {
        gsap.to(scrollTopBtn, { scale: 1.1, duration: 0.3 });
    });
    scrollTopBtn.addEventListener('mouseleave', () => {
        gsap.to(scrollTopBtn, { scale: 1, duration: 0.3 });
    });

    window.addEventListener('scroll', () => {
        scrollTopBtn.style.opacity = window.pageYOffset > 500 ? '1' : '0';
        scrollTopBtn.style.pointerEvents = window.pageYOffset > 500 ? 'all' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
        gsap.to(window, { duration: 1.2, scrollTo: { y: 0 }, ease: 'power3.inOut' });
    });


    const mesh = document.querySelector('.gradient-mesh');
    if (mesh) {
        window.addEventListener('scroll', () => {
            mesh.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(50, 184, 198, 0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: -1;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: 'power2.out'
        });
    });


    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach((el, index) => {

        const parent = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.reveal-element'));
        const siblingIndex = siblings.indexOf(el);

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: siblingIndex * 0.12,
                    ease: 'power3.out',
                    onStart: () => el.classList.add('revealed')
                });
            },
            once: true
        });
    });

    document.querySelectorAll('.section-title').forEach(title => {
        gsap.to(title, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
                end: 'top 20%',
                scrub: 1
            }
        });
    });


    document.querySelectorAll('.problem-icon ion-icon, .service-icon ion-icon, .usp-icon ion-icon').forEach(icon => {
        const parent = icon.closest('.glass-card, .glass-card-premium');
        if (parent) {
            parent.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.2,
                    rotate: -8,
                    duration: 0.4,
                    ease: 'back.out(2)'
                });
            });
            parent.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }
    });


    document.querySelectorAll('.stat-value').forEach(stat => {
        const text = stat.textContent;
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                gsap.fromTo(stat,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }
                );
            },
            once: true
        });
    });


    document.querySelectorAll('.step-connector').forEach(connector => {
        gsap.fromTo(connector,
            { scaleY: 0, transformOrigin: 'top' },
            {
                scaleY: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: connector,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    console.log('✅ GSAP animations + Ionicons loaded!');
});
