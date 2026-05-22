interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export default function StarRating({ rating, max = 5, size = "md", interactive = false, onChange }: StarRatingProps) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };

  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
              filled ? "text-amber-400" : partial ? "text-amber-300" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
