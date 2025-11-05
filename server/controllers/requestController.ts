import { Response } from 'express';
import { TeachRequest } from '../models/Request';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

function transformRequest(reqDoc: any) {
  return {
    id: reqDoc._id.toString(),
    postId: reqDoc.postId ? String(reqDoc.postId) : undefined,
    tutorId: reqDoc.tutorId.toString(),
    tutorName: reqDoc.tutorName,
    studentId: reqDoc.studentId.toString(),
    studentName: reqDoc.studentName,
    status: reqDoc.status,
    createdAt: reqDoc.createdAt,
  };
}

// Tutor creates a request to teach a post
export const createTeachRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const tutorId = req.userId;

    // Validate post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure user exists and is a tutor
    const user = await User.findById(tutorId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'tutor')
      return res
        .status(403)
        .json({ message: 'Only tutors can request to teach' });

    // Prevent requesting own post
    if (post.studentId.toString() === tutorId) {
      return res
        .status(400)
        .json({ message: 'You cannot request to teach your own post' });
    }

    // Prevent duplicate pending request by same tutor for same post
    const existing = await TeachRequest.findOne({
      postId,
      tutorId,
      status: 'pending',
    });
    if (existing)
      return res
        .status(409)
        .json({ message: 'You already have a pending request for this post' });

    const teachReq = await TeachRequest.create({
      postId,
      tutorId,
      tutorName: user.name,
      studentId: post.studentId,
      studentName: post.studentName,
    });

    res.status(201).json(transformRequest(teachReq));
  } catch (error) {
    console.error('Create teach request error:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
};

// Student views requests for their post
export const getRequestsForPost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only the student owner can view requests for their post
    if (post.studentId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Only the post owner can view requests' });
    }

    const requests = await TeachRequest.find({ postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(requests.map(transformRequest));
  } catch (error) {
    console.error('Get requests for post error:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Tutor views their outgoing requests
export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const tutorId = req.userId;
    const requests = await TeachRequest.find({ tutorId }).sort({
      createdAt: -1,
    });

    const sent: any[] = []; // requests created by tutor (postId present)
    const received: any[] = []; // requests created by students (learning requests, subject present)

    for (const r of requests) {
      const doc: any = r.toObject ? r.toObject() : r;
      const base = {
        id: doc._id.toString(),
        postId: doc.postId ? String(doc.postId) : undefined,
        tutorId: String(doc.tutorId),
        tutorName: doc.tutorName,
        studentId: String(doc.studentId),
        studentName: doc.studentName,
        status: doc.status,
        subject: doc.subject,
        createdAt: doc.createdAt,
      };

      if (doc.postId) {
        // find post title for context
        const post = await Post.findById(doc.postId).select('title');
        sent.push({ ...base, postTitle: post ? post.title : undefined });
      } else {
        // subject-only request from student -> tutor
        received.push(base);
      }
    }

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Student accepts or rejects a request
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // request id
    const { status } = req.body; // accepted | rejected
    const userId = req.userId;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const teachReq = await TeachRequest.findById(id);
    if (!teachReq)
      return res.status(404).json({ message: 'Request not found' });

    // Determine who is allowed to change status:
    // - If this is a post-based request (postId present), only the student (post owner) may accept/reject.
    // - If this is a subject-only learning request (student -> tutor), only the tutor may accept/reject.
    const doc: any = teachReq.toObject ? teachReq.toObject() : teachReq;
    if (doc.postId) {
      // post-based: student owner
      if (String(doc.studentId) !== userId) {
        return res.status(403).json({
          message: 'Only the student can accept or reject this request',
        });
      }
    } else {
      // subject-only: tutor
      if (String(doc.tutorId) !== userId) {
        return res.status(403).json({
          message: 'Only the tutor can accept or reject this request',
        });
      }
    }

    teachReq.status = status as any;
    await teachReq.save();

    res.status(200).json(transformRequest(teachReq));
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};

// Student creates a learning request to a tutor (no post)
export const createLearningRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const studentId = req.userId;
    const { tutorId, subject } = req.body;

    if (!studentId)
      return res.status(401).json({ message: 'Authentication required' });
    if (!tutorId || !subject)
      return res
        .status(400)
        .json({ message: 'tutorId and subject are required' });

    const tutor = await User.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    if (tutor.role !== 'tutor')
      return res.status(400).json({ message: 'User is not a tutor' });

    // Prevent duplicate pending request from same student to same tutor for same subject
    const existing = await TeachRequest.findOne({
      tutorId,
      studentId,
      subject,
      status: 'pending',
    });
    if (existing)
      return res.status(409).json({
        message:
          'You already have a pending request for this tutor and subject',
      });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const teachReq = await TeachRequest.create({
      tutorId,
      tutorName: tutor.name,
      studentId,
      studentName: student.name,
      subject,
    });

    return res.status(201).json({
      id: (teachReq as any)._id.toString(),
      tutorId: (teachReq as any).tutorId.toString(),
      tutorName: (teachReq as any).tutorName,
      studentId: (teachReq as any).studentId.toString(),
      studentName: (teachReq as any).studentName,
      subject: (teachReq as any).subject,
      status: (teachReq as any).status,
      createdAt: (teachReq as any).createdAt,
    });
  } catch (error) {
    console.error('Create learning request error:', error);
    res.status(500).json({ message: 'Failed to create learning request' });
  }
};
