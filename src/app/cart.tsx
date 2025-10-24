import { View, Text, ScrollView, Alert, Linking, TouchableOpacity } from "react-native";
// CORREÇÃO: Importar useRouter em vez de useNavigation
import { useRouter } from "expo-router";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Header } from "@/components/header";
import { Product } from "@/components/products";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";

const PHONE_NUMBER = "5519988414402"; // Mantenha seu número

export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const router = useRouter(); // CORREÇÃO: Usar useRouter

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} (${product.size} / ${product.color}) do carrinho?`, [
      {
        text: "Cancelar", style: "cancel" // Estilo cancel
      },
      {
        text: "Remover",
        style: "destructive", // Estilo destrutivo
        onPress: () => cartStore.remove(product.id, product.size, product.color),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Atenção", "Informe o endereço de entrega!");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity}x ${product.title} (Cor: ${product.color}, Tam: ${product.size})`)
      .join("");

    const message = `
    🛍️ NOVA COMPRA
    \n Entregar em: ${address}
    ${products}
    \n Valor total: ${total}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`
    );

    cartStore.clear();
    router.back(); // CORREÇÃO: Usar router.back()
  }

  return (
    <View className="flex-1 pt-8 bg-fundo"> {/* Fundo claro */}
      <Header title="Seu Carrinho" />
      <KeyboardAwareScrollView extraScrollHeight={100}>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-cinza-200"> {/* Borda clara */}
                {cartStore.products.map((product) => (
                   <View key={`${product.id}-${product.color}-${product.size}`} className="flex-row items-center border-b border-cinza-200 py-4"> {/* Borda clara */}
                        {/* Renderiza o componente Product */}
                        <Product data={product} />
                         {/* Detalhes e botão de remover alinhados à direita */}
                         <View className="ml-auto flex-col items-end pl-2">
                            <Text className="text-textoSuporte text-xs"> {/* Texto cinza */}
                                Cor: {product.color}
                            </Text>
                            <Text className="text-textoSuporte text-xs mb-2"> {/* Texto cinza */}
                                Tamanho: {product.size}
                            </Text>
                            <TouchableOpacity onPress={() => handleProductRemove(product)} className="p-1">
                                 {/* Cor do ícone */}
                                 <Feather name="trash-2" size={20} color="#EF4444"/> {/* Cor vermelha */}
                            </TouchableOpacity>
                         </View>
                   </View>
                ))}
              </View>
            ) : (
              <Text className="font-body text-textoSuporte text-center my-8"> {/* Texto cinza */}
                Seu carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-textoBase text-xl font-subtitle">Total:</Text> {/* Texto escuro */}
              <Text className="text-azul-dark text-2xl font-heading"> {/* Azul escuro */}
                {total}
              </Text>
            </View>

            {/* Input do endereço */}
            <Input
              placeholder="Informe o endereço de entrega completo..."
              onChangeText={setAddress}
              onSubmitEditing={handleOrder}
              blurOnSubmit={true}
              returnKeyType="send"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

       {/* Área inferior com botões */}
      <View className="p-5 gap-5 border-t border-cinza-200 bg-cinza-100"> {/* Fundo cinza claro */}
        <Button onPress={handleOrder} disabled={cartStore.products.length === 0 || address.trim().length === 0}>
          <Button.Text>Finalizar compra</Button.Text>
          <Button.Icon>
            {/* Icone já recebe cor branca do componente Button */}
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Continuar comprando" href={"/"} />
      </View>
    </View>
  );
}