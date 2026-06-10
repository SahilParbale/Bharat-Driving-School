export function initFeeCalculator(onBookCustomClick: (customDetails: {
    vehicle: string;
    days: number;
    addons: string[];
    price: number;
}) => void): void {
    const root = document.getElementById('calculator-root');
    if (!root) return;

    // Render calculator template with custom dropdown structure
    root.innerHTML = `
        <div class="calc-card">
            <h3>Configure Your Course</h3>
            
            <div class="calc-group">
                <label>Select Vehicle Option</label>
                <div class="custom-dropdown" id="calcVehicleDropdown">
                    <button type="button" class="dropdown-trigger" id="dropdownTrigger">
                        <span id="selectedVehicleText">Hatchback (Manual) - ₹3,500 base</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu" id="dropdownMenu">
                        <div class="dropdown-item active" data-value="hatchback" data-price="3500">Hatchback (Manual) - ₹3,500 base</div>
                        <div class="dropdown-item" data-value="sedan" data-price="4500">Sedan (Manual/Automatic) - ₹4,500 base</div>
                        <div class="dropdown-item" data-value="suv" data-price="5500">SUV Premium (Manual/Automatic) - ₹5,500 base</div>
                        <div class="dropdown-item" data-value="twowheeler" data-price="1800">Two-Wheeler (Scooter/Bike) - ₹1,800 base</div>
                    </div>
                </div>
            </div>
            
            <div class="calc-group">
                <label>Training Duration (Sessions)</label>
                <div class="range-slider-wrapper">
                    <input type="range" id="calcDays" class="range-slider" min="10" max="30" value="15">
                    <span class="range-val" id="daysVal">15 Days</span>
                </div>
            </div>
            
            <div class="calc-group">
                <label>Optional Service Add-ons</label>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <label class="checkbox-card">
                        <input type="checkbox" id="addLicense" value="license" data-price="1500" checked>
                        <span>Official RTO License Assistance (+₹1,500)</span>
                    </label>
                    <label class="checkbox-card">
                        <input type="checkbox" id="addPickup" value="pickup" data-price="1000">
                        <span>Doorstep Pick-up & Drop Service (+₹1,000)</span>
                    </label>
                    <label class="checkbox-card">
                        <input type="checkbox" id="addNight" value="night" data-price="800">
                        <span>Simulator & Night Session Training (+₹800)</span>
                    </label>
                </div>
            </div>
            
            <div class="calc-result">
                <div>
                    <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; display:block; opacity:0.8;">Estimated Total</span>
                    <span class="calc-result-price" id="calcPrice">₹0</span>
                </div>
                <button class="btn btn-primary" id="calcBookBtn">Enroll Package</button>
            </div>
        </div>
    `;

    const vehicleDropdown = document.getElementById('calcVehicleDropdown') as HTMLElement;
    const dropdownTrigger = document.getElementById('dropdownTrigger') as HTMLButtonElement;
    const dropdownMenu = document.getElementById('dropdownMenu') as HTMLElement;
    const selectedText = document.getElementById('selectedVehicleText') as HTMLElement;
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    const daysSlider = document.getElementById('calcDays') as HTMLInputElement;
    const daysLabel = document.getElementById('daysVal');
    const licenseCheckbox = document.getElementById('addLicense') as HTMLInputElement;
    const pickupCheckbox = document.getElementById('addPickup') as HTMLInputElement;
    const nightCheckbox = document.getElementById('addNight') as HTMLInputElement;
    const priceDisplay = document.getElementById('calcPrice');
    const bookBtn = document.getElementById('calcBookBtn');

    let currentPrice = 0;
    let selectedPrice = 3500;


    // Toggle dropdown menu open/closed state
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        vehicleDropdown.classList.toggle('open');
    });

    // Close dropdown menu when clicking anywhere else on the document
    document.addEventListener('click', () => {
        vehicleDropdown.classList.remove('open');
    });

    const calculatePrice = () => {
        const days = parseInt(daysSlider.value);
        
        // Duration scaling (base is calibrated at 15 sessions)
        const durationMultiplier = days / 15;
        let runningTotal = selectedPrice * durationMultiplier;

        // Add-ons
        if (licenseCheckbox.checked) runningTotal += parseInt(licenseCheckbox.getAttribute('data-price') || '0');
        if (pickupCheckbox.checked) runningTotal += parseInt(pickupCheckbox.getAttribute('data-price') || '0');
        if (nightCheckbox.checked) runningTotal += parseInt(nightCheckbox.getAttribute('data-price') || '0');

        currentPrice = Math.round(runningTotal);
        
        if (priceDisplay) {
            priceDisplay.textContent = `₹${currentPrice.toLocaleString('en-IN')}`;
        }
        if (daysLabel) {
            daysLabel.textContent = `${days} Days`;
        }
    };

    // Bind item click select action
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = item as HTMLElement;
            
            // Highlight active item and update selection text
            selectedText.textContent = target.textContent || '';
            dropdownItems.forEach(di => di.classList.remove('active'));
            target.classList.add('active');

            selectedPrice = parseInt(target.getAttribute('data-price') || '3500', 10);
            
            vehicleDropdown.classList.remove('open');
            calculatePrice();
        });
    });

    // Bind range slider and checkbox listeners
    daysSlider.addEventListener('input', calculatePrice);
    licenseCheckbox.addEventListener('change', calculatePrice);
    pickupCheckbox.addEventListener('change', calculatePrice);
    nightCheckbox.addEventListener('change', calculatePrice);

    // Initial calculation
    calculatePrice();

    // Booking click
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            const selectedVehicle = selectedText.textContent?.split(' - ')[0] || 'Hatchback (Manual)';
            const days = parseInt(daysSlider.value);
            
            const activeAddons: string[] = [];
            if (licenseCheckbox.checked) activeAddons.push('RTO License Assistance');
            if (pickupCheckbox.checked) activeAddons.push('Doorstep Pickup');
            if (nightCheckbox.checked) activeAddons.push('Simulator & Night Training');

            onBookCustomClick({
                vehicle: selectedVehicle,
                days,
                addons: activeAddons,
                price: currentPrice
            });
        });
    }
}
