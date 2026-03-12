'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Image as ImageIcon, MoreVertical, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { Card } from '@/lib/data';
import { NewCardDialog } from '@/components/new-card-dialog';

const ADMIN_EMAIL = 'sedapdibedai@gmail.com';

const NOTION_COLORS: Record<string, string> = {
  default: '#6b7280', gray: '#9ca3af', brown: '#92400e', orange: '#ea580c',
  yellow: '#ca8a04', green: '#16a34a', blue: '#2563eb', purple: '#7c3aed',
  pink: '#db2777', red: '#dc2626',
};

const NOTION_BG: Record<string, string> = {
  default: '#f3f4f6', gray: '#f3f4f6', brown: '#fef3c7', orange: '#ffedd5',
  yellow: '#fefce8', green: '#dcfce7', blue: '#dbeafe', purple: '#ede9fe',
  pink: '#fce7f3', red: '#fee2e2',
};

function ConfirmDialog({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-xs rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Delete card?</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{title}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function CardsGrid({ initialCards }: { initialCards: Card[] }) {
  const [cards, setCards] = useState(initialCards);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmCard, setConfirmCard] = useState<Card | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-card-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const handleDelete = async (id: string) => {
    setConfirmCard(null);
    setDeletingId(id);
    try {
      await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      setCards((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = (updatedCard: Card) => {
    setCards((prev) => prev.map((c) => c.id === updatedCard.id ? updatedCard : c));
  };

  if (cards.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-zinc-500">
        No cards found. Add entries to data/cards.json.
      </div>
    );
  }

  return (
    <>
      {confirmCard && (
        <ConfirmDialog
          title={confirmCard.title}
          onConfirm={() => handleDelete(confirmCard.id)}
          onCancel={() => setConfirmCard(null)}
        />
      )}

      <NewCardDialog
        open={!!editCard}
        onClose={() => setEditCard(null)}
        editCard={editCard ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => {
          const canManage = isAdmin || (!!user && card.creatorId === user.id);
          return (
            <div key={card.id} className="group/card relative">
              <Link
                href={card.link || '#'}
                target={card.link ? '_blank' : undefined}
                className={`flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-white/8 dark:bg-zinc-900 ${deletingId === card.id ? 'opacity-40 pointer-events-none scale-[0.98]' : ''}`}
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <h3 className="truncate text-sm font-semibold">{card.title || 'Untitled'}</h3>
                  <p className="line-clamp-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {card.description || 'No description available'}
                  </p>

                  {card.labels && card.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.labels.map((label) => (
                        <span
                          key={label.name}
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: NOTION_BG[label.color] ?? NOTION_BG.default,
                            color: NOTION_COLORS[label.color] ?? NOTION_COLORS.default,
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-400">
                      <User size={11} className="text-white" />
                    </div>
                    <span className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {card.author || 'Anonymous'}
                    </span>
                  </div>
                </div>
              </Link>

              {canManage && (
                <div
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"
                  data-card-menu
                >
                  <button
                    onClick={() => setOpenMenuId(openMenuId === card.id ? null : card.id)}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-zinc-600 shadow-md border border-zinc-200/80 hover:bg-white hover:text-zinc-900 transition-colors backdrop-blur-sm dark:bg-zinc-800/90 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <MoreVertical size={13} />
                  </button>

                  {openMenuId === card.id && (
                    <div className="absolute right-0 top-9 w-36 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800 animate-in fade-in-0 zoom-in-95 duration-100">
                      <div className="p-1">
                        <button
                          onClick={() => { setOpenMenuId(null); setEditCard(card); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50 transition-colors"
                        >
                          <Pencil size={13} />
                          Edit card
                        </button>
                        <button
                          onClick={() => { setOpenMenuId(null); setConfirmCard(card); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={13} />
                          Delete card
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
