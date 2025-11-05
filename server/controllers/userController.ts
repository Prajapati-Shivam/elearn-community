import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

function transformUser(userDoc: any) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    subjects: userDoc.subjects || [],
    createdAt: userDoc.createdAt,
  };
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId || userId !== id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this user' });
    }

    const { name, email, subjects } = req.body;

    const update: any = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (Array.isArray(subjects)) update.subjects = subjects.map(String);

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(transformUser(user));
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const getTutors = async (_req: AuthRequest, res: Response) => {
  try {
    const tutors = await User.find({ role: 'tutor' })
      .select('-password')
      .lean();
    const transformed = tutors.map((t: any) => ({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      subjects: t.subjects || [],
      createdAt: t.createdAt,
    }));
    res.status(200).json(transformed);
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ message: 'Failed to fetch tutors' });
  }
};
