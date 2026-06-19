export interface InputProps {
  modelValue?: string | number;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
}

declare const UiInput: InputProps;
export default UiInput;
