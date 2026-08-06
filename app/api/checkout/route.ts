import { NextResponse } from "next/server";
import { isProductId, storeProducts, STRIPE_CURRENCY, type ProductId } from "@/lib/store";

type CheckoutRequest = {
  items?: Array<{ id?: unknown; quantity?: unknown }>;
};

type StripeSessionResponse = {
  url?: string;
};

const MAX_QUANTITY_PER_ITEM = 10;

function shippingCountries() {
  return (process.env.STRIPE_SHIPPING_COUNTRIES ?? "")
    .split(",")
    .map((country) => country.trim().toUpperCase())
    .filter((country) => /^[A-Z]{2}$/.test(country));
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "O checkout ainda não foi configurado." },
      { status: 503 },
    );
  }

  let payload: CheckoutRequest;
  try {
    payload = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Itens da sacola inválidos." }, { status: 400 });
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > storeProducts.length) {
    return NextResponse.json({ error: "Adicione uma peça à sacola para continuar." }, { status: 400 });
  }

  const quantities = new Map<ProductId, number>();
  for (const item of payload.items) {
    if (typeof item.id !== "string" || !isProductId(item.id) || !Number.isInteger(item.quantity)) {
      return NextResponse.json({ error: "Itens da sacola inválidos." }, { status: 400 });
    }

    const quantity = Number(item.quantity);
    if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM || quantities.has(item.id)) {
      return NextResponse.json({ error: "Quantidade indisponível." }, { status: 400 });
    }
    quantities.set(item.id, quantity);
  }

  const formData = new URLSearchParams();
  formData.set("mode", "payment");
  formData.set("billing_address_collection", "auto");
  formData.set("allow_promotion_codes", "true");
  formData.set("customer_creation", "always");
  formData.set("success_url", `${new URL(request.url).origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  formData.set("cancel_url", `${new URL(request.url).origin}/?checkout=cancelled`);

  const countries = shippingCountries();
  countries.forEach((country, index) => {
    formData.set(`shipping_address_collection[allowed_countries][${index}]`, country);
  });

  Array.from(quantities.entries()).forEach(([productId, quantity], index) => {
    const product = storeProducts.find((item) => item.id === productId);
    if (!product) return;
    formData.set(`line_items[${index}][price_data][currency]`, STRIPE_CURRENCY);
    formData.set(`line_items[${index}][price_data][product_data][name]`, product.name);
    formData.set(`line_items[${index}][price_data][product_data][description]`, product.description);
    formData.set(`line_items[${index}][price_data][unit_amount]`, String(product.priceInCents));
    formData.set(`line_items[${index}][quantity]`, String(quantity));
  });

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Não foi possível iniciar o checkout. Tente novamente." }, { status: 502 });
    }

    const session = (await response.json()) as StripeSessionResponse;
    if (!session.url) {
      return NextResponse.json({ error: "Não foi possível iniciar o checkout. Tente novamente." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Não foi possível conectar ao checkout. Tente novamente." }, { status: 502 });
  }
}
