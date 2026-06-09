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
