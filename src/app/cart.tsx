import { View, Text, ScrollView, Alert, Linking, TouchableOpacity /* TextInput */ } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Header } from "@/components/header";
import { Product } from "@/components/products"; // <<<--- RE-IMPORTAR/DESCOMENTAR
import { Button } from "@/components/button";
import { Input } from "@/components/input"; // <<<--- Manter importado
import { LinkButton } from "@/components/link-button";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";

const PHONE_NUMBER = "5519988414402";

export default function Cart() {
  const [address, setAddress] = useState(""); // Manter estado do endereço
  const cartStore = useCartStore();
  const router = useRouter();

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    // ... (lógica handleProductRemove) ...
     Alert.alert("Remover", `Deseja remover ${product.title} (${product.size} / ${product.color}) do carrinho?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => cartStore.remove(product.id, product.size, product.color),
      },
    ]);
  }

  function handleOrder() {
    // ... (lógica handleOrder, ainda sem validação/uso de address) ...
    const products = cartStore.products
      .map((product) => `\n ${product.quantity}x ${product.title} (Cor: ${product.color}, Tam: ${product.size})`)
      .join("");
    const message = `
    🛍️ NOVA COMPRA
    ${/* Remover comentário quando Input voltar -> \n Entregar em: ${address} */''}
    ${products}
    \n Valor total: ${total}`;
    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`
    );
    cartStore.clear();
    router.back();
  }

  return (
    <View className="flex-1 pt-8 bg-fundo">
      <Header title="Seu Carrinho" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-5 flex-1">
          {cartStore.products.length > 0 ? (
            <View>
              {cartStore.products.map((product) => (
                // <<<--- RESTAURANDO O USO DO COMPONENTE PRODUCT E VIEW LATERAL
                <View key={`${product.id}-${product.color}-${product.size}`} className="border-b border-cinza-200 py-4 flex-row">
                  <Product data={product} className="flex-1"/>
                  <View className="justify-center items-end pl-2 w-20">
                    <Text className="text-textoSuporte text-xs">Cor: {product.color}</Text>
                    <Text className="text-textoSuporte text-xs mb-2">Tamanho: {product.size}</Text>
                    <TouchableOpacity onPress={() => handleProductRemove(product)} className="p-1 mt-auto">
                      <Feather name="trash-2" size={20} color="#EF4444"/>
                    </TouchableOpacity>
                  </View>
                </View>
                // <<<--- FIM DA RESTAURAÇÃO
              ))}
            </View>
          ) : (
            <Text className="font-body text-textoSuporte text-center my-8">
              Seu carrinho está vazio.
            </Text>
          )}

          {/* Total */}
          <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-textoBase text-xl font-subtitle">Total:</Text>
            <Text className="text-azul-dark text-2xl font-heading">
              {total}
            </Text>
          </View>

          {/* INPUT AINDA COMENTADO */}
          {/*
          <Input
            placeholder="Informe o endereço de entrega completo..."
            onChangeText={setAddress}
            onSubmitEditing={handleOrder}
            blurOnSubmit={true}
            returnKeyType="send"
          />
          */}

        </View>
      </ScrollView>

      {/* Área inferior */}
      <View className="p-5 gap-5 border-t border-cinza-200 bg-cinza-100">
         {/* Botão Finalizar ainda desabilitado baseado apenas no carrinho */}
        <Button onPress={handleOrder} disabled={cartStore.products.length === 0}>
          <Button.Text>Finalizar compra</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title="Continuar comprando" href={"/"} />
      </View>
    </View>
  );
}