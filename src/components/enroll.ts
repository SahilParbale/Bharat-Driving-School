import { COURSES_DATA } from './courses';

export function initEnrollPage() {
    const form = document.getElementById('enrollmentForm') as HTMLFormElement;
    if (!form) return;

    const courseSelect = document.getElementById('enrollCourseSelect') as HTMLSelectElement;
    const branchSelect = document.getElementById('enrollBranchSelect') as HTMLSelectElement;
    const startDateInput = document.getElementById('enrollStartDate') as HTMLInputElement;
    const timeSlotRadios = document.getElementsByName('enrollTimeSlot');
    const addressInput = document.getElementById('enrollAddress') as HTMLTextAreaElement;

    let selectedCoursePrice = 0;
    let selectedCourseName = '';
    let selectedCustomAddons: string[] = [];

    // Setup Start Date (min date tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    startDateInput.min = `${yyyy}-${mm}-${dd}`;
    startDateInput.value = `${yyyy}-${mm}-${dd}`;

    // Populate Courses
    courseSelect.innerHTML = COURSES_DATA.map(course => 
        `<option value="${course.id}" data-price="${course.price}">${course.title} - ₹${course.price.toLocaleString('en-IN')}</option>`
    ).join('');

    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.text = 'Custom Driving Package (Calculated)';
    customOpt.style.display = 'none';
    courseSelect.appendChild(customOpt);

    // Read custom details or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const prefillCourse = urlParams.get('course');
    
    let customDetails: any = null;
    try {
        const stored = localStorage.getItem('bmds_custom_enroll');
        if (stored) {
            customDetails = JSON.parse(stored);
            localStorage.removeItem('bmds_custom_enroll'); // Clear it after reading
        }
    } catch (e) { }

    if (customDetails) {
        customOpt.style.display = 'block';
        courseSelect.value = 'custom';
        selectedCourseName = `Custom ${customDetails.vehicle} Course (${customDetails.days} Sessions)`;
        selectedCoursePrice = customDetails.price;
        selectedCustomAddons = customDetails.addons || [];
    } else if (prefillCourse) {
        courseSelect.value = prefillCourse;
        const matched = COURSES_DATA.find(c => c.id === prefillCourse);
        if (matched) {
            selectedCourseName = matched.title;
            selectedCoursePrice = matched.price;
        } else {
            // fallback
            courseSelect.selectedIndex = 0;
            const opt = courseSelect.options[0];
            selectedCoursePrice = parseInt(opt.getAttribute('data-price') || '0');
            selectedCourseName = opt.text.split(' - ')[0];
        }
    } else {
        courseSelect.selectedIndex = 0;
        const opt = courseSelect.options[0];
        selectedCoursePrice = parseInt(opt.getAttribute('data-price') || '0');
        selectedCourseName = opt.text.split(' - ')[0];
    }

    const updateSummary = () => {
        // Only update standard course name/price if not custom selected
        if (courseSelect.value !== 'custom') {
            const opt = courseSelect.options[courseSelect.selectedIndex];
            selectedCoursePrice = parseInt(opt.getAttribute('data-price') || '0');
            selectedCourseName = opt.text.split(' - ')[0];
            selectedCustomAddons = [];
        }

        const sumName = document.getElementById('enrollSummaryCourseName');
        const sumPrice = document.getElementById('enrollSummaryCoursePrice');
        const sumBranch = document.getElementById('enrollSummaryBranch');
        const sumSchedule = document.getElementById('enrollSummarySchedule');
        const sumPickup = document.getElementById('enrollSummaryPickup');
        const sumTotal = document.getElementById('enrollSummaryTotal');

        if (sumName) sumName.textContent = selectedCourseName;
        if (sumPrice) sumPrice.textContent = `₹${selectedCoursePrice.toLocaleString('en-IN')}`;
        if (sumBranch) sumBranch.textContent = branchSelect.options[branchSelect.selectedIndex].text;
        
        if (sumSchedule && startDateInput.value) {
            const dateObj = new Date(startDateInput.value);
            const formattedDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            
            let slotText = 'morning';
            for (let i = 0; i < timeSlotRadios.length; i++) {
                if ((timeSlotRadios[i] as HTMLInputElement).checked) {
                    slotText = (timeSlotRadios[i] as HTMLInputElement).value;
                    break;
                }
            }
            sumSchedule.textContent = `${formattedDate} (${slotText.toUpperCase()})`;
        }

        const isPickup = selectedCustomAddons.includes('Doorstep Pickup') || 
            (addressInput.value.trim().length > 0);
        if (sumPickup) sumPickup.textContent = isPickup ? 'Included' : 'Self-Arrival';
        
        if (sumTotal) sumTotal.textContent = `₹${selectedCoursePrice.toLocaleString('en-IN')}`;
    };

    // Bind events
    courseSelect.addEventListener('change', updateSummary);
    branchSelect.addEventListener('change', updateSummary);
    startDateInput.addEventListener('change', updateSummary);
    addressInput.addEventListener('input', updateSummary);
    timeSlotRadios.forEach(radio => radio.addEventListener('change', updateSummary));

    // Initial summary render
    updateSummary();

    // Form submission to WhatsApp
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('enrollName') as HTMLInputElement).value;
        const phone = (document.getElementById('enrollPhone') as HTMLInputElement).value;
        const email = (document.getElementById('enrollEmail') as HTMLInputElement).value || 'Not provided';
        const address = addressInput.value || 'Not provided';
        const branchName = branchSelect.options[branchSelect.selectedIndex].text;
        const dateVal = startDateInput.value;
        
        let slotText = 'morning';
        for (let i = 0; i < timeSlotRadios.length; i++) {
            if ((timeSlotRadios[i] as HTMLInputElement).checked) {
                slotText = (timeSlotRadios[i] as HTMLInputElement).value;
                break;
            }
        }

        const text = `*Bharat Motor Driving School - New Enrollment Request*
-----------------------------
*Customer Name:* ${name}
*Mobile Number:* ${phone}
*Email Address:* ${email}
*Training Branch:* ${branchName}

*Course Package:* ${selectedCourseName}
*Estimated Cost:* ₹${selectedCoursePrice.toLocaleString('en-IN')}
*Preferred Start:* ${dateVal} (${slotText.toUpperCase()} slot)
*Pickup Address:* ${address}
-----------------------------
_Sent from Driving School Web Platform._`;

        const encodedText = encodeURIComponent(text);
        const whatsappNumber = '919922211238'; // Main firm whatsapp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
        alert('Thank you! Redirecting you to WhatsApp to complete your reservation with our coordinators.');
    });
}
