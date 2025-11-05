import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Requests from '@/pages/Requests';
import Tutors from '@/pages/Tutors';

function ProtectedRoute({
  component: Component,
}: {
  component: () => JSX.Element | null;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }

  return <Component />;
}

function StudentRoute({
  component: Component,
}: {
  component: () => JSX.Element | null;
}) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to='/login' />;
  if (user?.role !== 'student') return <Redirect to='/dashboard' />;
  return <Component />;
}

function Router() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <Switch>
        <Route path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/dashboard'>
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path='/profile'>
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        <Route path='/requests'>
          {() => <ProtectedRoute component={Requests} />}
        </Route>
        <Route path='/tutors'>
          {() => <StudentRoute component={Tutors} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
