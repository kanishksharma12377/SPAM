/**
 * In-browser stand-in for the Express backend (demo / no-database mode).
 *
 * Every method mirrors the corresponding controller in SPAM_Backend/controller/
 * -- same response envelope, same error messages, same aliases applied by
 * backend-api.js -- so the page components need no changes and the real API can
 * be switched back on with a single env var.
 */

import { loadDb, saveDb, getSession, setSession, clearSession, nextId, clone } from './mock-db.js';

/** Simulated network latency, so loading states are actually visible. */
const LATENCY_MS = 180;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/** Matches the error shape apiFetch() throws for a non-2xx response. */
function apiError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  error.details = [];
  return error;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Mirrors SPAM_Backend/utils/calculateAge.js */
function calculateAge(dob) {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

function requireStudent() {
  const session = getSession();
  const role = session?.role;
  if (!session || !Array.isArray(role) || role[0] !== 'student') {
    throw apiError('Unauthorized', 401);
  }
  return session;
}

function requireAdmin() {
  const session = getSession();
  if (!session || session.role !== 'admin') {
    throw apiError('Unauthorized', 401);
  }
  return session;
}

/** Mirrors utils/logs.js createLog(). */
function addLog(db, by, s_id, type, detail = {}) {
  db.logs.push({
    l_id: nextId(db, 'l_id'),
    by,
    s_id: s_id ?? null,
    type,
    time: new Date().toISOString(),
    detail,
  });
}

/**
 * Read a File into a data URL. Images are downscaled first: a raw 5 MB upload
 * base64-encodes to ~6.7 MB, which blows the ~5 MB localStorage budget on its
 * own. Non-images (PDFs) are stored as-is.
 */
function fileToDataUrl(file, maxDim = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(apiError('Could not read the selected file'));
    reader.onload = () => {
      const raw = reader.result;
      if (!file.type?.startsWith('image/')) return resolve(raw);

      const img = new Image();
      img.onerror = () => resolve(raw); // Unreadable image -- keep the original.
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch {
          resolve(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Turn a stored data URL into a blob: URL. Browsers block window.open() on a
 * data: URL, but a blob: URL opens in a new tab as expected.
 */
function dataUrlToObjectUrl(dataUrl) {
  try {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return dataUrl;
  }
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Setup.jsx submits either a plain object or FormData (when an image is
 * attached). Normalise both into { data, imageFile }, matching the JSON-string
 * unpacking the real recordController does.
 */
async function normalizeRecordInput(input) {
  if (!(typeof FormData !== 'undefined' && input instanceof FormData)) {
    return { data: clone(input), imageFile: null };
  }

  const data = {};
  let imageFile = null;
  const objectFields = new Set(['name', 'address', 'socialAccount', 'document']);

  for (const [key, value] of input.entries()) {
    if (value instanceof File) {
      if (key === 'image') imageFile = value;
      continue;
    }
    data[key] = objectFields.has(key) ? parseMaybeJson(value) : value;
  }
  return { data, imageFile };
}

/** Strip empty strings so a partial edit never blanks an existing field. */
function pruneEmpty(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    out[key] = value;
  }
  return out;
}

function findStudent(db, s_id) {
  return db.students.find((s) => s.s_id === s_id);
}

function findLogin(db, s_id) {
  return db.logins.find((l) => l.s_id === s_id);
}

/** Login docs are returned without the password, as the real controllers do. */
function withoutPassword(doc) {
  const copy = { ...doc };
  delete copy.password;
  return copy;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export const mockAuthAPI = {
  async login(username, password, role) {
    await delay();
    const db = loadDb();
    const uname = String(username || '').trim().toLowerCase();

    let user;
    if (role === 'admin') {
      user = db.admins.find((a) => a.username === uname);
    } else if (role === 'student') {
      user = db.logins.find((l) => l.username === uname);
    } else {
      throw apiError('Invalid role');
    }

    if (!user) throw apiError('no user with following username', 404);
    if (user.password !== password) throw apiError('Invalid password');

    const setup = role === 'admin' ? true : Boolean(findStudent(db, user.s_id));

    const payload = {
      id: user.a_id || user.s_id,
      name: user.name,
      role: user.role,
      setup,
    };

    setSession(payload);
    return { success: true, message: 'login successful', user: payload };
  },

  async logout() {
    await delay(80);
    clearSession();
    return { success: true, message: 'logout successful' };
  },
};

/* ------------------------------------------------------------------ */
/* Student                                                             */
/* ------------------------------------------------------------------ */

export const mockStudentAPI = {
  async getProfile() {
    await delay();
    const session = requireStudent();
    const db = loadDb();
    const s_id = session.id;
    const record = findStudent(db, s_id);
    const login = findLogin(db, s_id);

    if (!record) {
      // Same fallback the real controller returns before setup is completed.
      const data = {
        s_id,
        name: session.name || 'Student',
        role: session.role,
        class: session.role[2],
        branch: session.role[3],
        username: login?.username || s_id,
      };
      return { success: true, data, student: data };
    }

    // `username` lives on the Login doc, not the Student doc; it is merged in
    // here so the profile page's edit dialog has something to show.
    const data = { ...clone(record), username: login?.username || s_id };
    return { success: true, data, student: data };
  },

  async updateProfile(profileData) {
    await delay();
    const session = requireStudent();
    const db = loadDb();
    const login = findLogin(db, session.id);
    if (!login) throw apiError("Can't find data", 404);

    const updates = pruneEmpty(profileData);
    if (Object.keys(updates).length === 0) throw apiError('Invalid input');

    if (updates.username) {
      const taken = db.logins.some(
        (l) => l.username === updates.username.toLowerCase() && l.s_id !== login.s_id
      );
      if (taken) throw apiError('That username is already taken');
      updates.username = updates.username.toLowerCase();
    }

    Object.assign(login, updates);

    if (updates.name) {
      session.name = updates.name;
      setSession(session);
    }

    addLog(db, 'student', session.id, 'update', {
      message: 'Student edit her profile',
      newData: { ...updates, password: updates.password ? '********' : undefined },
    });
    saveDb(db);

    return { success: true, message: 'profile is updated' };
  },

  async getRecord() {
    await delay();
    const session = requireStudent();
    const db = loadDb();
    const record = findStudent(db, session.id);
    if (!record) throw apiError("can't find data", 404);
    const data = clone(record);
    return { success: true, data, record: data };
  },

  async setupRecord(recordData) {
    const session = requireStudent();
    const { data, imageFile } = await normalizeRecordInput(recordData);
    const image = imageFile ? await fileToDataUrl(imageFile) : null;
    await delay();

    const db = loadDb();
    if (findStudent(db, session.id)) {
      throw apiError(
        'Profile already exists. Please contact admin if you need to update your information.'
      );
    }

    const record = {
      ...pruneEmpty(data),
      s_id: session.id,
      age: calculateAge(data.dob),
      image: image || '/defaultProfile.svg',
      points: 0,
      socialAccount: data.socialAccount || [],
      document: data.document || [],
      skills: [],
      result: [],
      certificate: [],
      project: [],
      internship: [],
    };

    db.students.push(record);

    const newPayload = { id: session.id, name: session.name, role: session.role, setup: true };
    setSession(newPayload);

    addLog(db, 'student', session.id, 'setup', { message: 'Student setup his record' });
    saveDb(db);

    return {
      success: true,
      message: 'Account setup successfully',
      user: newPayload,
      newData: clone(record),
    };
  },

  async updateRecord(recordData) {
    const session = requireStudent();
    const { data, imageFile } = await normalizeRecordInput(recordData);
    const image = imageFile ? await fileToDataUrl(imageFile) : null;
    await delay();

    const db = loadDb();
    const record = findStudent(db, session.id);
    if (!record) throw apiError("Can't find data", 404);

    const updates = pruneEmpty(data);
    if (Object.keys(updates).length === 0 && !image) throw apiError('Invalid input');

    if (updates.dob) updates.age = calculateAge(updates.dob);
    if (image) updates.image = image;

    Object.assign(record, updates);

    addLog(db, 'student', session.id, 'update', {
      message: 'Student edit his record',
      newData: updates,
    });
    saveDb(db);

    return { success: true, message: 'record is updated', updatedData: clone(record) };
  },

  async getUploads() {
    await delay();
    const session = requireStudent();
    const db = loadDb();
    const data = clone(db.verifications.filter((v) => v.s_id === session.id));
    return { success: true, count: data.length, data, requests: data };
  },

  async createUpload(formData) {
    const session = requireStudent();

    const proofFile = formData.get('proof');
    if (!(proofFile instanceof File)) {
      throw apiError('Proof document is required. Please upload an image or PDF file.');
    }
    const proof = await fileToDataUrl(proofFile, 900);
    await delay();

    const category = formData.get('category');
    const body = parseMaybeJson(formData.get('body')) || {};
    const message = formData.get('message') || '';

    const validCategories = ['skills', 'result', 'certificate', 'project', 'internship'];
    if (!validCategories.includes(category)) throw apiError('Invalid category');

    const db = loadDb();
    const request = {
      v_id: nextId(db, 'v_id'),
      s_id: session.id,
      category,
      body,
      message,
      proof,
      proof_name: proofFile.name,
      status: 'pending',
      feedback: '',
      creation_date: new Date().toISOString(),
    };

    db.verifications.push(request);
    addLog(db, 'student', session.id, 'request', {
      message: 'Student upload a request',
      req: { v_id: request.v_id, category },
    });
    saveDb(db);

    return { success: true, message: 'upload request is created', newData: clone(request) };
  },

  async deleteUpload(requestId) {
    await delay();
    const session = requireStudent();
    const db = loadDb();

    const index = db.verifications.findIndex((v) => String(v.v_id) === String(requestId));
    if (index === -1) throw apiError("Can't find data", 404);

    const request = db.verifications[index];
    if (request.s_id !== session.id || request.status !== 'pending') {
      throw apiError('You are not permitted to delete this request', 403);
    }

    db.verifications.splice(index, 1);
    addLog(db, 'student', session.id, 'request', {
      message: 'Student delete a upload request',
      deletedRequest: { v_id: request.v_id, category: request.category },
    });
    saveDb(db);

    return { success: true, message: 'request is deleted' };
  },

  getProofUrl(requestId) {
    const db = loadDb();
    const request = db.verifications.find((v) => String(v.v_id) === String(requestId));
    if (!request?.proof) return '';
    return request.proof.startsWith('data:')
      ? dataUrlToObjectUrl(request.proof)
      : request.proof;
  },

  async getNotices() {
    await delay();
    const session = requireStudent();
    const db = loadDb();

    // Mirrors the $or query in controller/student/noticeController.js
    const [, s_id, year, branch, skill] = session.role;
    const skillMatch = skill === 'skilled' ? ['skilled', 'none'] : ['none'];
    const today = Date.now();

    const data = clone(
      db.notices.filter((notice) => {
        if (new Date(notice.expire_date).getTime() < today) return false;
        const target = notice.for;
        if (!Array.isArray(target)) return false;

        const forAllStudents = target.length === 1 && target[0] === 'student';
        const forThisStudent = target.includes(s_id);
        const forCohort =
          Array.isArray(target[0]) &&
          Array.isArray(target[1]) &&
          target[0].includes(year) &&
          target[1].includes(branch) &&
          skillMatch.includes(target[2]);

        return forAllStudents || forThisStudent || forCohort;
      })
    );

    return { success: true, count: data.length, data, notices: data };
  },

  async getLogs() {
    await delay();
    const session = requireStudent();
    const db = loadDb();
    const data = clone(db.logs.filter((l) => l.s_id === session.id));
    return { success: true, count: data.length, data, logs: data };
  },
};

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export const mockAdminAPI = {
  async getProfile() {
    await delay();
    const session = requireAdmin();
    const db = loadDb();
    const admin = db.admins.find((a) => a.a_id === session.id);
    if (!admin) throw apiError("Can't find data", 404);
    const data = withoutPassword(clone(admin));
    return { success: true, data, admin: data };
  },

  async updateProfile(profileData) {
    await delay();
    const session = requireAdmin();
    const db = loadDb();
    const admin = db.admins.find((a) => a.a_id === session.id);
    if (!admin) throw apiError("Can't find data", 404);

    const updates = pruneEmpty(profileData);
    if (Object.keys(updates).length === 0) throw apiError('Invalid input');

    Object.assign(admin, updates);
    if (updates.name) {
      session.name = updates.name;
      setSession(session);
    }

    addLog(db, 'teacher', null, 'update', {
      message: 'Teacher edit his profile',
      newData: { ...updates, password: updates.password ? '********' : undefined },
    });
    saveDb(db);

    return {
      success: true,
      message: 'Profile is updated',
      updatedData: withoutPassword(clone(admin)),
    };
  },

  async getRegisteredStudents() {
    await delay();
    requireAdmin();
    const db = loadDb();
    const data = clone(db.logins).map(withoutPassword);
    return { success: true, count: data.length, data, students: data };
  },

  async registerStudent(studentData) {
    await delay();
    requireAdmin();
    const db = loadDb();

    const s_id = String(studentData.s_id || '').trim().toLowerCase();
    const username = String(studentData.username || '').trim().toLowerCase();
    const { name, password, role1, role2, role3 } = studentData;

    if (!s_id || !name || !username || !password) throw apiError('All fields are required');
    if (!/^s(cs|ce|me|ee)\d{4}$/.test(s_id)) {
      throw apiError('Student ID must look like SCS0001 (S + branch + 4 digits)');
    }
    if (findLogin(db, s_id)) throw apiError('A student with that ID is already registered');
    if (db.logins.some((l) => l.username === username)) throw apiError('That username is already taken');

    const login = {
      s_id,
      name,
      username,
      password,
      role: ['student', s_id, role1, role2, role3],
    };

    db.logins.push(login);
    addLog(db, 'teacher', s_id, 'register', {
      message: 'Teacher register a student',
      data: { s_id, name, username, role: login.role },
    });
    saveDb(db);

    return { success: true, message: 'Student registered successfully' };
  },

  async updateStudentCredentials(studentId, credentialsData) {
    await delay();
    requireAdmin();
    const db = loadDb();
    const login = findLogin(db, studentId);
    if (!login) throw apiError('Student not found', 404);

    const updates = pruneEmpty(credentialsData);
    if (Object.keys(updates).length === 0) throw apiError('Invalid input');

    if (updates.username) {
      updates.username = updates.username.toLowerCase();
      const taken = db.logins.some(
        (l) => l.username === updates.username && l.s_id !== login.s_id
      );
      if (taken) throw apiError('That username is already taken');
    }

    // Rebuild the role tuple if any of its components changed.
    if ('role1' in updates || 'role2' in updates || 'role3' in updates || 's_id' in updates) {
      const old = login.role;
      updates.role = [
        'student',
        updates.s_id || old[1],
        updates.role1 || old[2],
        updates.role2 || old[3],
        updates.role3 || old[4],
      ];
    }
    delete updates.role1;
    delete updates.role2;
    delete updates.role3;

    const previousId = login.s_id;
    Object.assign(login, updates);

    if (updates.s_id && updates.s_id !== previousId) {
      const record = findStudent(db, previousId);
      if (record) record.s_id = updates.s_id;
    }

    addLog(db, 'teacher', studentId, 'update', {
      message: 'Teacher update student credentials/account',
      newData: { ...updates, password: updates.password ? '********' : undefined },
    });
    saveDb(db);

    return { success: true, message: 'Profile is updated' };
  },

  async deleteStudent(studentId) {
    await delay();
    requireAdmin();
    const db = loadDb();

    const index = db.logins.findIndex((l) => l.s_id === studentId);
    if (index === -1) throw apiError("Can't find data", 404);

    db.logins.splice(index, 1);
    db.students = db.students.filter((s) => s.s_id !== studentId);
    db.verifications = db.verifications.filter((v) => v.s_id !== studentId);

    addLog(db, 'teacher', studentId, 'unregister', {
      message: 'Teacher unregistered a student',
    });
    saveDb(db);

    return { success: true, message: 'Student is unregistered' };
  },

  async getRecordsList() {
    await delay();
    requireAdmin();
    const db = loadDb();
    const data = clone(db.students);
    return { success: true, count: data.length, data, records: data };
  },

  async getStudentRecord(studentId) {
    await delay();
    requireAdmin();
    const db = loadDb();
    const record = findStudent(db, studentId);
    if (!record) throw apiError("Can't find data", 404);
    const data = clone(record);
    return { success: true, data, record: data };
  },

  async updateStudentRecord(studentId, recordData) {
    await delay();
    requireAdmin();
    const db = loadDb();
    const record = findStudent(db, studentId);
    if (!record) throw apiError("Can't find data", 404);

    // `profile` and `points` may legitimately be cleared/zeroed, so they skip
    // the empty-string prune that protects the other fields.
    const updates = pruneEmpty(recordData);
    if ('profile' in recordData) updates.profile = recordData.profile;
    if ('points' in recordData) updates.points = Number(recordData.points) || 0;

    if (Object.keys(updates).length === 0) throw apiError('Invalid input');
    if (updates.dob) updates.age = calculateAge(updates.dob);

    Object.assign(record, updates);

    addLog(db, 'teacher', studentId, 'update', {
      message: 'Teacher edit student record',
      newData: updates,
    });
    saveDb(db);

    return { success: true, message: 'Record is updated', updatedData: clone(record) };
  },

  async getUploadRequests() {
    await delay();
    requireAdmin();
    const db = loadDb();
    const data = clone(db.verifications);
    return { success: true, count: data.length, data, requests: data };
  },

  async verifyRequest(v_id, requestData) {
    await delay();
    requireAdmin();
    const db = loadDb();

    const request = db.verifications.find((v) => String(v.v_id) === String(v_id));
    if (!request) throw apiError("Can't find data", 404);

    const { status, feedback } = requestData;
    if (!['accepted', 'rejected'].includes(status)) throw apiError('Invalid status');

    request.status = status;
    request.feedback = feedback || '';

    const record = findStudent(db, request.s_id);
    if (record) {
      const bucket = request.category;
      record[bucket] = Array.isArray(record[bucket]) ? record[bucket] : [];
      // Drop any previous copy first, so re-deciding a request cannot duplicate it.
      record[bucket] = record[bucket].filter((item) => String(item.v_id) !== String(request.v_id));

      if (status === 'accepted') {
        const body = clone(request.body);
        // Upload.jsx sends skill topics as `topics`, but studentModel stores
        // them as `topic`. Map across so accepted skills are not left blank.
        if (bucket === 'skills' && body.topics && !body.topic) {
          body.topic = body.topics;
          delete body.topics;
        }
        record[bucket].push({ v_id: String(request.v_id), ...body });
      }
    }

    addLog(db, 'teacher', request.s_id, 'request', {
      message: `Teacher ${status} student's request`,
      request: { v_id: request.v_id, category: request.category },
    });
    saveDb(db);

    return { success: true, message: 'Upload request is verified', newData: clone(request) };
  },

  getProofUrl(requestId) {
    return mockStudentAPI.getProofUrl(requestId);
  },

  async getNotices() {
    await delay();
    requireAdmin();
    const db = loadDb();
    const data = clone(db.notices);
    return { success: true, count: data.length, data, notices: data };
  },

  async createNotice(noticeData) {
    await delay();
    requireAdmin();
    const db = loadDb();

    const { category, for: target, subject, body, expire_date } = noticeData;
    if (!category || !subject || !body || !expire_date) throw apiError('All fields are required');
    if (!Array.isArray(target) || target.length === 0) throw apiError('Invalid audience');

    const notice = {
      n_id: nextId(db, 'n_id'),
      category,
      for: target,
      subject,
      body,
      issue_date: new Date().toISOString(),
      expire_date: new Date(expire_date).toISOString(),
    };

    db.notices.push(notice);
    addLog(db, 'teacher', null, 'notice', {
      message: 'Teacher creates a new notice',
      data: { n_id: notice.n_id, subject: notice.subject },
    });
    saveDb(db);

    return { success: true, message: 'Notice is created', newData: clone(notice) };
  },

  async deleteNotice(noticeId) {
    await delay();
    requireAdmin();
    const db = loadDb();

    const index = db.notices.findIndex((n) => String(n.n_id) === String(noticeId));
    if (index === -1) throw apiError("Can't find data", 400);

    const [removed] = db.notices.splice(index, 1);
    addLog(db, 'teacher', null, 'notice', {
      message: 'Teacher deleted a notice',
      data: { n_id: removed.n_id, subject: removed.subject },
    });
    saveDb(db);

    return { success: true, message: 'Notice is deleted' };
  },

  async getLogs() {
    await delay();
    requireAdmin();
    const db = loadDb();
    const data = clone(db.logs);
    return { success: true, count: data.length, data, logs: data };
  },
};
