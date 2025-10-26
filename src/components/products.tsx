import React, { forwardRef, ReactNode } from "react"; // React já estava importado
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageProps,
  Image,
  View,
  Text,
} from "react-native";

// Tipos definidos anteriormente...
type ProductDataProps = {
  title: string;
  description: string;
  thumbnail: ImageProps["source"];
  quantity?: number;
  price?: number;
  color?: string;
  size?: string;
};

type ProductProps = TouchableOpacityProps & {
  data: ProductDataProps;
  children?: ReactNode; // Children continua opcional
};

export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, children, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4" // Padding bottom para espaçamento na lista
        activeOpacity={0.7}
        {...rest}
      >
        {/* Imagem */}
        <Image source={data.thumbnail} className="w-20 h-20 rounded-md" />

        {/* Informações do Produto */}
        <View className="flex-1 ml-3">
          {/* Linha do Título e Quantidade */}
          <View className="flex-row items-center">
             {/* Título com limite de 1 linha e espaço à direita */}
            <Text className="text-textoBase font-subtitle text-base flex-1 pr-2" numberOfLines={1} ellipsizeMode="tail">
              {data.title}
            </Text>

            {/* Quantidade (se existir) */}
            {data.quantity != null && data.quantity > 0 && (
              <Text className="text-textoSuporte font-subtitle text-sm">
                x {data.quantity}
              </Text>
            )}
          </View>

          {/* Descrição com limite de 2 linhas */}
          <Text className="text-textoSuporte text-xs leading-5 mt-0.5" numberOfLines={2} ellipsizeMode="tail">
            {data.description}
          </Text>

          {/* Renderiza children DENTRO de uma View se eles existirem */}
          {children && <View className="mt-1">{children}</View>}
        </View>
      </TouchableOpacity>
    );
  }
);

Product.displayName = "Product"; // Mantém o displayName