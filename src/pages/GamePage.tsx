import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import StarRating from "@/components/StarRating";
import LevelBadge from "@/components/LevelBadge";
import RateModal from "@/components/RateModal";
import ReviewModal from "@/components/ReviewModal";
import { useGames } from "@/contexts/GamesContext";
import { rateGame } from "@/lib/games";
import { fetchReviews, voteReview, ApiReview } from "@/lib/reviews";

interface GamePageProps {
  gameId: number;
  onBack: () => void;
  onGameClick: (id: number) => void;
}

export default function GamePage({ gameId, onBack, onGameClick }: GamePageProps) {
  const { games, myRatings, updateGameRating, setMyRating } = useGames();
  const game = games.find((g) => g.id === gameId);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSort, setReviewSort] = useState<"helpful" | "date" | "rating">("helpful");
  const [addedToList, setAddedToList] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const data = await fetchReviews(gameId);
      setReviews(data);
    } finally {
      setReviewsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (!game) return null;

  const similar = games.filter((g) => g.id !== gameId && g.genre === game.genre).slice(0, 3);
  const myRating = myRatings[gameId];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "date") {
      return b.id - a.id;
    }
    if (reviewSort === "rating") {
      return b.rating - a.rating;
    }
    return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful);
  });

  const handleRate = async (data: { rating: number; criteria: Record<string, number>; comment: string }) => {
    try {
      const result = await rateGame(gameId, data.rating, data.criteria, data.comment);
      updateGameRating(gameId, result.gameRating, result.ratingsCount);
      setMyRating(gameId, data.rating);
      if (result.xpGained > 0) {
        setSuccessMsg(`Спасибо! Оценка ${data.rating}/5 принята. +${result.xpGained} XP`);
      } else {
        setSuccessMsg(`Оценка обновлена: ${data.rating}/5`);
      }
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const handleReviewSuccess = (xpGained: number, isNew: boolean) => {
    if (isNew) {
      setSuccessMsg(`Отзыв опубликован! +${xpGained} XP`);
    } else {
      setSuccessMsg("Отзыв обновлён");
    }
    setTimeout(() => setSuccessMsg(""), 4000);
    loadReviews();
  };

  const handleVote = async (reviewId: number, isHelpful: boolean) => {
    try {
      const result = await voteReview(reviewId, isHelpful);
      setReviews((prev) => prev.map((r) =>
        r.id === reviewId
          ? { ...r, helpful: result.helpful, notHelpful: result.notHelpful, myVote: isHelpful ? "helpful" : "not" }
          : r
      ));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm animate-slide-in-right">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-xl shadow-lg text-sm animate-slide-in-right">
          {errorMsg}
        </div>
      )}

      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={game.cover} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-black/40 glass text-white px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 hover:bg-black/60 transition-all"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-36 shrink-0">
            <img
              src={game.cover}
              alt={game.title}
              className="w-28 md:w-36 rounded-2xl shadow-2xl border-4 border-background"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <span className="bg-primary/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium">{game.genre}</span>
              <span className="bg-secondary text-muted-foreground text-xs px-2.5 py-0.5 rounded-full">{game.year}</span>
              {game.platform.map((p) => (
                <span key={p} className="bg-secondary text-muted-foreground text-xs px-2.5 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">{game.title}</h1>
            <p className="text-muted-foreground text-sm mb-4">{game.publisher}</p>

            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-5xl font-black text-foreground">{game.rating}</span>
                <div>
                  <StarRating rating={game.rating} size="md" />
                  <p className="text-xs text-muted-foreground mt-0.5">{(game.ratingsCount / 1000).toFixed(1)}k оценок</p>
                </div>
              </div>

              <div className="flex-1 min-w-48">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground w-2">{star}</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${game.ratingDistribution[4 - i]}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{game.ratingDistribution[4 - i]}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowRateModal(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 ${
                  myRating
                    ? "bg-green-500/15 text-green-600 border border-green-500/30"
                    : "bg-primary text-primary-foreground pulse-accent"
                }`}
              >
                <Icon name="Star" size={16} />
                {myRating ? `Ваша оценка: ${myRating}/5` : "Оценить"}
              </button>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/70 transition-all flex items-center gap-2"
              >
                <Icon name="MessageSquare" size={16} />
                Написать отзыв
              </button>
              <button
                onClick={() => setAddedToList(!addedToList)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  addedToList ? "bg-green-500/15 text-green-600 border border-green-500/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                <Icon name={addedToList ? "Check" : "BookmarkPlus"} size={16} />
                {addedToList ? "В списке" : "В список"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold mb-3">Об игре</h2>
              <p className="text-muted-foreground leading-relaxed">{game.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {game.tags.map((tag) => (
                  <span key={tag} className="bg-secondary text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-display text-xl font-bold">Отзывы ({reviews.length})</h2>
                <div className="flex gap-1">
                  {([
                    { key: "helpful", label: "По полезности" },
                    { key: "date", label: "По дате" },
                    { key: "rating", label: "По рейтингу" },
                  ] as const).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setReviewSort(s.key)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                        reviewSort === s.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {reviewsLoading && reviews.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Loader" size={24} className="animate-spin mx-auto" />
                  </div>
                )}

                {sortedReviews.map((review) => {
                  const hasCriteria = review.criteria.graphics || review.criteria.gameplay || review.criteria.story || review.criteria.sound;
                  return (
                    <div key={review.id} className={`bg-card border rounded-2xl p-5 ${review.isMine ? "border-primary/40" : "border-border"}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {review.userName[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{review.userName}</span>
                            {review.isMine && <span className="text-xs text-primary font-medium">(ваш отзыв)</span>}
                            <LevelBadge level={review.userLevel} />
                            <span className="text-xs text-muted-foreground">{review.userXp} XP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/90 leading-relaxed mb-3 whitespace-pre-wrap">{review.text}</p>

                      {hasCriteria && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {([
                            { key: "graphics", label: "Графика" },
                            { key: "gameplay", label: "Геймплей" },
                            { key: "story", label: "Сюжет" },
                            { key: "sound", label: "Звук" },
                          ] as const).map((c) => {
                            const val = review.criteria[c.key] || 0;
                            if (!val) return null;
                            return (
                              <div key={c.key} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-16">{c.label}</span>
                                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${val / 5 * 100}%` }} />
                                </div>
                                <span className="text-xs font-medium w-3">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                        <span>Полезно?</span>
                        <button
                          disabled={review.isMine}
                          onClick={() => handleVote(review.id, true)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                            review.myVote === "helpful" ? "bg-green-500/15 text-green-600" : "hover:bg-secondary"
                          } ${review.isMine ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <Icon name="ThumbsUp" size={13} />
                          {review.helpful}
                        </button>
                        <button
                          disabled={review.isMine}
                          onClick={() => handleVote(review.id, false)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                            review.myVote === "not" ? "bg-red-500/15 text-red-500" : "hover:bg-secondary"
                          } ${review.isMine ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <Icon name="ThumbsDown" size={13} />
                          {review.notHelpful}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {!reviewsLoading && reviews.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                    <p className="text-2xl mb-2">💬</p>
                    <p className="text-sm">Пока нет отзывов. Будь первым!</p>
                    <button onClick={() => setShowReviewModal(true)} className="mt-3 text-sm text-primary font-medium hover:underline">
                      Написать отзыв
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {game.systemRequirements && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-display font-semibold mb-3 text-sm">Системные требования</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Минимальные</span>
                    <p className="text-xs text-muted-foreground mt-1">{game.systemRequirements.min}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Рекомендуемые</span>
                    <p className="text-xs text-muted-foreground mt-1">{game.systemRequirements.rec}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span>🔗</span>
                <h3 className="font-display font-semibold text-sm">Купить игру</h3>
              </div>
              <div className="space-y-2">
                {["Steam", "PlayStation Store", "Xbox Store"].filter((_, i) =>
                  game.platform.includes(["PC", "PS5", "Xbox"][i])
                ).map((store) => (
                  <button
                    key={store}
                    className="w-full flex items-center justify-between bg-secondary px-3 py-2 rounded-xl text-sm hover:bg-primary/10 transition-all"
                  >
                    <span>{store}</span>
                    <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {similar.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-display font-semibold mb-3 text-sm">Похожие игры</h3>
                <div className="space-y-3">
                  {similar.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => onGameClick(g.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-all text-left"
                    >
                      <img src={g.cover} alt={g.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-medium">{g.title}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-xs font-bold">{g.rating}</span>
                          <StarRating rating={g.rating} size="sm" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRateModal && (
        <RateModal game={game} onClose={() => setShowRateModal(false)} onSubmit={handleRate} />
      )}
      {showReviewModal && (
        <ReviewModal game={game} onClose={() => setShowReviewModal(false)} onSuccess={handleReviewSuccess} />
      )}
    </div>
  );
}