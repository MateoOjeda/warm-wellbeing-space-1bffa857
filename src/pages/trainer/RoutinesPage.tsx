import { useState } from "react";
import { useApp } from "@/lib/context";
import { DAYS, DayOfWeek } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import { toast } from "sonner";

export default function RoutinesPage() {
  const { students, addExercise, removeExercise } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const [form, setForm] = useState({ name: "", sets: "", reps: "", weight: "", day: "" as string });

  const student = students.find((s) => s.id === selectedStudent);

  const handleAdd = () => {
    if (!form.name || !form.sets || !form.reps || !form.day) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    addExercise(selectedStudent, {
      name: form.name,
      sets: parseInt(form.sets),
      reps: parseInt(form.reps),
      weight: parseFloat(form.weight) || 0,
      day: form.day as DayOfWeek,
    });
    setForm({ name: "", sets: "", reps: "", weight: "", day: "" });
    toast.success("Ejercicio agregado correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Creador de Rutinas</h1>
        <p className="text-muted-foreground text-sm mt-1">Asigna ejercicios a tus alumnos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="card-glass neon-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Nuevo Ejercicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Alumno</Label>
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
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Ejercicio</Label>
              <Input
                placeholder="Ej: Press Banca"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Series</Label>
                <Input
                  type="number"
                  placeholder="4"
                  value={form.sets}
                  onChange={(e) => setForm({ ...form, sets: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Reps</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={form.reps}
                  onChange={(e) => setForm({ ...form, reps: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Peso (kg)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Día</Label>
              <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Ejercicio
            </Button>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Ejercicios de {student?.name || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!student || student.exercises.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Sin ejercicios asignados</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {DAYS.map((day) => {
                  const dayExercises = student.exercises.filter((e) => e.day === day);
                  if (dayExercises.length === 0) return null;
                  return (
                    <div key={day}>
                      <Badge variant="outline" className="mb-2 border-primary/30 text-primary text-[10px]">{day}</Badge>
                      {dayExercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 mb-1"
                        >
                          <div>
                            <p className="font-medium text-sm">{ex.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {ex.sets}×{ex.reps} — {ex.weight}kg
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeExercise(student.id, ex.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
