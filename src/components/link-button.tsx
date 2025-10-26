import { Link } from "expo-router";
import type { ComponentProps } from "react";
// REMOVIDO: import { Text } from 'react-native';

type LinkButtonProps = ComponentProps<typeof Link> & {
  title: string;
};

export function LinkButton({ title, ...rest }: LinkButtonProps) {
  // Voltando a aplicar className no Link e passando title diretamente
  return (
    <Link className="text-azul text-center text-base font-body" {...rest}>
      {title}
    </Link>
  );
}