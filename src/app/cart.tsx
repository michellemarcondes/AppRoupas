// src/app/cart.tsx

import { View, Text, ScrollView, Alert, Linking, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react"; // Adicionado useCallback
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router"; // Importar useFocusEffect

import { Header } from "@/components/header";
import { Product } from "@/components/products";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";
import { CheckoutForm, CheckoutFormData } from "@/components/CheckoutForm"; // Importar Form e Tipo

import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import axios from 'axios';
import { API_BASE_URL } from "@/utils/apiConfig";

export default function Cart() {
  const cartStore = useCartStore();
  const router = useRouter();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado de erro para submit

  // Recalcular total sempre que o carrinho mudar
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

  // Abre o modal de checkout
  function handleCheckout() {
    setError(null); // Limpa erros anteriores ao abrir o modal
    setIsCheckoutVisible(true);
  }

  // Função para submeter o pedido via API
  const submitOrder = useCallback(async (formData: CheckoutFormData) => {
    setIsSubmittingOrder(true);
    setError(null);

    try {
      const orderItems = cartStore.products.map(item => ({
        productId: item.id,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }));

      const payload = {
        ...formData,
        items: orderItems,
      };

      const response = await axios.post(`${API_BASE_URL}/orders`, payload);

      if (response.status === 201) {
          setIsCheckoutVisible(false); // Fecha modal no SUCESSO
          Alert.alert("Pedido Finalizado!", "Sua compra foi registrada com sucesso.", [
            {
                text: "OK",
                onPress: () => {
                cartStore.clear();
                router.replace('/'); // Usar replace para não poder voltar para o carrinho vazio
                },
            },
          ]);
      } else {
          throw new Error(`Status inesperado: ${response.status}`);
      }

    } catch (error: any) {
      console.error("Erro ao finalizar pedido (cart.tsx):", error.response?.data || error.message);
      let errorMessage = "Não foi possível finalizar o pedido. Verifique os dados ou tente novamente mais tarde.";
      if (axios.isAxiosError(error) && error.response?.data?.details) {
          const fieldErrors = error.response.data.details;
          const firstFieldName = Object.keys(fieldErrors)[0];
          if (firstFieldName && fieldErrors[firstFieldName] && fieldErrors[firstFieldName].length > 0) {
              // Mapear nomes de campos do backend para nomes amigáveis (opcional)
              const fieldNameMap: { [key: string]: string } = {
                  customerName: 'Nome Completo',
                  customerCpf: 'CPF',
                  customerPhone: 'Telefone',
                  customerCep: 'CEP',
                  items: 'Itens do Carrinho'
              };
              const friendlyFieldName = fieldNameMap[firstFieldName] || firstFieldName;
              errorMessage = `Erro no campo ${friendlyFieldName}: ${fieldErrors[firstFieldName][0]}`;
          } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
          }
      } else if (axios.isAxiosError(error) && error.response?.data?.error) {
         errorMessage = error.response.data.error; // Captura erros genéricos do backend
      }
      setError(errorMessage); // Guarda a mensagem de erro
      Alert.alert("Erro no Pedido", errorMessage); // Mostra o alerta
      // Não fecha o modal no erro, para o usuário corrigir
      throw error; // Re-lança o erro para o catch no CheckoutForm (opcional)
    } finally {
      setIsSubmittingOrder(false);
    }
  }, [cartStore, router]); // Dependências do useCallback


  return (
    <View className="flex-1 pt-8 bg-fundo">
      <Header title="Seu Carrinho" />
      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="p-5 flex-1">
          {/* Lista de Produtos */}
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
        </View>
      </ScrollView>

      {/* Área inferior fixa */}
      <View className="p-5 gap-5 border-t border-cinza-200 bg-cinza-100">
        <Button onPress={handleCheckout} disabled={cartStore.products.length === 0}>
          <Button.Text>Finalizar compra</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title="Continuar comprando" href={"/"} />
      </View>

      {/* Modal do Formulário */}
      <CheckoutForm
          isVisible={isCheckoutVisible}
          onClose={() => setIsCheckoutVisible(false)} // Simplesmente fecha ao clicar fora ou no X
          onSubmit={submitOrder} // Passa a função de submit
          isSubmitting={isSubmittingOrder} // Passa o estado de loading
      />
    </View>
  );
}