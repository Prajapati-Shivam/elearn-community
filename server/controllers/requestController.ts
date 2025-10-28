import { Response } from 'express';
import { TeachRequest } from '../models/Request';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

function transformRequest(reqDoc: any) {
  return {
    id: reqDoc._id.toString(),
    postId: reqDoc.postId.toString(),
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
    res.status(200).json(requests.map(transformRequest));
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

    // Only the student owner can accept/reject
    if (teachReq.studentId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Only the student can accept or reject requests' });
    }

    teachReq.status = status as any;
    await teachReq.save();

    res.status(200).json(transformRequest(teachReq));
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};
