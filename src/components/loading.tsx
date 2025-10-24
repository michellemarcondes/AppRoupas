import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      {/* Indicador de cor azul */}
      <ActivityIndicator color={"#3B82F6"} />
    </View>
  );
}