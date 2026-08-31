import React, { useState } from 'react';
import { ForumThread } from '../types';
import { X, MessageSquare, Send } from 'lucide-react';

interface StartDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newThread: ForumThread) => void;
}

export const StartDiscussionModal: React.FC<StartDiscussionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ForumThread['category']>('Teknik Pewarnaan Alami');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Budi Santoso');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newThread: ForumThread = {
      id: `t-${Date.now()}`,
      authorName: authorName.trim() || 'Anonymous Artisan',
      authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GAZNx-92AGvmb5RF-2fC3Hqsre5AhVt_B88bMjkDziG2cemMFKUQ9wO_B7f2kzSmWx6tu9okfBEQFSPCTLprRLHSxMIga4e-qVt68jedfpkZNbwgdPoAqOVpx7uta6kXK5ttNKaG5VRmd-WQ-_uLnpkS120GloHY9vuSz0M3nSWMx5q6NUUkcALn1UMZrezFJVEQTPNAQXm7d_eTd4bLFc-dZnuNl8V_W2Bri-inNfrJQHBhvji-TA',
      timeAgo: 'Just now',
      category,
      title: title.trim(),
      content: content.trim(),
      repliesCount: 0,
      viewsCount: 1,
    };

    onSubmit(newThread);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fbf9f5] border border-[#767683]/20 rounded-xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#767683] hover:text-[#000666] hover:bg-[#efeeea] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#000666] text-white rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
              Start Discussion
            </h3>
            <p className="text-xs text-[#454652]">
              Share techniques, ask for advice, or discuss heritage preservation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
              placeholder="e.g. Master Budi"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
            >
              <option value="Teknik Pewarnaan Alami">Teknik Pewarnaan Alami</option>
              <option value="Filosofi Motif">Filosofi Motif</option>
              <option value="Tips Sertifikasi">Tips Sertifikasi</option>
              <option value="Peralatan & Bahan">Peralatan & Bahan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Discussion Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sourcing high-quality Mori Primissima in Solo area?"
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Topic Details / Question
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question, observation, or craft experience in detail..."
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666] resize-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#454652] border border-[#767683]/30 rounded-lg hover:bg-[#efeeea]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#000666] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#1a237e] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
