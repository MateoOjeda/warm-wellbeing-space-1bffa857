import { useApp } from "@/lib/context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Dumbbell } from "lucide-react";

export default function StudentsPage() {
  const { students } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Mis Alumnos</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona y supervisa a tus alumnos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-glass">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-xs text-muted-foreground">Alumnos activos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.reduce((a, s) => a + s.exercises.length, 0)}</p>
              <p className="text-xs text-muted-foreground">Ejercicios asignados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(
                  students.reduce((a, s) => a + s.completedRoutines.reduce((b, c) => b + c, 0), 0) / students.length
                )}
              </p>
              <p className="text-xs text-muted-foreground">Promedio rutinas/alumno</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {students.map((student) => {
          const completedCount = student.exercises.filter((e) => e.completed).length;
          const totalExercises = student.exercises.length;
          const activePlans = student.plans.filter((p) => p.enabled).length;

          return (
            <Card key={student.id} className="card-glass hover:neon-border transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{student.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{student.name}</h3>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-primary">{completedCount}/{totalExercises}</p>
                    <p className="text-[10px] text-muted-foreground">Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{activePlans}</p>
                    <p className="text-[10px] text-muted-foreground">Planes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{student.weight} kg</p>
                    <p className="text-[10px] text-muted-foreground">Peso</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  Activo
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
