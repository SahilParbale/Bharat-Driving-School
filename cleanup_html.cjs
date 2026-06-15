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

const modalRegex = /<!-- Enrollment Modal -->[\s\S]*?<div class="modal-overlay" id="bookingModalOverlay">[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/i;

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove modal HTML
        content = content.replace(modalRegex, '');
        
        // Update #enrollTrigger links
        content = content.replace(/href="#" class="nav-link nav-btn" id="enrollTrigger"/g, 'href="enroll.html" class="nav-link nav-btn" id="enrollTrigger"');
        
        // Update #aboutEnrollTrigger links
        content = content.replace(/href="#" class="btn btn-primary btn-lg" id="aboutEnrollTrigger"/g, 'href="enroll.html" class="btn btn-primary btn-lg" id="aboutEnrollTrigger"');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Cleaned up " + file);
    } else {
        console.log("File " + file + " not found.");
    }
});
