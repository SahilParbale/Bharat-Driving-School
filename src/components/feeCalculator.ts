export function initFeeCalculator(onBookCustomClick: (customDetails: {
    vehicle: string;
    days: number;
    addons: string[];
    price: number;
}) => void): void {
    const root = document.getElementById('calculator-root');
    if (!root) return;

    // Render calculator template
    root.innerHTML = `
        <div class="calc-card">
            <h3>Configure Your Course</h3>
            
            <div class="calc-group">
                <label for="calcVehicle">Select Vehicle Option</label>
                <select id="calcVehicle" class="calc-select">
                    <option value="hatchback" data-price="3500">Hatchback (Manual) - ₹3,500 base</option>
                    <option value="sedan" data-price="4500">Sedan (Manual/Automatic) - ₹4,500 base</option>
                    <option value="suv" data-price="5500">SUV Premium (Manual/Automatic) - ₹5,500 base</option>
                    <option value="twowheeler" data-price="1800">Two-Wheeler (Scooter/Bike) - ₹1,800 base</option>
                </select>
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
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
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

    const vehicleSelect = document.getElementById('calcVehicle') as HTMLSelectElement;
    const daysSlider = document.getElementById('calcDays') as HTMLInputElement;
    const daysLabel = document.getElementById('daysVal');
    const licenseCheckbox = document.getElementById('addLicense') as HTMLInputElement;
    const pickupCheckbox = document.getElementById('addPickup') as HTMLInputElement;
    const nightCheckbox = document.getElementById('addNight') as HTMLInputElement;
    const priceDisplay = document.getElementById('calcPrice');
    const bookBtn = document.getElementById('calcBookBtn');

    let currentPrice = 0;

    const calculatePrice = () => {
        const vehicleOption = vehicleSelect.options[vehicleSelect.selectedIndex];
        const basePrice = parseInt(vehicleOption.getAttribute('data-price') || '0');
        const days = parseInt(daysSlider.value);
        
        // Duration scaling (base is calibrated at 15 sessions)
        const durationMultiplier = days / 15;
        let runningTotal = basePrice * durationMultiplier;

        // Add-ons
        if (licenseCheckbox.checked) runningTotal += parseInt(licenseCheckbox.getAttribute('data-price') || '0');
        if (pickupCheckbox.checked) runningTotal += parseInt(pickupCheckbox.getAttribute('data-price') || '0');
        if (nightCheckbox.checked) runningTotal += parseInt(nightCheckbox.getAttribute('data-price') || '0');

        currentPrice = Math.round(runningTotal);
        
        // Counter animation or display
        if (priceDisplay) {
            priceDisplay.textContent = `₹${currentPrice.toLocaleString('en-IN')}`;
        }
        if (daysLabel) {
            daysLabel.textContent = `${days} Days`;
        }
    };

    // Bind event listeners
    vehicleSelect.addEventListener('change', calculatePrice);
    daysSlider.addEventListener('input', calculatePrice);
    licenseCheckbox.addEventListener('change', calculatePrice);
    pickupCheckbox.addEventListener('change', calculatePrice);
    nightCheckbox.addEventListener('change', calculatePrice);

    // Initial calculation
    calculatePrice();

    // Booking click
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex].text.split(' - ')[0];
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
