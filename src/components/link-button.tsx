import { Link } from "expo-router";
import type { ComponentProps } from "react";

type LinkButtonProps = ComponentProps<typeof Link> & {
  title: string;
};

export function LinkButton({ title, ...rest }: LinkButtonProps) {
  // Cor azul para o link
  return (
    <Link className="text-azul text-center text-base font-body" {...rest}>
      {title}
    </Link>
  );
}