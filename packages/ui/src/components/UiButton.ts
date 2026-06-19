export interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

declare const UiButton: ButtonProps;
export default UiButton;
