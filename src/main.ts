import {
    initScrollAnimations,
    initMobileNav,
    initHeaderScroll,
    initGalleryTabs,
    initFaqAccordion,
    initStatsCounter,
    initRtoConsole,
    initTestimonialSlider
} from './utils/animations';
import { initCoursesSection } from './components/courses';
import { initFeeCalculator } from './components/feeCalculator';
import { initBranchesSection } from './components/branches';
import { initEnrollPage } from './components/enroll';
import { initChatWidget } from './components/chatWidget';
import { Router } from './utils/router';
import { showToast } from './utils/toast';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize interactive floating chat widget
    initChatWidget();

    // 2. Initialize layout / design animations & scroll effects
    initMobileNav();
    initHeaderScroll();

    let router: Router;

    // 4. Dynamic Bootloader for page-specific components
    const bootPage = (path: string) => {
        // Re-initialize reveals (IntersectionObserver)
        initScrollAnimations();

        if (path.includes('courses.html')) {
            // Courses Catalog Page
            initCoursesSection((courseId) => {
                router.navigate(`enroll.html?course=${courseId}`);
            });
        } else if (path.includes('calculator.html')) {
            // Calculator Page
            initFeeCalculator((customDetails) => {
                localStorage.setItem('bmds_custom_enroll', JSON.stringify(customDetails));
                router.navigate('enroll.html');
            });
        } else if (path.includes('branches.html')) {
            // Branches Page
            initBranchesSection();
        } else if (path.includes('gallery.html')) {
            // Gallery Page
            initGalleryTabs();
        } else if (path.includes('about.html')) {
            // About Us Page (scroll animations handled globally)
        } else if (path.includes('enroll.html')) {
            // Enrollment Page
            initEnrollPage();
        } else {
            // Home Page (or root "/")
            initFaqAccordion();
            initStatsCounter();
            initRtoConsole();
            initTestimonialSlider();

            // Auto-detect Real-Time Google Reviews Widget & hide fallback reviews
            const widgetSlot = document.querySelector('.google-reviews-widget-slot');
            const fallbackGrid = document.querySelector('.testimonials-static-fallback') as HTMLElement;
            if (widgetSlot && fallbackGrid) {
                if (widgetSlot.children.length > 0) {
                    fallbackGrid.style.display = 'none';
                } else {
                    const observer = new MutationObserver(() => {
                        if (widgetSlot.children.length > 0) {
                            fallbackGrid.style.display = 'none';
                            observer.disconnect();
                        }
                    });
                    observer.observe(widgetSlot, { childList: true, subtree: true });
                }
            }

            // Bind Home Page "Book Course" buttons directly to enroll.html
            const bookBasic = document.getElementById('book-car-basic');
            if (bookBasic) {
                bookBasic.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.navigate('enroll.html?course=car-basic');
                });
            }
            const bookSedan = document.getElementById('book-car-sedan');
            if (bookSedan) {
                bookSedan.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.navigate('enroll.html?course=car-sedan');
                });
            }
            const bookBike = document.getElementById('book-two-wheeler');
            if (bookBike) {
                bookBike.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.navigate('enroll.html?course=two-wheeler');
                });
            }


            // Quick Contact Counselor Form Submission
            const contactForm = document.getElementById('directContactForm') as HTMLFormElement;
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const nameVal = (document.getElementById('cName') as HTMLInputElement).value;
                    const phoneVal = (document.getElementById('cPhone') as HTMLInputElement).value;
                    const emailVal = (document.getElementById('cEmail') as HTMLInputElement).value || 'Not provided';
                    const msgVal = (document.getElementById('cMessage') as HTMLTextAreaElement).value || 'No message content';

                    const phoneRegex = /^[6-9]\d{9}$/;
                    if (!phoneRegex.test(phoneVal)) {
                        showToast('Please enter a valid 10-digit mobile number.', 'error');
                        return;
                    }

                    const text = `*Bharat Motor Driving School - Inquiry*
-----------------------------
*Inquirer Name:* ${nameVal}
*Mobile Number:* ${phoneVal}
*Email Address:* ${emailVal}
*Inquiry Message:* ${msgVal}
-----------------------------
_Sent from Driving School Web Platform._`;

                    const encoded = encodeURIComponent(text);
                    const whatsappNumber = '919011051238'; // Direct firm WhatsApp number
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;

                    contactForm.reset();
                    showToast('Your inquiry was processed. Redirecting to WhatsApp to chat with our coordinator...', 'success');
                    setTimeout(() => {
                        window.location.href = whatsappUrl;
                    }, 1500);
                });
            }
        }

        // Scroll reveal triggers on load
        const reveals = document.querySelectorAll('.reveal');
        setTimeout(() => {
            reveals.forEach(rev => {
                const rect = rev.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    rev.classList.add('active');
                }
            });
        }, 150);
    };

    // 5. Initialize the client-side Router
    router = new Router((path) => {
        bootPage(path);
    });

    // 6. Boot the page for the current path
    bootPage(window.location.pathname);
});
