// pims/static/js/base.js - Core JavaScript for PIMS (Parliament IT Inventory Management System)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize PIMS application
    PIMS.init();
});

// Main PIMS namespace
const PIMS = {
    // Configuration
    config: {
        searchDelay: 300,
        alertDuration: 5000,
        animationDuration: 300,
        sidebarBreakpoint: 1024
    },

    // Initialize application
    init: function() {
        console.log('Initializing PIMS...');
        
        this.initSidebar();
        this.initNavigation();
        this.initAlerts();
        this.initTooltips();
        this.initModals();
        this.initTables();
        this.initForms();
        this.initImageHandling();
        this.initCharts();
        
        console.log('PIMS initialized successfully');
    },

    // ===== SIDEBAR FUNCTIONALITY =====
    initSidebar: function() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebarToggle && sidebar) {
            // Toggle sidebar on button click
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('show');
                
                // Update ARIA attributes for accessibility
                const isOpen = sidebar.classList.contains('show');
                sidebarToggle.setAttribute('aria-expanded', isOpen);
                sidebar.setAttribute('aria-hidden', !isOpen);
            });

            // Close sidebar when clicking outside on mobile/tablet
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= PIMS.config.sidebarBreakpoint) {
                    if (!sidebar.contains(e.target) && 
                        !sidebarToggle.contains(e.target) && 
                        sidebar.classList.contains('show')) {
                        sidebar.classList.remove('show');
                        sidebarToggle.setAttribute('aria-expanded', 'false');
                        sidebar.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > PIMS.config.sidebarBreakpoint) {
                    sidebar.classList.remove('show');
                    sidebarToggle.setAttribute('aria-expanded', 'false');
                    sidebar.setAttribute('aria-hidden', 'false');
                }
            });
        }

        // Initialize collapsible menu items
        this.initCollapsibleMenus();
    },

    // Handle collapsible sidebar menus (Reports, etc.)
    initCollapsibleMenus: function() {
        const collapseButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
        
        collapseButtons.forEach(button => {
            const chevron = button.querySelector('.bi-chevron-down, .bi-chevron-up');
            
            if (chevron) {
                button.addEventListener('click', function() {
                    setTimeout(() => {
                        const isExpanded = button.getAttribute('aria-expanded') === 'true';
                        chevron.classList.toggle('bi-chevron-down', !isExpanded);
                        chevron.classList.toggle('bi-chevron-up', isExpanded);
                    }, 50);
                });
            }
        });
    },

    // ===== NAVIGATION FUNCTIONALITY =====
    initNavigation: function() {
        // Highlight active navigation
        this.highlightActiveNav();
        
        // Smooth scrolling for anchor links
        this.initSmoothScrolling();
        
        // Dropdown menu enhancements
        this.initDropdowns();
    },

    // Highlight active navigation items
    highlightActiveNav: function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Add active class for current page
            if (href && (currentPath === href || 
                       (href !== '/' && currentPath.startsWith(href)))) {
                link.classList.add('active');
                
                // If it's a submenu item, expand parent menu
                const parentCollapse = link.closest('.collapse');
                if (parentCollapse) {
                    const bsCollapse = new bootstrap.Collapse(parentCollapse, {show: true});
                    
                    // Update chevron icon
                    const toggleButton = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
                    if (toggleButton) {
                        const chevron = toggleButton.querySelector('.bi-chevron-down');
                        if (chevron) {
                            chevron.classList.remove('bi-chevron-down');
                            chevron.classList.add('bi-chevron-up');
                        }
                    }
                }
            }
        });
    },

    // Smooth scrolling for anchor links
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.length > 1) { // More than just "#"
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    },

    // Enhanced dropdown functionality
    initDropdowns: function() {
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('show.bs.dropdown', function() {
                this.setAttribute('aria-expanded', 'true');
            });
            
            dropdown.addEventListener('hide.bs.dropdown', function() {
                this.setAttribute('aria-expanded', 'false');
            });
        });
    },

    // ===== ALERT FUNCTIONALITY =====
    initAlerts: function() {
        // Auto-dismiss alerts
        this.initAutoDismissAlerts();
        
        // Enhanced alert interactions
        this.initAlertInteractions();
    },

    // Auto-dismiss functionality for alerts
    initAutoDismissAlerts: function() {
        const alerts = document.querySelectorAll('.alert[data-auto-dismiss="true"]');
        
        alerts.forEach(alert => {
            setTimeout(() => {
                const alertInstance = bootstrap.Alert.getOrCreateInstance(alert);
                if (alertInstance && alert.classList.contains('show')) {
                    alertInstance.close();
                }
            }, PIMS.config.alertDuration);
        });
    },

    // Enhanced alert interactions
    initAlertInteractions: function() {
        document.querySelectorAll('.alert .btn-close').forEach(button => {
            button.addEventListener('click', function() {
                const alert = this.closest('.alert');
                if (alert) {
                    alert.style.transition = 'all 0.3s ease';
                    alert.style.opacity = '0';
                    alert.style.transform = 'translateX(100%)';
                }
            });
        });
    },

    // ===== TOOLTIPS AND POPOVERS =====
    initTooltips: function() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                animation: true,
                delay: { show: 500, hide: 100 }
            });
        });

        // Initialize Bootstrap popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    },

    // ===== MODAL FUNCTIONALITY =====
    initModals: function() {
        // Confirmation modals
        this.initConfirmModals();
        
        // QR Code modals
        this.initQRCodeModals();
        
        // Image preview modals
        this.initImageModals();
    },

    // Confirmation modals for delete actions
    initConfirmModals: function() {
        document.querySelectorAll('[data-confirm]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const message = this.getAttribute('data-confirm') || 'Are you sure?';
                const title = this.getAttribute('data-confirm-title') || 'Confirm Action';
                
                if (confirm(`${title}\n\n${message}`)) {
                    // If it's a form, submit it
                    const form = this.closest('form');
                    if (form) {
                        form.submit();
                    } else {
                        // If it's a link, follow it
                        const href = this.getAttribute('href');
                        if (href) {
                            window.location.href = href;
                        }
                    }
                }
            });
        });
    },

    // QR Code modal functionality
    initQRCodeModals: function() {
        document.querySelectorAll('[data-qr-code]').forEach(button => {
            button.addEventListener('click', function() {
                const qrData = this.getAttribute('data-qr-code');
                const deviceId = this.getAttribute('data-device-id') || 'Device';
                
                // Create or update QR modal
                let modal = document.getElementById('qrCodeModal');
                if (!modal) {
                    modal = this.createQRModal();
                }
                
                // Generate QR code (you would integrate with a QR library here)
                const qrContainer = modal.querySelector('.qr-code-container');
                qrContainer.innerHTML = `
                    <div class="text-center p-4">
                        <div class="bg-light p-3 rounded">
                            <strong>QR Code for ${deviceId}</strong><br>
                            <small class="text-muted">${qrData}</small>
                        </div>
                    </div>
                `;
                
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            });
        });
    },

    // Create QR modal dynamically
    createQRModal: function() {
        const modalHTML = `
            <div class="modal fade" id="qrCodeModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Device QR Code</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="qr-code-container"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="window.print()">Print</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return document.getElementById('qrCodeModal');
    },

    // Image preview modals
    initImageModals: function() {
        document.querySelectorAll('.image-preview').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                const src = this.src;
                const alt = this.alt || 'Image Preview';
                
                // Create or update image modal
                let modal = document.getElementById('imagePreviewModal');
                if (!modal) {
                    modal = this.createImageModal();
                }
                
                const modalImg = modal.querySelector('.modal-image');
                const modalTitle = modal.querySelector('.modal-title');
                
                modalImg.src = src;
                modalTitle.textContent = alt;
                
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            });
        });
    },

    // Create image preview modal
    createImageModal: function() {
        const modalHTML = `
            <div class="modal fade" id="imagePreviewModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Image Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img class="modal-image img-fluid" src="" alt="">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return document.getElementById('imagePreviewModal');
    },

    // ===== TABLE FUNCTIONALITY =====
    initTables: function() {
        // Table sorting
        this.initTableSorting();
        
        // Table row selection
        this.initTableSelection();
        
        // Responsive table enhancements
        this.initResponsiveTables();
    },

    // Table sorting functionality
    initTableSorting: function() {
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const table = this.closest('table');
                const column = this.getAttribute('data-sort');
                const currentOrder = this.getAttribute('data-order') || 'asc';
                const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                
                // Update header indicators
                table.querySelectorAll('th[data-sort]').forEach(th => {
                    th.removeAttribute('data-order');
                    th.classList.remove('sorted-asc', 'sorted-desc');
                });
                
                this.setAttribute('data-order', newOrder);
                this.classList.add(`sorted-${newOrder}`);
                
                // Perform sorting (this would typically trigger a server request)
                console.log(`Sorting by ${column} in ${newOrder} order`);
            });
        });
    },

    // Table row selection
    initTableSelection: function() {
        // Select all checkbox functionality
        document.querySelectorAll('input[data-select-all]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const targetCheckboxes = document.querySelectorAll(`input[${this.getAttribute('data-select-all')}]`);
                targetCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                
                PIMS.updateBulkActions();
            });
        });

        // Individual checkbox functionality
        document.querySelectorAll('input[data-select-item]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                PIMS.updateBulkActions();
            });
        });
    },

    // Update bulk action buttons based on selection
    updateBulkActions: function() {
        const selectedItems = document.querySelectorAll('input[data-select-item]:checked');
        const bulkActions = document.querySelectorAll('.bulk-actions');
        
        bulkActions.forEach(actionGroup => {
            actionGroup.style.display = selectedItems.length > 0 ? 'block' : 'none';
            
            const countElement = actionGroup.querySelector('.selection-count');
            if (countElement) {
                countElement.textContent = selectedItems.length;
            }
        });
    },

    // Responsive table enhancements
    initResponsiveTables: function() {
        // Add mobile-friendly data attributes
        document.querySelectorAll('.table-responsive table').forEach(table => {
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            
            table.querySelectorAll('tbody tr').forEach(row => {
                Array.from(row.querySelectorAll('td')).forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index]);
                    }
                });
            });
        });
    },

    // ===== FORM FUNCTIONALITY =====
    initForms: function() {
        // Form validation
        this.initFormValidation();
        
        // Image upload handling
        this.initImageUpload();
        
        // Auto-save functionality
        this.initAutoSave();
    },

    // Form validation
    initFormValidation: function() {
        document.querySelectorAll('.needs-validation').forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });

        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    },

    // ===== IMAGE HANDLING =====
    initImageHandling: function() {
        this.initImageUpload();
        this.initImagePreviews();
    },

    // Image upload with preview
    initImageUpload: function() {
        document.querySelectorAll('input[type="file"][accept*="image"]').forEach(input => {
            input.addEventListener('change', function() {
                const file = this.files[0];
                const previewContainer = document.querySelector(`[data-preview-for="${this.id}"]`);
                
                if (file && previewContainer) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        let img = previewContainer.querySelector('img');
                        if (!img) {
                            img = document.createElement('img');
                            img.className = 'img-thumbnail';
                            img.style.maxWidth = '200px';
                            img.style.maxHeight = '200px';
                            previewContainer.appendChild(img);
                        }
                        img.src = e.target.result;
                        img.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    },

    // Image preview functionality
    initImagePreviews: function() {
        document.querySelectorAll('.image-preview').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                // Create modal if it doesn't exist
                let modal = document.getElementById('imageModal');
                if (!modal) {
                    modal = PIMS.createImageModal();
                }
                
                const modalImg = modal.querySelector('.modal-body img');
                modalImg.src = this.src;
                modalImg.alt = this.alt;
                
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            });
        });
    },

    // Auto-save functionality
    initAutoSave: function() {
        document.querySelectorAll('form[data-auto-save]').forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    clearTimeout(this.autoSaveTimeout);
                    this.autoSaveTimeout = setTimeout(() => {
                        PIMS.autoSaveForm(form);
                    }, 2000); // Auto-save after 2 seconds of inactivity
                });
            });
        });
    },

    // Auto-save form data
    autoSaveForm: function(form) {
        const formData = new FormData(form);
        const saveData = {};
        
        for (let [key, value] of formData.entries()) {
            saveData[key] = value;
        }
        
        // Save to localStorage
        const formId = form.id || 'autoSaveForm';
        localStorage.setItem(`autoSave_${formId}`, JSON.stringify(saveData));
        
        // Show auto-save indicator
        this.showAutoSaveIndicator();
    },

    // Show auto-save indicator
    showAutoSaveIndicator: function() {
        let indicator = document.getElementById('autoSaveIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'autoSaveIndicator';
            indicator.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-sm';
            indicator.innerHTML = '<i class="bi bi-check-circle me-1"></i>Auto-saved';
            document.body.appendChild(indicator);
        }
        
        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    },

    // ===== CHART FUNCTIONALITY =====
    initCharts: function() {
        // Initialize Chart.js charts if available
        if (typeof Chart !== 'undefined') {
            this.initDashboardCharts();
        }
    },

    // Initialize dashboard charts
    initDashboardCharts: function() {
        // Device Status Chart
        const deviceStatusChart = document.getElementById('deviceStatusChart');
        if (deviceStatusChart) {
            new Chart(deviceStatusChart, {
                type: 'doughnut',
                data: {
                    labels: ['Available', 'Assigned', 'Maintenance', 'Retired'],
                    datasets: [{
                        data: [45, 30, 15, 10],
                        backgroundColor: [
                            '#14b8a6', // teal
                            '#f97316', // orange
                            '#eab308', // yellow
                            '#ef4444'  // red
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Maintenance Timeline Chart
        const maintenanceChart = document.getElementById('maintenanceChart');
        if (maintenanceChart) {
            new Chart(maintenanceChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Completed',
                        data: [12, 19, 15, 25, 22, 30],
                        borderColor: '#14b8a6',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Scheduled',
                        data: [8, 15, 12, 18, 16, 24],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },

    // ===== SEARCH FUNCTIONALITY =====
    initSearch: function() {
        const searchInputs = document.querySelectorAll('input[type="search"]');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                
                searchTimeout = setTimeout(() => {
                    if (this.value.length >= 2 || this.value.length === 0) {
                        PIMS.performSearch(this.value, this);
                    }
                }, PIMS.config.searchDelay);
            });
        });
    },

    // Perform search
    performSearch: function(query, input) {
        const searchContainer = input.closest('.search-container');
        const resultsContainer = searchContainer?.querySelector('.search-results');
        
        if (!resultsContainer) return;
        
        if (query.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        // Show loading state
        resultsContainer.innerHTML = '<div class="p-2 text-center"><i class="bi bi-hourglass-split"></i> Searching...</div>';
        resultsContainer.style.display = 'block';
        
        // Simulate API call (replace with actual search endpoint)
        setTimeout(() => {
            const mockResults = [
                { title: 'Device DEV-001', type: 'device', url: '#' },
                { title: 'John Doe', type: 'user', url: '#' },
                { title: 'Conference Room A', type: 'location', url: '#' }
            ];
            
            if (mockResults.length > 0) {
                resultsContainer.innerHTML = mockResults.map(result => 
                    `<a href="${result.url}" class="d-block p-2 text-decoration-none border-bottom">
                        <i class="bi bi-${this.getIconForType(result.type)} me-2"></i>
                        ${result.title}
                        <small class="text-muted ms-2">${result.type}</small>
                    </a>`
                ).join('');
            } else {
                resultsContainer.innerHTML = '<div class="p-2 text-muted">No results found</div>';
            }
        }, 500);
    },

    // Get icon for search result type
    getIconForType: function(type) {
        const icons = {
            device: 'laptop',
            user: 'person',
            location: 'geo-alt',
            vendor: 'building'
        };
        return icons[type] || 'search';
    },

    // ===== UTILITY FUNCTIONS =====
    
    // Show loading overlay
    showLoading: function() {
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
            overlay.style.cssText = 'background: rgba(255, 255, 255, 0.8); z-index: 9999;';
            overlay.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="text-muted">Please wait...</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    },

    // Hide loading overlay
    hideLoading: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    // Show toast notification
    showToast: function(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, { delay: duration });
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    },

    // Create toast container
    createToastContainer: function() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }
};

// Global utility functions
window.showLoading = PIMS.showLoading.bind(PIMS);
window.hideLoading = PIMS.hideLoading.bind(PIMS);
window.showToast = PIMS.showToast.bind(PIMS);

// Global error handler for AJAX requests
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    PIMS.hideLoading();
    PIMS.showToast('An error occurred. Please try again.', 'danger');
});

// Performance monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd > 0) {
                console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }
        }, 0);
    }
});

// Service worker registration for PWA features
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
    });
}