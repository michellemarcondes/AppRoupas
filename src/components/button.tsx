// ADICIONADO: Importar React
import React, { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { Feather } from "@expo/vector-icons"; // Manter se usar Feather

type ButtonProps = TouchableOpacityProps & {
  children: ReactNode;
};

type ButtonTextProps = {
  children: ReactNode;
};

type ButtonIconProps = {
  children: ReactNode;
};

function Button({ children, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      // Classe corrigida na etapa anterior
      className="h-12 py-3 bg-azul rounded-md items-center justify-center flex-row"
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

function ButtonText({ children }: ButtonTextProps) {
  return <Text className="text-white font-heading text-base mx-2">{children}</Text>;
}

function ButtonIcon({ children }: ButtonIconProps) {
   // Esta lógica agora funciona porque React está importado
   if (React.isValidElement(children)) {
    // Definindo a cor padrão para o ícone como branca
    return React.cloneElement(children as React.ReactElement, { color: '#FFF' }); // Cor branca
  }
  return children;
}


Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };