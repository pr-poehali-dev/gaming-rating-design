import { useState } from "react";
import StarRating from "./StarRating";
import Icon from "@/components/ui/icon";
import { Game } from "@/data/games";

interface RateModalProps {
  game: Game;
  onClose: () => void;
  onSubmit: (data: { rating: number; criteria: Record<string, number>; comment: string }) => void;
}

const CRITERIA = [
  { key: "graphics", label: "Графика" },
  { key: "gameplay", label: "Геймплей" },
  { key: "story", label: "Сюжет" },
  { key: "sound", label: "Звук" },
];

export default function RateModal({ game, onClose, onSubmit }: RateModalProps) {
  const [rating, setRating] = useState(0);
  const [criteria, setCriteria] = useState<Record<string, number>>({
    graphics: 0, gameplay: 0, story: 0, sound: 0
  });
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, criteria, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold">Оценить игру</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{game.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Общая оценка</p>
          <div className="flex justify-center">
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          {rating > 0 && (
            <p className="text-2xl font-display font-bold text-primary mt-2">{rating} / 5</p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-muted-foreground">По критериям</p>
          {CRITERIA.map((c) => (
            <div key={c.key} className="flex items-center justify-between">
              <span className="text-sm">{c.label}</span>
              <StarRating
                rating={criteria[c.key]}
                size="sm"
                interactive
                onChange={(v) => setCriteria({ ...criteria, [c.key]: v })}
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Напишите короткий комментарий (необязательно)..."
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Отправить оценку
        </button>
      </div>
    </div>
  );
}
