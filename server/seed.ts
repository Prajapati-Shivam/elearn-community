import bcrypt from 'bcryptjs';
import { connectDB } from './db/connection';
import { User } from './models/User';
import { Post } from './models/Post';

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create a student user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const student = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'student',
    });

    console.log('✅ Created student user: alice@example.com / password123');

    // Create a tutor user
    const tutor = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'tutor',
      subjects: ['Mathematics', 'Physics'],
    });

    console.log('✅ Created tutor user: bob@example.com / password123');

    // Create a sample post
    await Post.create({
      title: 'Need Help with Calculus - Derivatives',
      subject: 'Mathematics',
      description:
        'I am struggling with understanding derivatives and their applications. Looking for a tutor who can explain the concepts clearly and help me solve practice problems. I have an exam coming up next week.',
      level: 'intermediate',
      studentId: student._id,
      studentName: student.name,
    });

    console.log('✅ Created sample learning post');

    // Create another sample post
    await Post.create({
      title: 'Learn React Hooks and State Management',
      subject: 'Programming',
      description:
        'I am new to React and want to understand hooks, especially useState and useEffect. Also interested in learning about state management patterns and best practices.',
      level: 'beginner',
      studentId: student._id,
      studentName: student.name,
    });

    console.log('✅ Created second sample learning post');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
