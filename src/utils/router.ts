export class Router {
    private pageContent: HTMLElement | null = null;
    private onPageChange: (path: string) => void;

    constructor(onPageChange: (path: string) => void) {
        this.pageContent = document.getElementById('page-content');
        this.onPageChange = onPageChange;
        this.init();
    }

    private init(): void {
        // Intercept clicks on internal links
        document.body.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            
            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && this.isInternalLink(href)) {
                    e.preventDefault();
                    this.navigate(href);
                }
            }
        });

        // Listen for history pops (back/forward)
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname, false);
        });
    }

    private isInternalLink(href: string): boolean {
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return href.startsWith(window.location.origin);
        }
        if (href.startsWith('#')) return false;
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('whatsapp:')) return false;
        return true;
    }

    public navigate(path: string): void {
        this.loadPage(path, true);
    }

    private async loadPage(path: string, pushState = true): Promise<void> {
        this.pageContent = document.getElementById('page-content');
        if (!this.pageContent) return;

        // Apply visual fade-out
        this.pageContent.classList.add('page-transition-fade');
        this.pageContent.style.opacity = '0';

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Could not load page ${path}`);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.getElementById('page-content');
            
            if (newContent) {
                // Wait for the fade-out transition (300ms)
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Swap inner HTML
                this.pageContent.innerHTML = newContent.innerHTML;
                
                // Update Title
                document.title = doc.title;
                
                // Update Meta Description
                const newDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
                const oldDesc = document.querySelector('meta[name="description"]');
                if (newDesc && oldDesc) {
                    oldDesc.setAttribute('content', newDesc);
                }

                // Push path to history bar
                if (pushState) {
                    history.pushState(null, '', path);
                }

                // Update active highlight classes in header
                this.updateActiveNavLink(path);

                // Run bootloader components initializer callback
                this.onPageChange(path);
                
                // Jump back to scroll top instantly
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
        } catch (error) {
            console.error('AJAX dynamic route navigation failed, falling back to full refresh:', error);
            window.location.href = path;
        } finally {
            // Fade back in
            if (this.pageContent) {
                this.pageContent.style.opacity = '1';
                setTimeout(() => {
                    if (this.pageContent) {
                        this.pageContent.classList.remove('page-transition-fade');
                    }
                }, 300);
            }
        }
    }

    private updateActiveNavLink(path: string): void {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Match exact name or index default
                const cleanPath = path.substring(path.lastIndexOf('/') + 1);
                if (cleanPath === href || (cleanPath === '' && href === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
}
