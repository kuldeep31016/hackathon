// Enhanced Authentication Service for Telemedicine Web App
// Handles login, logout, role-based routing, and session management

class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.tokenKey = 'nabha_auth_token';
        this.userKey = 'nabha_user_data';
        this.refreshKey = 'nabha_refresh_token';
        
        // Initialize auth state
        this.init();
    }

    // Initialize authentication service
    init() {
        console.log('🔐 AuthService: Initializing...');
        this.checkAuthState();
        this.setupInterceptors();
    }

    // Check current authentication state
    checkAuthState() {
        const token = this.getToken();
        const user = this.getUser();
        
        if (token && user) {
            console.log('✅ AuthService: User is authenticated', { role: user.role, email: user.email });
            return true;
        } else {
            console.log('❌ AuthService: User is not authenticated');
            return false;
        }
    }

    // Setup API interceptors for automatic token handling
    setupInterceptors() {
        // Override fetch to automatically include auth headers
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            const token = this.getToken();
            
            if (token && !url.includes('/auth/login')) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
            }
            
            const response = await originalFetch(url, options);
            
            // Handle 401 unauthorized responses
            if (response.status === 401 && !url.includes('/auth/login')) {
                console.log('🔒 AuthService: Token expired, logging out...');
                this.logout();
                this.redirectToLogin();
            }
            
            return response;
        };
    }

    // Login function with role-based redirection
    async login(credentials) {
        try {
            console.log('🚀 AuthService: Attempting login...', { email: credentials.email });
            
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store authentication data
                this.storeAuthData(data);
                
                console.log('✅ AuthService: Login successful', { 
                    role: data.user.role, 
                    email: data.user.email 
                });

                // Role-based redirection
                this.redirectAfterLogin(data.user.role);
                
                return { success: true, user: data.user };
            } else {
                throw new Error(data.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('❌ AuthService: Login failed', error);
            return { success: false, error: error.message };
        }
    }

    // Store authentication data securely
    storeAuthData(authData) {
        try {
            localStorage.setItem(this.tokenKey, authData.token);
            localStorage.setItem(this.userKey, JSON.stringify(authData.user));
            
            if (authData.refreshToken) {
                localStorage.setItem(this.refreshKey, authData.refreshToken);
            }
            
            console.log('💾 AuthService: Auth data stored successfully');
        } catch (error) {
            console.error('❌ AuthService: Failed to store auth data', error);
        }
    }

    // Role-based redirection after successful login
    redirectAfterLogin(role) {
        console.log(`🧭 AuthService: Redirecting user with role: ${role}`);
        
        switch (role) {
            case 'admin':
                window.location.href = '/admin-dashboard.html';
                break;
            case 'doctor':
                window.location.href = '/doctor-dashboard.html';
                break;
            case 'patient':
                // Redirect to patient portal if needed
                window.location.href = '/patient-dashboard.html';
                break;
            default:
                console.warn('⚠️ AuthService: Unknown role, redirecting to login');
                window.location.href = '/admin-login.html';
        }
    }

    // Logout function
    async logout() {
        try {
            const token = this.getToken();
            
            if (token) {
                // Call logout endpoint
                await fetch(`${this.baseURL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            // Clear local storage
            this.clearAuthData();
            
            console.log('👋 AuthService: Logout successful');
            
            // Redirect to login
            this.redirectToLogin();
            
        } catch (error) {
            console.error('❌ AuthService: Logout error', error);
            // Still clear local data even if API call fails
            this.clearAuthData();
            this.redirectToLogin();
        }
    }

    // Clear all authentication data
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.refreshKey);
        console.log('🗑️ AuthService: Auth data cleared');
    }

    // Get stored token
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Get stored user data
    getUser() {
        try {
            const userData = localStorage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('❌ AuthService: Error parsing user data', error);
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    // Check if user has specific role
    hasRole(role) {
        const user = this.getUser();
        return user && user.role === role;
    }

    // Get user role
    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }

    // Redirect to appropriate login page
    redirectToLogin() {
        window.location.href = '/admin-login.html';
    }

    // Protect routes based on authentication and role
    protectRoute(requiredRole = null) {
        if (!this.isAuthenticated()) {
            console.log('🔒 AuthService: Route protection - Not authenticated');
            this.redirectToLogin();
            return false;
        }

        if (requiredRole && !this.hasRole(requiredRole)) {
            console.log(`🔒 AuthService: Route protection - Insufficient role (required: ${requiredRole})`);
            this.redirectToUnauthorized();
            return false;
        }

        return true;
    }

    // Redirect to unauthorized page
    redirectToUnauthorized() {
        window.location.href = '/unauthorized.html';
    }

    // Refresh authentication token
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem(this.refreshKey);
            
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Update stored token
                localStorage.setItem(this.tokenKey, data.token);
                console.log('🔄 AuthService: Token refreshed successfully');
                return true;
            } else {
                throw new Error(data.message || 'Token refresh failed');
            }
            
        } catch (error) {
            console.error('❌ AuthService: Token refresh failed', error);
            this.logout();
            return false;
        }
    }

    // Get current user profile from API
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.baseURL}/auth/me`);
            const data = await response.json();

            if (response.ok) {
                // Update stored user data
                localStorage.setItem(this.userKey, JSON.stringify(data.user));
                return data.user;
            } else {
                throw new Error(data.message || 'Failed to get user profile');
            }
            
        } catch (error) {
            console.error('❌ AuthService: Failed to get current user', error);
            return null;
        }
    }

    // Initialize page protection
    initPageProtection() {
        // Get current page
        const currentPage = window.location.pathname;
        
        // Define protected routes and their requirements
        const protectedRoutes = {
            '/admin-dashboard.html': 'admin',
            '/admin-users.html': 'admin',
            '/admin-doctors.html': 'admin',
            '/admin-analytics.html': 'admin',
            '/doctor-dashboard.html': 'doctor',
            '/doctor-appointments.html': 'doctor',
            '/doctor-patients.html': 'doctor',
            '/doctor-schedule.html': 'doctor'
        };

        // Check if current page is protected
        const requiredRole = protectedRoutes[currentPage];
        
        if (requiredRole) {
            console.log(`🛡️ AuthService: Protecting route ${currentPage} (requires: ${requiredRole})`);
            this.protectRoute(requiredRole);
        }
    }
}

// Create global instance
window.authService = new AuthService();

// Initialize page protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authService.initPageProtection();
});

console.log('✅ AuthService: Module loaded successfully');