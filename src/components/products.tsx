// src/components/products.tsx

import React, { forwardRef, ReactNode } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
  View,
  Text,
} from "react-native";
// Usar tipo do Backend diretamente ou um tipo específico se necessário
import { ProductProps as BackendProductProps } from "@/utils/data/products";

// Ajustar o tipo de dado esperado para incluir apenas o necessário para exibição na lista/carrinho
type ProductDataForComponent = Pick<BackendProductProps, 'title' | 'description' | 'thumbnail_url'> & {
    quantity?: number; // Quantidade é opcional e usada no carrinho
};

type ProductProps = TouchableOpacityProps & {
  data: ProductDataForComponent;
  children?: ReactNode;
};

export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, children, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4" // Mantido padding bottom para espaçamento
        activeOpacity={0.7}
        {...rest}
      >
        {/* Usar a URL da thumbnail do backend */}
        {data.thumbnail_url ? ( // Verifica se a URL existe
            <Image
                source={{ uri: data.thumbnail_url }} // Usa a URL
                className="w-20 h-20 rounded-md bg-cinza-100" // Adiciona um fundo enquanto carrega
                resizeMode="cover"
            />
        ) : (
            // Placeholder se não houver imagem
            <View className="w-20 h-20 rounded-md bg-cinza-200 items-center justify-center">
                <Text className="text-textoSuporte text-xs">Sem Imagem</Text>
            </View>
        )}


        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-textoBase font-subtitle text-base flex-1 pr-2" numberOfLines={1} ellipsizeMode="tail">
              {data.title}
            </Text>
            {data.quantity != null && data.quantity > 0 && (
              <Text className="text-textoSuporte font-subtitle text-sm ml-2">
                x {data.quantity}
              </Text>
            )}
          </View>
          <Text className="text-textoSuporte text-xs leading-5 mt-0.5" numberOfLines={2} ellipsizeMode="tail">
            {data.description}
          </Text>
          {/* Renderiza children (usado no carrinho) */}
          {children && <View className="mt-1">{children}</View>}
        </View>
      </TouchableOpacity>
    );
  }
);

Product.displayName = "Product";