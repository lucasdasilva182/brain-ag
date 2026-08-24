import { Input } from './Input';
import { aplicarMascaraDocumento } from '../../utils/format';

interface DocumentoInputProps {
  id?: string;
  value: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
}

// Input de CPF/CNPJ com máscara aplicada enquanto o usuário digita.
// Guarda o valor já formatado no estado do formulário — o backend
// normaliza (remove pontuação) antes de validar, então não precisa
// mandar só os dígitos crus.
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
