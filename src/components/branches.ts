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
        mapEmbed: 'https://maps.google.com/maps?q=Shri+Bharat+Motor+Driving+School+Chavan+Nagar+Dhankwadi+Pune&t=&z=17&ie=UTF8&iwloc=&output=embed'
    },
    {
        id: 'dhayari',
        name: 'Dhayari Branch',
        title: 'NEW BHARAT MOTOR DRIVING SCHOOL',
        address: 'Shop No 05, Nandgude Complex, Dhayari Phata, Near Nanded City Entrance, Pune - 411041',
        phone: '9922211238',
        trainers: 6,
        hours: 'Monday - Sunday: 7:00 AM - 9:00 PM',
        mapEmbed: 'https://maps.google.com/maps?q=New+Bharat+Motor+Driving+School+Dhayari+Phata+Pune&t=&z=17&ie=UTF8&iwloc=&output=embed'
    }
];

export function initBranchesSection(): void {
    const root = document.getElementById('branches-root');
    if (!root) return;

    // Render branch dashboard layout
    root.innerHTML = `
        <div class="branches-dashboard">
            <!-- Left Panel: Selector Cards -->
            <div class="branches-selector-list" id="branches-list-container">
                ${BRANCHES_DATA.map((branch, index) => `
                    <div class="branch-selector-card ${index === 0 ? 'selected' : ''} reveal" data-branch-id="${branch.id}">
                        <div class="branch-card-header">
                            <span class="branch-badge">Active Campus</span>
                            <h3 style="font-size:1.25rem; font-weight:700;">${branch.name}</h3>
                        </div>
                        <p class="branch-card-address">${branch.address}</p>
                        <div class="branch-card-meta">
                            <span><i class="fa-solid fa-user-tie"></i> ${branch.trainers} Trainers</span>
                            <span><i class="fa-solid fa-clock"></i> 7 AM - 9 PM</span>
                        </div>
                        <div class="branch-card-footer">
                            <a href="tel:+91${branch.phone}" class="branch-call-btn"><i class="fa-solid fa-phone"></i> Call</a>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Right Panel: Interactive Maps Viewport -->
            <div class="branches-map-console reveal">
                <div class="map-viewport" id="map-viewport-container"></div>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('branches-list-container');
    const mapContainer = document.getElementById('map-viewport-container');

    if (!listContainer || !mapContainer) return;

    // Function to render map for the active branch
    const renderActiveMap = (branchId: string) => {
        const branch = BRANCHES_DATA.find(b => b.id === branchId);
        if (!branch || !mapContainer) return;

        mapContainer.innerHTML = `
            <iframe src="${branch.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%; height:100%; border:none;"></iframe>
        `;
    };

    // Initialize with first branch map
    renderActiveMap(BRANCHES_DATA[0].id);

    // Bind selector click events
    const selectorCards = listContainer.querySelectorAll('.branch-selector-card');
    selectorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            
            // Check if user clicked a link (phone support) inside card
            const clickedLink = (e.target as HTMLElement).closest('a');
            if (clickedLink) return; // Allow natural anchor link clicking

            const branchId = target.getAttribute('data-branch-id') || BRANCHES_DATA[0].id;

            selectorCards.forEach(c => c.classList.remove('selected'));
            target.classList.add('selected');

            renderActiveMap(branchId);
        });
    });
}
