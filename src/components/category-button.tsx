import { Text, Pressable, PressableProps } from "react-native";
import { clsx } from "clsx";

type CategoryProps = PressableProps & {
  title: string;
  isSelected?: boolean;
};

export function CategoryButton({ title, isSelected, ...rest }: CategoryProps) {
  return (
    <Pressable
      // Fundo branco ou cinza claro, borda azul se selecionado
      className={clsx(
        "bg-white px-4 justify-center rounded-md h-10 border border-cinza-200", // Fundo branco padrão, borda cinza claro
        isSelected && "border-azul bg-blue-100" // Borda e fundo azul claro se selecionado
      )}
      {...rest}
    >
      <Text className={clsx("font-subtitle text-sm",
        isSelected ? "text-azul-dark font-bold" : "text-textoSuporte" // Texto azul escuro/bold se selecionado, cinza se não
      )}>
        {title}
      </Text>
    </Pressable>
  );
}