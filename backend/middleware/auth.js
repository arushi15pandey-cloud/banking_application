const User = require('../models/User');
const Account = require('../models/Account');

module.exports = async (req, res, next) => {
  try {
    const email = req.headers['x-user-email'];
    if (!email) {
      // Fallback to first user in database if no header is present
      const user = await User.findOne();
      if (!user) {
        return res.status(401).json({ success: false, message: 'No user authenticated and database is not seeded. Please register on the frontend first.' });
      }
      req.user = user;
      return next();
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const displayName = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      user = await User.create({
        name: displayName,
        email: email.toLowerCase(),
        password: 'password', // default
        accountNumber: '1092-' + Math.floor(1000 + Math.random() * 9000) + '-552',
        creditScore: 750,
        riskRating: 'Low Risk',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
      });

      // Initialize empty default accounts for this new user in MongoDB
      await Account.create([
        {
          userId: user._id,
          accountId: `chk-${user._id}`,
          name: 'Premier Checking',
          accountNumber: '•••• 8892',
          type: 'checking',
          balance: 0.00,
          currency: '$',
          icon: 'Landmark',
        },
        {
          userId: user._id,
          accountId: `sav-${user._id}`,
          name: 'High-Yield Growth Savings',
          accountNumber: '•••• 4412',
          type: 'savings',
          balance: 0.00,
          apy: '4.85%',
          currency: '$',
          icon: 'PiggyBank',
        },
        {
          userId: user._id,
          accountId: `crd-${user._id}`,
          name: 'Apex Sapphire Reserve',
          accountNumber: '•••• 1928',
          type: 'credit',
          balance: 0.00,
          creditLimit: 20000.00,
          dueDate: 'Aug 12, 2026',
          currency: '$',
          icon: 'CreditCard',
        }
      ]);
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentication error: ' + err.message });
  }
};
