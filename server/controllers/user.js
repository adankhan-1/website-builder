import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'approved', 'createdAt'],
            where: {
                role: 'user',
            },
            order: [['createdAt', 'DESC']],
        });

        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ approved: true });

        res.status(200).json({ message: 'User approved successfully' });
    } catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}