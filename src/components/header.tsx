// Importações permanecem as mesmas
import { View, Text, TouchableOpacity } from "react-native"; // Image não é mais necessária aqui
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
};

export function Header({ title, cartQuantityItem = 0 }: HeaderProps) {
  return (
    // Ajuste no padding vertical se necessário (era pb-5)
    <View className="flex-row items-center border-b border-cinza-200 px-5 py-4">
      {/* View do título agora ocupa todo o espaço à esquerda */}
      <View className="flex-1">
        {/* REMOVIDO: A linha <Image source={require("@/assets/logo.png")} ... /> foi removida */}
        {/* O título agora pode começar diretamente */}
        <Text className="text-textoBase text-xl font-heading">{title}</Text>
      </View>

      {/* Ícone do carrinho permanece igual */}
      {cartQuantityItem > 0 && (
        <Link href={"/cart"} asChild>
          <TouchableOpacity className="relative" activeOpacity={0.7}>
            <View className="bg-azul w-5 h-5 rounded-full items-center justify-center absolute top-[-8px] z-10 right-[-8px]">
              <Text className="text-white font-bold text-xs">
                {cartQuantityItem}
              </Text>
            </View>
            <Feather name="shopping-bag" color={"#0F172A"} size={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}