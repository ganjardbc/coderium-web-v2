export interface BadgeProps {
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

declare const UiBadge: BadgeProps;
export default UiBadge;
