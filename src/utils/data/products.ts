// src/utils/data/products.ts

import { ImageSourcePropType } from 'react-native'; // Manter para referência, mas não usado diretamente nos tipos de backend

// Tipo para os tamanhos como vêm do backend
export type BackendSizeProps = {
  size: string;
  stock: number;
};

// Tipo para as variações como vêm do backend
export type BackendVariationProps = {
  color: string;
  sizes?: BackendSizeProps[]; // Tamanhos são opcionais por variação
};

// Tipo principal do Produto como vem do Backend
export type ProductProps = {
  _id: string; // ID do MongoDB
  title: string;
  description: string;
  price: number;
  category: string;
  image_urls: string[]; // URLs completas das imagens
  thumbnail_url: string; // URL completa da thumbnail
  variations: BackendVariationProps[];
  // createdAt?: string; // Opcional, se precisar usar
  // updatedAt?: string; // Opcional, se precisar usar
};

// Dados estáticos foram removidos. Este arquivo agora exporta principalmente tipos.
export type { }; // Export vazio para garantir que é um módulo