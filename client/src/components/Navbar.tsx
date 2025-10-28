import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className='sticky top-0 z-50 border-b bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and Brand */}
          <Link href='/' data-testid='link-home'>
            <div className='flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all cursor-pointer'>
              <GraduationCap className='w-8 h-8 text-primary' />
              <span className='text-xl font-semibold'>Learning Community</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className='hidden md:flex items-center gap-2'>
              <Link href='/dashboard' data-testid='link-dashboard'>
                <div
                  className={`px-4 py-2 rounded-md font-medium transition-all hover-elevate active-elevate-2 cursor-pointer ${
                    location === '/dashboard' ? 'bg-accent text-black' : ''
                  }`}
                >
                  Dashboard
                </div>
              </Link>
              <Link href='/profile' data-testid='link-profile'>
                <div
                  className={`px-4 py-2 rounded-md font-medium transition-all hover-elevate active-elevate-2 cursor-pointer ${
                    location === '/profile' ? 'bg-accent text-black' : ''
                  }`}
                >
                  Profile
                </div>
              </Link>
              <Link href='/requests' data-testid='link-requests'>
                <div
                  className={`px-4 py-2 rounded-md font-medium transition-all hover-elevate active-elevate-2 cursor-pointer ${
                    location === '/requests' ? 'bg-accent text-black' : ''
                  }`}
                >
                  Requests
                </div>
              </Link>
            </div>
          )}

          {/* Auth Section */}
          <div className='flex items-center gap-2'>
            {!isAuthenticated ? (
              <>
                <Link href='/login'>
                  <Button variant='ghost' data-testid='button-login'>
                    Login
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button data-testid='button-signup'>Sign Up</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='gap-2'
                    data-testid='button-user-menu'
                  >
                    <Avatar className='w-8 h-8'>
                      <AvatarFallback className='bg-primary text-primary-foreground text-sm'>
                        {getInitials(user?.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className='hidden sm:inline font-medium'>
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56 text-black'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col gap-1'>
                      <p className='font-medium'>{user?.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {user?.email}
                      </p>
                      <p className='text-xs font-medium text-black capitalize'>
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    data-testid='menu-profile'
                  >
                    <User className='w-4 h-4 mr-2' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid='menu-logout'
                  >
                    <LogOut className='w-4 h-4 mr-2' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
