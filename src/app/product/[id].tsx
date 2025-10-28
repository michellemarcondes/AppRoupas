// src/app/product/[id].tsx

import React, { useState, useEffect } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Redirect, Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

// Importar tipos do Backend
import { ProductProps as BackendProductProps, BackendSizeProps, BackendVariationProps } from "@/utils/data/products";
import { formatCurrency } from "@/utils/functions/format-currency";
import { useCartStore } from "@/stores/cart-store";

import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";
import axios from 'axios';
import { API_BASE_URL } from "@/utils/apiConfig";

// Renomeado para evitar conflito
type SizeVariationProps = BackendSizeProps;

export default function ProductDetail() {
  const cartStore = useCartStore();
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id aqui é o _id do MongoDB

  const [product, setProduct] = useState<BackendProductProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Para galeria de imagens
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<SizeVariationProps | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) { // Validar formato ObjectId
          setError("ID do produto inválido.");
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<BackendProductProps>(`${API_BASE_URL}/products/${id}`);
        setProduct(response.data);

        // Inicializar seleção
        if (response.data?.variations && response.data.variations.length > 0) {
            const firstVariation = response.data.variations[0];
            setSelectedColor(firstVariation.color ?? ""); // Usar string vazia se color for null/undefined
            if (firstVariation.sizes && firstVariation.sizes.length > 0) {
                const availableSize = firstVariation.sizes.find(s => s.stock > 0);
                setSelectedSize(availableSize || firstVariation.sizes[0]);
            } else {
                 setSelectedSize(null);
            }
        }
      } catch (err: any) {
        console.error("Erro ao buscar produto:", err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
             setError("Produto não encontrado.");
        } else {
            setError("Não foi possível carregar os detalhes do produto.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  function handleColorSelect(color: string) {
     if (!product) return;
    setSelectedColor(color);
    const variation = product.variations.find(v => v.color === color);
    if (variation?.sizes && variation.sizes.length > 0) {
        const availableSize = variation.sizes.find(s => s.stock > 0);
        setSelectedSize(availableSize || variation.sizes[0]);
    } else {
        setSelectedSize(null); // Resetar se a nova cor não tiver tamanhos
    }
  }

  function handleAddToCart() {
    if (!product) return;
     if (product.variations.some(v => v.color) && !selectedColor) {
         return Alert.alert("Ops!", "Selecione uma cor para continuar.");
    }
    const currentVariation = product.variations.find(v => v.color === selectedColor);
    // Ajuste: Só valida tamanho se a variação *deveria* ter tamanhos
    if (currentVariation?.sizes && currentVariation.sizes.length > 0 && !selectedSize) {
         return Alert.alert("Ops!", "Selecione um tamanho para continuar.");
    }
     if (selectedSize && selectedSize.stock === 0) {
        return Alert.alert("Ops!", "Este tamanho está fora de estoque.");
    }

    const sizeToAdd = selectedSize ? selectedSize.size : "Único"; // Default para itens sem tamanho
    const colorToAdd = selectedColor ? selectedColor : "Padrão"; // Default para itens sem cor

    cartStore.add(product, sizeToAdd, colorToAdd);

    Alert.alert("Sucesso!", "Produto adicionado ao carrinho.");
    router.back();
  }

  // --- Renderização Condicional ---
  if (isLoading) {
    return (
      <View className="flex-1 bg-fundo items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
     return (
       <View className="flex-1 bg-fundo items-center justify-center p-5">
         <Text className="text-red-500 text-center mb-4">{error}</Text>
          <LinkButton title="Voltar para Início" href="/" />
       </View>
     );
  }

  if (!product) {
    // Se chegou aqui após loading e sem erro, mas produto é null, redireciona
    return <Redirect href="/" />;
  }
  // --- Fim Renderização Condicional ---


  const selectedColorData = product.variations.find(v => v.color === selectedColor);
  const isOutOfStock = selectedSize?.stock === 0 && selectedColorData?.sizes && selectedColorData.sizes.length > 0;
  const currentImageUrl = product.image_urls[selectedImageIndex] || product.thumbnail_url; // Usa imagem selecionada ou thumbnail

  return (
    <View className="flex-1 bg-fundo">
      {/* Imagem Principal */}
      <Image
        source={{ uri: currentImageUrl }} // Usa URL da imagem atual
        className="w-full h-64 bg-cinza-100" // Aumentar altura, fundo placeholder
        resizeMode="contain" // Contain pode ser melhor para roupas
      />
      {/* Miniaturas (se houver mais de uma imagem) */}
      {product.image_urls.length > 1 && (
         <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-none py-2 px-5 bg-cinza-100 border-b border-cinza-200">
             {product.image_urls.map((url, index) => (
                 <TouchableOpacity
                    key={url}
                    className={`w-16 h-16 rounded mr-2 border-2 ${index === selectedImageIndex ? 'border-azul' : 'border-transparent'}`}
                    onPress={() => setSelectedImageIndex(index)}
                    activeOpacity={0.8}
                 >
                     <Image source={{ uri: url }} className="w-full h-full rounded" resizeMode="cover" />
                 </TouchableOpacity>
             ))}
         </ScrollView>
      )}


      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5 mt-4 flex-1"> {/* Reduzido mt */}
          <Text className="text-textoBase text-xl font-heading">{product.title}</Text>
          <Text className="text-azul-dark text-2xl font-heading my-2">
            {formatCurrency(product.price)}
          </Text>
          <Text className="text-textoSuporte font-body text-base leading-6 mb-6">
            {product.description}
          </Text>

          {/* Seletor de Cores */}
           {product.variations && product.variations.length > 0 && product.variations.some(v => v.color) && (
            <>
              <Text className="text-textoBase font-heading text-lg mb-2">Cor</Text>
              <View className="flex-row gap-2 flex-wrap mb-4">
                {product.variations.map((variation) => (
                  <TouchableOpacity
                    key={variation.color}
                    onPress={() => handleColorSelect(variation.color)}
                    className={`border-2 rounded-md py-1 px-3 ${
                      selectedColor === variation.color ? "border-azul bg-blue-100" : "border-cinza-200 bg-white"
                    }`}
                  >
                    <Text className={selectedColor === variation.color ? "text-azul-dark font-bold" : "text-textoBase"}>{variation.color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
           )}

          {/* Seletor de Tamanhos */}
          {selectedColorData?.sizes && selectedColorData.sizes.length > 0 && (
            <View className="mt-4">
              <Text className="text-textoBase font-heading text-lg mb-2">Tamanho</Text>
              <View className="flex-row gap-2 flex-wrap">
                {selectedColorData.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.size}
                    onPress={() => setSelectedSize(size)}
                    disabled={size.stock === 0}
                    className={`border-2 rounded-md p-2 w-16 items-center ${
                      selectedSize?.size === size.size ? "border-azul bg-blue-100" : "border-cinza-200 bg-white"
                    } ${size.stock === 0 ? "opacity-60 bg-cinza-100" : ""}`}
                  >
                    <Text className={selectedSize?.size === size.size ? "text-azul-dark font-bold" : (size.stock === 0 ? "text-textoSuporte" : "text-textoBase")}>{size.size}</Text>
                     {size.stock === 0 && (
                       <Text className="text-xs text-red-600">(Esgotado)</Text>
                     )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Área do botão */}
      <View className="p-5 pb-8 gap-5 border-t border-cinza-200 bg-cinza-100">
        <Button onPress={handleAddToCart} disabled={isOutOfStock}>
           <Button.Icon>
             <Feather name="shopping-cart" size={20} />
           </Button.Icon>
           <Button.Text>{isOutOfStock ? "Fora de Estoque" : "Adicionar ao carrinho"}</Button.Text>
        </Button>
        <LinkButton title="Continuar comprando" href={"/"} />
      </View>
    </View>
  );
}

// Estilos adicionais, se necessário (ex: para galeria)
// const styles = StyleSheet.create({ ... });