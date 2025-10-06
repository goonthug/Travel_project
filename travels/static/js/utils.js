// Attach utils to window object for global access
window.utils = {
    // Get CSRF token from cookie
    getCookie: function(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    // Check authentication
    checkAuth: async function(setIsAuthenticated, setLoading) {
        try {
            const response = await fetch('/api/get_cities/', { credentials: 'include' });
            setIsAuthenticated(response.ok);
            setLoading(false);
        } catch (err) {
            console.error('Auth check error:', err);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }
};