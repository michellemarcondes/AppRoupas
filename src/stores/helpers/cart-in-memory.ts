import { ProductProps } from "@/utils/data/products";
import { ProductCartProps } from "../cart-store";

export function add(
  products: ProductCartProps[],
  newProduct: ProductProps,
  size: string,
  color: string
): ProductCartProps[] {
  // Procura por um produto que tenha o mesmo ID, a mesma COR e o mesmo TAMANHO.
  const existingProduct = products.find(
    (p) => p.id === newProduct.id && p.size === size && p.color === color
  );

  // Se a variação específica já existe no carrinho, apenas aumenta a quantidade.
  if (existingProduct) {
    return products.map((product) =>
      product.id === existingProduct.id && product.size === size && product.color === color
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
  }

  // Se a variação não existe, adiciona o novo item com os detalhes da variação.
  return [...products, { ...newProduct, size, color, quantity: 1 }];
}

export function remove(
  products: ProductCartProps[],
  productIdToRemove: string,
  size: string,
  color: string
): ProductCartProps[] {
  
  // Percorre os produtos para encontrar a variação exata a ser alterada.
  const updatedProducts = products.map((product) => {
      // Se encontrar o item com ID, tamanho e cor correspondentes...
      if(product.id === productIdToRemove && product.size === size && product.color === color) {
        // ...diminui a quantidade em 1.
        return {
          ...product,
          quantity: product.quantity - 1
        }
      }
      return product;
    }
  );

  // Filtra a lista para remover permanentemente qualquer item cuja quantidade chegou a 0.
  return updatedProducts.filter((product) => product.quantity > 0);
}