const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'about.html',
    'courses.html',
    'calculator.html',
    'branches.html',
    'gallery.html'
];

const newFooterHTML = `    <!-- Footer -->
    <footer class="footer-new">
        <!-- Feature Bar -->
        <div class="footer-features-bar">
            <div class="container footer-features-grid">
                <div class="footer-feature-item">
                    <div class="footer-feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="footer-feature-text">
                        <h4>Expert Trainers</h4>
                        <p>Certified professionals with years of experience</p>
                    </div>
                </div>
                <div class="footer-feature-divider"></div>
                <div class="footer-feature-item">
                    <div class="footer-feature-icon"><i class="fa-solid fa-car"></i></div>
                    <div class="footer-feature-text">
                        <h4>Safe & Secure</h4>
                        <p>Well maintained vehicles & safety first approach</p>
                    </div>
                </div>
                <div class="footer-feature-divider"></div>
                <div class="footer-feature-item">
                    <div class="footer-feature-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="footer-feature-text">
                        <h4>Proven Results</h4>
                        <p>Thousands of happy licensed drivers</p>
                    </div>
                </div>
                <div class="footer-feature-divider"></div>
                <div class="footer-feature-item">
                    <div class="footer-feature-icon"><i class="fa-solid fa-headset"></i></div>
                    <div class="footer-feature-text">
                        <h4>24/7 Support</h4>
                        <p>We're here to help you anytime, anywhere</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-main">
            <div class="container footer-main-grid">
                <!-- Column 1: Brand -->
                <div class="footer-brand-col">
                    <div class="footer-logo-row">
                        <img src="assets/images/logo.png" alt="BMDS" class="footer-logo-img">
                        <div class="footer-logo-text">
                            <h3>Bharat Motor</h3>
                            <h3>Driving School</h3>
                        </div>
                    </div>
                    <p class="footer-desc">Empowering drivers with premium coaching, defensive training, and comprehensive licensing services since 2013.</p>
                    
                    <ul class="footer-contact-list">
                        <li><i class="fa-solid fa-phone"></i> <span>9101051238</span></li>
                        <li><i class="fa-solid fa-location-dot"></i> <span>Katraj &bull; Dhankwadi &bull; Dhayari, Pune</span></li>
                        <li><i class="fa-solid fa-envelope"></i> <span>bharatmotordriving@gmail.com</span></li>
                        <li><i class="fa-regular fa-clock"></i> <span>Mon - Sun: 7:00 AM - 9:00 PM</span></li>
                    </ul>

                    <div class="footer-socials-circle">
                        <a href="https://wa.me/919922211238" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>
                        <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i></a>
                        <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-google"></i></a>
                    </div>
                </div>

                <!-- Column 2: Navigation -->
                <div class="footer-nav-col">
                    <h4 class="footer-heading">NAVIGATION</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="courses.html">Courses Offered</a></li>
                        <li><a href="calculator.html">Fee Calculator</a></li>
                        <li><a href="branches.html">Our Branches</a></li>
                        <li><a href="gallery.html">Media Gallery</a></li>
                        <li><a href="index.html#contact">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Column 3: Primary Services -->
                <div class="footer-nav-col">
                    <h4 class="footer-heading">PRIMARY SERVICES</h4>
                    <ul>
                        <li><a href="courses.html">Car Training</a></li>
                        <li><a href="courses.html">SUV Training</a></li>
                        <li><a href="courses.html">Two-Wheeler Classes</a></li>
                        <li><a href="index.html#services">RTO Guidance</a></li>
                        <li><a href="https://sarathi.parivahan.gov.in" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem; margin-right: 4px;"></i> Sarathi RTO Portal</a></li>
                    </ul>
                </div>

                <!-- Column 4: Stay Updated & App -->
                <div class="footer-action-col">
                    <div class="footer-subscribe">
                        <h4 class="footer-heading">STAY UPDATED</h4>
                        <p>Subscribe to get updates on new courses, offers &amp; driving tips.</p>
                        <form class="footer-subscribe-form">
                            <input type="email" placeholder="Enter your email" required>
                            <button type="button">Subscribe</button>
                        </form>
                    </div>

                    <div class="footer-divider-dotted"></div>

                    <div class="footer-app">
                        <h4 class="footer-heading">DOWNLOAD OUR APP</h4>
                        <p>Book classes, track progress &amp; more.</p>
                        <div class="footer-app-badges">
                            <a href="#" class="app-badge store-badge-css">
                                <i class="fa-brands fa-google-play"></i>
                                <div class="badge-text">
                                    <span class="small-text">GET IT ON</span>
                                    <span class="large-text">Google Play</span>
                                </div>
                            </a>
                            <a href="#" class="app-badge store-badge-css">
                                <i class="fa-brands fa-apple"></i>
                                <div class="badge-text">
                                    <span class="small-text">Download on the</span>
                                    <span class="large-text">App Store</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom-bar">
            <div class="container footer-bottom-flex">
                <p>&copy; 2026 Bharat Motor Driving School. All Rights Reserved.</p>
                <div class="footer-payments">
                    <span><i class="fa-solid fa-lock"></i> 100% SECURED PAYMENT VIA:</span>
                    <i class="fa-brands fa-cc-visa"></i>
                    <i class="fa-brands fa-cc-mastercard"></i>
                    <span class="rupay-text">RuPay</span>
                    <i class="fa-solid fa-qrcode"></i>
                    <span class="upi-text">UPI</span>
                </div>
                <div class="footer-policies">
                    <a href="#">Privacy Policy</a>
                    <span class="sep">|</span>
                    <a href="#">Terms &amp; Conditions</a>
                    <span class="sep">|</span>
                    <a href="#">Refund Policy</a>
                </div>
            </div>
        </div>
    </footer>`;

const footerRegex = /<!-- Footer -->[\s\S]*?<\/footer>/i;

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(footerRegex, newFooterHTML);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated " + file);
    } else {
        console.log("File " + file + " not found.");
    }
});
