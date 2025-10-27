import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import type { Post } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  isOwner?: boolean;
}

export function PostCard({ post, onEdit, onDelete, isOwner = false }: PostCardProps) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover-elevate transition-all duration-200 h-full flex flex-col" data-testid={`card-post-${post.id}`}>
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold line-clamp-2" data-testid={`text-title-${post.id}`}>
            {post.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" data-testid={`badge-subject-${post.id}`}>
            {post.subject}
          </Badge>
          <Badge className={getLevelColor(post.level)} data-testid={`badge-level-${post.id}`}>
            {post.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${post.id}`}>
          {post.description}
        </p>
        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span data-testid={`text-student-${post.id}`}>{post.studentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-date-${post.id}`}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>

      {isOwner && (
        <CardFooter className="pt-4 gap-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(post)}
            className="flex-1"
            data-testid={`button-edit-${post.id}`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(post.id)}
            className="flex-1"
            data-testid={`button-delete-${post.id}`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
