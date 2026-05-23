import { useState } from "react";
import Icon from "@/components/ui/icon";
import StarRating from "./StarRating";
import { createReview } from "@/lib/reviews";
import { Game } from "@/data/games";

interface ReviewModalProps {
  game: Game;
  onClose: () => void;
  onSuccess: (xpGained: number, isNew: boolean) => void;
}

const CRITERIA = [
  { key: "graphics", label: "Графика" },
  { key: "gameplay", label: "Геймплей" },
  { key: "story", label: "Сюжет" },
  { key: "sound", label: "Звук" },
];

export default function ReviewModal({ game, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [criteria, setCriteria] = useState<Record<string, number>>({
    graphics: 0, gameplay: 0, story: 0, sound: 0
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (rating === 0) {
      setError("Поставьте общую оценку");
      return;
    }
    if (text.trim().length < 20) {
      setError(`Минимум 20 символов (сейчас ${text.trim().length})`);
      return;
    }
    setLoading(true);
    try {
      const result = await createReview(game.id, rating, text.trim(), criteria);
      onSuccess(result.xpGained, result.isNew);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-8 animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold">Написать отзыв</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{game.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="mb-5 text-center">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Общая оценка</p>
          <div className="flex justify-center">
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          {rating > 0 && (
            <p className="text-2xl font-display font-bold text-primary mt-1">{rating} / 5</p>
          )}
        </div>

        <div className="space-y-2 mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">По критериям (опционально)</p>
          <div className="grid grid-cols-2 gap-2">
            {CRITERIA.map((c) => (
              <div key={c.key} className="flex items-center justify-between bg-secondary rounded-xl px-3 py-2">
                <span className="text-xs">{c.label}</span>
                <StarRating
                  rating={criteria[c.key]}
                  size="sm"
                  interactive
                  onChange={(v) => setCriteria({ ...criteria, [c.key]: v })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Текст отзыва</label>
            <span className={`text-xs ${text.length >= 20 ? "text-green-500" : "text-muted-foreground"}`}>
              {text.length} / минимум 20
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о своих впечатлениях: что понравилось, что нет, кому подойдёт игра..."
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            maxLength={5000}
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 text-xs text-muted-foreground mb-4 flex items-center gap-2">
          <Icon name="Sparkles" size={14} className="text-primary" />
          За полный отзыв вы получите <span className="text-primary font-semibold">+30 XP</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || rating === 0 || text.trim().length < 20}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Icon name="Loader" size={16} className="animate-spin" />
              Отправляем...
            </span>
          ) : (
            "Опубликовать отзыв"
          )}
        </button>
      </div>
    </div>
  );
}
