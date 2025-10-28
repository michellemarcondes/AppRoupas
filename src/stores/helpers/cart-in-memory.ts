// src/stores/helpers/cart-in-memory.ts

// Importar o tipo do Backend
import { ProductProps as BackendProductProps } from "@/utils/data/products";
// Importar o tipo do Carrinho
import { ProductCartProps } from "../cart-store";

// Função add ajustada para receber BackendProductProps
export function add(
  products: ProductCartProps[],
  newProduct: BackendProductProps, // Recebe tipo do Backend
  size: string,
  color: string
): ProductCartProps[] {
  // Procura usando _id do backend, mas comparando com o 'id' que armazenamos no carrinho
  const existingProduct = products.find(
    (p) => p.id === newProduct._id && p.size === size && p.color === color
  );

  // Se a variação específica já existe, incrementa a quantidade
  if (existingProduct) {
    return products.map((product) =>
      product.id === existingProduct.id && product.size === size && product.color === color
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
  }

  // Se não existe, adiciona o novo item, mapeando _id para id e incluindo size/color
  return [...products, { ...newProduct, id: newProduct._id, size, color, quantity: 1 }];
}

// Função remove permanece a mesma, comparando pelo 'id' interno (que veio do _id)
export function remove(
  products: ProductCartProps[],
  productIdToRemove: string,
  size: string,
  color: string
): ProductCartProps[] {
  const updatedProducts = products.map((product) => {
    if (product.id === productIdToRemove && product.size === size && product.color === color) {
      return {
        ...product,
        quantity: product.quantity - 1
      }
    }
    return product;
  });
  // Filtra itens com quantidade 0
  return updatedProducts.filter((product) => product.quantity > 0);
}