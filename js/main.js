document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
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

    const isMobile = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);
    const canvas = document.getElementById('particle-canvas');

    if (canvas && !isMobile) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000, mouseY = -1000;
        let animFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const PARTICLE_COUNT = 60;
        const CONNECTION_DIST = 150;
        const MOUSE_RADIUS = 200;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.baseAlpha = Math.random() * 0.4 + 0.1;
                this.alpha = this.baseAlpha;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }
            update(time) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
                    this.vx += dx * force * 0.01;
                    this.vy += dy * force * 0.01;
                    this.alpha = this.baseAlpha + (1 - dist / MOUSE_RADIUS) * 0.5;
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }

                this.alpha += Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.05;
                this.vx *= 0.999;
                this.vy *= 0.999;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(50, 184, 198, ${this.alpha})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(50, 184, 198, ${this.alpha * 0.15})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(50, 184, 198, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        let time = 0;
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;
            particles.forEach(p => {
                p.update(time);
                p.draw();
            });
            drawConnections();
            animFrameId = requestAnimationFrame(animateParticles);
        };
        animateParticles();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (canvas) {
                canvas.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        });
    }

    const blobs = document.querySelectorAll('.morphing-blob');
    blobs.forEach((blob, i) => {
        gsap.to(blob, {
            y: () => -120 * (i + 1),
            rotate: (i + 1) * 30,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2
            }
        });
    });

    const navLogoLink = document.getElementById('nav-logo-link');
    if (navLogoLink) {
        navLogoLink.addEventListener('click', function (e) {
            e.preventDefault();
            gsap.to(window, {
                scrollTo: { y: 0, autoKill: false },
                duration: 1,
                ease: 'power3.inOut'
            });
        });
    }

    document.querySelectorAll('.glass-card, .glass-card-premium').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
            this.classList.add('card-glow-active');

            gsap.to(this, {
                x: deltaX * 4,
                y: deltaY * 3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('card-glow-active');
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });
        });

        card.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.classList.add('magnetic-ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);

            gsap.fromTo(ripple,
                { scale: 0, opacity: 0.6 },
                {
                    scale: 4, opacity: 0, duration: 0.8, ease: 'power2.out',
                    onComplete: () => ripple.remove()
                }
            );
        });
    });

    document.querySelectorAll('.section').forEach(section => {
        gsap.fromTo(section,
            { opacity: 0.5, scale: 0.96 },
            {
                opacity: 1,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 92%',
                    end: 'top 35%',
                    scrub: 1.5
                }
            }
        );
    });

    const problemCards = gsap.utils.toArray('.problem-card');
    const directions = [
        { x: -60, y: 30, rotation: -8 },
        { x: 0, y: 50, rotation: 0 },
        { x: 60, y: 30, rotation: 8 }
    ];
    problemCards.forEach((card, i) => {
        const dir = directions[i % 3];
        gsap.fromTo(card,
            {
                x: dir.x,
                y: dir.y,
                rotation: dir.rotation,
                opacity: 0,
                scale: 0.88,
                filter: 'blur(6px)'
            },
            {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                delay: i * 0.12,
                onComplete: () => {
                    card.classList.add('glow-border-animate');
                }
            }
        );
    });

    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            {
                scale: 0.6,
                opacity: 0,
                filter: 'blur(10px)',
                y: 30
            },
            {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                delay: (i % 2) * 0.15 + Math.floor(i / 2) * 0.1
            }
        );
    });

    gsap.utils.toArray('.usp-card').forEach((card, i) => {
        gsap.fromTo(card,
            {
                y: 80,
                opacity: 0,
                scale: 0.85,
                filter: 'blur(8px)'
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                delay: i * 0.18,
                onComplete: () => {
                    gsap.fromTo(card, { boxShadow: '0 12px 40px rgba(33,128,141,0.1)' }, {
                        boxShadow: '0 12px 40px rgba(33,128,141,0.1), 0 0 30px rgba(50,184,198,0.15)',
                        duration: 0.6,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                }
            }
        );
    });

    gsap.utils.toArray('.comparison-row-item').forEach((row, i) => {
        const cols = row.querySelectorAll('.comparison-col');
        cols.forEach((col, j) => {
            gsap.fromTo(col,
                {
                    x: j === 0 ? -50 : 50,
                    opacity: 0,
                    filter: 'blur(4px)'
                },
                {
                    x: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.12 + j * 0.15
                }
            );
        });
    });

    const stepNumbers = gsap.utils.toArray('.step-number');
    stepNumbers.forEach((num, i) => {
        gsap.fromTo(num,
            { scale: 0, rotation: -180 },
            {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: num,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                delay: i * 0.2
            }
        );
    });

    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach((el) => {
        const parent = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.reveal-element'));
        const siblingIndex = siblings.indexOf(el);

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                gsap.fromTo(el,
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.93,
                        filter: 'blur(6px)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.85,
                        delay: siblingIndex * 0.1,
                        ease: 'power3.out',
                        onStart: () => el.classList.add('revealed'),
                        onComplete: () => {
                            if (el.classList.contains('glass-card') ||
                                el.classList.contains('glass-card-premium') ||
                                el.closest('.glass-card') ||
                                el.closest('.glass-card-premium')) {
                                el.classList.add('glow-border-animate');
                            }
                        }
                    }
                );
            },
            once: true
        });
    });

    gsap.utils.toArray('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            y: () => -100 * (i + 1),
            rotate: (i % 2 === 0 ? 1 : -1) * 15,
            scale: 1 + (i * 0.05),
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5 + i * 0.5
            }
        });
    });

    document.querySelectorAll('.section').forEach(section => {
        const children = section.querySelectorAll('.section-title, .section-subtitle');
        children.forEach((child, i) => {
            gsap.to(child, {
                y: -30 * (i + 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    });

    document.querySelectorAll('.stat-value').forEach(stat => {
        const text = stat.textContent.trim();
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const hasSlash = text.includes('/');
        const hasK = text.includes('K');

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                if (hasSlash) {
                    gsap.fromTo(stat,
                        { scale: 0.3, opacity: 0, rotationX: 90 },
                        {
                            scale: 1, opacity: 1, rotationX: 0,
                            duration: 0.9, ease: 'back.out(2)',
                            transformPerspective: 800
                        }
                    );
                } else {
                    let numericValue;
                    if (hasK) {
                        numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    } else {
                        numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    }

                    const counter = { val: 0 };
                    gsap.fromTo(stat,
                        { scale: 0.5, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
                    );
                    gsap.to(counter, {
                        val: numericValue,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            let display;
                            if (hasK) {
                                display = Math.floor(counter.val) + 'K';
                            } else {
                                display = Math.floor(counter.val);
                            }
                            if (hasPlus) display += '+';
                            if (hasPercent) display += '%';
                            stat.textContent = display;
                        }
                    });
                }
            },
            once: true
        });
    });

    document.querySelectorAll('.conclusion-stat').forEach(stat => {
        const text = stat.textContent.trim();
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        const hasPercent = text.includes('%');

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            onEnter: () => {
                const counter = { val: 0 };
                gsap.fromTo(stat,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
                );
                gsap.to(counter, {
                    val: numericValue,
                    duration: 2.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        let display = Math.floor(counter.val);
                        if (hasPercent) display += '%';
                        stat.textContent = display;
                    }
                });
            },
            once: true
        });
    });

    document.querySelectorAll('.section-title').forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        title.classList.add('text-reveal-ready');

        const words = text.split(' ');
        let charIndex = 0;
        words.forEach((word, wIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            [...word].forEach(char => {
                const span = document.createElement('span');
                span.classList.add('char-reveal');
                span.textContent = char;
                span.style.setProperty('--char-index', charIndex);
                wordSpan.appendChild(span);
                charIndex++;
            });

            title.appendChild(wordSpan);

            if (wIndex < words.length - 1) {
                const space = document.createElement('span');
                space.classList.add('char-reveal');
                space.textContent = '\u00A0';
                space.style.setProperty('--char-index', charIndex);
                title.appendChild(space);
                charIndex++;
            }
        });

        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => {
                const chars = title.querySelectorAll('.char-reveal');
                gsap.fromTo(chars,
                    {
                        opacity: 0,
                        y: 30,
                        filter: 'blur(8px)',
                        scale: 0.8,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.02,
                        ease: 'back.out(1.5)',
                    }
                );
            },
            once: true
        });
    });

    document.querySelectorAll('.glass-card, .glass-card-premium').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('glow-trail-active');
        });
        card.addEventListener('mouseleave', function () {
            this.classList.remove('glow-trail-active');
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
                    { scale: 0, opacity: 0, rotation: -180 },
                    {
                        scale: 1, opacity: 1, rotation: 0,
                        duration: 0.8, ease: 'back.out(2.5)',
                        delay: index * 0.1
                    }
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

    if (!isMobile) {
        const cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(50, 184, 198, 0.07) 0%, transparent 70%);
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
        `;
        document.body.appendChild(cursorGlow);

        document.addEventListener('mousemove', (e) => {
            gsap.to(cursorGlow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        document.querySelectorAll('.glass-card, .glass-card-premium, .nav-links a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '400px';
                cursorGlow.style.height = '400px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(50, 184, 198, 0.12) 0%, transparent 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '300px';
                cursorGlow.style.height = '300px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(50, 184, 198, 0.07) 0%, transparent 70%)';
            });
        });
    }

    document.querySelectorAll('.problem-icon ion-icon, .service-icon ion-icon, .usp-icon ion-icon').forEach(icon => {
        const parent = icon.closest('.glass-card, .glass-card-premium');
        if (parent) {
            parent.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.3,
                    rotate: -12,
                    duration: 0.4,
                    ease: 'back.out(3)'
                });
            });
            parent.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        }
    });

    document.querySelectorAll('.step-connector').forEach(connector => {
        gsap.fromTo(connector,
            { scaleY: 0, transformOrigin: 'top' },
            {
                scaleY: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: connector,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    const footer = document.querySelector('.footer');
    if (footer) {
        ScrollTrigger.create({
            trigger: footer,
            start: 'top 90%',
            onEnter: () => {
                gsap.fromTo(footer,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                );
            },
            once: true
        });
    }

});
