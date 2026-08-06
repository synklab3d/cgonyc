export const STRIPE_CURRENCY = "brl";

export const storeProducts = [
  {
    id: "camiseta-cg-one",
    name: "Camiseta CG One",
    description: "Camiseta oversized em algodão, com arte CG-ONYC em serigrafia.",
    category: "Moda",
    priceInCents: 14900,
    priceLabel: "R$ 149",
    shape: "tshirt",
  },
  {
    id: "estatua-prisma",
    name: "Estátua Prisma",
    description: "Escultura de mesa em edição limitada, feita para dar presença ao ambiente.",
    category: "Decoração",
    priceInCents: 28900,
    priceLabel: "R$ 289",
    shape: "statue",
  },
  {
    id: "vaso-orbital",
    name: "Vaso Orbital",
    description: "Objeto decorativo com curvas impressas em camadas de alta precisão.",
    category: "Decoração",
    priceInCents: 21900,
    priceLabel: "R$ 219",
    shape: "vase",
  },
] as const;

export type StoreProduct = (typeof storeProducts)[number];
export type ProductId = StoreProduct["id"];

export function isProductId(id: string): id is ProductId {
  return storeProducts.some((product) => product.id === id);
}
