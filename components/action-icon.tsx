import {
  FlaskConical,
  Droplets,
  Scissors,
  SprayCan,
  Layers,
  Apple,
  Sprout,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  דישון: FlaskConical,
  "דישון אביב": FlaskConical,
  "דישון סתיו": FlaskConical,
  השקיה: Droplets,
  גיזום: Scissors,
  "גיזום קל": Scissors,
  "גיזום עיקרי": Scissors,
  ריסוס: SprayCan,
  "ריסוס מונע": SprayCan,
  "ריסוס חורף": SprayCan,
  "ריסוס נוסף": SprayCan,
  חיפוי: Layers,
  קטיף: Apple,
  "קטיף שוטף": Apple,
};

export function actionIcon(action: string): LucideIcon {
  if (ICON_MAP[action]) return ICON_MAP[action];
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (action.includes(key) || key.includes(action)) return icon;
  }
  return Sprout;
}

export function ActionIcon({
  action,
  className,
}: {
  action: string;
  className?: string;
}) {
  const Icon = actionIcon(action);
  return <Icon className={className} />;
}
