import { create } from "zustand";
import { ProductProps } from "@/utils/data/products";
import * as cartInMemory from "./helpers/cart-in-memory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

// NOVO: Adicionamos as propriedades da variação ao item do carrinho
export type ProductCartProps = ProductProps & {
  id: string; // Garantindo que o id está aqui
  quantity: number;
  size: string;
  color: string;
};

type StateProps = {
  products: ProductCartProps[];
  // ALTERADO: A função 'add' agora recebe os dados da variação
  add: (product: ProductProps, size: string, color: string) => void;
  remove: (productId: string, size: string, color: string) => void; // ALTERADO: Remove precisa ser mais específico
  clear: () => void;
};

export const useCartStore = create(
  persist<StateProps>(
    (set) => ({
      products: [],

      // ALTERADO: Passamos os novos parâmetros para a função interna
      add: (product: ProductProps, size: string, color: string) =>
        set((state) => ({
          products: cartInMemory.add(state.products, product, size, color),
        })),

      // ALTERADO: Passamos os detalhes da variação para a remoção
      remove: (productId: string, size: string, color: string) =>
        set((state) => ({
          products: cartInMemory.remove(state.products, productId, size, color),
        })),

      clear: () => set(() => ({ products: [] })),
    }),
    {
      // ALTERADO: Um novo nome para o armazenamento local
      name: "clothing-store:cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);