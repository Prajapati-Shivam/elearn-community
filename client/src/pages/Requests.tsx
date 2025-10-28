import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function RequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myRequests = [], isLoading: tutorLoading } = useQuery<any[]>({
    queryKey: ['/api/requests'],
    enabled: !!user && user.role === 'tutor',
  });

  const { data: postsRequests = [], isLoading: studentLoading } = useQuery<
    any[]
  >({
    queryKey: ['/api/my-post-requests'],
    queryFn: async () => {
      if (!user || user.role !== 'student') return [];
      const postsRes = await apiRequest('GET', '/api/posts');
      const posts = await postsRes.json();
      const myPosts = posts.filter((p: any) => p.studentId === user.id);
      const all: any[] = [];
      for (const p of myPosts) {
        try {
          const r = await apiRequest('GET', `/api/posts/${p.id}/requests`);
          const list = await r.json();
          all.push({ post: p, requests: list });
        } catch (e) {
          console.warn('Failed to fetch requests for post', p.id, e);
        }
      }
      return all;
    },
    enabled: !!user && user.role === 'student',
  });

  const acceptRejectMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'accepted' | 'rejected';
    }) => {
      const res = await apiRequest('PATCH', `/api/requests/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Request status updated.' });
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/my-post-requests'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'Could not update request.',
        variant: 'destructive',
      });
    },
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge variant='default' className='flex items-center gap-1'>
            <CheckCircle2 size={14} /> Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant='destructive' className='flex items-center gap-1'>
            <XCircle size={14} /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='flex items-center gap-1'>
            <Clock size={14} /> Pending
          </Badge>
        );
    }
  };

  const isLoading =
    tutorLoading || studentLoading || acceptRejectMutation.isPending;

  return (
    <div className='max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Requests</h2>
        {isLoading && (
          <Loader2 className='animate-spin text-muted-foreground' size={24} />
        )}
      </div>

      {/* Tutor View */}
      {user?.role === 'tutor' && (
        <section>
          <h3 className='text-xl font-semibold mb-4 text-muted-foreground'>
            Requests You’ve Sent
          </h3>
          <div className='grid gap-4'>
            {myRequests.length === 0 ? (
              <div className='text-center py-10 border rounded-lg'>
                <p className='text-muted-foreground'>
                  You haven’t sent any requests yet.
                </p>
              </div>
            ) : (
              myRequests.map((r) => (
                <Card
                  key={r.id}
                  className='hover:shadow-md transition-shadow border-muted'
                >
                  <CardHeader className='flex items-center justify-between'>
                    <div>
                      <p className='font-semibold text-lg'>{r.postTitle}</p>
                      <p className='text-sm text-muted-foreground'>
                        Student: {r.studentName}
                      </p>
                    </div>
                    {renderStatusBadge(r.status)}
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      Requested on: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      )}

      {/* Student View */}
      {user?.role === 'student' && (
        <section className='mt-8'>
          <h3 className='text-xl font-semibold mb-4 text-muted-foreground'>
            Requests for Your Posts
          </h3>
          <div className='grid gap-6'>
            {postsRequests.length === 0 ? (
              <div className='text-center py-10 border rounded-lg'>
                <p className='text-muted-foreground'>
                  You haven’t received any requests yet.
                </p>
              </div>
            ) : (
              postsRequests.map((block: any) => (
                <div key={block.post.id}>
                  <h4 className='font-semibold text-lg mb-2'>
                    {block.post.title}
                  </h4>
                  <div className='grid gap-3'>
                    {block.requests.map((r: any) => (
                      <Card
                        key={r.id}
                        className='hover:shadow-md transition-shadow border-muted'
                      >
                        <CardHeader className='flex items-center justify-between'>
                          <div>
                            <p className='font-medium text-base'>
                              Tutor: {r.tutorName}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              Requested:{' '}
                              {new Date(r.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {renderStatusBadge(r.status)}
                        </CardHeader>
                        {r.status === 'pending' && (
                          <CardFooter className='flex gap-3 pt-2'>
                            <Button
                              size='sm'
                              onClick={() =>
                                acceptRejectMutation.mutate({
                                  id: r.id,
                                  status: 'accepted',
                                })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size='sm'
                              variant='destructive'
                              onClick={() =>
                                acceptRejectMutation.mutate({
                                  id: r.id,
                                  status: 'rejected',
                                })
                              }
                            >
                              Reject
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
