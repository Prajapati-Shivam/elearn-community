import mongoose, { Schema, Document } from 'mongoose';

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ITeachRequest extends Document {
  postId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  tutorName: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  status: RequestStatus;
  createdAt: Date;
}

const teachRequestSchema = new Schema<ITeachRequest>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tutorName: { type: String, required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export const TeachRequest = mongoose.model<ITeachRequest>(
  'TeachRequest',
  teachRequestSchema
);
