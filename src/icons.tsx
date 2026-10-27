import {
  Home, MessageCircle, Scale, Video, Phone, FileText, ShieldCheck, Siren, Search, Lock, Receipt,
  Check, X, TriangleAlert, SendHorizontal, MapPin, UserRound, BadgeCheck, Circle, Square, Download,
  ChevronLeft, ArrowRight, Quote, Gavel, ListChecks, ThumbsUp, type LucideProps,
} from 'lucide-react'

export const ICONS = {
  home: Home, chat: MessageCircle, laws: Scale, record: Video, help: Phone, report: FileText,
  shield: ShieldCheck, siren: Siren, search: Search, lock: Lock, receipt: Receipt, check: Check,
  x: X, alert: TriangleAlert, send: SendHorizontal, pin: MapPin, user: UserRound, badge: BadgeCheck,
  rec: Circle, stop: Square, download: Download, back: ChevronLeft, arrow: ArrowRight, quote: Quote,
  gavel: Gavel, list: ListChecks, thumb: ThumbsUp,
}

export type IconName = keyof typeof ICONS

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & LucideProps) {
  const C = ICONS[name]
  return <C size={size} strokeWidth={2} aria-hidden="true" {...rest} />
}
