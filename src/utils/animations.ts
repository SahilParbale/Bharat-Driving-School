export function initScrollAnimations(): void {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;

                // Add stagger effect if part of a grid/list
                const parent = target.parentElement;
                if (parent && (parent.classList.contains('courses-grid') || parent.classList.contains('grid') || parent.classList.contains('services-grid'))) {
                    const children = Array.from(parent.querySelectorAll('.reveal'));
                    const index = children.indexOf(target);
                    if (index !== -1) {
                        target.style.transitionDelay = `${index * 120}ms`;
                    }
                }

                target.classList.add('active');
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    reveals.forEach(element => {
        observer.observe(element);
    });
}

export function initMobileNav(): void {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Toggle hamburger animation
            const bars = navToggle.querySelectorAll('.bar');
            if (navToggle.classList.contains('active')) {
                bars[0].setAttribute('style', 'transform: rotate(-45deg) translate(-5px, 6px);');
                bars[1].setAttribute('style', 'opacity: 0;');
                bars[2].setAttribute('style', 'transform: rotate(45deg) translate(-5px, -6px);');
            } else {
                bars[0].removeAttribute('style');
                bars[1].removeAttribute('style');
                bars[2].removeAttribute('style');
            }
        });

        // Close mobile menu when link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => bar.removeAttribute('style'));
            });
        });
    }
}

export function initHeaderScroll(): void {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                header.setAttribute('style', 'background-color: var(--color-white); box-shadow: var(--shadow-md); height: 75px;');
            } else {
                header.classList.remove('scrolled');
                header.removeAttribute('style');
            }
        });
    }
}

export function initGalleryTabs(): void {
    const tabs = document.querySelectorAll('.gallery-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabTarget = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(`gallery-${tabTarget}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

export function initFaqAccordion(): void {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content') as HTMLElement;

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQs
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.faq-content') as HTMLElement;
                    if (c) c.style.maxHeight = '0';
                });

                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = `${content.scrollHeight + 50}px`;
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = '0';
                }
            });
        }
    });
}

export function initStatsCounter(): void {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observerOptions = {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetEl = entry.target as HTMLElement;
            const suffix = targetEl.getAttribute('data-suffix') || '';

            if (entry.isIntersecting) {
                // Trigger the count-up animation when scrolling into view (from any direction)
                animateSingleNumber(targetEl);
            } else {
                // Reset to 0 when it goes out of view, and cancel any active animation frame
                const animId = targetEl.dataset.animationId;
                if (animId) {
                    cancelAnimationFrame(parseInt(animId, 10));
                    delete targetEl.dataset.animationId;
                }
                targetEl.textContent = '0' + suffix;
            }
        });
    }, observerOptions);

    statNumbers.forEach(el => {
        // Set initial state immediately to 0 + suffix
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = '0' + suffix;

        // Start observing this specific counter element
        observer.observe(el);
    });

    function animateSingleNumber(htmlEl: HTMLElement) {
        const target = parseInt(htmlEl.getAttribute('data-target') || '0', 10);
        const suffix = htmlEl.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds for a smooth, visible roll
        const startTime = performance.now();

        // Cancel any active animation frame on this element to avoid duplicate loops
        const activeAnimId = htmlEl.dataset.animationId;
        if (activeAnimId) {
            cancelAnimationFrame(parseInt(activeAnimId, 10));
        }

        const updateNumber = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                htmlEl.textContent = target.toLocaleString() + suffix;
                delete htmlEl.dataset.animationId;
            } else {
                const progress = elapsedTime / duration;
                // Quadratic ease-out: progress * (2 - progress)
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                htmlEl.textContent = currentValue.toLocaleString() + suffix;

                const nextAnimId = requestAnimationFrame(updateNumber);
                htmlEl.dataset.animationId = nextAnimId.toString();
            }
        };

        const firstAnimId = requestAnimationFrame(updateNumber);
        htmlEl.dataset.animationId = firstAnimId.toString();
    }
}

export function initRtoConsole(): void {
    const buttons = document.querySelectorAll('.rto-console-btn');
    const panels = document.querySelectorAll('.rto-panel');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRto = btn.getAttribute('data-rto');
            if (!targetRto) return;

            buttons.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(`rto-${targetRto}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}

export function initTestimonialSlider(): void {
    const wrapper = document.querySelector('.testimonials-slider-wrapper');
    const container = document.getElementById('testimonialsSliderContainer');
    const track = document.getElementById('testimonialsSliderTrack');
    const prevBtn = document.getElementById('reviewsPrevBtn');
    const nextBtn = document.getElementById('reviewsNextBtn');
    const dotsContainer = document.getElementById('reviewsSliderDots');

    if (!wrapper || !container || !track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    let currentIndex = 0;
    let autoScrollInterval: ReturnType<typeof setInterval> | null = null;

    const getVisibleCount = (): number => {
        const width = window.innerWidth;
        if (width > 900) return 3;
        if (width > 600) return 2;
        return 1;
    };

    const getMaxIndex = (): number => {
        const visible = getVisibleCount();
        return Math.max(0, totalCards - visible);
    };

    const updateSlider = (): void => {
        const visible = getVisibleCount();
        const maxIdx = getMaxIndex();

        if (currentIndex > maxIdx) {
            currentIndex = maxIdx;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        // Slide using exact CSS calc calculation (1.5rem is the track gap)
        track.style.transform = `translateX(calc(-${currentIndex} * (100% + 1.5rem) / ${visible}))`;

        // Update Dots active state
        const dots = dotsContainer?.querySelectorAll('.slider-dot');
        if (dots) {
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    };

    const createDots = (): void => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';

        const maxIdx = getMaxIndex();

        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to review slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                resetAutoScroll();
            });
            dotsContainer.appendChild(dot);
        }
    };

    const nextSlide = (): void => {
        const maxIdx = getMaxIndex();
        if (currentIndex >= maxIdx) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    };

    const prevSlide = (): void => {
        const maxIdx = getMaxIndex();
        if (currentIndex <= 0) {
            currentIndex = maxIdx;
        } else {
            currentIndex--;
        }
        updateSlider();
    };

    const startAutoScroll = (): void => {
        if (autoScrollInterval) return;
        autoScrollInterval = setInterval(nextSlide, 4000);
    };

    const stopAutoScroll = (): void => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };

    const resetAutoScroll = (): void => {
        stopAutoScroll();
        startAutoScroll();
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoScroll();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoScroll();
        });
    }

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAutoScroll);
    wrapper.addEventListener('mouseleave', startAutoScroll);

    // Re-initialize dots and positions on viewport resizing
    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createDots();
            updateSlider();
        }, 150);
    });

    // Initialize
    createDots();
    updateSlider();
    startAutoScroll();
}

