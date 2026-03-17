require('dotenv').config({ override: true });
const connectDB = require('./src/config/db');
const User = require('./src/models/userModel');

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@mail.com';
        
        // Check if admin already exists
        let admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            console.log(`Admin user with email ${adminEmail} already exists!`);
            // Just ensure they are marked as admin role (belt and suspenders)
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('Updated existing user role to admin.');
            }
        } else {
            // Create new admin
            admin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                phone: '99' + Math.floor(10000000 + Math.random() * 90000000).toString(), // Random 10-digit phone
                password: '12345678', // from prompt: password 12345678
                role: 'admin'
            });
            console.log(`Admin user seeded successfully!`);
            console.log(`Email: ${admin.email}`);
            console.log(`Role: ${admin.role}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
