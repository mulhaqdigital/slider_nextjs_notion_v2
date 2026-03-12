'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { X, Plus, Tag, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Card } from '@/lib/data';

interface LabelOption {
  name: string;
  color: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  editCard?: Card;
  onSuccess?: (card: Card) => void;
}

const EMPTY_FORM = { title: '', description: '', author: '', link: '' };

const NOTION_COLORS: Record<string, string> = {
  default: '#6b7280',
  gray: '#9ca3af',
  brown: '#92400e',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  blue: '#2563eb',
  purple: '#7c3aed',
  pink: '#db2777',
  red: '#dc2626',
};

const NOTION_BG: Record<string, string> = {
  default: '#f3f4f6',
  gray: '#f3f4f6',
  brown: '#fef3c7',
  orange: '#ffedd5',
  yellow: '#fefce8',
  green: '#dcfce7',
  blue: '#dbeafe',
  purple: '#ede9fe',
  pink: '#fce7f3',
  red: '#fee2e2',
};

export function NewCardDialog({ open, onClose, editCard, onSuccess }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [existingLabels, setExistingLabels] = useState<LabelOption[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const isEditing = !!editCard;

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      if (editCard) {
        setForm({
          title: editCard.title,
          description: editCard.description,
          author: editCard.author,
          link: editCard.link,
        });
        setSelectedLabels(editCard.labels.map((l) => l.name));
        setImagePreview(editCard.imageUrl || '');
      } else {
        setForm(EMPTY_FORM);
        setSelectedLabels([]);
        setImagePreview('');
      }
      setImageFile(null);
      setLabelInput('');
      setError('');

      fetch('/api/labels')
        .then((r) => r.json())
        .then(setExistingLabels)
        .catch(() => {});
    }
  }, [open, editCard]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !labelInputRef.current?.contains(e.target as Node) &&
        !suggestionsRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!open) return null;

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
    if (words.length > 60) return;
    setForm((f) => ({ ...f, description: e.target.value }));
  };

  const filteredSuggestions = existingLabels.filter(
    (l) =>
      l.name.toLowerCase().includes(labelInput.toLowerCase()) &&
      !selectedLabels.includes(l.name)
  );

  const addLabel = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || selectedLabels.includes(trimmed)) return;
    setSelectedLabels((prev) => [...prev, trimmed]);
    setLabelInput('');
    setShowSuggestions(false);
  };

  const removeLabel = (name: string) =>
    setSelectedLabels((prev) => prev.filter((l) => l !== name));

  const handleLabelKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0 && !labelInput.trim()) return;
      addLabel(labelInput);
    } else if (e.key === 'Backspace' && !labelInput && selectedLabels.length > 0) {
      removeLabel(selectedLabels[selectedLabels.length - 1]);
    }
  };

  const getLabelColor = (name: string) => {
    const found = existingLabels.find((l) => l.name === name);
    return found?.color || 'default';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const labelsWithNew = selectedLabels.includes('New')
        ? selectedLabels
        : ['New', ...selectedLabels];

      if (isEditing) {
        const res = await fetch(`/api/cards/${editCard.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imageUrl, labels: labelsWithNew }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update card');
        }
        const { card: updatedCard } = data;
        onSuccess?.(updatedCard);
      } else {
        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imageUrl, labels: labelsWithNew }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create card');
        }
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">{isEditing ? 'Edit Card' : 'New Card'}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Title *" value={form.title} onChange={set('title')} placeholder="Card title" required />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
            <textarea
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="Short description (up to 60 words)"
              rows={5}
              className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500 resize-none"
            />
          </div>
          <Field label="Author" value={form.author} onChange={set('author')} placeholder="Author name" />
          <Field label="Link" value={form.link} onChange={set('link')} placeholder="https://..." type="url" />
          {/* Image upload */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Image</label>
            {imagePreview ? (
              <div className="relative w-full h-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-transparent py-6 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
              >
                <ImageIcon size={20} />
                <span className="text-xs">Click to upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Label picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Tag size={11} />
              Labels
            </label>
            <div
              className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 bg-transparent px-3 py-2 focus-within:border-zinc-400 dark:border-zinc-700 dark:focus-within:border-zinc-500 transition-colors cursor-text min-h-[38px]"
              onClick={() => labelInputRef.current?.focus()}
            >
              {selectedLabels.map((name) => {
                const color = getLabelColor(name);
                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: NOTION_BG[color] || NOTION_BG.default,
                      color: NOTION_COLORS[color] || NOTION_COLORS.default,
                    }}
                  >
                    {name}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeLabel(name); }}
                      className="opacity-60 hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </span>
                );
              })}
              <div className="relative flex-1 min-w-[80px]">
                <input
                  ref={labelInputRef}
                  type="text"
                  value={labelInput}
                  onChange={(e) => { setLabelInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleLabelKeyDown}
                  placeholder={selectedLabels.length === 0 ? 'Add label…' : ''}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />

                {showSuggestions && (filteredSuggestions.length > 0 || labelInput.trim()) && (
                  <div
                    ref={suggestionsRef}
                    className="absolute bottom-full left-0 mb-1 z-10 w-44 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {filteredSuggestions.map((l) => (
                      <button
                        key={l.name}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); addLabel(l.name); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: NOTION_COLORS[l.color] || NOTION_COLORS.default }}
                        />
                        {l.name}
                      </button>
                    ))}
                    {labelInput.trim() && !existingLabels.some((l) => l.name.toLowerCase() === labelInput.trim().toLowerCase()) && (
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); addLabel(labelInput); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg text-zinc-500"
                      >
                        <Plus size={12} />
                        Create &ldquo;{labelInput.trim()}&rdquo;
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !form.title.trim()}
            className="mt-1 rounded-full bg-black py-2 text-sm font-medium text-white transition-opacity hover:opacity-75 disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {loading ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save Changes' : 'Create Card')}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"
      />
    </div>
  );
}
