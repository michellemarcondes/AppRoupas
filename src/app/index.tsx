import { View, Text, FlatList, SectionList } from "react-native";
import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";

import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products";

import { Product } from "@/components/products";

import { useState, useRef } from "react";

import { Link } from "expo-router";

import { useCartStore } from "@/stores/cart-store";

export default function Home() {
  const cartStore = useCartStore();
  const [category, setCategory] = useState(CATEGORIES[0]);

  const sectionListRef = useRef<SectionList<ProductProps>>(null);

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    );

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  return (
    <View className="flex-1 pt-8 bg-fundo"> {/* Fundo claro */}
      <Header title="Nossos Produtos" cartQuantityItem={cartQuantityItems} />

      {/* Lista de Categorias */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5 mb-5" // Adicionado mb-5 para espaçamento
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      {/* Lista de Produtos */}
      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-textoBase font-heading mt-8 mb-3 px-5"> {/* Texto escuro, adicionado padding horizontal */}
            {title}
          </Text>
        )}
        className="flex-1" // Removido p-5 daqui
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} // Adicionado padding horizontal aqui
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}