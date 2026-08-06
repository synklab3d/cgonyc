"use client";

import Image from "next/image";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { storeProducts, type ProductId } from "@/lib/store";

const menuItems = [
  ["Home", "#hero"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Shop", "#shop"],
  ["Contact", "#contact"],
] as const;

const services = [
  {
    title: "Moda personalizada",
    description: "Camisetas, hoodies e peças autorais com acabamento pensado para vestir todos os dias.",
    icon: <path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8l4-4zM9 6v3h6V6" />,
  },
  {
    title: "Acessórios & wearables",
    description: "Bonés, pins, joias e acessórios que levam a identidade da sua coleção além da roupa.",
    icon: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M8 8h8M8 16h8" /></>,
  },
  {
    title: "Estátuas & esculturas",
    description: "Peças de arte em pequena escala para mesas, estantes e espaços que pedem presença.",
    icon: <><path d="M12 3c2.2 0 4 1.8 4 4 0 1.3-.7 2.5-1.7 3.2.9 1 1.7 2.5 1.7 4.8v4H8v-4c0-2.3.8-3.8 1.7-4.8A4 4 0 0 1 8 7c0-2.2 1.8-4 4-4z" /><path d="M5 20h14" /></>,
  },
  {
    title: "Objetos decorativos",
    description: "Luminárias, caixas, suportes e objetos de coleção com personalidade digital e tátil.",
    icon: <><rect x="5" y="5" width="14" height="14" rx="3" /><path d="M5 10h14M10 5v14" /></>,
  },
  {
    title: "Vasos & luminárias",
    description: "Design de interiores em camadas: formas, textura e luz para transformar o ambiente.",
    icon: <><path d="M8 3h8M9 3v5l-3 8a4 4 0 0 0 4 5h4a4 4 0 0 0 4-5l-3-8V3" /><path d="M7 15h10" /></>,
  },
  {
    title: "Coleções sob medida",
    description: "Do conceito à tiragem limitada, criamos uma linguagem completa para sua marca ou espaço.",
    icon: <><path d="M12 2l9 5v10l-9 5-9-5V7z" /><path d="M12 12l9-5M12 12v10M12 12L3 7" /></>,
  },
];

function Swoosh({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <div className={`swoosh${flip ? " swoosh-flip" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path
          d="M0,50 C300,110 700,-10 1140,40 C1300,58 1400,40 1440,30 L1440,90 L0,90 Z"
          fill={color}
          stroke={color === "#0a0a0a" ? "none" : "#0a0a0a"}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

function HeroPrinter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0.4, 2.3, 6.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const yellowLight = new THREE.PointLight(0xefff00, 2.5, 20);
    yellowLight.position.set(3, 4, 4);
    scene.add(yellowLight);
    const pinkLight = new THREE.PointLight(0xff1493, 2.4, 20);
    pinkLight.position.set(-3, 2, 3);
    scene.add(pinkLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(0, 6, 2);
    scene.add(keyLight);

    const rig = new THREE.Group();
    rig.rotation.set(0.05, 0.35, 0);
    scene.add(rig);

    const chrome = new THREE.MeshStandardMaterial({ color: 0xd7d9e0, metalness: 0.85, roughness: 0.18 });
    const black = new THREE.MeshStandardMaterial({ color: 0x121214, metalness: 0.35, roughness: 0.5 });
    const pink = new THREE.MeshStandardMaterial({ color: 0xff1493, metalness: 0.25, roughness: 0.28, emissive: 0xff1493, emissiveIntensity: 0.35 });

    const bed = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 2), black);
    bed.position.y = -1.35;
    rig.add(bed);
    const columnGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2.7, 14);
    for (const [x, z] of [[-1.5, -0.85], [1.5, -0.85], [-1.5, 0.85], [1.5, 0.85]]) {
      const column = new THREE.Mesh(columnGeometry, chrome);
      column.position.set(x, 0, z);
      rig.add(column);
    }
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 2), chrome);
    topBar.position.y = 1.2;
    rig.add(topBar);

    const head = new THREE.Group();
    const headBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.42), pink);
    const headTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 12), chrome);
    headTip.position.y = -0.2;
    head.add(headBody, headTip);
    head.position.set(0, -0.9, -0.82);
    rig.add(head);

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 1024;
    textureCanvas.height = 560;
    const context = textureCanvas.getContext("2d");
    if (!context) return;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = "900 150px Arial Black, Arial, sans-serif";
    context.lineWidth = 14;
    context.strokeStyle = "#0a0a0a";
    context.fillStyle = "#EFFF00";
    context.strokeText("CG-", 512, 180);
    context.fillText("CG-", 512, 180);
    context.fillStyle = "#FF1493";
    context.strokeText("ONYC", 512, 380);
    context.fillText("ONYC", 512, 380);
    context.beginPath();
    for (let index = 0; index < 16; index += 1) {
      const radius = index % 2 === 0 ? 42 : 18;
      const angle = (Math.PI / 8) * index;
      const x = 880 + Math.cos(angle) * radius;
      const y = 118 + Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.fillStyle = "#EFFF00";
    context.fill();
    context.stroke();

    const texture = new THREE.CanvasTexture(textureCanvas);
    const planeHeight = 3 * (560 / 1024);
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -planeHeight / 2);
    const logoMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, clippingPlanes: [clippingPlane], side: THREE.DoubleSide });
    const logoPlane = new THREE.Mesh(new THREE.PlaneGeometry(3, planeHeight), logoMaterial);
    logoPlane.rotation.x = -Math.PI / 2;
    logoPlane.position.y = -1.26;
    rig.add(logoPlane);

    const layers: THREE.Mesh[] = [];
    for (let index = 0; index < 10; index += 1) {
      const color = index % 2 === 0 ? 0xefff00 : 0xff1493;
      const material = new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.35, emissive: color, emissiveIntensity: 0.25 });
      const layer = new THREE.Mesh(new THREE.TorusGeometry(0.5 - index * 0.012, 0.045, 8, 28), material);
      layer.rotation.x = Math.PI / 2;
      layer.position.set(1.7, -1.3 + index * 0.09, -0.1);
      layer.scale.setScalar(0.001);
      rig.add(layer);
      layers.push(layer);
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const move = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    const tick = (time: number) => {
      const phase = ((time % 5200) / 5200) * Math.PI * 2;
      const progress = reducedMotion ? 1 : (Math.sin(phase - Math.PI / 2) + 1) / 2;
      clippingPlane.constant = -planeHeight / 2 + planeHeight * progress;
      head.position.z = -planeHeight / 2 + planeHeight * progress;
      head.position.y = -0.9 + Math.sin(time * 0.009) * 0.035;
      rig.rotation.y += (0.35 + pointerX * 0.5 - rig.rotation.y) * 0.04;
      rig.rotation.x += (0.05 + pointerY * 0.2 - rig.rotation.x) * 0.04;
      layers.forEach((layer, index) => {
        const layerProgress = Math.max(0, Math.min(1, (progress * 1.35 - index * 0.085) / 0.28));
        const scale = 0.001 + layerProgress * 0.999;
        layer.scale.setScalar(scale);
        layer.rotation.z = time * 0.0004 + index;
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    resize();
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      texture.dispose();
      columnGeometry.dispose();
      logoPlane.geometry.dispose();
      bed.geometry.dispose();
      topBar.geometry.dispose();
      headBody.geometry.dispose();
      headTip.geometry.dispose();
      layers.forEach((layer) => {
        layer.geometry.dispose();
        (layer.material as THREE.Material).dispose();
      });
      chrome.dispose();
      black.dispose();
      pink.dispose();
      logoMaterial.dispose();
      renderer.dispose();
      reducedMotion = true;
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-label="Animação de uma impressora 3D criando a marca CGONYC" />;
}

function tiltCard(event: MouseEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.transform = `perspective(900px) translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
}

function resetTilt(event: MouseEvent<HTMLDivElement>) {
  event.currentTarget.style.transform = "";
}

export default function CgonycSite() {
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [cart, setCart] = useState<Partial<Record<ProductId, number>>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450);
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    let lastSpark = 0;
    const moveStar = (event: PointerEvent) => {
      if (starRef.current) {
        starRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
        starRef.current.style.opacity = "1";
      }
      if (window.innerWidth <= 900 || event.pointerType === "touch") return;
      const now = performance.now();
      if (now - lastSpark < 55) return;
      lastSpark = now;
      const spark = document.createElement("span");
      spark.className = "cursor-spark";
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty("--spark-color", Math.random() > 0.5 ? "#efff00" : "#ff1493");
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 700);
    };
    window.addEventListener("pointermove", moveStar, { passive: true });

    const checkoutStatus = new URLSearchParams(window.location.search).get("checkout");
    const statusMessage = checkoutStatus === "success"
      ? "Pagamento confirmado. Obrigado por criar com a CGONYC!"
      : checkoutStatus === "cancelled"
        ? "Checkout cancelado. Sua sacola continua pronta quando você quiser voltar."
        : "";
    const checkoutTimer = statusMessage ? window.setTimeout(() => setCheckoutMessage(statusMessage), 0) : undefined;

    return () => {
      window.clearTimeout(timer);
      if (checkoutTimer) window.clearTimeout(checkoutTimer);
      revealObserver.disconnect();
      window.removeEventListener("pointermove", moveStar);
    };
  }, []);

  const cartEntries = storeProducts.flatMap((product) => {
    const quantity = cart[product.id] ?? 0;
    return quantity > 0 ? [{ product, quantity }] : [];
  });
  const cartCount = cartEntries.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartEntries.reduce((total, item) => total + item.product.priceInCents * item.quantity, 0);
  const totalLabel = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cartTotal / 100);

  const updateCart = (productId: ProductId, adjustment: number) => {
    setCheckoutMessage("");
    setCart((current) => {
      const next = { ...current };
      const quantity = Math.max(0, Math.min(10, (next[productId] ?? 0) + adjustment));
      if (quantity === 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  };

  const startCheckout = async () => {
    if (cartEntries.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);
    setCheckoutMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartEntries.map(({ product, quantity }) => ({ id: product.id, quantity })),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Não foi possível iniciar o checkout.");
      }
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutMessage(error instanceof Error ? error.message : "Não foi possível iniciar o checkout.");
      setIsCheckingOut(false);
    }
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSent(true);
    window.setTimeout(() => {
      setSent(false);
      form.reset();
    }, 2400);
  };

  return (
    <>
      <div className={`preloader${loading ? "" : " preloader-hidden"}`} aria-hidden={!loading}>
        <div className="pre-logo-wrap">
          <div className="pre-ring" />
          <Image src="/images/logo.png" alt="" width={500} height={500} priority />
        </div>
        <div className="pre-bar-wrap"><span /></div>
      </div>
      <div ref={starRef} className="cursor-star" aria-hidden="true">
        <svg viewBox="0 0 100 100"><path d="M50 2 L61 34 L96 36 L69 58 L79 92 L50 71 L21 92 L31 58 L4 36 L39 34 Z" fill="#efff00" stroke="#0a0a0a" strokeWidth="5" strokeLinejoin="round" /></svg>
      </div>
      <div className="background-system" aria-hidden="true">
        <div className="background-blob blob-one" />
        <div className="background-blob blob-two" />
        <div className="background-blob blob-three" />
        <div className="speed-lines" />
        <div className="halftone" />
      </div>

      <header className={`site-header${loading ? "" : " header-visible"}`}>
        <nav className="navbar" aria-label="Navegação principal">
          <a href="#hero" className="nav-logo" aria-label="CGONYC, início">
            <Image src="/images/logo.png" alt="CGONYC" width={500} height={500} priority />
          </a>
          <ul className="nav-links">
            {menuItems.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
          <a className="gel-button yellow-button nav-cta nav-cart" href="#shop" aria-label={`Abrir sacola com ${cartCount} itens`}>
            Sacola <b>{cartCount}</b>
          </a>
        </nav>
      </header>

      <main>
        <section id="hero" className="hero-section">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span className="pulse" />Design Studio · NYC</span>
              <h1>Future made<br /><span>physical</span></h1>
              <p>Moda autoral · estátuas · objetos decorativos</p>
              <div className="hero-actions">
                <a className="gel-button yellow-button" href="#services">Explore <span aria-hidden="true">↓</span></a>
                <a className="gel-button chrome-button" href="#shop">Shop now <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className="printer-wrap">
              <HeroPrinter />
              <div className="floating-chip chip-one">⚙ <span>0.02mm precision</span></div>
              <div className="floating-chip chip-two">✦ <span>printing live</span></div>
            </div>
          </div>
        </section>

        <Swoosh color="#EFFF00" />

        <section id="about" className="about-section">
          <div className="wrap about-grid">
            <div className="about-copy reveal">
              <span className="section-label">01 — About</span>
              <h2>Nostalgia,<br />rebuilt in <em>chrome</em> &amp; light.</h2>
              <p>CGONYC começou numa oficina pequena no Brooklyn, entre impressoras aquecidas e telas CRT emprestadas. <strong>Misturamos a estética das interfaces do início dos anos 2000</strong> com moda autoral e design de interiores.</p>
              <p>Cada peça que sai do nosso laboratório carrega essa dualidade: nostalgia digital e acabamento contemporâneo. <strong>Não fazemos objetos genéricos</strong> — criamos roupas, estátuas e itens decorativos que parecem ter vindo do futuro que a gente imaginava em 2001.</p>
              <div className="stats" aria-label="Estatísticas da CGONYC">
                <div><b>12k+</b><span>Peças autorais</span></div>
                <div><b>98%</b><span>Acabamento</span></div>
                <div><b>24h</b><span>Ideia → forma</span></div>
              </div>
            </div>
            <div className="about-visual reveal" aria-label="Destaques de produção">
              <div className="chrome-card card-one">Feito para vestir,<br />habitar e colecionar.</div>
              <div className="chrome-card card-two"><span>CG</span><small>precision lab</small></div>
              <div className="chrome-card card-three"><span>✦</span></div>
            </div>
          </div>
        </section>

        <Swoosh color="#FF1493" flip />

        <section id="services" className="services-section">
          <div className="wrap">
            <span className="section-label reveal">02 — Services</span>
            <h2 className="section-title reveal">O que <em>criamos</em></h2>
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.title} className="service-card reveal" onMouseMove={tiltCard} onMouseLeave={resetTilt}>
                  <div className="service-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4">{service.icon}</svg></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Swoosh color="#0a0a0a" />

        <section id="shop" className="shop-section">
          <div className="wrap">
            <span className="section-label reveal">03 — Shop</span>
            <h2 className="section-title reveal">Moda & <em>decoração</em></h2>
            <div className="shop-grid">
              {storeProducts.map((product) => (
                <article key={product.id} className="product-card reveal">
                  <div className="product-image"><span className={`product-shape ${product.shape}`}><i>CG</i></span></div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.priceLabel}</p>
                    <button type="button" className="cart-button" onClick={() => updateCart(product.id, 1)}>Adicionar à sacola <span aria-hidden="true">+</span></button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cart-panel reveal" aria-live="polite">
              <div className="cart-heading"><span>Sacola CGONYC</span><b>{cartCount} {cartCount === 1 ? "item" : "itens"}</b></div>
              {cartEntries.length === 0 ? (
                <p className="empty-cart">Escolha uma peça acima para iniciar seu pedido.</p>
              ) : (
                <>
                  <ul className="cart-items">
                    {cartEntries.map(({ product, quantity }) => (
                      <li key={product.id}>
                        <div><b>{product.name}</b><span>{product.priceLabel} · qtd. {quantity}</span></div>
                        <div className="quantity-control" aria-label={`Quantidade de ${product.name}`}>
                          <button type="button" onClick={() => updateCart(product.id, -1)} aria-label={`Remover uma unidade de ${product.name}`}>−</button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => updateCart(product.id, 1)} aria-label={`Adicionar uma unidade de ${product.name}`}>+</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-total"><span>Total</span><b>{totalLabel}</b></div>
                </>
              )}
              <button type="button" className="checkout-button" onClick={startCheckout} disabled={cartEntries.length === 0 || isCheckingOut}>
                {isCheckingOut ? "Abrindo checkout…" : "Pagar com Stripe"}<span aria-hidden="true">↗</span>
              </button>
              {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
            </aside>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="wrap contact-box">
            <span className="section-label reveal">04 — Contact</span>
            <h2 className="section-title reveal">Vamos <em>fabricar</em> algo</h2>
            <form className="contact-form reveal" onSubmit={submitForm}>
              <label><span className="sr-only">Nome</span><input name="name" type="text" placeholder="Nome" required /></label>
              <label><span className="sr-only">Email</span><input name="email" type="email" placeholder="Email" required /></label>
              <label><span className="sr-only">Mensagem</span><textarea name="message" placeholder="Mensagem" required /></label>
              <button type="submit" className="gel-button yellow-button">Send message <span aria-hidden="true">↗</span></button>
              <div className={`contact-success${sent ? " success-visible" : ""}`} aria-live="polite">
                <svg viewBox="0 0 24 24" fill="none" stroke="#efff00" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
                <b>Mensagem enviada!</b>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <a href="#hero" className="footer-logo"><Image src="/images/logo.png" alt="CGONYC" width={500} height={500} /></a>
              <div className="footer-social">
                <a href="#contact" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
                <a href="#contact" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg></a>
                <a href="#contact" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.4c0-1 .4-1.8 1-2.4-3.3-.4-6.8-1.6-6.8-7.4 0-1.6.6-3 1.5-4-.2-.4-.6-2 .2-4 0 0 1.3-.4 4 1.5a14 14 0 0 1 7.2 0c2.7-1.9 4-1.5 4-1.5.8 2 .4 3.6.2 4a5.7 5.7 0 0 1 1.5 4c0 5.8-3.5 7-6.8 7.4.5.6 1 1.5 1 3V21" /></svg></a>
              </div>
            </div>
            <ul className="footer-links">{menuItems.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            <a className="footer-email" href="mailto:hello@cgonyc.com">hello@cgonyc.com</a>
          </div>
          <p className="footer-bottom">© 2026 CGONYC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
