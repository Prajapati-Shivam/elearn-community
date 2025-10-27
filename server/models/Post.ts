import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  subject: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Level is required'],
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model<IPost>('Post', postSchema);
