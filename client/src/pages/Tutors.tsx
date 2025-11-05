import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Tutors() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');

  const {
    data: tutors = [],
    isLoading,
    isError,
    error,
  } = useQuery<any[]>({
    queryKey: ['/api/tutors'],
  });

  const allSubjects = Array.from(
    new Set((tutors as any[]).flatMap((t: any) => t.subjects || []))
  ) as string[];

  const filteredTutors = (tutors as any[]).filter((t: any) => {
    if (filter === 'all') return true;
    return (t.subjects || [])
      .map((s: string) => s.toLowerCase())
      .includes(filter.toLowerCase());
  });

  // Small subcomponent for each tutor card so hooks can be used per-card
  function TutorCard({ tutor }: { tutor: any }) {
    const [selected, setSelected] = useState<string | null>(
      (tutor.subjects && tutor.subjects[0]) || null
    );

    const initials = (tutor.name || '')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <Card key={tutor.id} className='flex flex-col'>
        <CardHeader className='flex items-start gap-4'>
          <Avatar className='w-12 h-12'>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{tutor.name}</CardTitle>
            </div>
            <p className='text-sm text-muted-foreground'>{tutor.email}</p>
          </div>
        </CardHeader>

        <CardContent className='flex-1'>
          <div className='flex flex-wrap gap-2 mb-4'>
            {(tutor.subjects || []).map((s: string) => (
              <Badge key={s} className='capitalize'>
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          {user?.role === 'student' ? (
            <div className='flex gap-2 w-full'>
              {tutor.subjects && tutor.subjects.length > 1 ? (
                <div className='flex-1'>
                  <Select
                    value={selected || ''}
                    onValueChange={(v) => setSelected(String(v))}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select subject' />
                    </SelectTrigger>
                    <SelectContent>
                      {(tutor.subjects || []).map((s: string) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {tutor.subjects && tutor.subjects.length > 1 ? (
                <Button
                  onClick={() => {
                    if (!selected)
                      return toast({
                        title: 'Pick a subject',
                        description: 'Please select a subject first',
                        variant: 'destructive',
                      });
                    handleRequest(tutor.id, selected);
                  }}
                >
                  Request
                </Button>
              ) : (
                <Button
                  className='w-full'
                  onClick={() =>
                    handleRequest(tutor.id, (tutor.subjects || [])[0])
                  }
                >
                  Request to Learn
                  {tutor.subjects && tutor.subjects[0]
                    ? ` (${tutor.subjects[0]})`
                    : ''}
                </Button>
              )}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>
              Only students can request tutors.
            </div>
          )}
        </CardFooter>
      </Card>
    );
  }

  const requestMutation = useMutation({
    mutationFn: async ({
      tutorId,
      subject,
    }: {
      tutorId: string;
      subject: string;
    }) => {
      return apiRequest('POST', '/api/requests', { tutorId, subject });
    },
    onSuccess: () => {
      toast({
        title: 'Request sent',
        description: 'Your learning request was sent to the tutor.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
    },
    onError: (err: any) => {
      toast({
        title: 'Request failed',
        description: err?.message || 'Could not send request',
        variant: 'destructive',
      });
    },
  });

  const handleRequest = (tutorId: string, subject: string) => {
    if (!user)
      return toast({
        title: 'Not signed in',
        description: 'Please login to send requests',
        variant: 'destructive',
      });
    requestMutation.mutate({ tutorId, subject });
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto space-y-6'>
          <div>
            <h1 className='text-2xl font-semibold'>Find Tutors</h1>
            <p className='text-muted-foreground'>
              Browse tutors by subject and request to learn.
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className='w-[220px]'>
                <SelectValue placeholder='Filter by subject' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Subjects</SelectItem>
                {allSubjects.map((s) => (
                  <SelectItem key={String(s)} value={String(s).toLowerCase()}>
                    {String(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
            </div>
          ) : isError ? (
            <div className='py-8'>
              <Card>
                <CardContent className='text-center'>
                  <p className='font-medium'>Failed to load tutors</p>
                  <p className='text-sm text-muted-foreground'>
                    {String(error)}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (tutors as any[]).length === 0 ? (
            <div className='py-8'>
              <Card>
                <CardContent className='text-center'>
                  <p className='font-medium'>No tutors found</p>
                  <p className='text-sm text-muted-foreground'>
                    There are no tutors available right now.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredTutors.map((t) => (
                <Card key={t.id}>
                  <CardHeader>
                    <CardTitle>{t.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4'>
                      {(t.subjects || []).map((s: string) => (
                        <Badge key={s} className='mr-2 mb-2 capitalize'>
                          {s}
                        </Badge>
                      ))}
                    </div>

                    {user?.role === 'student' && (
                      <div>
                        <div className='flex flex-col gap-2'>
                          {(t.subjects || []).slice(0, 3).map((s: string) => (
                            <Button
                              key={s}
                              onClick={() => handleRequest(t.id, s)}
                            >
                              Request to Learn ({s})
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
