// src/app/index.tsx
import { TouchableOpacity } from 'react-native';
import { View, Text, FlatList, SectionList, ActivityIndicator } from "react-native";
import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";
// Importar tipo do Backend
import { ProductProps as BackendProductProps } from "@/utils/data/products";
import { Product } from "@/components/products";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Import React
import { Link, useFocusEffect } from "expo-router";
import { useCartStore } from "@/stores/cart-store";
import axios from 'axios';
import { API_BASE_URL } from "@/utils/apiConfig"; // Importar URL base

// Interface para a estrutura da SectionList
interface MenuSection {
  title: string;
  data: BackendProductProps[];
}

export default function Home() {
  const cartStore = useCartStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [menu, setMenu] = useState<MenuSection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionListRef = useRef<SectionList<BackendProductProps>>(null);

  // Estado local para quantidade no carrinho, atualizado com useFocusEffect
  const [cartQuantityItems, setCartQuantityItems] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setCartQuantityItems(cartStore.products.reduce((total, product) => total + product.quantity, 0));
    }, [cartStore.products]) // Dependência: produtos no carrinho
  );

  // Função para buscar dados da API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<BackendProductProps[]>(`${API_BASE_URL}/products`);
      const products = response.data;

      const uniqueCategories = [...new Set(products.map(p => p.category))].sort(); // Ordenar categorias
      setCategories(uniqueCategories);

      const groupedMenu: MenuSection[] = uniqueCategories.map(category => ({
        title: category,
        data: products.filter(p => p.category === category),
      }));
      setMenu(groupedMenu);

      if (uniqueCategories.length > 0 && !selectedCategory) { // Define apenas se não houver seleção
        setSelectedCategory(uniqueCategories[0]);
      }

    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos. Verifique sua conexão ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Executa apenas na montagem inicial

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    const sectionIndex = menu.findIndex((section) => section.title === category);
    if (sectionListRef.current && sectionIndex !== -1) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  // Renderização de Loading
  if (isLoading) {
    return (
      <View className="flex-1 pt-8 bg-fundo items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Renderização de Erro
  if (error) {
     return (
       <View className="flex-1 pt-8 bg-fundo items-center justify-center p-5">
         <Header title="Erro" cartQuantityItem={0} />
         <View className="flex-1 justify-center items-center">
             <Text className="text-red-500 text-center mb-4">{error}</Text>
             {/* Adicionar um botão real para tentar novamente */}
             <TouchableOpacity onPress={fetchData} className="bg-azul py-2 px-4 rounded">
                <Text className="text-white">Tentar Novamente</Text>
             </TouchableOpacity>
         </View>
       </View>
     );
  }

  // Renderização Principal
  return (
    <View className="flex-1 pt-8 bg-fundo">
      <Header title="Nossos Produtos" cartQuantityItem={cartQuantityItems} />

      {/* Categorias */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === selectedCategory}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5 mb-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      {/* Produtos */}
      <SectionList
        ref={sectionListRef}
        sections={menu}
        keyExtractor={(item) => item._id} // Usar _id
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          // Link para a tela de detalhes usando _id
          <Link href={`/product/${item._id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-textoBase font-heading mt-8 mb-3 px-5">
            {title}
          </Text>
        )}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={()=>(
             <Text className="text-textoSuporte text-center mt-10">Nenhum produto encontrado nesta categoria.</Text>
        )}
      />
    </View>
  );
}