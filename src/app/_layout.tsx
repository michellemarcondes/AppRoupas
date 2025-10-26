import { Slot } from "expo-router";
// ADICIONADO: Importar View de react-native
import { SafeAreaView, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { Loading } from "@/components/loading";
import { useEffect } from 'react'; // Mantido da etapa anterior

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontError) {
      console.error("Erro ao carregar fontes:", fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return <Loading />;
  }

  if (fontError) {
     return (
       // Usando SafeAreaView aqui está ok, View já foi importada
       <SafeAreaView className="bg-fundo flex-1 items-center justify-center">
         <Text className="text-red-500 p-4">Erro ao carregar as fontes. Verifique o console.</Text>
       </SafeAreaView>
     )
  }

  return (
    <SafeAreaView className="bg-fundo flex-1">
      <StatusBar style="dark" />
      <Slot />
    </SafeAreaView>
  );
}

// Nota: A importação de 'Text' já estava aqui da etapa anterior
// Nota: A importação de 'View' foi adicionada acima junto com SafeAreaView