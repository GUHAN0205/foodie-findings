const API_BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('foodie_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || data || response.statusText || 'API Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request('/auth/me'),
  },

  // Listings
  listings: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.query) query.append('query', params.query);
      if (params.category && params.category !== 'ALL') query.append('category', params.category);
      if (params.foodType) query.append('foodType', params.foodType);
      if (params.status) query.append('status', params.status);
      const qs = query.toString();
      return request(`/food-listings${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => request(`/food-listings/${id}`),
    create: (listingData) =>
      request('/food-listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
      }),
    update: (id, listingData) =>
      request(`/food-listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(listingData),
      }),
    delete: (id) =>
      request(`/food-listings/${id}`, {
        method: 'DELETE',
      }),
    getMyListings: () => request('/food-listings/my'),
  },

  // Pickups
  pickups: {
    create: (pickupData) =>
      request('/pickup-requests', {
        method: 'POST',
        body: JSON.stringify(pickupData),
      }),
    getMyPickups: () => request('/pickup-requests/my'),
    getDonorIncoming: () => request('/pickup-requests/donor/my'),
    getByListing: (listingId) => request(`/pickup-requests/listing/${listingId}`),
    updateStatus: (id, status) =>
      request(`/pickup-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Impact
  impact: {
    getStats: () => request('/impact/stats'),
    getRecentRescues: () => request('/impact/recent'),
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markAsRead: (id) =>
      request(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
  },
};
