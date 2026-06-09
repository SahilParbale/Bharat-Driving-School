export interface Branch {
    id: string;
    name: string;
    title: string;
    address: string;
    phone: string;
    trainers: number;
    hours: string;
    mapEmbed: string;
}

export const BRANCHES_DATA: Branch[] = [
    {
        id: 'dhankwadi',
        name: 'Dhankwadi Branch',
        title: 'SHRI BHARAT MOTOR DRIVING SCHOOL',
        address: 'Shop No 5, Zambare Heritage Soc, Chavan Nagar, Dhankwadi, Pune - 411043',
        phone: '9922211238',
        trainers: 8,
        hours: 'Monday - Sunday: 7:00 AM - 9:00 PM',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.4447473919424!2d73.8545892!3d18.4635677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eaaa4a1238fb%3A0xea2b0c360db938b8!2sZambare%20Heritage!5e0!3m2!1sen!2sin!4v1686312384910!5m2!1sen!2sin'
    },
    {
        id: 'dhayari',
        name: 'Dhayari / Nanded City Branch',
        title: 'NEW BHARAT MOTOR DRIVING SCHOOL',
        address: 'Shop No 05, Nandgude Complex, Dhayari Phata, Near Nanded City Entrance, Pune - 411041',
        phone: '9922211238',
        trainers: 6,
        hours: 'Monday - Sunday: 7:00 AM - 9:00 PM',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.819385800049!2d73.7932822!3d18.4526365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2953ab8c2323f%3A0xbcf70e4d0361280b!2sDhayari%20Phata%2C%20Dhayari%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1686312384911!5m2!1sen!2sin'
    }
];

export function initBranchesSection(): void {
    const root = document.getElementById('branches-root');
    if (!root) return;

    // Render branch shell
    root.innerHTML = `
        <div class="branches-wrapper">
            <div class="branches-tabs" id="branch-tabs-container"></div>
            <div id="branch-content-container"></div>
        </div>
    `;

    const tabsContainer = document.getElementById('branch-tabs-container');
    const contentContainer = document.getElementById('branch-content-container');

    if (!tabsContainer || !contentContainer) return;

    // Render switcher tabs
    tabsContainer.innerHTML = BRANCHES_DATA.map((branch, index) => 
        `<button class="branch-tab ${index === 0 ? 'active' : ''}" data-branch-id="${branch.id}">${branch.name}</button>`
    ).join('');

    // Function to render active branch details
    const renderActiveBranch = (branchId: string) => {
        contentContainer.innerHTML = '';
        const branch = BRANCHES_DATA.find(b => b.id === branchId);
        if (!branch) return;

        const branchElement = document.createElement('div');
        branchElement.className = 'branch-content active';
        branchElement.innerHTML = `
            <div class="branch-details">
                <h3>${branch.title}</h3>
                
                <div class="branch-info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                        <h4>Branch Address</h4>
                        <p>${branch.address}</p>
                    </div>
                </div>
                
                <div class="branch-info-item">
                    <i class="fa-solid fa-phone"></i>
                    <div>
                        <h4>Contact Numbers</h4>
                        <p><a href="tel:+91${branch.phone}">+91 ${branch.phone}</a></p>
                    </div>
                </div>
                
                <div class="branch-info-item">
                    <i class="fa-solid fa-clock"></i>
                    <div>
                        <h4>Working Hours</h4>
                        <p>${branch.hours}</p>
                    </div>
                </div>
                
                <div class="branch-info-item">
                    <i class="fa-solid fa-user-tie"></i>
                    <div>
                        <h4>Available Staff</h4>
                        <p>${branch.trainers} Professional Instructors</p>
                    </div>
                </div>
            </div>
            
            <div class="branch-map">
                <iframe src="${branch.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        `;
        contentContainer.appendChild(branchElement);
    };

    // Initialize with first branch
    renderActiveBranch(BRANCHES_DATA[0].id);

    // Bind click events
    const tabs = tabsContainer.querySelectorAll('.branch-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const branchId = target.getAttribute('data-branch-id') || BRANCHES_DATA[0].id;

            tabs.forEach(t => t.classList.remove('active'));
            target.classList.add('active');

            renderActiveBranch(branchId);
        });
    });
}
