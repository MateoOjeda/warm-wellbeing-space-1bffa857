import { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Apple, Dumbbell, Heart, StretchHorizontal, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Dumbbell,
  Heart,
  Stretch: StretchHorizontal,
};

export default function PlansPage() {
  const { students, togglePlan } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const student = students.find((s) => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Gestión de Planes</h1>
        <p className="text-muted-foreground text-sm mt-1">Habilita o deshabilita módulos por alumno</p>
      </div>

      <div className="max-w-xs">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {student && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {student.plans.map((plan) => {
            const Icon = iconMap[plan.icon] || ClipboardList;
            return (
              <Card
                key={plan.id}
                className={`card-glass transition-all duration-300 ${plan.enabled ? "neon-border" : "opacity-60"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${plan.enabled ? "bg-primary/15" : "bg-secondary"}`}>
                        <Icon className={`h-5 w-5 ${plan.enabled ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <Badge variant="outline" className={`text-[10px] mt-1 ${plan.enabled ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                          {plan.enabled ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={plan.enabled}
                      onCheckedChange={() => togglePlan(student.id, plan.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
