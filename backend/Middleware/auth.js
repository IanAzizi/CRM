const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'دسترسی غیرمجاز: توکن ارسال نشده است' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId || !decoded?.role) {
      return res.status(401).json({ message: 'توکن نامعتبر: اطلاعات ناقص' });
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    console.log('✅ احراز هویت موفق:', req.user);
    next();
  } catch (error) {
    console.error('❌ خطا در بررسی توکن:', error.message);
    return res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده' });
  }
};
