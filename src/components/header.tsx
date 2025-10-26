import { Image, View, Text, TouchableOpacity } from "react-native";
// Re-importar Feather
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
};

export function Header({ title, cartQuantityItem = 0 }: HeaderProps) {
  return (
    <View className="flex-row items-center border-b border-cinza-200 pb-5 mx-5">
      <View className="flex-1">
        <Image source={require("@/assets/logo.png")} className="h-6 w-32" resizeMode="contain" />
        <Text className="text-textoBase text-xl font-heading mt-2">{title}</Text>
      </View>

      {cartQuantityItem > 0 && (
        <Link href={"/cart"} asChild>
          {/* Voltando a usar TouchableOpacity sem padding extra, se não for necessário */}
          <TouchableOpacity className="relative" activeOpacity={0.7}>
            {/* Posição original do badge */}
            <View className="bg-azul w-5 h-5 rounded-full items-center justify-center absolute top-[-8px] z-10 right-[-8px]">
              <Text className="text-white font-bold text-xs">
                {cartQuantityItem}
              </Text>
            </View>
            {/* Voltando a usar o ícone Feather */}
            <Feather name="shopping-bag" color={"#0F172A"} size={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}