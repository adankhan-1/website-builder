import bcrypt from 'bcrypt';
import User  from '../models/user.js';

export const register = async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const login  = async (req, res) => {
    const { email, password } = req.body;

    let user;
    try {
        user = await User.findOne({ where: { email } });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful', user });

};

export const checkSession = (req, res, next) => {
    if (!req.session.userId) return res.sendStatus(401);
    res.json({ id: req.session.userId });
    next();
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Logout failed');
    }

    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.sendStatus(200);
  });
};
