// ADICIONADO: Importar React e ajustar forwardRef
import React, { forwardRef, ReactNode, ComponentRef } from "react";
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
  children?: ReactNode;
};

// Usando React.forwardRef explicitamente
export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, children, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4"
        activeOpacity={0.7}
        {...rest}
      >
        <Image source={data.thumbnail} className="w-20 h-20 rounded-md" />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-textoBase font-subtitle text-base flex-1">
              {data.title}
            </Text>

            {data.quantity != null && data.quantity > 0 && ( // Verificação mais segura
              <Text className="text-textoSuporte font-subtitle text-sm ml-2"> {/* Adicionado ml-2 */}
                x {data.quantity}
              </Text>
            )}
          </View>

          <Text className="text-textoSuporte text-xs leading-5 mt-0.5">
            {data.description}
          </Text>
          {/* Renderiza children (ex: detalhes cor/tamanho e botão remover no carrinho) */}
          {children}
        </View>
      </TouchableOpacity>
    );
  }
);

// Adiciona um displayName para debugging (opcional, mas recomendado com forwardRef)
Product.displayName = "Product";