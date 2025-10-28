// src/stores/cart-store.ts

import { create } from "zustand";
// Importar o tipo atualizado do Backend
import { ProductProps as BackendProductProps } from "@/utils/data/products";
import * as cartInMemory from "./helpers/cart-in-memory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

// Tipo do produto DENTRO do carrinho
export type ProductCartProps = BackendProductProps & {
  // Usamos 'id' internamente, mapeado do '_id' do backend
  id: string;
  quantity: number;
  size: string; // Tamanho selecionado pelo usuário
  color: string; // Cor selecionada pelo usuário
};

// Tipo para a função add que recebe o produto do backend e as seleções
type StateProps = {
  products: ProductCartProps[];
  // Função add agora recebe o tipo do Backend + size/color selecionados
  add: (product: BackendProductProps, size: string, color: string) => void;
  // Função remove continua usando o 'id' interno (que veio do _id)
  remove: (productId: string, size: string, color: string) => void;
  // Função clear permanece a mesma
  clear: () => void;
};

export const useCartStore = create(
  persist<StateProps>(
    (set) => ({
      products: [],

      // Implementação da função add
      add: (product: BackendProductProps, size: string, color: string) =>
        set((state) => ({
          // Chama a função helper passando os dados recebidos
          products: cartInMemory.add(state.products, product, size, color),
        })),

      // Implementação da função remove
      remove: (productId: string, size: string, color: string) =>
        set((state) => ({
          products: cartInMemory.remove(state.products, productId, size, color),
        })),

      // Implementação da função clear
      clear: () => set(() => ({ products: [] })),
    }),
    {
      // Configuração da persistência
      name: "clothing-store:cart", // Nome no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);