import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { baseProducts, categories, MARKETPLACE_STORAGE_KEYS, Order, Product } from "@/data/marketplace";

type Cart = Record<string, number>;

const currency = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "MZN", maximumFractionDigits: 2 });

const checkoutDefaults = {
  customerName: "",
  phone: "",
  address: "",
  notes: "",
  paymentMethod: "M-Pesa" as Order["paymentMethod"],
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [cart, setCart] = useState<Cart>({});
  const [checkout, setCheckout] = useState(checkoutDefaults);
  const [products, setProducts] = useState<Product[]>(baseProducts);

  useEffect(() => {
    const customProductsRaw = localStorage.getItem(MARKETPLACE_STORAGE_KEYS.customProducts);
    if (!customProductsRaw) return;

    try {
      const customProducts: Product[] = JSON.parse(customProductsRaw);
      setProducts([...baseProducts, ...customProducts]);
    } catch {
      setProducts(baseProducts);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeCategory === "Todas" || product.category === activeCategory;
      const searchMatch = `${product.name} ${product.description} ${product.seller}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, products, search]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        if (!product) return null;
        return {
          ...product,
          quantity,
          lineTotal: product.price * quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [cart, products]);

  const subtotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);
  const deliveryFee = subtotal > 10000 ? 0 : subtotal > 0 ? 350 : 0;
  const total = subtotal + deliveryFee;

  const updateCart = (id: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: nextQuantity };
    });
  };

  const placeOrder = () => {
    if (!checkout.customerName || !checkout.phone || !checkout.address || cartItems.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha seus dados e adicione produtos ao carrinho para finalizar.",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Order = {
      id: `PED-${Date.now().toString().slice(-6)}`,
      customerName: checkout.customerName,
      phone: checkout.phone,
      address: checkout.address,
      notes: checkout.notes,
      paymentMethod: checkout.paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
      status: "Pendente",
    };

    const ordersRaw = localStorage.getItem(MARKETPLACE_STORAGE_KEYS.orders);
    const orders: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];
    localStorage.setItem(MARKETPLACE_STORAGE_KEYS.orders, JSON.stringify([newOrder, ...orders]));

    toast({
      title: `Pedido ${newOrder.id} criado!`,
      description: "Integração com Firebase ainda pendente. Pedido salvo localmente.",
    });

    setCart({});
    setCheckout(checkoutDefaults);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mercado MZ</h1>
            <p className="text-sm text-muted-foreground">Marketplace completo em Metical (MZN)</p>
          </div>
          <div className="flex gap-3 items-center">
            <Input
              placeholder="Buscar por produto, descrição ou vendedor"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full md:w-80"
            />
            <Button asChild variant="outline">
              <Link to="/admin">Painel vendedor</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Store className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Lojas ativas</p>
                <p className="text-xl font-bold">120+</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Truck className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Entrega em Moçambique</p>
                <p className="text-xl font-bold">24-72h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <ShieldCheck className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Pagamentos</p>
                <p className="text-xl font-bold">M-Pesa, e-Mola, Cartão</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "Todas" ? "default" : "secondary"}
            onClick={() => setActiveCategory("Todas")}
          >
            Todas
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <Badge>{product.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-primary">{currency.format(product.price)}</p>
                    {product.oldPrice && <p className="text-xs line-through text-muted-foreground">{currency.format(product.oldPrice)}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {product.seller} • {product.location} • ⭐ {product.rating}
                  </p>
                  <Button onClick={() => updateCart(product.id, 1)} className="w-full" disabled={product.stock <= 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? "Adicionar ao carrinho" : "Sem stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit sticky top-5">
            <CardHeader>
              <CardTitle>Checkout em MZN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-52 overflow-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-sm font-semibold">{currency.format(item.lineTotal)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => updateCart(item.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateCart(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span>{deliveryFee === 0 ? "Grátis" : currency.format(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{currency.format(total)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Input
                  placeholder="Nome completo"
                  value={checkout.customerName}
                  onChange={(event) => setCheckout((current) => ({ ...current, customerName: event.target.value }))}
                />
                <Input
                  placeholder="Telefone"
                  value={checkout.phone}
                  onChange={(event) => setCheckout((current) => ({ ...current, phone: event.target.value }))}
                />
                <Input
                  placeholder="Endereço de entrega"
                  value={checkout.address}
                  onChange={(event) => setCheckout((current) => ({ ...current, address: event.target.value }))}
                />
                <select
                  value={checkout.paymentMethod}
                  onChange={(event) =>
                    setCheckout((current) => ({ ...current, paymentMethod: event.target.value as Order["paymentMethod"] }))
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>M-Pesa</option>
                  <option>e-Mola</option>
                  <option>Cartão</option>
                </select>
                <Textarea
                  placeholder="Notas do pedido"
                  value={checkout.notes}
                  onChange={(event) => setCheckout((current) => ({ ...current, notes: event.target.value }))}
                />
                <Button className="w-full" onClick={placeOrder}>
                  Finalizar pedido
                </Button>
                <p className="text-xs text-muted-foreground">
                  * Aplicação completa pronta. Falta apenas conectar Firebase para persistência online e autenticação.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
