import StarRating from "./StarRating";
import { Game } from "@/data/games";

interface GameCardProps {
  game: Game;
  onClick: () => void;
  index?: number;
}

export default function GameCard({ game, onClick, index = 0 }: GameCardProps) {
  const delays = ["stagger-1", "stagger-2", "stagger-3", "stagger-4", "stagger-5", "stagger-6"];
  const delay = delays[index % delays.length];

  return (
    <div
      className={`group bg-card border border-border rounded-2xl overflow-hidden card-hover cursor-pointer animate-slide-up opacity-0 ${delay}`}
      onClick={onClick}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold text-sm">{game.rating}</span>
            <StarRating rating={game.rating} size="sm" />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {game.genre}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-display font-semibold text-base leading-tight mb-1 group-hover:text-primary transition-colors">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{game.year}</span>
          <span>{(game.ratingsCount / 1000).toFixed(1)}k оценок</span>
        </div>
      </div>
    </div>
  );
}
