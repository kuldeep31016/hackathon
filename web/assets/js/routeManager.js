// Route Management System for Telemedicine Web App
// Handles client-side routing, role-based navigation, and page transitions

class RouteManager {
    constructor() {
        this.routes = {
            // Public routes (no authentication required)
            public: [
                '/',
                '/index.html',
                '/admin-login.html',
                '/doctor-login.html',
                '/doctor-register.html',
                '/unauthorized.html'
            ],
            
            // Admin routes (admin role required)
            admin: [
                '/admin-dashboard.html',
                '/admin-users.html',
                '/admin-doctors.html',
                '/admin-appointments.html',
                '/admin-analytics.html',
                '/admin-settings.html'
            ],
            
            // Doctor routes (doctor role required)
            doctor: [
                '/doctor-dashboard.html',
                '/doctor-appointments.html',
                '/doctor-patients.html',
                '/doctor-schedule.html',
                '/doctor-consultations.html',
                '/doctor-profile.html'
            ]
        };

        this.navigationMenus = {
            admin: [
                { path: '/admin-dashboard.html', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
                { path: '/admin-users.html', name: 'User Management', icon: 'fas fa-users' },
                { path: '/admin-doctors.html', name: 'Doctor Management', icon: 'fas fa-user-md' },
                { path: '/admin-appointments.html', name: 'Appointments', icon: 'fas fa-calendar' },
                { path: '/admin-analytics.html', name: 'Analytics', icon: 'fas fa-chart-bar' },
                { path: '/admin-settings.html', name: 'Settings', icon: 'fas fa-cog' }
            ],
            doctor: [
                { path: '/doctor-dashboard.html', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
                { path: '/doctor-appointments.html', name: 'My Appointments', icon: 'fas fa-calendar' },
                { path: '/doctor-patients.html', name: 'My Patients', icon: 'fas fa-users' },
                { path: '/doctor-schedule.html', name: 'Schedule', icon: 'fas fa-clock' },
                { path: '/doctor-consultations.html', name: 'Consultations', icon: 'fas fa-video' },
                { path: '/doctor-profile.html', name: 'Profile', icon: 'fas fa-user' }
            ]
        };

        this.init();
    }

    // Initialize route manager
    init() {
        console.log('🧭 RouteManager: Initializing...');
        this.handleInitialLoad();
        this.setupEventListeners();
    }

    // Handle initial page load
    handleInitialLoad() {
        const currentPath = window.location.pathname;
        console.log(`🧭 RouteManager: Current path: ${currentPath}`);

        // Check if user is authenticated
        if (window.authService && window.authService.isAuthenticated()) {
            const userRole = window.authService.getUserRole();
            console.log(`🧭 RouteManager: User authenticated with role: ${userRole}`);

            // If user is on login page but already authenticated, redirect to dashboard
            if (currentPath.includes('login.html')) {
                this.redirectToDashboard(userRole);
                return;
            }

            // Check if current route is allowed for user role
            if (!this.isRouteAllowed(currentPath, userRole)) {
                console.log(`🚫 RouteManager: Route ${currentPath} not allowed for role ${userRole}`);
                this.redirectToDashboard(userRole);
                return;
            }

            // Generate navigation for authenticated user
            this.generateNavigation(userRole);
        } else {
            console.log('🔒 RouteManager: User not authenticated');
            
            // If user is on protected route, redirect to login
            if (!this.isPublicRoute(currentPath)) {
                console.log(`🔒 RouteManager: Redirecting to login from protected route: ${currentPath}`);
                window.location.href = '/admin-login.html';
                return;
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-navigate]')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-navigate');
                this.navigate(path);
            }
        });

        // Listen for logout clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-logout]')) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    }

    // Check if route is public
    isPublicRoute(path) {
        return this.routes.public.some(route => 
            path === route || path.endsWith(route)
        );
    }

    // Check if route is allowed for user role
    isRouteAllowed(path, userRole) {
        if (this.isPublicRoute(path)) return true;
        
        if (userRole === 'admin') {
            return this.routes.admin.some(route => path.endsWith(route));
        } else if (userRole === 'doctor') {
            return this.routes.doctor.some(route => path.endsWith(route));
        }
        
        return false;
    }

    // Redirect to appropriate dashboard
    redirectToDashboard(userRole) {
        console.log(`🧭 RouteManager: Redirecting to ${userRole} dashboard`);
        
        if (userRole === 'admin') {
            window.location.href = '/admin-dashboard.html';
        } else if (userRole === 'doctor') {
            window.location.href = '/doctor-dashboard.html';
        } else {
            window.location.href = '/admin-login.html';
        }
    }

    // Navigate to specific path
    navigate(path) {
        console.log(`🧭 RouteManager: Navigating to ${path}`);
        
        // Check authentication and permissions
        if (window.authService && window.authService.isAuthenticated()) {
            const userRole = window.authService.getUserRole();
            
            if (this.isRouteAllowed(path, userRole)) {
                window.location.href = path;
            } else {
                console.log(`🚫 RouteManager: Access denied to ${path} for role ${userRole}`);
                this.showAccessDeniedMessage();
            }
        } else {
            console.log('🔒 RouteManager: Authentication required for navigation');
            window.location.href = '/admin-login.html';
        }
    }

    // Generate navigation menu based on user role
    generateNavigation(userRole) {
        console.log(`🧭 RouteManager: Generating navigation for role: ${userRole}`);
        
        const navContainer = document.querySelector('[data-navigation]');
        if (!navContainer) return;

        const menuItems = this.navigationMenus[userRole] || [];
        const currentPath = window.location.pathname;

        const navHTML = menuItems.map(item => {
            const isActive = currentPath.endsWith(item.path) ? 'active' : '';
            return `
                <a href="${item.path}" class="nav-item ${isActive}" data-navigate="${item.path}">
                    <i class="${item.icon}"></i>
                    <span class="nav-text">${item.name}</span>
                </a>
            `;
        }).join('');

        navContainer.innerHTML = navHTML;
    }

    // Handle logout
    async handleLogout() {
        console.log('👋 RouteManager: Handling logout');
        
        if (window.authService) {
            await window.authService.logout();
        } else {
            // Fallback logout
            localStorage.clear();
            window.location.href = '/admin-login.html';
        }
    }

    // Show access denied message
    showAccessDeniedMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-danger';
        message.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Access denied. You don't have permission to access this page.
        `;
        
        const container = document.querySelector('.main-content') || document.body;
        container.insertBefore(message, container.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Get breadcrumb for current page
    getBreadcrumb() {
        const currentPath = window.location.pathname;
        const userRole = window.authService ? window.authService.getUserRole() : null;
        
        if (!userRole) return [];

        const menuItems = this.navigationMenus[userRole] || [];
        const currentItem = menuItems.find(item => currentPath.endsWith(item.path));
        
        if (currentItem) {
            return [
                { name: 'Home', path: userRole === 'admin' ? '/admin-dashboard.html' : '/doctor-dashboard.html' },
                { name: currentItem.name, path: currentItem.path }
            ];
        }
        
        return [];
    }

    // Generate breadcrumb HTML
    generateBreadcrumb() {
        const breadcrumbContainer = document.querySelector('[data-breadcrumb]');
        if (!breadcrumbContainer) return;

        const breadcrumb = this.getBreadcrumb();
        
        const breadcrumbHTML = breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? item.name : `<a href="${item.path}" data-navigate="${item.path}">${item.name}</a>`}
                </span>
                ${!isLast ? '<i class="fas fa-chevron-right breadcrumb-separator"></i>' : ''}
            `;
        }).join('');

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    // Initialize user profile display
    initUserProfile() {
        const profileContainer = document.querySelector('[data-user-profile]');
        if (!profileContainer || !window.authService) return;

        const user = window.authService.getUser();
        if (!user) return;

        const profileHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div class="user-info">
                    <div class="user-name">${user.name || 'User'}</div>
                    <div class="user-role">${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</div>
                </div>
                <div class="user-actions">
                    <button class="btn-logout" data-logout>
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        `;

        profileContainer.innerHTML = profileHTML;
    }
}

// Create global instance
window.routeManager = new RouteManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure authService is initialized
    setTimeout(() => {
        if (window.routeManager) {
            window.routeManager.generateBreadcrumb();
            window.routeManager.initUserProfile();
        }
    }, 100);
});

console.log('✅ RouteManager: Module loaded successfully');