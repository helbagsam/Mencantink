import React, { useState } from 'react';
import { ReviewItem } from '../types';
import { X, Star, Send } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReview: ReviewItem) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [itemName, setItemName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('Budi S.');
  const [reviewerRole, setReviewerRole] = useState('Master Cirebon');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !reviewText.trim()) return;

    const newReview: ReviewItem = {
      id: `r-${Date.now()}`,
      itemName: itemName.trim(),
      rating,
      reviewText: `"${reviewText.trim()}"`,
      reviewerName: reviewerName.trim() || 'Master Craftsman',
      reviewerRole: reviewerRole.trim() || 'Association Member',
    };

    onSubmit(newReview);
    setItemName('');
    setReviewText('');
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
          <div className="p-2.5 bg-[#a14000] text-white rounded-lg">
            <Star className="w-5 h-5 fill-current text-[#ffe088]" />
          </div>
          <div>
            <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
              Write an Artisan Review
            </h3>
            <p className="text-xs text-[#454652]">
              Rate tools, copper stamps, wax grades, or natural dye pastes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Tool / Material Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Canting Cap Tembaga #4"
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-[#cba72f] fill-current' : 'text-[#767683]/30'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#000666] ml-2">{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
              Review Notes
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe durability, wax hold, dye absorption, or performance..."
              className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
                Region / Role
              </label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
              />
            </div>
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
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
