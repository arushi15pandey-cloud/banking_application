require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connection');

// Models (for seeding)
const User = require('./models/User');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const Policy = require('./models/Policy');
const Claim = require('./models/Claim');
const Notification = require('./models/Notification');

// Routers
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const accountRouter = require('./routers/accountRouter');
const transactionRouter = require('./routers/transactionRouter');
const transferRouter = require('./routers/transferRouter');
const policyRouter = require('./routers/policyRouter');
const claimRouter = require('./routers/claimRouter');
const notificationRouter = require('./routers/notificationRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Auth Middleware (JWT)
const authMiddleware = require('./middleware/auth');

// Public Routes (no auth required)
app.use('/api/auth', authRouter);

// Protected Routes (JWT required)
app.use('/api/user', authMiddleware, userRouter);
app.use('/api/accounts', authMiddleware, accountRouter);
app.use('/api/transactions', authMiddleware, transactionRouter);
app.use('/api/transfer', authMiddleware, transferRouter);
app.use('/api/policies', authMiddleware, policyRouter);
app.use('/api/claims', authMiddleware, claimRouter);
app.use('/api/notifications', authMiddleware, notificationRouter);

// Seed Route — populates DB with demo data for the classic demo user
app.get('/api/seed', async (req, res) => {
  try {
    // Clear existing demo user data
    const existingUser = await User.findOne({ email: 'alex.morgan@apexbank.com' });
    if (existingUser) {
      await Account.deleteMany({ userId: existingUser._id });
      await Transaction.deleteMany({ userId: existingUser._id });
      await Policy.deleteMany({ userId: existingUser._id });
      await Claim.deleteMany({ userId: existingUser._id });
      await Notification.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    // 1. Create Demo User (password will be hashed by pre-save hook)
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'alex.morgan@apexbank.com',
      password: 'password123',
      accountNumber: '8892-4412-901',
      creditScore: 785,
      riskRating: 'Low Risk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    });

    // 2. Create Initial Accounts
    const accountsData = [
      {
        userId: demoUser._id,
        accountId: 'chk-1',
        name: 'Premier Checking',
        accountNumber: '•••• 8892',
        type: 'checking',
        balance: 14850.50,
        currency: '$',
        icon: 'Landmark',
      },
      {
        userId: demoUser._id,
        accountId: 'sav-1',
        name: 'High-Yield Growth Savings',
        accountNumber: '•••• 4412',
        type: 'savings',
        balance: 42300.00,
        apy: '4.85%',
        currency: '$',
        icon: 'PiggyBank',
      },
      {
        userId: demoUser._id,
        accountId: 'crd-1',
        name: 'Apex Sapphire Reserve',
        accountNumber: '•••• 1928',
        type: 'credit',
        balance: 2430.20,
        creditLimit: 20000.00,
        dueDate: 'Aug 12, 2026',
        currency: '$',
        icon: 'CreditCard',
      }
    ];
    await Account.insertMany(accountsData);

    // 3. Create Initial Transactions
    const transactionsData = [
      {
        userId: demoUser._id,
        title: 'Salary Deposit - Horizon Tech Inc',
        category: 'Income',
        amount: 6500.00,
        type: 'credit',
        date: '2026-07-25',
        account: 'Premier Checking',
        status: 'Completed'
      },
      {
        userId: demoUser._id,
        title: 'Apex Shield Health Insurance Premium',
        category: 'Insurance',
        amount: 140.00,
        type: 'debit',
        date: '2026-07-15',
        account: 'Premier Checking',
        status: 'Completed'
      },
      {
        userId: demoUser._id,
        title: 'Whole Foods Market',
        category: 'Shopping',
        amount: 184.30,
        type: 'debit',
        date: '2026-07-24',
        account: 'Apex Sapphire Reserve',
        status: 'Completed'
      },
      {
        userId: demoUser._id,
        title: 'Tesla Supercharger',
        category: 'Transport',
        amount: 28.50,
        type: 'debit',
        date: '2026-07-23',
        account: 'Apex Sapphire Reserve',
        status: 'Completed'
      },
      {
        userId: demoUser._id,
        title: 'Transfer to High-Yield Savings',
        category: 'Transfer',
        amount: 1500.00,
        type: 'debit',
        date: '2026-07-20',
        account: 'Premier Checking',
        status: 'Completed'
      }
    ];
    await Transaction.insertMany(transactionsData);

    // 4. Create Initial Policies
    const policiesData = [
      {
        userId: demoUser._id,
        policyId: 'POL-HLT-9921',
        type: 'Health',
        title: 'Apex Comprehensive Health Shield',
        coverage: 250000,
        monthlyPremium: 140.00,
        nextPaymentDate: '2026-08-15',
        status: 'Active',
        deductible: 500,
        insuredSubject: 'Alex Morgan + 1 Dependent',
        autoDebitAccount: 'Premier Checking (•••• 8892)',
        icon: 'HeartPulse',
        color: 'emerald'
      },
      {
        userId: demoUser._id,
        policyId: 'POL-AUT-4410',
        type: 'Auto',
        title: 'Zero-Dep Auto Protection',
        coverage: 55000,
        monthlyPremium: 85.00,
        nextPaymentDate: '2026-08-20',
        status: 'Active',
        deductible: 250,
        insuredSubject: '2024 Tesla Model Y (VIN: 5YJSA1E28P...)',
        autoDebitAccount: 'Premier Checking (•••• 8892)',
        icon: 'Car',
        color: 'blue'
      },
      {
        userId: demoUser._id,
        policyId: 'POL-HOM-1102',
        type: 'Home',
        title: 'Estate & Property Guard',
        coverage: 650000,
        monthlyPremium: 195.00,
        nextPaymentDate: '2026-09-01',
        status: 'Active',
        deductible: 1000,
        insuredSubject: '742 Evergreen Terrace, Seattle WA',
        autoDebitAccount: 'Premier Checking (•••• 8892)',
        icon: 'Home',
        color: 'purple'
      }
    ];
    await Policy.insertMany(policiesData);

    // 5. Create Initial Claims
    const claimsData = [
      {
        userId: demoUser._id,
        claimId: 'CLM-8821',
        policyId: 'POL-AUT-4410',
        policyTitle: 'Zero-Dep Auto Protection',
        claimType: 'Windshield Crack Repair',
        incidentDate: '2026-07-10',
        amount: 450.00,
        status: 'Payout Disbursed',
        step: 4,
        description: 'Road debris cracked front windshield on Interstate 90.',
        payoutAccount: 'Premier Checking (•••• 8892)',
        submittedDate: '2026-07-11'
      },
      {
        userId: demoUser._id,
        claimId: 'CLM-9014',
        policyId: 'POL-HLT-9921',
        policyTitle: 'Apex Comprehensive Health Shield',
        claimType: 'Outpatient Specialist & X-Ray',
        incidentDate: '2026-07-21',
        amount: 620.00,
        status: 'Under Assessment',
        step: 2,
        description: 'Orthopedic consultation and right wrist X-ray imaging.',
        payoutAccount: 'Premier Checking (•••• 8892)',
        submittedDate: '2026-07-22'
      }
    ];
    await Claim.insertMany(claimsData);

    // 6. Create Initial Notifications
    const notificationsData = [
      {
        userId: demoUser._id,
        title: 'Auto-Debit Executed',
        text: 'Health Insurance Premium $140.00 debited from Premier Checking.',
        time: '2 hours ago',
        unread: true
      },
      {
        userId: demoUser._id,
        title: 'Claim Status Updated',
        text: 'Claim #CLM-9014 is currently under assessment by medical auditor.',
        time: '1 day ago',
        unread: true
      },
      {
        userId: demoUser._id,
        title: 'Security Alert',
        text: 'New login detected from Chrome Windows 11.',
        time: '3 days ago',
        unread: false
      }
    ];
    await Notification.insertMany(notificationsData);

    res.status(200).json({ success: true, message: 'Database seeded successfully. Demo credentials: alex.morgan@apexbank.com / password123' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Apex Bank & Shield Insurance Services Backend is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
