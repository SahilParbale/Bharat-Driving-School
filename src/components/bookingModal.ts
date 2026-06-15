import { COURSES_DATA } from './courses';

class CustomDropdownWrapper {
    private select: HTMLSelectElement;
    private wrapper: HTMLDivElement | null = null;
    private trigger: HTMLButtonElement | null = null;
    private menu: HTMLDivElement | null = null;
    private items: HTMLDivElement[] = [];

    constructor(selectId: string) {
        this.select = document.getElementById(selectId) as HTMLSelectElement;
        if (!this.select) throw new Error(`Select element with ID ${selectId} not found`);

        // Create container wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-dropdown';

        // Insert wrapper before the select and move select inside it
        this.select.parentNode?.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);

        // Hide original select
        this.select.style.display = 'none';

        // Create trigger button
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'dropdown-trigger';
        this.trigger.style.width = '100%';
        this.trigger.style.textAlign = 'left';
        this.trigger.style.display = 'flex';
        this.trigger.style.justifyContent = 'space-between';
        this.trigger.style.alignItems = 'center';
        
        const triggerText = document.createElement('span');
        triggerText.className = 'selected-text';
        this.trigger.appendChild(triggerText);

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-chevron-down';
        this.trigger.appendChild(icon);

        this.wrapper.appendChild(this.trigger);

        // Create menu
        this.menu = document.createElement('div');
        this.menu.className = 'dropdown-menu';
        this.menu.style.width = '100%';
        this.wrapper.appendChild(this.menu);

        this.initEvents();
        this.syncWithOptions();
    }

    private initEvents() {
        if (!this.trigger) return;

        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        document.addEventListener('click', () => {
            this.close();
        });

        // Sync back if select value changes programmatically
        this.select.addEventListener('change', () => {
            this.updateSelectedDisplay();
        });
    }

    public syncWithOptions() {
        const menu = this.menu;
        if (!menu) return;
        menu.innerHTML = '';
        this.items = [];

        Array.from(this.select.options).forEach((option) => {
            // Check if option is visible (we set display: none on the custom calculator option in some flows)
            if (option.style.display === 'none') return;

            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = option.text;
            item.setAttribute('data-value', option.value);

            if (this.select.value === option.value) {
                item.classList.add('active');
            }

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.select.value = option.value;
                this.select.dispatchEvent(new Event('change'));
                this.close();
            });

            menu.appendChild(item);
            this.items.push(item);
        });

        this.updateSelectedDisplay();
    }

    private updateSelectedDisplay() {
        if (!this.trigger) return;
        const activeOption = this.select.options[this.select.selectedIndex];
        const textSpan = this.trigger.querySelector('.selected-text');
        if (textSpan && activeOption) {
            textSpan.textContent = activeOption.text;
        }

        // Highlight active class in menu
        this.items.forEach(item => {
            if (item.getAttribute('data-value') === this.select.value) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    private toggle() {
        if (!this.wrapper) return;
        // Close other dropdowns first
        document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
            if (dropdown !== this.wrapper) {
                dropdown.classList.remove('open');
            }
        });
        this.wrapper.classList.toggle('open');
    }

    private close() {
        if (this.wrapper) {
            this.wrapper.classList.remove('open');
        }
    }
}

class CustomDatePickerWrapper {
    private input: HTMLInputElement;
    private wrapper: HTMLDivElement | null = null;
    private trigger: HTMLButtonElement | null = null;
    private popup: HTMLDivElement | null = null;
    
    private currentDate: Date;
    private selectedDate: Date | null = null;
    private minDate: Date | null = null;

    constructor(inputId: string) {
        this.input = document.getElementById(inputId) as HTMLInputElement;
        if (!this.input) throw new Error(`Input element with ID ${inputId} not found`);

        // Set min date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.minDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
        
        // Initial selected date
        this.selectedDate = new Date(this.minDate);
        this.currentDate = new Date(this.selectedDate);

        // Create container wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-datepicker';
        this.wrapper.style.position = 'relative';
        this.wrapper.style.width = '100%';

        // Insert wrapper before the input and move input inside it
        this.input.parentNode?.insertBefore(this.wrapper, this.input);
        this.wrapper.appendChild(this.input);

        // Hide original input
        this.input.style.display = 'none';

        // Create trigger button
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'dropdown-trigger';
        this.trigger.style.width = '100%';
        this.trigger.style.textAlign = 'left';
        this.trigger.style.display = 'flex';
        this.trigger.style.justifyContent = 'space-between';
        this.trigger.style.alignItems = 'center';
        
        const triggerText = document.createElement('span');
        triggerText.className = 'selected-date-text';
        this.trigger.appendChild(triggerText);

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-calendar';
        this.trigger.appendChild(icon);

        this.wrapper.appendChild(this.trigger);

        // Create calendar popup
        this.popup = document.createElement('div');
        this.popup.className = 'calendar-popup';
        this.wrapper.appendChild(this.popup);

        this.initEvents();
        this.renderCalendar();
        this.updateTriggerText();
    }

    private initEvents() {
        if (!this.trigger || !this.popup) return;

        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        document.addEventListener('click', () => {
            this.close();
        });

        this.popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Sync when native value changes
        this.input.addEventListener('change', () => {
            this.syncWithValue();
        });
    }

    public syncWithValue() {
        if (this.input.value) {
            const dateParts = this.input.value.split('-');
            if (dateParts.length === 3) {
                this.selectedDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                this.currentDate = new Date(this.selectedDate);
                this.renderCalendar();
                this.updateTriggerText();
            }
        }
    }

    private updateTriggerText() {
        if (!this.trigger) return;
        const span = this.trigger.querySelector('.selected-date-text');
        if (span && this.selectedDate) {
            span.textContent = this.selectedDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }

    private toggle() {
        if (!this.wrapper) return;
        // Close other dropdowns/pickers
        document.querySelectorAll('.custom-dropdown, .custom-datepicker').forEach(el => {
            if (el !== this.wrapper) {
                el.classList.remove('open');
            }
        });
        this.wrapper.classList.toggle('open');
    }

    private close() {
        if (this.wrapper) {
            this.wrapper.classList.remove('open');
        }
    }

    private renderCalendar() {
        const popup = this.popup;
        if (!popup) return;
        popup.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Header
        const header = document.createElement('div');
        header.className = 'calendar-header';
        
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            this.currentDate.setDate(1); // Avoid overflow bugs
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        header.appendChild(prevBtn);

        const title = document.createElement('span');
        title.className = 'calendar-title';
        title.textContent = this.currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        header.appendChild(title);

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            this.currentDate.setDate(1); // Avoid overflow bugs
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        header.appendChild(nextBtn);

        popup.appendChild(header);

        // Weekdays row
        const weekdaysGrid = document.createElement('div');
        weekdaysGrid.className = 'calendar-weekdays-grid';
        ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach(day => {
            const el = document.createElement('span');
            el.textContent = day;
            weekdaysGrid.appendChild(el);
        });
        popup.appendChild(weekdaysGrid);

        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-days-grid';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Adjust for Monday start (0=Sunday, 1=Monday ... 6=Saturday) -> adjust: 0 should be 6, and others decremented by 1
        const adjustedOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const totalDays = new Date(year, month + 1, 0).getDate();

        // Empty items before 1st of month
        for (let i = 0; i < adjustedOffset; i++) {
            const empty = document.createElement('span');
            empty.className = 'calendar-day-empty';
            daysGrid.appendChild(empty);
        }

        // Days numbers
        for (let day = 1; day <= totalDays; day++) {
            const el = document.createElement('span');
            el.className = 'calendar-day';
            el.textContent = day.toString();

            const thisDate = new Date(year, month, day);

            // Check if day is disabled (past dates)
            if (this.minDate && thisDate < this.minDate) {
                el.classList.add('disabled');
            } else {
                el.addEventListener('click', () => {
                    this.selectedDate = thisDate;
                    
                    // Update native select input
                    const yyyy = thisDate.getFullYear();
                    const mm = String(thisDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(thisDate.getDate()).padStart(2, '0');
                    this.input.value = `${yyyy}-${mm}-${dd}`;
                    this.input.dispatchEvent(new Event('change'));
                    
                    this.close();
                    this.renderCalendar();
                    this.updateTriggerText();
                });
            }

            // Check if selected
            if (this.selectedDate && 
                thisDate.getDate() === this.selectedDate.getDate() &&
                thisDate.getMonth() === this.selectedDate.getMonth() &&
                thisDate.getFullYear() === this.selectedDate.getFullYear()) {
                el.classList.add('active');
            }

            daysGrid.appendChild(el);
        }

        popup.appendChild(daysGrid);
    }
}

export class BookingModal {
    private overlay: HTMLElement | null = null;
    private closeBtn: HTMLButtonElement | null = null;
    private form: HTMLFormElement | null = null;
    
    private currentStep = 1;
    
    private selectedCoursePrice = 0;
    private selectedCourseName = '';
    private selectedCustomAddons: string[] = [];

    private courseDropdown: CustomDropdownWrapper | null = null;
    private branchDropdown: CustomDropdownWrapper | null = null;
    private datePicker: CustomDatePickerWrapper | null = null;
    
    constructor() {
        this.overlay = document.getElementById('bookingModalOverlay');
        this.closeBtn = document.getElementById('modalCloseBtn') as HTMLButtonElement;
        this.form = document.getElementById('bookingCheckoutForm') as HTMLFormElement;
        
        this.initEventListeners();
        this.populateCourses();
        this.setMinStartDate();

        try {
            this.courseDropdown = new CustomDropdownWrapper('bookCourseSelect');
            this.branchDropdown = new CustomDropdownWrapper('bookBranchSelect');
            this.datePicker = new CustomDatePickerWrapper('bookStartDate');
        } catch (e) {
            console.error('Error creating custom dropdowns/datepickers', e);
        }
    }
    
    private initEventListeners(): void {
        // Close modal triggers
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
        }
        
        // Next & Back buttons
        const nextButtons = document.querySelectorAll('.next-step-btn');
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });
        
        const prevButtons = document.querySelectorAll('.prev-step-btn');
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });
        
        // Form submit
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckoutSubmit();
            });
        }
    }
    
    private populateCourses(): void {
        const select = document.getElementById('bookCourseSelect') as HTMLSelectElement;
        if (!select) return;
        
        select.innerHTML = COURSES_DATA.map(course => 
            `<option value="${course.id}" data-price="${course.price}">${course.title} - ₹${course.price.toLocaleString('en-IN')}</option>`
        ).join('');
        
        // Add custom option in case they came from the Fee Calculator
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.text = 'Custom Driving Package (Calculated)';
        customOpt.style.display = 'none';
        select.appendChild(customOpt);
        
        select.addEventListener('change', () => {
            const opt = select.options[select.selectedIndex];
            if (opt.value !== 'custom') {
                this.selectedCoursePrice = parseInt(opt.getAttribute('data-price') || '0');
                this.selectedCourseName = opt.text.split(' - ')[0];
                this.selectedCustomAddons = [];
            }
        });
    }

    private setMinStartDate(): void {
        const input = document.getElementById('bookStartDate') as HTMLInputElement;
        if (!input) return;
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        input.min = `${yyyy}-${mm}-${dd}`;
        input.value = `${yyyy}-${mm}-${dd}`;
    }
    
    public open(courseId?: string, customDetails?: {
        vehicle: string;
        days: number;
        addons: string[];
        price: number;
    }): void {
        this.currentStep = 1;
        this.updateStepDisplay();
        
        const select = document.getElementById('bookCourseSelect') as HTMLSelectElement;
        if (select) {
            if (customDetails) {
                // Pre-populate with Calculator Details
                const customOpt = select.querySelector('option[value="custom"]') as HTMLOptionElement;
                if (customOpt) {
                    customOpt.style.display = 'block';
                    select.value = 'custom';
                }
                this.selectedCourseName = `Custom ${customDetails.vehicle} Course (${customDetails.days} Sessions)`;
                this.selectedCoursePrice = customDetails.price;
                this.selectedCustomAddons = customDetails.addons;
            } else if (courseId) {
                // Pre-populate standard course
                select.value = courseId;
                const matched = COURSES_DATA.find(c => c.id === courseId);
                if (matched) {
                    this.selectedCourseName = matched.title;
                    this.selectedCoursePrice = matched.price;
                    this.selectedCustomAddons = [];
                }
            } else {
                // Select first standard course
                select.selectedIndex = 0;
                const opt = select.options[0];
                this.selectedCoursePrice = parseInt(opt.getAttribute('data-price') || '0');
                this.selectedCourseName = opt.text.split(' - ')[0];
                this.selectedCustomAddons = [];
            }
            if (this.courseDropdown) {
                this.courseDropdown.syncWithOptions();
            }
            if (this.branchDropdown) {
                this.branchDropdown.syncWithOptions();
            }
            if (this.datePicker) {
                this.datePicker.syncWithValue();
            }
        }
        
        if (this.overlay) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }
    }
    
    public close(): void {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = ''; // Release scroll lock
        }
    }
    
    private nextStep(): void {
        if (this.validateStep(this.currentStep)) {
            this.currentStep++;
            if (this.currentStep === 4) {
                this.generateInvoiceSummary();
            }
            this.updateStepDisplay();
        }
    }
    
    private prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }
    
    private validateStep(step: number): boolean {
        if (step === 2) {
            const startDate = (document.getElementById('bookStartDate') as HTMLInputElement).value;
            if (!startDate) {
                alert('Please select a preferred start date.');
                return false;
            }
        } else if (step === 3) {
            const name = (document.getElementById('bookName') as HTMLInputElement).value;
            const phone = (document.getElementById('bookPhone') as HTMLInputElement).value;
            
            if (!name.trim()) {
                alert('Please enter your name.');
                return false;
            }
            
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit mobile number.');
                return false;
            }
        }
        return true;
    }
    
    private updateStepDisplay(): void {
        // Toggle step contents
        const contents = document.querySelectorAll('.modal-step-content');
        contents.forEach(content => {
            const contentStep = parseInt(content.getAttribute('data-step-content') || '1');
            if (contentStep === this.currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Toggle step navigation circles
        const stepBubbles = document.querySelectorAll('.modal-step');
        stepBubbles.forEach(bubble => {
            const bubbleStep = parseInt(bubble.getAttribute('data-step') || '1');
            if (bubbleStep <= this.currentStep) {
                bubble.classList.add('active');
            } else {
                bubble.classList.remove('active');
            }
        });
        
        // Toggle labels color
        const labels = document.querySelectorAll('.modal-step-labels span');
        labels.forEach((label, idx) => {
            if (idx + 1 === this.currentStep) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
    
    private generateInvoiceSummary(): void {
        const branchSelect = document.getElementById('bookBranchSelect') as HTMLSelectElement;
        const branchName = branchSelect.options[branchSelect.selectedIndex].text;
        
        const dateVal = (document.getElementById('bookStartDate') as HTMLInputElement).value;
        const slotRadio = document.querySelector('input[name="timeSlot"]:checked') as HTMLInputElement;
        const slotText = slotRadio ? slotRadio.value : 'morning';
        
        // Update DOM displays
        const sumName = document.getElementById('summaryCourseName');
        const sumPrice = document.getElementById('summaryCoursePrice');
        const sumBranch = document.getElementById('summaryBranch');
        const sumSchedule = document.getElementById('summarySchedule');
        const sumPickup = document.getElementById('summaryPickup');
        const sumTotal = document.getElementById('summaryTotal');
        
        if (sumName) sumName.textContent = this.selectedCourseName;
        if (sumPrice) sumPrice.textContent = `₹${this.selectedCoursePrice.toLocaleString('en-IN')}`;
        if (sumBranch) sumBranch.textContent = branchName;
        if (sumSchedule) {
            const dateObj = new Date(dateVal);
            const formattedDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            sumSchedule.textContent = `${formattedDate} (${slotText.toUpperCase()})`;
        }
        
        const isPickup = this.selectedCustomAddons.includes('Doorstep Pickup') || 
            (document.getElementById('bookAddress') as HTMLInputElement).value.trim().length > 0;
        if (sumPickup) sumPickup.textContent = isPickup ? 'Included' : 'Self-Arrival';
        
        if (sumTotal) sumTotal.textContent = `₹${this.selectedCoursePrice.toLocaleString('en-IN')}`;
    }
    
    private handleCheckoutSubmit(): void {
        const name = (document.getElementById('bookName') as HTMLInputElement).value;
        const phone = (document.getElementById('bookPhone') as HTMLInputElement).value;
        const email = (document.getElementById('bookEmail') as HTMLInputElement).value || 'Not provided';
        const address = (document.getElementById('bookAddress') as HTMLInputElement).value || 'Not provided';
        
        const branchSelect = document.getElementById('bookBranchSelect') as HTMLSelectElement;
        const branchName = branchSelect.options[branchSelect.selectedIndex].text;
        
        const dateVal = (document.getElementById('bookStartDate') as HTMLInputElement).value;
        const slotRadio = document.querySelector('input[name="timeSlot"]:checked') as HTMLInputElement;
        const slotText = slotRadio ? slotRadio.value : 'morning';
        
        // Assemble text message for WhatsApp API
        const text = `*Bharat Motor Driving School - New Enrollment Request*
-----------------------------
*Customer Name:* ${name}
*Mobile Number:* ${phone}
*Email Address:* ${email}
*Training Branch:* ${branchName}

*Course Package:* ${this.selectedCourseName}
*Estimated Cost:* ₹${this.selectedCoursePrice.toLocaleString('en-IN')}
*Preferred Start:* ${dateVal} (${slotText.toUpperCase()} slot)
*Pickup Address:* ${address}
-----------------------------
_Sent from Driving School Web Platform._`;
        
        const encodedText = encodeURIComponent(text);
        const whatsappNumber = '919922211238'; // Main firm whatsapp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        
        // Open WhatsApp chat in a new tab
        window.open(whatsappUrl, '_blank');
        
        alert('Thank you! Redirecting you to WhatsApp to complete your reservation with our coordinators.');
        this.close();
    }
}
