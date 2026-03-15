import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { baseProducts, categories, MARKETPLACE_STORAGE_KEYS, Order, Product } from "@/data/marketplace";

const currency = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "MZN", maximumFractionDigits: 2 });

type ProductForm = {
  name: string;
  category: Product["category"];
  price: string;
  stock: string;
  seller: string;
  location: string;
  image: string;
  description: string;
};

const formDefaults: ProductForm = {
  name: "",
  category: "Smartphones",
  price: "",
  stock: "",
  seller: "",
  location: "",
  image: "",
  description: "",
};

const Admin = () => {
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<ProductForm>(formDefaults);

  useEffect(() => {
    const productsRaw = localStorage.getItem(MARKETPLACE_STORAGE_KEYS.customProducts);
    const ordersRaw = localStorage.getItem(MARKETPLACE_STORAGE_KEYS.orders);

    setCustomProducts(productsRaw ? JSON.parse(productsRaw) : []);
    setOrders(ordersRaw ? JSON.parse(ordersRaw) : []);
  }, []);

  const allProducts = useMemo(() => [...baseProducts, ...customProducts], [customProducts]);

  const saveProducts = (nextProducts: Product[]) => {
    setCustomProducts(nextProducts);
    localStorage.setItem(MARKETPLACE_STORAGE_KEYS.customProducts, JSON.stringify(nextProducts));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.seller || !form.location || !form.description) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }

    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      seller: form.seller,
      location: form.location,
      image:
        form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
      description: form.description,
      rating: 5,
    };

    saveProducts([newProduct, ...customProducts]);
    setForm(formDefaults);
    toast({ title: "Produto criado", description: "Produto adicionado ao marketplace local." });
  };

  const removeProduct = (id: string) => {
    const nextProducts = customProducts.filter((product) => product.id !== id);
    saveProducts(nextProducts);
    toast({ title: "Produto removido" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Painel do vendedor</h1>
            <p className="text-sm text-muted-foreground">Gerencie produtos e pedidos em MZN</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao marketplace
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" /> Cadastrar novo produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2 space-y-1">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label>Categoria</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((c) => ({ ...c, category: e.target.value as Product["category"] }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label>Preço (MZN)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm((c) => ({ ...c, stock: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label>Vendedor</Label>
                <Input value={form.seller} onChange={(e) => setForm((c) => ({ ...c, seller: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label>Localização</Label>
                <Input value={form.location} onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label>URL da imagem (opcional)</Label>
                <Input value={form.image} onChange={(e) => setForm((c) => ({ ...c, image: e.target.value }))} />
              </div>

              <div className="md:col-span-2 space-y-1">
                <Label>Descrição</Label>
                <Input value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} />
              </div>

              <div className="md:col-span-2">
                <Button className="w-full" type="submit">Salvar produto</Button>
              </div>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Firebase ainda não conectado. Produtos e pedidos são persistidos localmente no navegador.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Total de produtos: <span className="font-semibold">{allProducts.length}</span></p>
              <p>Produtos personalizados: <span className="font-semibold">{customProducts.length}</span></p>
              <p>Pedidos recebidos: <span className="font-semibold">{orders.length}</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-auto">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
              ) : (
                orders.slice(0, 6).map((order) => (
                  <div key={order.id} className="border rounded-lg p-3 space-y-1 text-sm">
                    <p className="font-semibold">{order.id} • {order.customerName}</p>
                    <p className="text-muted-foreground">{order.paymentMethod} • {currency.format(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString("pt-PT")}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produtos personalizados cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ainda não há produtos personalizados.</p>
            ) : (
              customProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • {currency.format(product.price)} • stock {product.stock}
                    </p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
