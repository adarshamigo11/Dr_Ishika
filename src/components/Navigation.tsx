'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Stethoscope, User, LogOut, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#team' },
  { label: 'Stories', href: '#stories' },
  { label: 'Careers', href: '#careers' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    return '/dashboard';
  };

  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin': return <Shield className="h-3.5 w-3.5" />;
      case 'doctor': return <Stethoscope className="h-3.5 w-3.5" />;
      case 'patient': return <User className="h-3.5 w-3.5" />;
      default: return <User className="h-3.5 w-3.5" />;
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-500',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/assets/dr-ishika.jpg"
            alt="Dr. Ishika Patidar"
            className={cn(
              'h-8 w-8 rounded-full object-cover transition-all duration-300',
              scrolled ? 'ring-2 ring-vivavive-teal' : 'ring-2 ring-white/40'
            )}
          />
          <span
            className={cn(
              'font-sans text-base font-bold tracking-tight transition-colors duration-300',
              scrolled ? 'text-vivavive-dark' : 'text-red-500'
            )}
          >
            VivaVive
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                'font-sans text-base tracking-tight transition-colors duration-300 hover:opacity-70',
                scrolled ? 'text-vivavive-dark' : 'text-red-500'
              )}
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <a
                href={getDashboardLink()}
                className={cn(
                  'flex items-center gap-1.5 font-sans text-base tracking-tight transition-colors duration-300 hover:opacity-70',
                  scrolled ? 'text-vivavive-dark' : 'text-red-500'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>
              <div className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-medium',
                scrolled ? 'bg-vivavive-offwhite text-vivavive-dark' : 'bg-red-500/15 text-red-500'
              )}>
                {getRoleIcon()}
                {getRoleLabel()}
              </div>
              <button
                onClick={logout}
                className={cn(
                  'flex items-center gap-1 font-sans text-sm transition-colors duration-300 hover:opacity-70',
                  scrolled ? 'text-vivavive-muted' : 'text-red-400'
                )}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className={cn(
                  'font-sans text-base tracking-tight transition-colors duration-300 hover:opacity-70',
                  scrolled ? 'text-vivavive-dark' : 'text-red-500'
                )}
              >
                Sign in
              </a>
              <a
                href="/login"
                className={cn(
                  'rounded-full px-6 py-2 font-sans text-sm font-medium tracking-tight transition-all duration-300 hover:scale-[1.02]',
                  scrolled
                    ? 'bg-black text-white hover:bg-[#222222]'
                    : 'bg-white text-black hover:bg-[#f5f5f5]'
                )}
              >
                Book now
              </a>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              'block h-[2px] w-6 transition-all duration-300',
              scrolled ? 'bg-vivavive-dark' : 'bg-red-500',
              menuOpen && 'translate-y-[5px] rotate-45'
            )}
          />
          <span
            className={cn(
              'block h-[2px] w-6 transition-all duration-300',
              scrolled ? 'bg-vivavive-dark' : 'bg-red-500',
              menuOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block h-[2px] w-6 transition-all duration-300',
              scrolled ? 'bg-vivavive-dark' : 'bg-red-500',
              menuOpen && '-translate-y-[5px] -rotate-45'
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'absolute left-0 right-0 top-14 overflow-hidden bg-white shadow-lg transition-all duration-300 md:hidden',
          menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-4 px-6 py-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-base text-vivavive-dark tracking-tight"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {isAuthenticated && user ? (
            <>
              <a
                href={getDashboardLink()}
                className="flex items-center gap-2 font-sans text-base text-vivavive-teal font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard ({getRoleLabel()})
              </a>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-2 font-sans text-base text-vivavive-red"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="font-sans text-base text-vivavive-dark tracking-tight"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </a>
              <a
                href="/login"
                className="rounded-full bg-black px-6 py-3 text-center font-sans text-sm font-medium text-white"
                onClick={() => setMenuOpen(false)}
              >
                Book now
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
