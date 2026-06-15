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

const blockToRemove = `        <!-- Feature Bar -->
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
        </div>\n\n`;

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(blockToRemove, '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated " + file);
    } else {
        console.log("File " + file + " not found.");
    }
});
