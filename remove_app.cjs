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

const blockToRemove = `                    <div class="footer-divider-dotted"></div>

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
                    </div>`;

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
