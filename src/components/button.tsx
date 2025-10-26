import React, { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

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
      // Apenas confirmando: className corrigido, sem espaços extras
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
   if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, { color: '#FFF' });
  }
  return children;
}


Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };