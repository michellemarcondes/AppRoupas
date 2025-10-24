import { TextInput, TextInputProps } from "react-native";

export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={"#64748B"} // Cor textoSuporte (slate-500)
      // Fundo branco, borda cinza, texto escuro
      className="h-32 bg-white border border-cinza-200 rounded-md px-4 py-3 font-body text-sm text-textoBase"
      {...rest}
    />
  );
}