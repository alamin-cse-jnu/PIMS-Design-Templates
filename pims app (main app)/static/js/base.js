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

        // Initialize click-based submenu functionality
        this.initClickBasedMenus();
    },

    // Handle click-based sidebar submenus
    initClickBasedMenus: function() {
        // For now, show all submenus by default (like original hover behavior)
        const allSubmenus = document.querySelectorAll('.submenu');
        allSubmenus.forEach(submenu => {
            submenu.classList.add('show');
        });

        const menuToggleLinks = document.querySelectorAll('.nav-link-toggle[data-toggle="submenu"]');
        
        menuToggleLinks.forEach(toggleLink => {
            toggleLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const parentNavItem = this.closest('.nav-item');
                const submenu = parentNavItem.querySelector('.submenu');
                const toggleIcon = this.querySelector('.toggle-icon');
                
                if (submenu) {
                    // Check if submenu is currently open
                    const isOpen = submenu.classList.contains('show');
                    
                    // Close all other submenus first
                    document.querySelectorAll('.submenu.show').forEach(openSubmenu => {
                        if (openSubmenu !== submenu) {
                            openSubmenu.classList.remove('show');
                            const otherToggleLink = openSubmenu.closest('.nav-item').querySelector('.nav-link-toggle');
                            const otherToggleIcon = otherToggleLink.querySelector('.toggle-icon');
                            otherToggleLink.classList.remove('expanded');
                            if (otherToggleIcon) {
                                otherToggleIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current submenu
                    if (isOpen) {
                        submenu.classList.remove('show');
                        this.classList.remove('expanded');
                        if (toggleIcon) {
                            toggleIcon.style.transform = 'rotate(0deg)';
                        }
                    } else {
                        submenu.classList.add('show');
                        this.classList.add('expanded');
                        if (toggleIcon) {
                            toggleIcon.style.transform = 'rotate(180deg)';
                        }
                    }
                }
            });
        });

        // Handle regular navigation links that should also navigate
        const regularNavLinks = document.querySelectorAll('.nav-link-toggle[data-toggle="submenu"]');
        regularNavLinks.forEach(link => {
            // Allow Ctrl+Click or middle-click to open in new tab/window
            link.addEventListener('click', function(e) {
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                    const href = this.getAttribute('href');
                    if (href && href !== '#') {
                        window.open(href, '_blank');
                    }
                }
            });
        });
    },

    // Legacy collapsible menu support (for Bootstrap collapse)
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
                const parentSubmenu = link.closest('.submenu');
                if (parentSubmenu) {
                    parentSubmenu.classList.add('show');
                    
                    // Update parent toggle link
                    const parentNavItem = parentSubmenu.closest('.nav-item');
                    const toggleLink = parentNavItem.querySelector('.nav-link-toggle');
                    const toggleIcon = toggleLink.querySelector('.toggle-icon');
                    
                    if (toggleLink) {
                        toggleLink.classList.add('expanded');
                        if (toggleIcon) {
                            toggleIcon.style.transform = 'rotate(180deg)';
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
                    alert.style.opacity = '0';
                    setTimeout(() => {
                        alert.remove();
                    }, 150);
                }
            });
        });
    },

    // ===== TOOLTIP FUNCTIONALITY =====
    initTooltips: function() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    },

    // ===== MODAL FUNCTIONALITY =====
    initModals: function() {
        // Enhanced modal functionality
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('show.bs.modal', function() {
                document.body.classList.add('modal-open');
            });
            
            modal.addEventListener('hidden.bs.modal', function() {
                document.body.classList.remove('modal-open');
                
                // Clear any dynamic content
                const dynamicContent = this.querySelector('.modal-dynamic-content');
                if (dynamicContent) {
                    dynamicContent.innerHTML = '';
                }
            });
        });
    },

    // ===== TABLE FUNCTIONALITY =====
    initTables: function() {
        // Initialize table sorting
        this.initTableSorting();
        
        // Initialize row selection
        this.initTableSelection();
        
        // Initialize responsive tables
        this.initResponsiveTables();
    },

    // Table sorting functionality
    initTableSorting: function() {
        const sortableHeaders = document.querySelectorAll('th[data-sort]');
        
        sortableHeaders.forEach(header => {
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
        });
    },

    // Responsive table handling
    initResponsiveTables: function() {
        const tables = document.querySelectorAll('.table-responsive');
        
        tables.forEach(table => {
            // Add scroll indicators
            const wrapper = table.parentElement;
            if (wrapper) {
                table.addEventListener('scroll', function() {
                    const isScrolledLeft = this.scrollLeft > 0;
                    const isScrolledRight = this.scrollLeft < (this.scrollWidth - this.clientWidth);
                    
                    wrapper.classList.toggle('scrolled-left', isScrolledLeft);
                    wrapper.classList.toggle('scrolled-right', isScrolledRight);
                });
            }
        });
    },

    // ===== FORM FUNCTIONALITY =====
    initForms: function() {
        // Form validation
        this.initFormValidation();
        
        // Enhanced form interactions
        this.initFormInteractions();
        
        // File upload handling
        this.initFileUploads();
    },

    // Form validation
    initFormValidation: function() {
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    },

    // Enhanced form interactions
    initFormInteractions: function() {
        // Auto-resize textareas
        const textareas = document.querySelectorAll('textarea[data-auto-resize]');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });

        // Character counters
        const inputsWithCounter = document.querySelectorAll('input[data-max-length], textarea[data-max-length]');
        inputsWithCounter.forEach(input => {
            const maxLength = input.getAttribute('data-max-length');
            const counter = document.createElement('small');
            counter.className = 'form-text text-muted';
            input.parentNode.appendChild(counter);
            
            const updateCounter = () => {
                const remaining = maxLength - input.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.classList.toggle('text-danger', remaining < 0);
            };
            
            input.addEventListener('input', updateCounter);
            updateCounter();
        });
    },

    // File upload handling
    initFileUploads: function() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const files = Array.from(this.files);
                const fileList = this.parentNode.querySelector('.file-list') || 
                               this.parentNode.appendChild(document.createElement('div'));
                fileList.className = 'file-list mt-2';
                
                fileList.innerHTML = files.map(file => 
                    `<div class="file-item d-flex align-items-center p-2 border rounded mb-1">
                        <i class="bi bi-file-earmark me-2"></i>
                        <span class="flex-grow-1">${file.name}</span>
                        <small class="text-muted">${(file.size / 1024).toFixed(1)} KB</small>
                    </div>`
                ).join('');
            });
        });
    },

    // ===== IMAGE HANDLING =====
    initImageHandling: function() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    // ===== CHART INITIALIZATION =====
    initCharts: function() {
        // Device Status Chart
        const deviceChart = document.getElementById('deviceChart');
        if (deviceChart && typeof Chart !== 'undefined') {
            new Chart(deviceChart, {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Maintenance', 'Retired'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: ['#14b8a6', '#f97316', '#ef4444'],
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
        if (maintenanceChart && typeof Chart !== 'undefined') {
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

// Export PIMS for use in other scripts
window.PIMS = PIMS;