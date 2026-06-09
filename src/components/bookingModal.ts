import { COURSES_DATA } from './courses';

export class BookingModal {
    private overlay: HTMLElement | null = null;
    private closeBtn: HTMLButtonElement | null = null;
    private form: HTMLFormElement | null = null;
    
    private currentStep = 1;
    
    private selectedCoursePrice = 0;
    private selectedCourseName = '';
    private selectedCustomAddons: string[] = [];
    
    constructor() {
        this.overlay = document.getElementById('bookingModalOverlay');
        this.closeBtn = document.getElementById('modalCloseBtn') as HTMLButtonElement;
        this.form = document.getElementById('bookingCheckoutForm') as HTMLFormElement;
        
        this.initEventListeners();
        this.populateCourses();
        this.setMinStartDate();
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
