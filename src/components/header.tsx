import { Image, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
};

export function Header({ title, cartQuantityItem = 0 }: HeaderProps) {
  return (
    <View className="flex-row items-center border-b border-cinza-200 pb-5 mx-5"> {/* Borda clara */}
      <View className="flex-1">
         {/* Se o logo for escuro, pode ficar bom no fundo claro */}
        <Image source={require("@/assets/logo.png")} className="h-6 w-32" resizeMode="contain" />
        <Text className="text-textoBase text-xl font-heading mt-2">{title}</Text> {/* Texto escuro */}
      </View>

      {cartQuantityItem > 0 && (
        <Link href={"/cart"} asChild>
          <TouchableOpacity className="relative" activeOpacity={0.7}>
            <View className="bg-azul w-5 h-5 rounded-full items-center justify-center absolute top-[-8px] z-10 right-[-8px]">
              <Text className="text-white font-bold text-xs"> {/* Texto branco no badge */}
                {cartQuantityItem}
              </Text>
            </View>
             {/* Ícone do carrinho escuro */}
            <Feather name="shopping-bag" color={"#0F172A"} size={24} /> {/* Cor textoBase */}
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}