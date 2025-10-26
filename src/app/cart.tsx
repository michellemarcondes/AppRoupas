import { View, Text, ScrollView, Alert, Linking, TouchableOpacity } from "react-native"; // Linking não será mais usado aqui, mas pode deixar
import { useRouter } from "expo-router";
// REMOVIDO: import { useState } from "react";
import { Feather } from "@expo/vector-icons";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Mantido removido
// ADICIONADO: React para estado (se precisar de algo mais tarde)
import React from "react";

import { Header } from "@/components/header";
import { Product } from "@/components/products";
import { Button } from "@/components/button";
// REMOVIDO: import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";

// REMOVIDO: Constante PHONE_NUMBER não é mais necessária
// const PHONE_NUMBER = "5519988414402";

export default function Cart() {
  // REMOVIDO: Estado 'address' não é mais necessário
  // const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const router = useRouter();

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} (${product.size} / ${product.color}) do carrinho?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => cartStore.remove(product.id, product.size, product.color),
      },
    ]);
  }

  // --- LÓGICA DE handleOrder ALTERADA ---
  function handleOrder() {
    // Não precisa mais validar endereço
    // Não precisa mais formatar mensagem para WhatsApp

    // Exibe o alerta de confirmação
    Alert.alert("Pedido Finalizado!", "Sua compra foi registrada com sucesso.", [
      {
        text: "OK",
        onPress: () => {
          // Ações a serem executadas APÓS o usuário pressionar OK
          cartStore.clear(); // Limpa o carrinho
          router.back();     // Volta para a tela anterior (provavelmente a inicial)
        },
      },
    ]);
  }
  // --- FIM DA ALTERAÇÃO ---

  return (
    <View className="flex-1 pt-8 bg-fundo">
      <Header title="Seu Carrinho" />
      {/* Usando ScrollView normal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-5 flex-1">
          {cartStore.products.length > 0 ? (
            <View>
              {cartStore.products.map((product) => (
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

          {/* REMOVIDO: Componente Input */}

        </View>
      </ScrollView>

      {/* Área inferior */}
      <View className="p-5 gap-5 border-t border-cinza-200 bg-cinza-100">
        {/* Botão Finalizar só depende do carrinho não estar vazio */}
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