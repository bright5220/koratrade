require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// SECURITY IMPORTS
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporarily stores uploaded IDs in an /uploads folder

const app = express();
app.use(cors());
app.use(express.json());

// 1. SECURITY MIDDLEWARE
app.use(helmet()); // Hides Express server headers from attackers

// Limit each IP to 50 requests per 15 minutes to prevent brute-force login attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: "Too many requests from this IP, please try again later."
});
app.use('/api/', limiter);

// Initialize WebSockets
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// 2. DATABASE SETUP
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('✅ MongoDB Database Connected'))
  .catch(err => console.log('⚠️ MongoDB not detected. Running in Prototype Memory Mode.'));

const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String, required: true },
    balance: { type: Number, default: 1200 },
    kycStatus: { type: String, default: 'Pending' },
    botActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false }, // <-- NEW: Admin flag
    joinedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 3. LIVE MARKET DATA (WebSockets)
io.on('connection', (socket) => {
    setInterval(() => {
        const fluctuation = (Math.random() * 10) - 5; 
        const newPrice = (94238.10 + fluctuation).toFixed(2);
        socket.emit('priceUpdate', { pair: 'BTC/USD', price: newPrice });
    }, 1500);
});

// 4. ADMIN BACKOFFICE ROUTE
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json([{ email: 'demo@vaultx.com', balance: 1200, kycStatus: 'Pending', botActive: true }]);
    }
});

// 4b. ADMIN BALANCE MANAGEMENT
app.post('/api/admin/balance', async (req, res) => {
    const { email, amount } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $inc: { balance: amount } }, // $inc automatically adds/subtracts from the current value
            { new: true }
        );
        res.status(200).json({ message: "Balance updated successfully.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Database error during balance update." });
    }
});

// 4c. ADMIN KYC MANAGEMENT
app.post('/api/admin/kyc', async (req, res) => {
    const { email, status } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { kycStatus: status },
            { new: true }
        );
        res.status(200).json({ message: "KYC status updated.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Database error during KYC update." });
    }
});

// 5. SECURE AUTHENTICATION (Register & Login)
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        const isMasterAdmin = email === 'admin@vaultx.app'; // Secret backdoor for your master account
        
        // If user exists, log them in
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
            
            // Auto-upgrade to admin if using the master email
            if (isMasterAdmin && !user.isAdmin) {
                user.isAdmin = true;
                await user.save();
            }
            return res.status(200).json({ message: "Login successful!", user });
        }

        // If user is new, encrypt password and register
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashedPassword, isAdmin: isMasterAdmin });
        await user.save();
        
        res.status(201).json({ message: "Account secured in Database!", user });
    } catch (error) {
        res.status(201).json({ message: "Memory Mode Active", user: { email, balance: 1200, isAdmin: email === 'admin@vaultx.app' }});
    }
});

// 6. KYC FILE UPLOAD GATEWAY
app.post('/api/kyc', upload.single('document'), async (req, res) => {
    const { email } = req.body;
    
    // In a production environment, you would send 'req.file' to AWS S3 or Google Cloud here.
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { kycStatus: 'Under Review' },
            { new: true }
        );
        res.status(200).json({ message: "Document safely received.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Database error during KYC update." });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 VaultX Master Server running on port ${PORT}`));