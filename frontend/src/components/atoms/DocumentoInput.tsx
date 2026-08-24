import { Input } from './Input';
import { aplicarMascaraDocumento } from '../../utils/format';

interface DocumentoInputProps {
  id?: string;
  value: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
}

export function DocumentoInput({ id, value, onChange, disabled }: DocumentoInputProps) {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(aplicarMascaraDocumento(e.target.value))}
      inputMode="numeric"
      placeholder="000.000.000-00"
      disabled={disabled}
    />
  );
}
