export interface Branch {
    id: string;
    name: string;
    title: string;
    address: string;
    phone: string;
    trainers: number;
    hours: string;
    mapEmbed: string;
    gmapsUrl: string;
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
        mapEmbed: 'https://maps.google.com/maps?q=18.471626,73.860086(Shri+Bharat+Motor+Driving+School+Chavan+Nagar)&t=&z=17&ie=UTF8&iwloc=A&output=embed',
        gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shri+Bharat+Motor+Driving+School+Chavan+Nagar+Dhankwadi+Pune'
    },
    {
        id: 'dhayari',
        name: 'Dhayari Branch',
        title: 'NEW BHARAT MOTOR DRIVING SCHOOL',
        address: 'Shop No 05, Nandgude Complex, Dhayari Phata, Near Nanded City Entrance, Pune - 411041',
        phone: '9922211238',
        trainers: 6,
        hours: 'Monday - Sunday: 7:00 AM - 9:00 PM',
        mapEmbed: 'https://maps.google.com/maps?q=18.455203,73.805541(New+Bharat+Motor+Driving+School+Dhayari+Phata)&t=&z=17&ie=UTF8&iwloc=A&output=embed',
        gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=New+Bharat+Motor+Driving+School+Dhayari+Phata+Pune'
    }
];

export function initBranchesSection(): void {
    const root = document.getElementById('branches-root');
    if (!root) return;

    // Render branch dashboard layout with absolute-positioned Open in Maps button overlay
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
            <div class="branches-map-console reveal" style="position: relative;">
                <div class="map-viewport" id="map-viewport-container"></div>
                
                <!-- Floating Open in Maps Button (Top Right) -->
                <a id="map-open-in-maps" href="#" target="_blank" class="map-open-maps-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" style="display: inline-block; vertical-align: middle;">
                        <path d="M12.29 2C8.26 2 5 5.26 5 9.29c0 5.47 7.29 12.71 7.29 12.71s7.29-7.24 7.29-12.71C19.58 5.26 16.32 2 12.29 2zm0 10A2.71 2.71 0 1 1 15 9.29 2.71 2.71 0 0 1 12.29 12z" fill="#ea4335" />
                        <path d="M12.29 6.58A2.71 2.71 0 0 0 9.58 9.29c0 .76.31 1.45.81 1.95L12.29 13l1.9-1.76c.5-.5.81-1.19.81-1.95a2.71 2.71 0 0 0-2.71-2.71z" fill="#4285f4" />
                        <path d="M12.29 6.58v5.42a2.71 2.71 0 0 0 2.71-2.71 2.71 2.71 0 0 0-2.71-2.71z" fill="#34a853" />
                        <path d="M12.29 12a2.71 2.71 0 0 1-2.71-2.71c0-1.5 1.21-2.71 2.71-2.71" fill="#fbbd05" />
                    </svg>
                    <span>Open in Maps</span>
                </a>
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

        // Update floating Open in Maps button URL
        const openMapsBtn = document.getElementById('map-open-in-maps') as HTMLAnchorElement;
        if (openMapsBtn) {
            openMapsBtn.href = branch.gmapsUrl;
        }
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
