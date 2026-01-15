import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CodeInput = () => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (code.trim()) {
      console.log("Código enviado:", code);
    }
  };

  return (
    <div className="space-y-3 no-select">
      <Input
        type="text"
        placeholder="C Ó D I G O"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="h-12 text-center tracking-[0.3em] font-medium bg-secondary border-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <Button
        onClick={handleSubmit}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide glow-primary transition-all duration-300"
      >
        ENTRAR
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Use: <span className="text-primary font-semibold">FUTEBOL24</span> para testar
      </p>
    </div>
  );
};

export default CodeInput;
