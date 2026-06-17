export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Displays a beautiful toast notification.
 * @param message The message to show in the toast.
 * @param type The type of toast ('success', 'error', 'warning', 'info'). Defaults to 'info'.
 * @param duration The duration in milliseconds before the toast auto-dismisses. Defaults to 4000.
 */
export function showToast(message: string, type: ToastType = 'info', duration: number = 4000): void {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    // Select icon based on type
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') {
        iconClass = 'fa-solid fa-circle-check';
    } else if (type === 'error') {
        iconClass = 'fa-solid fa-circle-exclamation';
    } else if (type === 'warning') {
        iconClass = 'fa-solid fa-triangle-exclamation';
    }

    toast.innerHTML = `
        <div class="toast-icon"><i class="${iconClass}"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;

    container.appendChild(toast);

    const dismissToast = () => {
        if (!toast.parentNode) return; // Already removed
        toast.classList.add('toast-dismiss');
        toast.addEventListener('animationend', () => {
            toast.remove();
            if (container && container.children.length === 0) {
                container.remove();
            }
        });
    };

    // Close button event
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissToast();
        });
    }

    // Auto dismiss
    setTimeout(dismissToast, duration);
}
