import { COURSES_DATA, Course } from './courses';
import { BRANCHES_DATA } from './branches';
import { showToast } from '../utils/toast';

export function initEnrollPage() {
    const form = document.getElementById('enrollmentForm') as HTMLFormElement;
    if (!form) return;

    // DOM Elements
    const courseTabs = document.getElementById('courseTabs') as HTMLElement;
    const courseScroller = document.getElementById('courseScroller') as HTMLElement;
    const courseScrollerPrev = document.getElementById('courseScrollerPrev') as HTMLButtonElement;
    const courseScrollerNext = document.getElementById('courseScrollerNext') as HTMLButtonElement;
    
    const branchSearchInput = document.getElementById('branchSearchInput') as HTMLInputElement;
    const branchList = document.getElementById('branchList') as HTMLElement;
    
    const calPrevMonth = document.getElementById('calPrevMonth') as HTMLButtonElement;
    const calNextMonth = document.getElementById('calNextMonth') as HTMLButtonElement;
    const calMonthYear = document.getElementById('calMonthYear') as HTMLElement;
    const calDaysGrid = document.getElementById('calDaysGrid') as HTMLElement;
    const enrollStartDate = document.getElementById('enrollStartDate') as HTMLInputElement;
    
    const pickupAddressGroup = document.getElementById('pickupAddressGroup') as HTMLElement;
    const enrollAddress = document.getElementById('enrollAddress') as HTMLTextAreaElement;
    
    const llNumberGroup = document.getElementById('llNumberGroup') as HTMLElement;
    const enrollLLNumber = document.getElementById('enrollLLNumber') as HTMLInputElement;
    
    const enrollName = document.getElementById('enrollName') as HTMLInputElement;
    const enrollPhone = document.getElementById('enrollPhone') as HTMLInputElement;
    const enrollWhatsApp = document.getElementById('enrollWhatsApp') as HTMLInputElement;
    const enrollSpecialReqs = document.getElementById('enrollSpecialReqs') as HTMLTextAreaElement;
    const enrollEmail = document.getElementById('enrollEmail') as HTMLInputElement;
    const enrollStepper = document.getElementById('enrollStepper') as HTMLElement;

    // Summary Elements
    const sumCourse = document.getElementById('sumCourse') as HTMLElement;
    const sumBranch = document.getElementById('sumBranch') as HTMLElement;
    const sumDate = document.getElementById('sumDate') as HTMLElement;
    const sumTime = document.getElementById('sumTime') as HTMLElement;
    const sumPickup = document.getElementById('sumPickup') as HTMLElement;
    const sumAddr = document.getElementById('sumAddr') as HTMLElement;
    const sumTotal = document.getElementById('sumTotal') as HTMLElement;

    // Render branches dynamically
    branchList.innerHTML = BRANCHES_DATA.map((branch, index) => `
        <label class="branch-radio ${index === 0 ? 'active' : ''}">
            <input type="radio" name="enrollBranch" value="${branch.id}" ${index === 0 ? 'checked' : ''}>
            <div class="br-content">
                <strong>${branch.title}</strong>
                <span style="font-size:0.7rem; color:var(--color-text-muted); line-height: 1.25; margin-top: 0.15rem;">${branch.address}</span>
                ${branch.id === 'dhankwadi' ? '<span class="br-badge" style="align-self: flex-start; margin-top: 0.25rem;">Most Popular</span>' : ''}
            </div>
        </label>
    `).join('');

    // State Variables
    let selectedCourseId = 'car-basic';
    let selectedCourseName = '';
    let selectedCoursePrice = 0;
    let selectedCustomAddons: string[] = [];
    let customDetails: any = null;

    let selectedDate = new Date();
    // Default selected date: tomorrow
    selectedDate.setDate(selectedDate.getDate() + 1);
    
    let currentCalendarMonth = selectedDate.getMonth();
    let currentCalendarYear = selectedDate.getFullYear();

    // -----------------------------------------
    // 1. Helper: Setup Custom Radio Group Active Classes
    // -----------------------------------------
    function setupRadioGroup(container: HTMLElement, labelClass: string, nameAttribute: string, onChange?: (value: string) => void) {
        const labels = container.querySelectorAll(`.${labelClass}`);
        labels.forEach(label => {
            const input = label.querySelector(`input[name="${nameAttribute}"]`) as HTMLInputElement;
            if (input) {
                // Initial styling
                if (input.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }

                // Handle click on the label
                label.addEventListener('click', () => {
                    // Check input if not already checked
                    if (!input.checked) {
                        input.checked = true;
                        // Fire change event manually so radio change listeners catch it
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }
        });

        // Delegate change event on the container
        container.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target && target.name === nameAttribute) {
                labels.forEach(lbl => {
                    const inp = lbl.querySelector(`input[name="${nameAttribute}"]`) as HTMLInputElement;
                    if (inp && inp.checked) {
                        lbl.classList.add('active');
                    } else {
                        lbl.classList.remove('active');
                    }
                });
                if (onChange) {
                    onChange(target.value);
                }
            }
        });
    }

    // -----------------------------------------
    // 2. Prefill & Custom Quote Loader
    // -----------------------------------------
    function loadPrefills() {
        // Check localStorage for quote calculation details
        try {
            const stored = localStorage.getItem('bmds_custom_enroll');
            if (stored) {
                customDetails = JSON.parse(stored);
                localStorage.removeItem('bmds_custom_enroll'); // clear it
            }
        } catch (e) {
            console.error('Error reading localStorage', e);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const prefillCourseId = urlParams.get('course');

        if (customDetails) {
            selectedCourseId = 'custom';
            selectedCourseName = `Custom ${customDetails.vehicle} Course`;
            selectedCoursePrice = customDetails.price;
            selectedCustomAddons = customDetails.addons || [];
            
            // If custom quote contains Doorstep Pickup, toggle pickup option to yes
            if (selectedCustomAddons.includes('Doorstep Pickup')) {
                const yesRadio = document.querySelector('input[name="pickupReq"][value="yes"]') as HTMLInputElement;
                if (yesRadio) {
                    yesRadio.checked = true;
                    yesRadio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            
            // Select Combo/Premium tab
            switchTab('combo');
        } else if (prefillCourseId) {
            const matched = COURSES_DATA.find(c => c.id === prefillCourseId);
            if (matched) {
                selectedCourseId = matched.id;
                selectedCourseName = matched.title;
                selectedCoursePrice = matched.price;
                switchTab(matched.category);
            } else {
                // Fallback to basic
                setDefaultCourse();
            }
        } else {
            setDefaultCourse();
        }
    }

    function setDefaultCourse() {
        const firstCourse = COURSES_DATA.find(c => c.category === 'car') || COURSES_DATA[0];
        selectedCourseId = firstCourse.id;
        selectedCourseName = firstCourse.title;
        selectedCoursePrice = firstCourse.price;
        switchTab('car');
    }

    function switchTab(category: string) {
        const tabs = courseTabs.querySelectorAll('.course-tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-category') === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        renderCourses(category);
    }

    // -----------------------------------------
    // 3. Dynamic Course Render
    // -----------------------------------------
    function renderCourses(category: string) {
        courseScroller.innerHTML = '';
        
        // Filter standard courses
        const filtered = COURSES_DATA.filter(c => c.category === category);
        
        // If combo category and customDetails exists, add custom card at the beginning
        if (category === 'combo' && customDetails) {
            const customCard = createCourseCard({
                id: 'custom',
                title: `Custom ${customDetails.vehicle} Package`,
                category: 'combo',
                price: customDetails.price,
                duration: `${customDetails.days} Days`,
                sessions: `${customDetails.days} Sessions`,
                features: [
                    `${customDetails.vehicle} Class`,
                    `${customDetails.days} Training Days`,
                    ...customDetails.addons
                ],
                image: 'assets/services/img3.jpg',
                badge: 'Custom Quote'
            }, true);
            courseScroller.appendChild(customCard);
        }

        // Render normal course cards
        filtered.forEach(course => {
            const card = createCourseCard(course, false);
            courseScroller.appendChild(card);
        });

        // Initialize click logic on newly rendered course cards
        setupRadioGroup(courseScroller, 'course-select-card', 'enrollCourse', (courseId) => {
            selectedCourseId = courseId;
            if (courseId === 'custom' && customDetails) {
                selectedCourseName = `Custom ${customDetails.vehicle} Course`;
                selectedCoursePrice = customDetails.price;
            } else {
                const matched = COURSES_DATA.find(c => c.id === courseId);
                if (matched) {
                    selectedCourseName = matched.title;
                    selectedCoursePrice = matched.price;
                }
            }
            updateSummary();
        });

        // Auto-scroll scroller to the active course card
        setTimeout(() => {
            const activeCard = courseScroller.querySelector('.course-select-card.active') as HTMLElement;
            if (activeCard) {
                courseScroller.scrollLeft = activeCard.offsetLeft - (courseScroller.clientWidth / 2) + (activeCard.clientWidth / 2);
            }
            updateScrollerArrows();
        }, 50);
    }

    function createCourseCard(course: Course, isCustomQuote: boolean): HTMLElement {
        const label = document.createElement('label');
        const isActive = selectedCourseId === course.id;
        label.className = `course-select-card ${isActive ? 'active' : ''}`;
        
        let badgeHtml = '';
        if (isCustomQuote) {
            badgeHtml = `<div class="most-popular-badge">CUSTOM QUOTE <i class="fa-solid fa-calculator"></i></div>`;
        } else if (course.badge) {
            badgeHtml = `<div class="most-popular-badge">${course.badge.toUpperCase()} <i class="fa-solid fa-star"></i></div>`;
        }

        // Map icons
        let iconClass = 'fa-solid fa-car';
        if (course.id.includes('sedan')) iconClass = 'fa-solid fa-car-rear';
        else if (course.id.includes('suv')) iconClass = 'fa-solid fa-car-side';
        else if (course.id.includes('own')) iconClass = 'fa-solid fa-car-side';
        else if (course.id.includes('bike') || course.id.includes('wheeler')) iconClass = 'fa-solid fa-motorcycle';
        else if (course.id.includes('rto') || course.id.includes('license')) iconClass = 'fa-regular fa-file-lines';
        else if (course.id.includes('combo')) iconClass = 'fa-solid fa-star';
        else if (course.id.includes('fast') || course.id.includes('premium-fast')) iconClass = 'fa-solid fa-bolt';
        else if (isCustomQuote) iconClass = 'fa-solid fa-sliders';

        const featuresListHtml = course.features
            .map(feat => `<li><i class="fa-solid fa-circle-check"></i> ${feat}</li>`)
            .join('');

        label.innerHTML = `
            ${badgeHtml}
            <input type="radio" name="enrollCourse" value="${course.id}" ${isActive ? 'checked' : ''}>
            <div class="csc-icon"><i class="${iconClass}"></i></div>
            <h3>${course.title}</h3>
            <div class="csc-price">₹${course.price.toLocaleString('en-IN')}</div>
            <ul class="csc-features">
                ${featuresListHtml}
            </ul>
        `;

        return label;
    }

    // -----------------------------------------
    // 4. Horizontal Scroller Navigation
    // -----------------------------------------
    function updateScrollerArrows() {
        const scrollLeft = courseScroller.scrollLeft;
        const maxScroll = courseScroller.scrollWidth - courseScroller.clientWidth;
        
        if (scrollLeft <= 5) {
            courseScrollerPrev.style.display = 'none';
        } else {
            courseScrollerPrev.style.display = 'flex';
        }

        if (scrollLeft >= maxScroll - 5) {
            courseScrollerNext.style.display = 'none';
        } else {
            courseScrollerNext.style.display = 'flex';
        }
    }

    courseScroller.addEventListener('scroll', updateScrollerArrows);
    window.addEventListener('resize', updateScrollerArrows);

    courseScrollerNext.addEventListener('click', () => {
        courseScroller.scrollBy({ left: 220, behavior: 'smooth' });
    });

    courseScrollerPrev.addEventListener('click', () => {
        courseScroller.scrollBy({ left: -220, behavior: 'smooth' });
    });

    // Course tabs click logic
    const tabs = courseTabs.querySelectorAll('.course-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category') || 'car';
            switchTab(category);
            
            // When tab switches, auto select first course in that tab
            const categoryCourses = COURSES_DATA.filter(c => c.category === category);
            if (category === 'combo' && customDetails) {
                selectedCourseId = 'custom';
                selectedCourseName = `Custom ${customDetails.vehicle} Course`;
                selectedCoursePrice = customDetails.price;
            } else if (categoryCourses.length > 0) {
                const first = categoryCourses[0];
                selectedCourseId = first.id;
                selectedCourseName = first.title;
                selectedCoursePrice = first.price;
            }
            
            renderCourses(category);
            updateSummary();
        });
    });

    // -----------------------------------------
    // 5. Custom Calendar Logic
    // -----------------------------------------
    function renderCalendar(month: number, year: number) {
        calDaysGrid.innerHTML = '';
        
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        calMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Get first day of the month
        const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday
        // Convert to Monday start (0=Mon, 1=Tue, ..., 6=Sun)
        const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        
        // Days in current month
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        // Render blank spaces for previous month's padding
        for (let i = 0; i < adjustedFirstDay; i++) {
            const span = document.createElement('span');
            span.className = 'cal-day-empty';
            calDaysGrid.appendChild(span);
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0);

        // Render current month days
        for (let day = 1; day <= totalDays; day++) {
            const span = document.createElement('span');
            span.textContent = day.toString();
            
            const thisDate = new Date(year, month, day);
            thisDate.setHours(0,0,0,0);

            // Disable past dates and today (min booking date is tomorrow)
            if (thisDate < tomorrow) {
                span.style.opacity = '0.3';
                span.style.cursor = 'not-allowed';
                span.title = "Past dates cannot be selected";
            } else {
                span.classList.add('cal-day-selectable');
                
                // Highlight selected date
                if (
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year
                ) {
                    span.classList.add('active');
                }
                
                // Select date click listener
                span.addEventListener('click', () => {
                    const selectable = calDaysGrid.querySelectorAll('.cal-day-selectable');
                    selectable.forEach(s => s.classList.remove('active'));
                    span.classList.add('active');
                    
                    selectedDate = new Date(year, month, day);
                    const yyyy = selectedDate.getFullYear();
                    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(selectedDate.getDate()).padStart(2, '0');
                    enrollStartDate.value = `${yyyy}-${mm}-${dd}`;
                    
                    updateSummary();
                });
            }
            calDaysGrid.appendChild(span);
        }

        // Set hidden value if not already set
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        enrollStartDate.value = `${yyyy}-${mm}-${dd}`;
    }

    calPrevMonth.addEventListener('click', () => {
        currentCalendarMonth--;
        if (currentCalendarMonth < 0) {
            currentCalendarMonth = 11;
            currentCalendarYear--;
        }
        renderCalendar(currentCalendarMonth, currentCalendarYear);
    });

    calNextMonth.addEventListener('click', () => {
        currentCalendarMonth++;
        if (currentCalendarMonth > 11) {
            currentCalendarMonth = 0;
            currentCalendarYear++;
        }
        renderCalendar(currentCalendarMonth, currentCalendarYear);
    });

    // -----------------------------------------
    // 6. Branch Search Filtering
    // -----------------------------------------
    branchSearchInput.addEventListener('input', () => {
        const query = branchSearchInput.value.toLowerCase().trim();
        const branchLabels = branchList.querySelectorAll('.branch-radio');
        
        branchLabels.forEach(label => {
            const strongElement = label.querySelector('strong');
            if (strongElement) {
                const branchText = strongElement.textContent?.toLowerCase() || '';
                if (branchText.includes(query)) {
                    (label as HTMLElement).style.display = 'flex';
                } else {
                    (label as HTMLElement).style.display = 'none';
                }
            }
        });
    });

    // -----------------------------------------
    // 7. Radio Groups & Event Listeners
    // -----------------------------------------
    setupRadioGroup(branchList, 'branch-radio', 'enrollBranch', () => updateSummary());
    
    const timeSlotContainer = document.querySelector('.timeslot-list') as HTMLElement;
    if (timeSlotContainer) {
        setupRadioGroup(timeSlotContainer, 'timeslot-radio', 'enrollTime', () => updateSummary());
    }

    const pickupContainer = document.querySelector('.pickup-radios') as HTMLElement;
    if (pickupContainer) {
        setupRadioGroup(pickupContainer, 'pu-radio', 'pickupReq', (value) => {
            if (value === 'yes') {
                pickupAddressGroup.style.display = 'block';
                enrollAddress.required = true;
            } else {
                pickupAddressGroup.style.display = 'none';
                enrollAddress.required = false;
                enrollAddress.value = '';
            }
            updateSummary();
        });
    }

    const llContainer = document.querySelector('.ll-radios') as HTMLElement;
    if (llContainer) {
        setupRadioGroup(llContainer, 'll-radio', 'hasLL', (value) => {
            if (value === 'yes') {
                llNumberGroup.style.display = 'block';
                enrollLLNumber.required = true;
            } else {
                llNumberGroup.style.display = 'none';
                enrollLLNumber.required = false;
                enrollLLNumber.value = '';
            }
        });
    }

    enrollAddress.addEventListener('input', () => updateSummary());
    enrollName.addEventListener('input', () => updateSummary());
    enrollPhone.addEventListener('input', () => updateSummary());

    // -----------------------------------------
    // 8. Stepper Scrolling & ScrollSpy
    // -----------------------------------------
    const stepperItems = enrollStepper.querySelectorAll('.step-item');
    let lastActiveStep = 1;

    function updateStepper(activeStep: number) {
        stepperItems.forEach(item => {
            const stepNum = parseInt(item.getAttribute('data-step') || '1');
            const circle = item.querySelector('.step-circle') as HTMLElement;
            if (!circle) return;

            // Determine if this step is "completed"
            let isCompleted = false;
            if (stepNum === 1) {
                isCompleted = selectedCourseId !== '';
            } else if (stepNum === 2) {
                isCompleted = selectedDate !== null;
            } else if (stepNum === 3) {
                const nameVal = enrollName.value.trim();
                const phoneVal = enrollPhone.value.trim();
                const phoneRegex = /^[6-9]\d{9}$/;
                isCompleted = nameVal !== '' && phoneRegex.test(phoneVal);
            }

            if (isCompleted) {
                circle.innerHTML = '<i class="fa-solid fa-check" style="font-size: 0.8rem;"></i>';
                circle.style.backgroundColor = '#10B981'; // Green for complete
                circle.style.borderColor = '#10B981';
                circle.style.color = '#fff';
            } else {
                circle.textContent = stepNum.toString();
                // Reset styles to default
                circle.style.backgroundColor = '';
                circle.style.borderColor = '';
                circle.style.color = '';
            }

            // Set active item styling
            if (stepNum === activeStep) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }

            // If active or completed, full opacity. Otherwise default dim.
            if (stepNum === activeStep || isCompleted) {
                (item as HTMLElement).style.opacity = '1';
            } else {
                (item as HTMLElement).style.opacity = '';
            }
        });
    }

    stepperItems.forEach(item => {
        item.addEventListener('click', () => {
            const stepNum = item.getAttribute('data-step');
            let targetCard: HTMLElement | null = null;
            if (stepNum === '1') targetCard = document.getElementById('stepCard1');
            else if (stepNum === '2') targetCard = document.getElementById('stepCard2');
            else if (stepNum === '3') targetCard = document.getElementById('stepCard3');
            else if (stepNum === '4') targetCard = document.querySelector('.booking-summary-card') as HTMLElement;

            if (targetCard) {
                const headerHeight = 90; // sticky header padding
                const targetPosition = targetCard.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scrollspy to set active stepper item based on viewport scroll
    window.addEventListener('scroll', () => {
        const step1 = document.getElementById('stepCard1');
        const step2 = document.getElementById('stepCard2');
        const step3 = document.getElementById('stepCard3');
        const sumCard = document.querySelector('.booking-summary-card') as HTMLElement;

        if (!step1 || !step2 || !step3) return;

        const scrollPos = window.scrollY + 180; // offset for detection
        let activeStep = 1;

        if (sumCard && scrollPos >= sumCard.getBoundingClientRect().top + window.scrollY - 150) {
            activeStep = 4;
        } else if (scrollPos >= step3.offsetTop) {
            activeStep = 3;
        } else if (scrollPos >= step2.offsetTop) {
            activeStep = 2;
        } else {
            activeStep = 1;
        }

        lastActiveStep = activeStep;
        updateStepper(activeStep);
    });

    // -----------------------------------------
    // 9. Booking Summary Renderer
    // -----------------------------------------
    function updateSummary() {
        // 1. Course Name & Total
        if (sumCourse) sumCourse.textContent = selectedCourseName;
        if (sumTotal) sumTotal.textContent = `₹${selectedCoursePrice.toLocaleString('en-IN')}`;

        // 2. Branch Name
        const activeBranch = branchList.querySelector('.branch-radio.active') as HTMLElement;
        if (activeBranch && sumBranch) {
            const bName = activeBranch.querySelector('strong')?.textContent || '';
            sumBranch.textContent = bName;
        }

        // 3. Start Date
        if (sumDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            const formattedDay = selectedDate.toLocaleDateString('en-IN', { weekday: 'long' });
            sumDate.innerHTML = `${formattedDate}<br><span style="font-size:0.75rem; color:#94A3B8; font-weight:normal;">(${formattedDay})</span>`;
        }

        // 4. Time Slot
        const activeTimeSlot = document.querySelector('.timeslot-radio.active') as HTMLElement;
        if (activeTimeSlot && sumTime) {
            const slotTitle = activeTimeSlot.querySelector('strong')?.textContent || '';
            const slotHours = activeTimeSlot.querySelector('span')?.textContent || '';
            sumTime.innerHTML = `${slotTitle}<br><span style="font-size:0.75rem; color:#94A3B8; font-weight:normal;">(${slotHours})</span>`;
        }

        // 5. Pickup Address
        const pickupRadio = document.querySelector('input[name="pickupReq"]:checked') as HTMLInputElement;
        const pickupVal = pickupRadio ? pickupRadio.value : 'yes';
        
        if (sumPickup) {
            sumPickup.textContent = pickupVal === 'yes' ? 'Yes' : 'Self-Arrival';
        }

        const addressSummaryRow = document.querySelector('.pu-address') as HTMLElement;
        if (addressSummaryRow) {
            if (pickupVal === 'yes') {
                addressSummaryRow.style.display = 'flex';
                if (sumAddr) {
                    const text = enrollAddress.value.trim();
                    sumAddr.innerHTML = text ? text.replace(/\n/g, '<br>') : '<span style="color:#EF4444; font-style:italic;">Address required</span>';
                }
            } else {
                addressSummaryRow.style.display = 'none';
            }
        }

        // Update stepper checkmarks
        updateStepper(lastActiveStep);
    }

    // -----------------------------------------
    // 10. Form Validation & Submission to WhatsApp
    // -----------------------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = enrollName.value.trim();
        const phoneVal = enrollPhone.value.trim();
        const emailVal = enrollEmail.value.trim() || 'Not provided';
        const addressVal = enrollAddress.value.trim() || 'Not provided';
        
        const hasLLRadio = document.querySelector('input[name="hasLL"]:checked') as HTMLInputElement;
        const hasLL = hasLLRadio ? hasLLRadio.value : 'yes';
        const llNumberVal = enrollLLNumber.value.trim() || 'Not provided';
        
        const whatsAppVal = enrollWhatsApp.value.trim() || 'Not provided';
        const specialReqsVal = enrollSpecialReqs.value.trim() || 'No special requirements';

        // Validation checks
        if (!nameVal) {
            showToast('Please enter your full name.', 'error');
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneVal)) {
            showToast('Please enter a valid 10-digit mobile number.', 'error');
            return;
        }

        if (whatsAppVal !== 'Not provided' && !phoneRegex.test(whatsAppVal)) {
            showToast('Please enter a valid 10-digit WhatsApp number or leave it empty.', 'error');
            return;
        }

        const pickupRadio = document.querySelector('input[name="pickupReq"]:checked') as HTMLInputElement;
        const pickupVal = pickupRadio ? pickupRadio.value : 'yes';
        if (pickupVal === 'yes' && addressVal === 'Not provided') {
            showToast('Please enter your pickup address.', 'error');
            return;
        }

        if (hasLL === 'yes' && llNumberVal === 'Not provided') {
            showToast('Please enter your Learner\'s License Number.', 'error');
            return;
        }

        // Fetch selected Branch Name
        const activeBranch = branchList.querySelector('.branch-radio.active') as HTMLElement;
        const branchName = activeBranch ? activeBranch.querySelector('strong')?.textContent || 'Main' : 'Main';

        // Fetch selected Time Slot
        const activeTimeSlot = document.querySelector('.timeslot-radio.active') as HTMLElement;
        const timeSlotTitle = activeTimeSlot ? activeTimeSlot.querySelector('strong')?.textContent || 'Morning' : 'Morning';
        const timeSlotHours = activeTimeSlot ? activeTimeSlot.querySelector('span')?.textContent || '' : '';

        // Formatted Date
        const dateString = selectedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });

        // WhatsApp message styling using bullet points and headers
        const text = `*BHARAT MOTOR DRIVING SCHOOL*
*New Course Enrollment Reservation*
----------------------------------------
*1. Customer Information:*
• *Full Name:* ${nameVal}
• *Mobile Number:* +91 ${phoneVal}
• *WhatsApp Number:* ${whatsAppVal !== 'Not provided' ? '+91 ' + whatsAppVal : 'Same as Mobile'}
• *Email Address:* ${emailVal}

*2. License Status:*
• *Has Learner's License:* ${hasLL === 'yes' ? 'Yes' : 'No'}
• *Learner License No.:* ${hasLL === 'yes' ? llNumberVal : 'N/A (Apply Assistance Required)'}

*3. Selected Course & Pricing:*
• *Training Program:* ${selectedCourseName}
• *Estimated Package Cost:* ₹${selectedCoursePrice.toLocaleString('en-IN')}

*4. Schedule & Branch Details:*
• *Training Branch:* ${branchName}
• *Preferred Start Date:* ${dateString}
• *Preferred Time Slot:* ${timeSlotTitle} (${timeSlotHours})

*5. Logistics & Pick-up:*
• *Doorstep Pick-up Required:* ${pickupVal === 'yes' ? 'Yes' : 'No (Self-Arrival at Branch)'}
• *Pickup Address:* ${pickupVal === 'yes' ? addressVal : 'N/A'}

*6. Special Requests / Comments:*
• *Notes:* ${specialReqsVal}
----------------------------------------
_Reservation request sent from Driving School web portal._`;

        const encodedText = encodeURIComponent(text);
        const whatsappNumber = '919922211238'; // Direct Coordinator WhatsApp number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

        // Reset form and UI first
        form.reset();
        loadPrefills();
        updateSummary();

        // Redirect user
        showToast('Thank you! Redirecting you to WhatsApp to complete your reservation...', 'success');
        setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 1500);
    });

    // Initialize components
    loadPrefills();
    renderCalendar(currentCalendarMonth, currentCalendarYear);
    updateSummary();

    // Trigger initial states for LL & Pickup block visibility
    const activeLLRadio = document.querySelector('input[name="hasLL"]:checked') as HTMLInputElement;
    if (activeLLRadio) {
        if (activeLLRadio.value === 'yes') {
            llNumberGroup.style.display = 'block';
            enrollLLNumber.required = true;
        } else {
            llNumberGroup.style.display = 'none';
            enrollLLNumber.required = false;
        }
    }

    const activePickupRadio = document.querySelector('input[name="pickupReq"]:checked') as HTMLInputElement;
    if (activePickupRadio) {
        if (activePickupRadio.value === 'yes') {
            pickupAddressGroup.style.display = 'block';
            enrollAddress.required = true;
        } else {
            pickupAddressGroup.style.display = 'none';
            enrollAddress.required = false;
        }
    }
}
