import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Shield, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>(user?.subjects || []);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setSubjects(user?.subjects || []);
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest('PATCH', `/api/users/${user?.id}`, {
        name,
        email,
        subjects,
      });
      const updated = await res.json();
      // update auth context
      const token = localStorage.getItem('token') || '';
      // reuse login to update stored user
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      login(updated, token);
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error?.message || 'Could not update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  const addSubject = () => {
    const s = newSubject.trim();
    if (!s) return;
    if (subjects.includes(s)) {
      toast({ title: 'Duplicate', description: 'Subject already added' });
      return;
    }
    setSubjects((prev) => [...prev, s]);
    setNewSubject('');
  };

  const removeSubject = (s: string) => {
    setSubjects((prev) => prev.filter((x) => x !== s));
  };

  if (!user) return null;

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-5xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Sidebar - User Info Card */}
            <div className='lg:col-span-1'>
              <Card>
                <CardHeader className='text-center pb-4'>
                  <div className='flex justify-center mb-4'>
                    <Avatar className='w-24 h-24'>
                      <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle
                    className='text-2xl'
                    data-testid='text-profile-name'
                  >
                    {user.name}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className='mt-4'>
                    <Badge className='capitalize' data-testid='badge-role'>
                      {user.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4 pt-4 border-t'>
                  <div className='flex items-center gap-3 text-sm'>
                    <Mail className='w-4 h-4 text-muted-foreground' />
                    <span className='text-muted-foreground break-all'>
                      {user.email}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <Calendar className='w-4 h-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>
                      Joined{' '}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <Shield className='w-4 h-4 text-muted-foreground' />
                    <span className='text-muted-foreground capitalize'>
                      {user.role} Account
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Edit Form */}
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Full Name</Label>
                        <Input
                          id='name'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className='h-12'
                          data-testid='input-name'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        <Input
                          id='email'
                          type='email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                          className='h-12'
                          data-testid='input-email'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='role'>Account Type</Label>
                        <Input
                          id='role'
                          value={user.role}
                          disabled
                          className='h-12 capitalize'
                          data-testid='input-role'
                        />
                        <p className='text-xs text-muted-foreground'>
                          Account type cannot be changed
                        </p>
                      </div>

                      {user.role === 'tutor' && (
                        <div className='space-y-2'>
                          <Label>Subjects</Label>
                          <div className='flex flex-wrap gap-2'>
                            {subjects.map((s) => (
                              <Badge
                                key={s}
                                className='flex items-center gap-2'
                              >
                                <span className='capitalize'>{s}</span>
                                {isEditing && (
                                  <button
                                    type='button'
                                    onClick={() => removeSubject(s)}
                                    className='text-xs text-red-500 ml-2'
                                    aria-label={`remove-${s}`}
                                  >
                                    &times;
                                  </button>
                                )}
                              </Badge>
                            ))}

                            {isEditing && (
                              <div className='flex items-center gap-2 mt-2 w-full sm:w-auto'>
                                <Input
                                  placeholder='Add subject e.g., Mathematics'
                                  value={newSubject}
                                  onChange={(e) =>
                                    setNewSubject(e.target.value)
                                  }
                                  className='h-10'
                                />
                                <Button type='button' onClick={addSubject}>
                                  Add Subject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing ? (
                      <Button
                        type='button'
                        onClick={() => setIsEditing(true)}
                        className='w-full sm:w-auto'
                        data-testid='button-edit'
                      >
                        <User className='w-4 h-4 mr-2' />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className='flex flex-col sm:flex-row gap-2'>
                        <Button
                          type='submit'
                          disabled={isLoading}
                          className='flex-1'
                          data-testid='button-save'
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={handleCancel}
                          disabled={isLoading}
                          className='flex-1'
                          data-testid='button-cancel'
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className='mt-6'>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center py-3 border-b'>
                    <div>
                      <p className='font-medium'>Account Status</p>
                      <p className='text-sm text-muted-foreground'>
                        Your account is active
                      </p>
                    </div>
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-800 border-green-200'
                    >
                      Active
                    </Badge>
                  </div>

                  <div className='flex justify-between items-center py-3 border-b'>
                    <div>
                      <p className='font-medium'>Account Type</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.role === 'student'
                          ? 'You can create learning requests and find tutors'
                          : 'You can browse student requests and offer to teach'}
                      </p>
                    </div>
                    <Badge className='capitalize'>{user.role}</Badge>
                  </div>

                  <div className='flex justify-between items-center py-3'>
                    <div>
                      <p className='font-medium'>Member Since</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
