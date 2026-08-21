// Backend API configuration
//
// The app ships in "demo mode" by default: every call below is served by an
// in-browser mock (src/mock/) seeded with dummy data, so the frontend can be
// deployed as a static site with no server and no database.
//
// To talk to the real Express backend in SPAM_Backend instead, set:
//   VITE_USE_MOCK_API=false
//   VITE_API_BASE_URL=http://localhost:3000
// The exported surface is identical either way, so no page needs to change.

import { mockAuthAPI, mockStudentAPI, mockAdminAPI } from '../../mock/mock-api';
import { resetDb } from '../../mock/mock-db';
import { DEMO_CREDENTIALS } from '../../mock/seed-data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/** Demo mode is on unless explicitly switched off. */
export const DEMO_MODE = import.meta.env.VITE_USE_MOCK_API !== 'false';

export { DEMO_CREDENTIALS };

/** Wipe demo edits and restore the seed dataset. */
export function resetDemoData() {
  resetDb();
}

/**
 * Resolve a stored file path to something an <img> can load.
 * Records seeded in demo mode already hold public-folder paths or data URLs;
 * against the real backend the path is relative to the API host.
 */
export function resolveAssetUrl(path, fallback = '/defaultProfile.svg') {
  if (!path) return fallback;
  if (/^(data:|blob:|https?:)/.test(path)) return path;
  return DEMO_MODE ? path : `${API_BASE_URL}${path}`;
}

// Helper function for API calls
const apiFetch = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'API request failed');
    error.details = data.allErrors || [];
    error.field = data.field;
    throw error;
  }

  return data;
};

// Authentication API
const liveAuthAPI = {
  async login(username, password, role) {
    return apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  },

  async logout() {
    return apiFetch('/api/logout', {
      method: 'POST',
    });
  },
};

// Student API
const liveStudentAPI = {
  // Profile
  async getProfile() {
    const response = await apiFetch('/api/profile');
    return { ...response, student: response.data }; // Backend returns 'data', alias as 'student'
  },

  async updateProfile(profileData) {
    return apiFetch('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  // Record
  async setupRecord(recordData) {
    // Check if recordData has image file
    if (recordData instanceof FormData) {
      // FormData is already prepared, use custom fetch
      const response = await fetch(`${API_BASE_URL}/api/record/setup`, {
        method: 'POST',
        credentials: 'include',
        body: recordData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup record');
      }
      return data;
    }

    return apiFetch('/api/record/setup', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },

  async getRecord() {
    const response = await apiFetch('/api/record');
    return { ...response, record: response.data }; // Backend returns 'data', alias as 'record'
  },

  async updateRecord(recordData) {
    // Check if recordData has image file
    if (recordData instanceof FormData) {
      // FormData is already prepared, use custom fetch
      const response = await fetch(`${API_BASE_URL}/api/record`, {
        method: 'PATCH',
        credentials: 'include',
        body: recordData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update record');
      }
      return data;
    }

    return apiFetch('/api/record', {
      method: 'PATCH',
      body: JSON.stringify(recordData),
    });
  },

  // Upload/Verification Requests
  async getUploads() {
    const response = await apiFetch('/api/upload');
    return { ...response, requests: response.data }; // Backend returns 'data', alias as 'requests'
  },

  async createUpload(formData) {
    // Handle FormData differently - don't set Content-Type header (browser will set it with boundary)
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // FormData object, not JSON
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload activity');
    }

    return data;
  },

  async deleteUpload(requestId) {
    return apiFetch(`/api/upload/${requestId}`, {
      method: 'DELETE',
    });
  },

  getProofUrl(requestId) {
    return `${API_BASE_URL}/api/upload/proof/${requestId}`;
  },

  // Notices
  async getNotices() {
    const response = await apiFetch('/api/notice');
    return { ...response, notices: response.data }; // Backend returns 'data', alias as 'notices'
  },

  // Logs
  async getLogs() {
    const response = await apiFetch('/api/logs');
    return { ...response, logs: response.data }; // Backend returns 'data', alias as 'logs'
  },
};

// Admin API
const liveAdminAPI = {
  // Profile
  async getProfile() {
    const response = await apiFetch('/api/admin/profile');
    return { ...response, admin: response.data }; // Backend returns 'data', alias as 'admin'
  },

  async updateProfile(profileData) {
    return apiFetch('/api/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  // Student Registration
  async getRegisteredStudents() {
    const response = await apiFetch('/api/admin/register');
    return { ...response, students: response.data }; // Backend returns 'data', alias as 'students'
  },

  async registerStudent(studentData) {
    return apiFetch('/api/admin/register/new', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async updateStudentCredentials(studentId, credentialsData) {
    return apiFetch(`/api/admin/register/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(credentialsData),
    });
  },

  async deleteStudent(studentId) {
    return apiFetch(`/api/admin/register/${studentId}`, {
      method: 'DELETE',
    });
  },

  // Records
  async getRecordsList() {
    const response = await apiFetch('/api/admin/record');
    return { ...response, records: response.data }; // Backend returns 'data', alias as 'records'
  },

  async getStudentRecord(studentId) {
    const response = await apiFetch(`/api/admin/record/${studentId}`);
    return { ...response, record: response.data }; // Backend returns 'data', alias as 'record'
  },

  async updateStudentRecord(studentId, recordData) {
    return apiFetch(`/api/admin/record/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(recordData),
    });
  },

  // Upload/Verification Requests
  async getUploadRequests() {
    const response = await apiFetch('/api/admin/upload');
    return { ...response, requests: response.data }; // Backend returns 'data', alias as 'requests'
  },

  async verifyRequest(v_id, requestData) {
    return apiFetch(`/api/admin/upload/${v_id}`, {
      method: 'PATCH',
      body: JSON.stringify(requestData),
    });
  },

  getProofUrl(requestId) {
    return `${API_BASE_URL}/api/admin/upload/proof/${requestId}`;
  },

  // Notices
  async getNotices() {
    const response = await apiFetch('/api/admin/notice');
    return { ...response, notices: response.data }; // Backend returns 'data', alias as 'notices'
  },

  async createNotice(noticeData) {
    return apiFetch('/api/admin/notice', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  },

  async deleteNotice(noticeId) {
    return apiFetch(`/api/admin/notice/${noticeId}`, {
      method: 'DELETE',
    });
  },

  // Logs
  async getLogs() {
    const response = await apiFetch('/api/admin/logs');
    return { ...response, logs: response.data }; // Backend returns 'data', alias as 'logs'
  },
};

// Pick the implementation once, at module load.
export const authAPI = DEMO_MODE ? mockAuthAPI : liveAuthAPI;
export const studentAPI = DEMO_MODE ? mockStudentAPI : liveStudentAPI;
export const adminAPI = DEMO_MODE ? mockAdminAPI : liveAdminAPI;

if (DEMO_MODE && typeof window !== 'undefined') {
  console.info(
    '%c[SPAM] Demo mode — data is served from an in-browser mock, not a database.',
    'color:#2563eb;font-weight:bold'
  );
}

export { apiFetch };
