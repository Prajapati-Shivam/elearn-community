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
import { Loader2, CheckCircle2, XCircle, Clock, Inbox } from 'lucide-react';

export default function RequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: myRequestsData = { sent: [], received: [] },
    isLoading: tutorLoading,
  } = useQuery<{ sent: any[]; received: any[] } | null>({
    queryKey: ['/api/requests'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/requests');
      return res.json();
    },
    enabled: !!user && user.role === 'tutor',
  });

  const myRequests = myRequestsData || { sent: [], received: [] };

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
          <Badge className='bg-green-100 text-green-800 flex items-center gap-1'>
            <CheckCircle2 size={14} /> Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className='bg-red-100 text-red-700 flex items-center gap-1'>
            <XCircle size={14} /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className='bg-yellow-100 text-yellow-700 flex items-center gap-1'>
            <Clock size={14} /> Pending
          </Badge>
        );
    }
  };

  const isLoading =
    tutorLoading || studentLoading || acceptRejectMutation.isPending;

  return (
    <div className='max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-3xl font-bold tracking-tight text-foreground'>
          {user?.role === 'tutor'
            ? 'Tutor Requests Dashboard'
            : 'Student Requests Dashboard'}
        </h2>
        {isLoading && (
          <Loader2 className='animate-spin text-muted-foreground' size={24} />
        )}
      </div>

      {/* TUTOR VIEW */}
      {user?.role === 'tutor' && (
        <>
          {/* Received Requests */}
          <section className='bg-muted/30 rounded-xl p-6 mb-10 shadow-sm'>
            <h3 className='text-xl font-semibold mb-4 border-b pb-2 text-foreground'>
              Requests You’ve Received
            </h3>
            {myRequests.received.length === 0 ? (
              <div className='text-center py-12'>
                <Inbox
                  className='mx-auto mb-3 text-muted-foreground'
                  size={40}
                />
                <p className='text-muted-foreground'>
                  No requests from students yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-5'>
                {myRequests.received.map((r) => (
                  <Card
                    key={r.id}
                    className='hover:shadow-lg transition-all border-border'
                  >
                    <CardHeader className='flex justify-between items-start'>
                      <div>
                        <h4 className='font-semibold text-lg'>
                          {r.subject || 'Requested Subject'}
                        </h4>
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
                    {r.status === 'pending' && (
                      <CardFooter className='flex justify-end gap-3'>
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
            )}
          </section>

          {/* Sent Requests */}
          <section className='bg-muted/30 rounded-xl p-6 shadow-sm'>
            <h3 className='text-xl font-semibold mb-4 border-b pb-2 text-foreground'>
              Requests You’ve Sent
            </h3>
            {myRequests.sent.length === 0 ? (
              <div className='text-center py-12'>
                <Inbox
                  className='mx-auto mb-3 text-muted-foreground'
                  size={40}
                />
                <p className='text-muted-foreground'>
                  You haven’t sent any requests yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-5'>
                {myRequests.sent.map((r) => (
                  <Card
                    key={r.id}
                    className='hover:shadow-lg transition-all border-border'
                  >
                    <CardHeader className='flex justify-between items-start'>
                      <div>
                        <h4 className='font-semibold text-lg'>
                          {r.postTitle || 'Post Request'}
                        </h4>
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
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* STUDENT VIEW */}
      {user?.role === 'student' && (
        <section className='bg-muted/30 rounded-xl p-6 shadow-sm'>
          <h3 className='text-xl font-semibold mb-4 border-b pb-2 text-foreground'>
            Requests for Your Posts
          </h3>
          {postsRequests.length === 0 ? (
            <div className='text-center py-12'>
              <Inbox className='mx-auto mb-3 text-muted-foreground' size={40} />
              <p className='text-muted-foreground'>
                You haven’t received any requests yet.
              </p>
            </div>
          ) : (
            postsRequests.map((block: any) => (
              <div key={block.post.id} className='mb-6'>
                <h4 className='font-semibold text-lg mb-3 text-foreground'>
                  {block.post.title}
                </h4>
                <div className='grid md:grid-cols-2 gap-5'>
                  {block.requests.map((r: any) => (
                    <Card
                      key={r.id}
                      className='hover:shadow-lg transition-all border-border'
                    >
                      <CardHeader className='flex justify-between items-start'>
                        <div>
                          <p className='font-medium text-base'>
                            Tutor: {r.tutorName}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            Requested: {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {renderStatusBadge(r.status)}
                      </CardHeader>
                      {r.status === 'pending' && (
                        <CardFooter className='flex justify-end gap-3'>
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
        </section>
      )}
    </div>
  );
}
