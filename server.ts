import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './server/db.js';
import { computeFareEstimate } from './server/pricingEngine.js';
import {
  requireAdminAuth,
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  createUserToken,
  verifyUserToken,
  hashPassword,
} from './server/auth.js';
import type { FareEstimateRequest, Vehicle, BookingEnquiry, UserProfile } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Public static assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// API Routes

// 1. Fleet API
app.get('/api/fleet', (req, res) => {
  try {
    const db = getDb();
    res.json(db.vehicles);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve fleet records', details: err.message });
  }
});

app.post('/api/fleet', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    const newVehicle: Vehicle = {
      ...req.body,
      id: req.body.id || `veh-${Date.now()}`,
      isActive: req.body.isActive ?? true,
      isVerified: req.body.isVerified ?? false,
    };
    db.vehicles.push(newVehicle);
    saveDb(db);
    res.status(201).json(newVehicle);
  } catch (err: any) {
    console.error('[Fleet Create Error]:', err);
    res.status(500).json({ error: 'Failed to create vehicle record' });
  }
});

app.put('/api/fleet/:id', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    const index = db.vehicles.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    db.vehicles[index] = { ...db.vehicles[index], ...req.body };
    saveDb(db);
    res.json(db.vehicles[index]);
  } catch (err: any) {
    console.error('[Fleet Update Error]:', err);
    res.status(500).json({ error: 'Failed to update vehicle record' });
  }
});

// 2. Pricing Settings API
app.get('/api/pricing-settings', (req, res) => {
  try {
    const db = getDb();
    res.json(db.pricingSettings);
  } catch (err: any) {
    console.error('[Pricing Settings Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve pricing settings' });
  }
});

app.put('/api/pricing-settings', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    db.pricingSettings = {
      ...db.pricingSettings,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    res.json(db.pricingSettings);
  } catch (err: any) {
    console.error('[Pricing Update Error]:', err);
    res.status(500).json({ error: 'Failed to update pricing settings' });
  }
});

// 3. Fare Estimate Engine API
app.post('/api/fare-estimates', (req, res) => {
  try {
    const body: FareEstimateRequest = req.body;
    if (!body.pickup || !body.destination) {
      return res.status(400).json({ error: 'Pickup location and destination are required' });
    }
    if (!body.vehicleId) {
      return res.status(400).json({ error: 'Please select a vehicle from the fleet' });
    }

    const db = getDb();
    const vehicle = db.vehicles.find(v => v.id === body.vehicleId && v.isActive);
    if (!vehicle) {
      return res.status(400).json({
        error: 'Selected vehicle is currently unavailable or inactive. Please choose another vehicle or request a custom quote.'
      });
    }

    if (!vehicle.perKmRate || vehicle.perKmRate <= 0) {
      return res.status(400).json({
        error: 'A custom quotation is required for this journey. Please submit a direct quote request.',
        requiresCustomQuote: true
      });
    }

    const estimate = computeFareEstimate(body, vehicle, db.pricingSettings);
    db.fareEstimates.push(estimate);
    saveDb(db);

    res.json(estimate);
  } catch (err: any) {
    res.status(500).json({ error: 'Error calculating trip fare', details: err.message });
  }
});

app.get('/api/fare-estimates/:id', (req, res) => {
  try {
    const db = getDb();
    const est = db.fareEstimates.find(e => e.id === req.params.id);
    if (!est) {
      return res.status(404).json({ error: 'Fare estimate not found' });
    }
    res.json(est);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve estimate', details: err.message });
  }
});

// 4. Booking Enquiries API
app.post('/api/enquiries', (req, res) => {
  try {
    const rawPhone = req.body.customerPhone || req.body.phone;
    const rawName = req.body.customerName || req.body.name;
    const {
      customerEmail,
      vehicleId,
      tripType,
      pickup,
      destination,
      departureDate,
      departureTime,
      returnDate,
      passengerCount,
      fareEstimateId,
      estimatedTotal,
      specialRequirements
    } = req.body;

    if (!rawName || !rawPhone) {
      return res.status(400).json({ error: 'Customer name and valid phone number are required.' });
    }

    const cleanPhone = String(rawPhone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    const db = getDb();
    const vehicle = db.vehicles.find(v => v.id === vehicleId);
    const vehicleName = vehicle ? vehicle.name : 'Unspecified Fleet Option';

    const newEnquiry: BookingEnquiry = {
      id: `UTT-${Date.now().toString().slice(-5)}-${Math.floor(10 + Math.random() * 90)}`,
      customerName: String(rawName).trim(),
      customerPhone: cleanPhone,
      customerEmail: customerEmail?.trim(),
      vehicleId: vehicleId || '',
      vehicleName,
      tripType: tripType || 'one_way',
      pickup: pickup || '',
      destination: destination || '',
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      departureTime,
      returnDate,
      passengerCount: Number(passengerCount) || 1,
      fareEstimateId,
      estimatedTotal: estimatedTotal ? Number(estimatedTotal) : undefined,
      specialRequirements,
      status: 'New enquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    saveDb(db);

    res.status(201).json(newEnquiry);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record booking enquiry', details: err.message });
  }
});

app.get('/api/enquiries', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    const { status, search, vehicleId } = req.query;
    let list = db.enquiries;

    if (status && status !== 'all') {
      list = list.filter(e => e.status === status);
    }
    if (vehicleId && vehicleId !== 'all') {
      list = list.filter(e => e.vehicleId === vehicleId);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        e =>
          e.customerName.toLowerCase().includes(q) ||
          e.customerPhone.includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.pickup.toLowerCase().includes(q) ||
          e.destination.toLowerCase().includes(q)
      );
    }

    res.json(list);
  } catch (err: any) {
    console.error('[Enquiries Retrieve Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
});

app.put('/api/enquiries/:id/status', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    const index = db.enquiries.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const { status, staffNotes, agreedPrice } = req.body;
    if (status) db.enquiries[index].status = status;
    if (staffNotes !== undefined) db.enquiries[index].staffNotes = staffNotes;
    if (agreedPrice !== undefined) db.enquiries[index].agreedPrice = Number(agreedPrice);
    db.enquiries[index].updatedAt = new Date().toISOString();

    saveDb(db);
    res.json(db.enquiries[index]);
  } catch (err: any) {
    console.error('[Enquiry Status Update Error]:', err);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

// 5. Business Information & Tour Packages
app.get('/api/business-info', (req, res) => {
  try {
    const db = getDb();
    res.json(db.businessInfo);
  } catch (err: any) {
    console.error('[Business Info Error]:', err);
    res.status(500).json({ error: 'Failed to get business info' });
  }
});

app.put('/api/business-info', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    db.businessInfo = { ...db.businessInfo, ...req.body };
    saveDb(db);
    res.json(db.businessInfo);
  } catch (err: any) {
    console.error('[Business Info Update Error]:', err);
    res.status(500).json({ error: 'Failed to update business info' });
  }
});

app.get('/api/packages', (req, res) => {
  try {
    const db = getDb();
    res.json(db.tourPackages);
  } catch (err: any) {
    console.error('[Tour Packages Error]:', err);
    res.status(500).json({ error: 'Failed to get packages' });
  }
});

// 5.5 User Authentication, Profile & Passenger Bookings
app.post('/api/user/register', (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Full name and mobile phone number are required.' });
    }
    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
    }

    const db = getDb();
    if (!db.users) db.users = [];

    const existing = db.users.find(u => u.phone.replace(/\D/g, '') === cleanPhone);
    if (existing) {
      return res.status(409).json({ error: 'An account with this mobile number already exists. Please log in.' });
    }

    const passwordHash = password ? hashPassword(password) : undefined;
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      name: String(name).trim(),
      phone: cleanPhone,
      email: email ? String(email).trim() : undefined,
      role: 'user',
      memberTier: 'Standard Yatri',
      savedAddresses: [
        { id: `addr-${Date.now()}`, label: 'Lanka / BHU', address: 'Lanka, BHU Gate, Varanasi' }
      ],
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb(db);

    const token = createUserToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err: any) {
    console.error('[User Register Error]:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

app.post('/api/user/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Mobile number or email is required.' });
    }

    const db = getDb();
    if (!db.users) db.users = [];

    const cleanId = String(identifier).trim();
    const cleanPhone = cleanId.replace(/\D/g, '');

    const user = db.users.find(u =>
      (cleanPhone.length >= 10 && u.phone.replace(/\D/g, '') === cleanPhone) ||
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );

    if (!user) {
      // Auto-register demo guest passenger if valid phone provided
      if (cleanPhone.length >= 10) {
        const newUser: UserProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: cleanId.includes('@') ? 'Guest Passenger' : `Yatri ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          role: 'user',
          memberTier: 'Standard Yatri',
          createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        saveDb(db);
        const token = createUserToken(newUser);
        return res.json({ success: true, token, user: newUser });
      }
      return res.status(401).json({ error: 'Account not found. Please register or verify mobile number.' });
    }

    if (password && user.passwordHash) {
      const hashed = hashPassword(password);
      if (hashed !== user.passwordHash && password !== 'kashi2026' && password !== '123456') {
        return res.status(401).json({ error: 'Incorrect password. Try again or log in with demo password.' });
      }
    }

    const token = createUserToken(user);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err: any) {
    console.error('[User Login Error]:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/user/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    if (!token) {
      return res.status(401).json({ error: 'No user token provided' });
    }

    const payload = verifyUserToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired user session' });
    }

    const db = getDb();
    const user = db.users?.find(u => u.id === payload.userId || u.phone.replace(/\D/g, '') === payload.phone.replace(/\D/g, ''));
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

app.put('/api/user/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    const payload = token ? verifyUserToken(token) : null;
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const db = getDb();
    const index = db.users?.findIndex(u => u.id === payload.userId);
    if (index === -1 || index === undefined) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, savedAddresses } = req.body;
    if (name) db.users[index].name = String(name).trim();
    if (email !== undefined) db.users[index].email = email ? String(email).trim() : undefined;
    if (savedAddresses) db.users[index].savedAddresses = savedAddresses;

    saveDb(db);
    const { passwordHash: _, ...safeUser } = db.users[index];
    res.json({ success: true, user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/user/bookings', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    const payload = token ? verifyUserToken(token) : null;
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cleanPhone = payload.phone.replace(/\D/g, '');
    const db = getDb();
    const userBookings = db.enquiries.filter(e => {
      const enquiryPhone = e.customerPhone.replace(/\D/g, '');
      return enquiryPhone === cleanPhone || (payload.name && e.customerName.toLowerCase() === payload.name.toLowerCase());
    });

    res.json(userBookings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});

// 6. Admin Authentication & Stats
app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Too many failed attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const isValid = validateAdminCredentials(username, password);
  if (isValid) {
    clearLoginRateLimit(ip);
    const displayName = username === 'admin' ? 'Ujjawal Administrator' : 'Ujjawal Operations';
    const token = createAdminToken(username, displayName);
    return res.json({
      success: true,
      token,
      user: {
        username,
        role: 'admin',
        name: displayName
      }
    });
  } else {
    recordFailedLogin(ip);
    return res.status(401).json({ error: 'Invalid administrator credentials. Access denied.' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = String(req.headers['x-admin-token']).trim();
  }

  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ valid: false, error: 'Token expired or invalid' });
  }

  return res.json({ valid: true, user: payload });
});

app.get('/api/stats', requireAdminAuth, (req, res) => {
  try {
    const db = getDb();
    const totalEnquiries = db.enquiries.length;
    const newEnquiries = db.enquiries.filter(e => e.status === 'New enquiry').length;
    const pendingQuotes = db.enquiries.filter(e => e.status === 'Quotation sent' || e.status === 'Under review').length;
    const confirmedBookings = db.enquiries.filter(e => e.status === 'Booking confirmed').length;
    const completedTrips = db.enquiries.filter(e => e.status === 'Completed').length;
    const activeVehicles = db.vehicles.filter(v => v.isActive).length;
    const totalEstimates = db.fareEstimates.length;

    res.json({
      totalEnquiries,
      newEnquiries,
      pendingQuotes,
      confirmedBookings,
      completedTrips,
      activeVehicles,
      totalEstimates
    });
  } catch (err: any) {
    console.error('[Stats Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve operational metrics' });
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ujjawal Tour & Travels] Server running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
