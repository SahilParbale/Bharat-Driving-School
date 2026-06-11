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
        <div class="calculator-split">
            <!-- Left Side: Quote Invoice Receipt -->
            <div class="quote-receipt-card reveal">
                <div class="quote-header">
                    <h3>Course Quote Summary</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Estimate is based on chosen variables. No hidden commissions.</p>
                </div>
                <div class="quote-details-list">
                    <div class="quote-row">
                        <span class="quote-row-lbl">Vehicle Category</span>
                        <span class="quote-row-val" id="quoteVehicle">Hatchback (Manual)</span>
                    </div>
                    <div class="quote-row">
                        <span class="quote-row-lbl">Base Course Cost</span>
                        <span class="quote-row-val" id="quoteBasePrice">₹3,500</span>
                    </div>
                    <div class="quote-row">
                        <span class="quote-row-lbl">Training Duration</span>
                        <span class="quote-row-val" id="quoteDuration">15 Days</span>
                    </div>
                    <div class="quote-row">
                        <span class="quote-row-lbl">Duration Cost Factor</span>
                        <span class="quote-row-val" id="quoteDurationCost">₹3,500</span>
                    </div>
                    
                    <!-- Dynamic Add-ons List -->
                    <div id="quoteAddonsList" style="display:flex; flex-direction:column; gap:0.75rem; border-top:1px solid var(--color-border); padding-top:1rem; margin-top:0.5rem;">
                        <!-- Injected Add-ons appear here -->
                    </div>
                    
                    <div class="quote-row quote-total">
                        <span class="quote-row-lbl">Estimated Total</span>
                        <span class="quote-row-val" id="calcPrice">₹3,500</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" id="calcBookBtn" style="width: 100%; height: 55px; font-size: 1rem; border-radius: var(--border-radius-sm);">Enroll & Reserve Package <i class="fa-solid fa-arrow-right"></i></button>
            </div>

            <!-- Right Side: Config Controls -->
            <div class="bento-card reveal" style="padding: 2.5rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 2rem; color: var(--color-primary); font-family: var(--font-heading); border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">Configure Your Training Path</h3>
                
                <div class="calc-group" style="margin-bottom: 2rem;">
                    <label style="display: block; font-weight: 700; margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-primary);">Select Vehicle Option</label>
                    <div class="custom-dropdown" id="calcVehicleDropdown">
                        <button type="button" class="dropdown-trigger" id="dropdownTrigger" style="width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                            <span id="selectedVehicleText">Hatchback (Manual) - ₹3,500 base</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdownMenu" style="width: 100%;">
                            <div class="dropdown-item active" data-value="hatchback" data-price="3500">Hatchback (Manual) - ₹3,500 base</div>
                            <div class="dropdown-item" data-value="sedan" data-price="4500">Sedan (Manual/Automatic) - ₹4,500 base</div>
                            <div class="dropdown-item" data-value="suv" data-price="5500">SUV Premium (Manual/Automatic) - ₹5,500 base</div>
                            <div class="dropdown-item" data-value="twowheeler" data-price="1800">Two-Wheeler (Scooter/Bike) - ₹1,800 base</div>
                        </div>
                    </div>
                </div>
                
                <div class="calc-group" style="margin-bottom: 2rem;">
                    <label style="display: block; font-weight: 700; margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-primary);">Training Duration (Sessions)</label>
                    <div class="range-slider-wrapper" style="display: flex; align-items: center; gap: 1.5rem;">
                        <input type="range" id="calcDays" class="range-slider" min="10" max="30" value="15" style="flex-grow: 1;">
                        <span class="range-val" id="daysVal" style="font-weight: 800; font-size: 1rem; color: var(--color-primary); min-width: 70px; text-align: right;">15 Days</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-top: 0.5rem;">Standard training is 15 days. Pricing scales linearly based on duration.</span>
                </div>
                
                <div class="calc-group">
                    <label style="display: block; font-weight: 700; margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-primary);">Optional Service Add-ons</label>
                    <div style="display:flex; flex-direction:column; gap:0.75rem;">
                        <label class="checkbox-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); cursor: pointer; transition: var(--transition-smooth);">
                            <input type="checkbox" id="addLicense" value="license" data-price="1500" checked>
                            <span style="font-size: 0.9rem; font-weight: 600;">Official RTO License Assistance (+₹1,500)</span>
                        </label>
                        <label class="checkbox-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); cursor: pointer; transition: var(--transition-smooth);">
                            <input type="checkbox" id="addPickup" value="pickup" data-price="1000">
                            <span style="font-size: 0.9rem; font-weight: 600;">Doorstep Pick-up & Drop Service (+₹1,000)</span>
                        </label>
                        <label class="checkbox-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); cursor: pointer; transition: var(--transition-smooth);">
                            <input type="checkbox" id="addNight" value="night" data-price="800">
                            <span style="font-size: 0.9rem; font-weight: 600;">Simulator & Night Session Training (+₹800)</span>
                        </label>
                    </div>
                </div>
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
        const durationMultiplier = days / 15;
        const durationCost = Math.round(selectedPrice * durationMultiplier);
        let runningTotal = selectedPrice * durationMultiplier;

        // Dynamic elements references
        const quoteVehicle = document.getElementById('quoteVehicle');
        const quoteBasePrice = document.getElementById('quoteBasePrice');
        const quoteDuration = document.getElementById('quoteDuration');
        const quoteDurationCost = document.getElementById('quoteDurationCost');
        const quoteAddonsList = document.getElementById('quoteAddonsList');

        if (quoteVehicle) {
            const selectedVehicle = selectedText.textContent?.split(' - ')[0] || 'Hatchback (Manual)';
            quoteVehicle.textContent = selectedVehicle;
        }
        if (quoteBasePrice) {
            quoteBasePrice.textContent = `₹${selectedPrice.toLocaleString('en-IN')}`;
        }
        if (quoteDuration) {
            quoteDuration.textContent = `${days} Days`;
        }
        if (quoteDurationCost) {
            quoteDurationCost.textContent = `₹${durationCost.toLocaleString('en-IN')}`;
        }

        // Add-ons rendering
        if (quoteAddonsList) {
            quoteAddonsList.innerHTML = '';
            
            const addAddonRow = (label: string, price: number) => {
                const row = document.createElement('div');
                row.className = 'quote-row';
                row.style.fontSize = '0.85rem';
                row.innerHTML = `
                    <span class="quote-row-lbl" style="padding-left:1rem; position:relative;"><i class="fa-solid fa-plus" style="position:absolute; left:0; top:3px; font-size:0.7rem; color:var(--color-accent-hover);"></i> ${label}</span>
                    <span class="quote-row-val">+₹${price.toLocaleString('en-IN')}</span>
                `;
                quoteAddonsList.appendChild(row);
            };

            if (licenseCheckbox.checked) {
                const price = parseInt(licenseCheckbox.getAttribute('data-price') || '0');
                runningTotal += price;
                addAddonRow('RTO License Assistance', price);
            }
            if (pickupCheckbox.checked) {
                const price = parseInt(pickupCheckbox.getAttribute('data-price') || '0');
                runningTotal += price;
                addAddonRow('Doorstep Pickup & Drop', price);
            }
            if (nightCheckbox.checked) {
                const price = parseInt(nightCheckbox.getAttribute('data-price') || '0');
                runningTotal += price;
                addAddonRow('Simulator & Night Sessions', price);
            }

            if (quoteAddonsList.children.length === 0) {
                quoteAddonsList.innerHTML = `<span style="font-size:0.8rem; color:var(--color-text-muted); font-style:italic;">No optional add-ons selected</span>`;
            }
        } else {
            if (licenseCheckbox.checked) runningTotal += parseInt(licenseCheckbox.getAttribute('data-price') || '0');
            if (pickupCheckbox.checked) runningTotal += parseInt(pickupCheckbox.getAttribute('data-price') || '0');
            if (nightCheckbox.checked) runningTotal += parseInt(nightCheckbox.getAttribute('data-price') || '0');
        }

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
