const MENU = [
  {
    title: "Camisetas e Camisas",
    data: [
      {
        id: "1",
        title: "Camiseta High-Tech",
        price: 89.9,
        description: "Feita com tecido tecnológico que se adapta à temperatura do corpo. Leve, confortável e não amassa.",
        cover: require("../../assets/products/cover/1.png"),
        thumbnail: require("../../assets/products/thumbnail/1.png"),
        images: [
          require("../../assets/products/cover/1.png"),
        ],
        variations: [
          { color: "Preto Grafite", sizes: [{ size: "P", stock: 15 }, { size: "M", stock: 20 }, { size: "G", stock: 12 }] },
          { color: "Branco Neve", sizes: [{ size: "P", stock: 10 }, { size: "M", stock: 0 }, { size: "G", stock: 8 }] },
        ],
      },
      {
        id: "2",
        title: "Camisa Polo Piquet",
        price: 129.9,
        description: "Elegância e conforto para o dia a dia. Feita com o clássico tecido piquet de algodão.",
        cover: require("../../assets/products/cover/2.png"),
        thumbnail: require("../../assets/products/thumbnail/2.png"),
        images: [
          require("../../assets/products/cover/2.png"),
        ],
        variations: [
          { color: "Azul Marinho", sizes: [{ size: "P", stock: 10 }, { size: "M", stock: 15 }, { size: "G", stock: 7 }, { size: "GG", stock: 5 }] },
          { color: "Vinho", sizes: [{ size: "M", stock: 8 }, { size: "G", stock: 12 }] },
          { color: "Cinza Mescla", sizes: [{ size: "P", stock: 5 }, { size: "G", stock: 9 }] },
        ],
      },
      {
        id: "3",
        title: "Regata Fitness",
        price: 69.9,
        description: "Ideal para treinos, com tecido leve que ajuda na transpiração e proporciona liberdade de movimento.",
        cover: require("../../assets/products/cover/3.png"),
        thumbnail: require("../../assets/products/thumbnail/3.png"),
        images: [
          require("../../assets/products/cover/3.png"),
        ],
        variations: [
          { color: "Preto", sizes: [{ size: "P", stock: 20 }, { size: "M", stock: 25 }, { size: "G", stock: 15 }] },
          { color: "Branco", sizes: [{ size: "P", stock: 18 }, { size: "M", stock: 22 }] },
        ],
      },
    ],
  },
  {
    title: "Calças e Shorts",
    data: [
      {
        id: "4",
        title: "Calça Jeans Urban",
        price: 189.9,
        description: "Modelagem slim com elastano para maior conforto nos movimentos. O jeans que te acompanha em qualquer situação.",
        cover: require("../../assets/products/cover/4.png"),
        thumbnail: require("../../assets/products/thumbnail/4.png"),
        images: [
          require("../../assets/products/cover/4.png"),
        ],
        variations: [
          { color: "Lavagem Escura", sizes: [{ size: "38", stock: 10 }, { size: "40", stock: 15 }, { size: "42", stock: 11 }, { size: "44", stock: 4 }] },
          { color: "Lavagem Clara", sizes: [{ size: "40", stock: 8 }, { size: "42", stock: 12 }] },
        ],
      },
      {
        id: "5",
        title: "Shorts de Moletom",
        price: 99.9,
        description: "Conforto máximo para momentos de lazer. Feito em moletom careca, com bolsos e cordão de ajuste.",
        cover: require("../../assets/products/cover/5.png"),
        thumbnail: require("../../assets/products/thumbnail/5.png"),
        images: [
          require("../../assets/products/cover/5.png"),
        ],
        variations: [
          { color: "Cinza Mescla", sizes: [{ size: "P", stock: 15 }, { size: "M", stock: 18 }, { size: "G", stock: 10 }] },
          { color: "Preto", sizes: [{ size: "P", stock: 12 }, { size: "M", stock: 20 }, { size: "G", stock: 14 }] },
        ],
      },
    ],
  },
  {
    title: "Acessórios",
    data: [
      {
        id: "6",
        title: "Boné Classic",
        price: 59.9,
        description: "Boné de aba curva com ajuste traseiro. Proteção e estilo em uma só peça.",
        cover: require("../../assets/products/cover/6.png"),
        thumbnail: require("../../assets/products/thumbnail/6.png"),
        images: [
          require("../../assets/products/cover/6.png"),
        ],
        variations: [
          { color: "Preto" },
          { color: "Azul Marinho" },
          { color: "Branco" },
        ],
      },
      {
        id: "7",
        title: "Cueca Boxer (Kit 3un)",
        price: 79.9,
        description: "Kit com 3 cuecas modelo boxer, feitas em algodão com elastano para ajuste perfeito e conforto.",
        cover: require("../../assets/products/cover/7.png"),
        thumbnail: require("../../assets/products/thumbnail/7.png"),
        images: [
          require("../../assets/products/cover/7.png"),
        ],
        variations: [
          { color: "Sortidas (Preto, Branco, Cinza)", sizes: [{ size: "P", stock: 30 }, { size: "M", stock: 40 }, { size: "G", stock: 35 }, { size: "GG", stock: 20 }] },
        ],
      },
    ],
  },
];

// O código abaixo se mantém igual
const PRODUCTS = MENU.map((item) => item.data).flat();
const CATEGORIES = MENU.map((item) => item.title);

// A definição do TIPO se mantém igual
type ProductProps = (typeof PRODUCTS)[0];

// AQUI ESTÁ A CORREÇÃO!
// Exportamos os valores e o tipo separadamente.
export { MENU, PRODUCTS, CATEGORIES };
export type { ProductProps };