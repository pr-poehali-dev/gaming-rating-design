const LEVEL_CONFIG = {
  novice: { label: "Новичок", cls: "badge-novice" },
  amateur: { label: "Любитель", cls: "badge-amateur" },
  expert: { label: "Эксперт", cls: "badge-expert" },
  guru: { label: "Гуру", cls: "badge-guru" },
};

interface LevelBadgeProps {
  level: 'novice' | 'amateur' | 'expert' | 'guru';
  size?: 'sm' | 'md';
}

export default function LevelBadge({ level, size = 'sm' }: LevelBadgeProps) {
  const { label, cls } = LEVEL_CONFIG[level];
  return (
    <span className={`${cls} rounded-full font-semibold ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}>
      {label}
    </span>
  );
}
