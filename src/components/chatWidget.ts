import { showToast } from '../utils/toast';

export function initChatWidget(): void {
    // 1. Remove the old static WhatsApp float links if they exist on the page
    const oldFloats = document.querySelectorAll('.whatsapp-float');
    oldFloats.forEach(el => el.remove());

    // 2. Create the wrapper container
    const container = document.createElement('div');
    container.className = 'chat-widget-container';
    
    // 3. Inject Widget HTML
    container.innerHTML = `
        <!-- Chat Toggle Button -->
        <button class="chat-widget-toggle" id="chatWidgetToggle" aria-label="Open Chat Support">
            <svg viewBox="0 0 100 100" fill="currentColor" class="chat-toggle-icon" id="chatToggleIcon">
                <!-- Rounded speech bubble shape matching the user's uploaded image -->
                <rect x="10" y="15" width="80" height="55" rx="12" ry="12"></rect>
                <polygon points="25,70 25,85 45,70"></polygon>
                <circle cx="35" cy="42" r="5" fill="#ffffff"></circle>
                <circle cx="50" cy="42" r="5" fill="#ffffff"></circle>
                <circle cx="65" cy="42" r="5" fill="#ffffff"></circle>
            </svg>
            <i class="fa-solid fa-xmark chat-close-icon" id="chatCloseIcon"></i>
        </button>

        <!-- Chat Popup Box -->
        <div class="chat-widget-popup" id="chatWidgetPopup">
            <div class="chat-popup-header">
                <div class="chat-header-avatar">B</div>
                <div class="chat-header-info">
                    <h4>Bharat Driving School</h4>
                    <span class="chat-status"><span class="status-dot"></span> Online • Support Desk</span>
                </div>
                <button class="chat-popup-close-btn" id="chatPopupClose" aria-label="Close Chat">&times;</button>
            </div>
            
            <div class="chat-popup-body">
                <div class="chat-welcome-message">
                    👋 Welcome! What can we help you with today?
                </div>

                <!-- Interactive Help Options -->
                <div class="chat-helper-options">
                    <button class="chat-option-btn" data-topic="Learn Driving">Learn Driving</button>
                    <button class="chat-option-btn" data-topic="Fees & Packages">Fees & Packages</button>
                    <button class="chat-option-btn" data-topic="Driving License Support">Driving License Support</button>
                    <button class="chat-option-btn" data-topic="Nearest Branch">Nearest Branch</button>
                    <button class="chat-option-btn" data-topic="Book Demo Class">Book Demo Class</button>
                </div>

                <!-- Form Fields (In Scrollable Body) -->
                <form class="chat-contact-form" id="chatWidgetForm">
                    <input type="hidden" id="chatSelectedTopic" value="">
                    
                    <div class="form-group-chat">
                        <label for="chatUserName">Name*</label>
                        <input type="text" id="chatUserName" placeholder="Enter your name" required>
                    </div>
                    
                    <div class="form-group-chat">
                        <label for="chatUserPhone">Mobile Number*</label>
                        <input type="tel" id="chatUserPhone" placeholder="Enter your mobile number" required>
                    </div>
                </form>
            </div>

            <!-- Sticky/Fixed Footer Form Area (Only contains the Start Chat button linking to the form) -->
            <div class="chat-popup-footer">
                <button type="submit" form="chatWidgetForm" class="chat-submit-btn">Start Chat</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // 4. Select DOM Elements
    const toggleBtn = document.getElementById('chatWidgetToggle');
    const popup = document.getElementById('chatWidgetPopup');
    const popupClose = document.getElementById('chatPopupClose');
    const toggleIcon = document.getElementById('chatToggleIcon');
    const closeIcon = document.getElementById('chatCloseIcon');
    const optionButtons = document.querySelectorAll('.chat-option-btn');
    const hiddenTopicInput = document.getElementById('chatSelectedTopic') as HTMLInputElement;
    const form = document.getElementById('chatWidgetForm') as HTMLFormElement;

    if (!toggleBtn || !popup || !popupClose || !toggleIcon || !closeIcon || !form) return;

    // 5. Toggle Popup Visibility
    const togglePopup = () => {
        const isOpen = popup.classList.contains('open');
        if (isOpen) {
            popup.classList.remove('open');
            toggleIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        } else {
            popup.classList.add('open');
            toggleIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopup();
    });

    popupClose.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.classList.remove('open');
        toggleIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });

    // Close on clicking outside the widget
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (popup.classList.contains('open') && !container.contains(target)) {
            popup.classList.remove('open');
            toggleIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });

    // 6. Handle Interactive Options Selection (Multi-Select Support)
    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('selected');
            
            // Gather all selected topics
            const selectedTopics: string[] = [];
            const selectedButtons = container.querySelectorAll('.chat-option-btn.selected');
            selectedButtons.forEach(b => {
                const topic = b.getAttribute('data-topic');
                if (topic) selectedTopics.push(topic);
            });
            
            hiddenTopicInput.value = selectedTopics.join(', ');
        });
    });

    // 7. Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const topic = hiddenTopicInput.value || 'General Inquiry';
        const name = (document.getElementById('chatUserName') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('chatUserPhone') as HTMLInputElement).value.trim();

        // Phone Validation (Indian 10-Digit Mobile Numbers starting with 6-9)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showToast('Please enter a valid 10-digit mobile number.', 'error');
            return;
        }

        // WhatsApp Message Format
        const text = `*Bharat Driving School - Chat Support Inquiry*
-----------------------------
*Inquiry Topic:* ${topic}
*Customer Name:* ${name}
*Mobile Number:* ${phone}
-----------------------------
_Sent via Driving School Chat Widget._`;

        const encodedMessage = encodeURIComponent(text);
        const whatsappNumber = '919922211238'; // Firm's primary contact number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Reset widget state
        form.reset();
        optionButtons.forEach(b => b.classList.remove('selected'));
        hiddenTopicInput.value = '';
        popup.classList.remove('open');
        toggleIcon.style.display = 'block';
        closeIcon.style.display = 'none';

        // Redirect user
        showToast('Connecting you with a coordinator on WhatsApp...', 'success');
        setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 1500);
    });
}
