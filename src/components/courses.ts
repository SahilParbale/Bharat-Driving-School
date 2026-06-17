export interface Course {
    id: string;
    title: string;
    category: 'car' | 'bike' | 'combo' | 'license';
    price: number;
    duration: string;
    sessions: string;
    features: string[];
    image: string;
    badge?: string;
}

export const COURSES_DATA: Course[] = [
    {
        id: 'car-basic',
        title: 'Beginner Car Training (Hatchback)',
        category: 'car',
        price: 3500,
        duration: '15 Days',
        sessions: '15 Live Sessions',
        features: [
            'Basic controls & steering alignment',
            'Doorstep pick-up & drop service',
            'Defensive driving techniques',
            'RTO Learning license application support',
            'Single trainer assignment'
        ],
        image: 'assets/services/img1.jpg',
        badge: 'Most Popular'
    },
    {
        id: 'car-sedan',
        title: 'Premium Sedan Course',
        category: 'car',
        price: 5000,
        duration: '21 Days',
        sessions: '21 Live Sessions',
        features: [
            'Traffic driving & Highway training',
            'Doorstep pick-up & drop service',
            'Advanced parallel & reverse parking',
            'Night driving session (1 Hour)',
            'Full RTO license assistance & test car'
        ],
        image: 'assets/services/img2.jpg',
        badge: 'Best Value'
    },
    {
        id: 'car-suv',
        title: 'SUV Mastery Training',
        category: 'car',
        price: 6500,
        duration: '15 Days',
        sessions: '15 Live Sessions',
        features: [
            'Heavy vehicle dimensions estimation',
            'Doorstep pick-up & drop service',
            'Uphill controls & slope techniques',
            'Complex parking solutions',
            'Official RTO passing guidance'
        ],
        image: 'assets/services/img3.jpg',
        badge: 'Premium'
    },
    {
        id: 'car-own',
        title: 'Own Vehicle Training',
        category: 'car',
        price: 2500,
        duration: '15 Days',
        sessions: '15 Live Sessions',
        features: [
            'Train in Your Own Car',
            'Instructor Support & Tips',
            'Flexible Booking Times',
            'Confidence on Heavy Traffic Roads'
        ],
        image: 'assets/services/img1.jpg'
    },
    {
        id: 'two-wheeler',
        title: 'Two-Wheeler Driving (Bike/Scooter)',
        category: 'bike',
        price: 1800,
        duration: '10 Days',
        sessions: '10 Live Sessions',
        features: [
            'Geared & Non-Geared options',
            'Balance training & figure-8 testing',
            'Traffic rules & emergency braking',
            'RTO learning license prep',
            'Personal training track'
        ],
        image: 'assets/services/img4.jpg'
    },
    {
        id: 'rto-package',
        title: 'RTO Assistance Package',
        category: 'license',
        price: 1500,
        duration: '1 Day',
        sessions: 'RTO Support',
        features: [
            'Official RTO Documentation Help',
            'Online Application Form Filling',
            'Learning License Slot Booking Assistance'
        ],
        image: 'assets/services/img2.jpg'
    },
    {
        id: 'combo-master',
        title: 'Combo Driving Mastery (Car + Bike)',
        category: 'combo',
        price: 5500,
        duration: '25 Days',
        sessions: '25 Live Sessions',
        features: [
            'Comprehensive manual car + bike training',
            'Doorstep pick-up & drop (for car)',
            'Complete theoretical road signs library',
            'Double license processing support',
            'Full mock test practices'
        ],
        image: 'assets/services/img5.jpg',
        badge: 'Super Saver'
    },
    {
        id: 'premium-fast',
        title: 'Premium Fast Track',
        category: 'combo',
        price: 5999,
        duration: '15 Days',
        sessions: '15 Express Batches',
        features: [
            'License & Passing in 15 Days',
            'Priority Time Slot Scheduling',
            'Comprehensive Personal Coordinator'
        ],
        image: 'assets/services/img3.jpg',
        badge: 'Fast Track'
    }
];

export function initCoursesSection(onBookClick: (courseId: string) => void): void {
    const root = document.getElementById('courses-root');
    if (!root) return;

    // Render filter tabs & card container skeletons
    root.innerHTML = `
        <div class="filter-tabs">
            <button class="filter-tab active" data-filter="all">All Packages</button>
            <button class="filter-tab" data-filter="car">Four-Wheelers (Car)</button>
            <button class="filter-tab" data-filter="bike">Two-Wheelers (Bike)</button>
            <button class="filter-tab" data-filter="combo">Combo Offers</button>
        </div>
        <div class="course-list-horizontal" id="courses-grid-container"></div>
    `;

    const gridContainer = document.getElementById('courses-grid-container');
    if (!gridContainer) return;

    // Function to render cards based on filter
    const renderCards = (filter: string) => {
        gridContainer.innerHTML = '';
        const filtered = filter === 'all' 
            ? COURSES_DATA 
            : COURSES_DATA.filter(c => c.category === filter);

        filtered.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card-horizontal reveal';
            
            // Build features HTML list
            const featuresHtml = course.features
                .map(feat => `<li><i class="fa-solid fa-circle-check"></i> ${feat}</li>`)
                .join('');

            card.innerHTML = `
                <div class="course-img-area">
                    <img src="${course.image}" alt="${course.title}">
                    ${course.badge ? `<span class="course-img-badge">${course.badge}</span>` : ''}
                </div>
                <div class="course-info-area">
                    <h3>${course.title}</h3>
                    <div class="course-meta-pills">
                        <span class="meta-pill"><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                        <span class="meta-pill"><i class="fa-solid fa-road"></i> ${course.sessions}</span>
                        <span class="meta-pill"><i class="fa-solid fa-car-side"></i> ${course.category}</span>
                    </div>
                    <ul class="course-features-list">
                        ${featuresHtml}
                    </ul>
                </div>
                <div class="course-action-area">
                    <div class="course-price-box">
                        <span class="price-lbl">Full Package</span>
                        <span class="price-val">₹${course.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button class="btn btn-primary book-btn" style="width: 100%;" data-id="${course.id}">Book Training</button>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        // Trigger animations
        setTimeout(() => {
            const cards = gridContainer.querySelectorAll('.course-card-horizontal');
            cards.forEach(c => c.classList.add('active'));
        }, 50);

        // Bind Booking clicks
        const bookButtons = gridContainer.querySelectorAll('.book-btn');
        bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const id = target.getAttribute('data-id');
                if (id) onBookClick(id);
            });
        });
    };

    // Initialize with all
    renderCards('all');

    // Filter switching events
    const tabs = root.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const filter = target.getAttribute('data-filter') || 'all';

            tabs.forEach(t => t.classList.remove('active'));
            target.classList.add('active');

            renderCards(filter);
        });
    });
}
