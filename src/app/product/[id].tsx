import { useState, useEffect } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { PRODUCTS, ProductProps as ProductDataProps } from "@/utils/data/products";
import { formatCurrency } from "@/utils/functions/format-currency";
import { useCartStore } from "@/stores/cart-store";

import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

type SizeProps = {
  size: string;
  stock: number;
};

type VariationProps = {
  color: string;
  sizes?: SizeProps[];
};

interface ExtendedProductProps extends ProductDataProps {
  variations: VariationProps[];
}


export default function ProductDetail() {
  const cartStore = useCartStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const product: ExtendedProductProps | undefined = PRODUCTS.find((item) => item.id === id) as ExtendedProductProps | undefined;

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<SizeProps | null>(null);

   useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      const firstVariation = product.variations[0];
      setSelectedColor(firstVariation.color);
      if (firstVariation.sizes) {
        const availableSize = firstVariation.sizes.find(s => s.stock > 0);
        setSelectedSize(availableSize || firstVariation.sizes[0] || null);
      } else {
         setSelectedSize(null);
      }
    }
  }, [product]);

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    const variation = product?.variations.find(v => v.color === color);
    if (variation?.sizes) {
        const availableSize = variation.sizes.find(s => s.stock > 0);
        setSelectedSize(availableSize || variation.sizes[0] || null);
    } else {
        setSelectedSize(null);
    }
  }

  function handleAddToCart() {
    if (!product) return;

    if (product.variations.some(v => v.color) && !selectedColor) {
         return Alert.alert("Ops!", "Selecione uma cor para continuar.");
    }
    const currentVariation = product.variations.find(v => v.color === selectedColor);
    if (currentVariation?.sizes && !selectedSize) {
         return Alert.alert("Ops!", "Selecione um tamanho para continuar.");
    }
     if (selectedSize && selectedSize.stock === 0) {
        return Alert.alert("Ops!", "Este tamanho está fora de estoque.");
    }

    const sizeToAdd = selectedSize ? selectedSize.size : "Único";
    const colorToAdd = selectedColor ? selectedColor : "Padrão";

    cartStore.add(product, sizeToAdd, colorToAdd);

    Alert.alert("Sucesso!", "Produto adicionado ao carrinho.");
    router.back();
  }

  if (!product) {
    return <Redirect href={"/"} />;
  }

  const selectedColorData = product.variations.find(v => v.color === selectedColor);

  return (
    <View className="flex-1 bg-fundo">
      <Image
        source={product.cover}
        className="w-full h-52"
        resizeMode="cover"
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5 mt-8 flex-1">
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
                     {/* CORREÇÃO AQUI: Envolver "(Esgotado)" em <Text> */}
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

      <View className="p-5 pb-8 gap-5 border-t border-cinza-200 bg-cinza-100">
        <Button onPress={handleAddToCart} disabled={selectedSize?.stock === 0 && selectedColorData?.sizes && selectedColorData.sizes.length > 0}>
           <Button.Icon>
             <Feather name="shopping-cart" size={20} />
           </Button.Icon>
           <Button.Text>{selectedSize?.stock === 0 && selectedColorData?.sizes && selectedColorData.sizes.length > 0 ? "Fora de Estoque" : "Adicionar ao carrinho"}</Button.Text>
        </Button>

        <LinkButton title="Continuar comprando" href={"/"} />
      </View>
    </View>
  );
}