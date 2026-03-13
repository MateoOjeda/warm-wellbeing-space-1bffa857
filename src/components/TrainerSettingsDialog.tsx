import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function TrainerSettingsDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mercadopagoAlias, setMercadopagoAlias] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [saving, setSaving] = useState(false);

  // Promote trainer state
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteCode, setPromoteCode] = useState("");
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    supabase
      .from("profiles")
      .select("mercadopago_alias, whatsapp_number")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setMercadopagoAlias((data as any).mercadopago_alias || "");
          setWhatsappNumber((data as any).whatsapp_number || "");
        }
      });
  }, [user, open]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        mercadopago_alias: mercadopagoAlias.trim(),
        whatsapp_number: whatsappNumber.trim(),
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Error al guardar");
    else {
      toast.success("Configuración guardada");
    }
  };

  const handlePromote = async () => {
    if (!promoteEmail.trim() || !promoteCode.trim()) {
      toast.error("Completa el email y el código de seguridad");
      return;
    }
    setPromoting(true);
    try {
      const { data, error } = await supabase.functions.invoke("promote-trainer", {
        body: { email: promoteEmail.trim(), code: promoteCode.trim() },
      });
      if (error) {
        toast.error("Error al procesar la solicitud");
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(data?.message || "Usuario promovido a entrenador");
        setPromoteEmail("");
        setPromoteCode("");
      }
    } catch {
      toast.error("Error de conexión");
    }
    setPromoting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Configuración">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Payment settings */}
          <div className="space-y-2">
            <Label className="text-sm">Alias de Mercado Pago</Label>
            <Input
              placeholder="ej: mi.alias.mp"
              value={mercadopagoAlias}
              onChange={(e) => setMercadopagoAlias(e.target.value)}
              maxLength={100}
            />
            <p className="text-[11px] text-muted-foreground">Tus alumnos podrán copiar este alias para realizarte pagos.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Número de WhatsApp</Label>
            <Input
              placeholder="ej: 5491112345678"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              maxLength={20}
            />
            <p className="text-[11px] text-muted-foreground">Con código de país, sin + ni espacios.</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar configuración
          </Button>

          <Separator />

          {/* Promote trainer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold">Habilitar Entrenador</Label>
            </div>
            <p className="text-[11px] text-muted-foreground">Promueve a un usuario registrado al rol de entrenador ingresando su email y el código de seguridad.</p>
            <Input
              placeholder="Email del usuario"
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
            />
            <Input
              placeholder="Código de seguridad"
              type="password"
              value={promoteCode}
              onChange={(e) => setPromoteCode(e.target.value)}
            />
            <Button onClick={handlePromote} disabled={promoting} variant="outline" className="w-full gap-2">
              {promoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Habilitar como entrenador
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
