'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Plus, LogOut } from 'lucide-react';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';
import { NewCardDialog } from '@/components/new-card-dialog';

export function FloatingNav() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2 py-2 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/70">

          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
              pathname === '/'
                ? 'bg-black/8 dark:bg-white/10'
                : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Home size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Pages */}
          <Link
            href="/pages"
            aria-label="Pages"
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
              pathname === '/pages'
                ? 'bg-black/8 dark:bg-white/10'
                : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <LayoutGrid size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Pages</span>
          </Link>

          {/* Divider */}
          <div className="mx-1 h-4 w-px shrink-0 bg-black/15 dark:bg-white/15" />

          {/* New Card — signed-in only */}
          {isSignedIn ? (
            <button
              onClick={() => setDialogOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-black px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-75 dark:bg-white dark:text-black sm:px-3"
            >
              <Plus size={12} strokeWidth={2.5} />
              <span className="hidden sm:inline">New Card</span>
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="flex shrink-0 items-center rounded-full border border-black/15 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10 sm:px-3">
                Sign In
              </button>
            </SignInButton>
          )}

          {/* User avatar + sign out */}
          {isSignedIn && (
            <>
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? 'User'}
                  className="ml-1 h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium dark:bg-zinc-700">
                  {(user.fullName ?? user.primaryEmailAddress?.emailAddress ?? '?')[0].toUpperCase()}
                </div>
              )}
              <button
                onClick={() => signOut()}
                aria-label="Sign out"
                className="ml-0.5 flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <LogOut size={12} strokeWidth={2} />
              </button>
            </>
          )}

        </div>
      </div>

      <NewCardDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
