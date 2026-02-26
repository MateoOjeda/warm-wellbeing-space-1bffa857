import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Dumbbell, Flame } from "lucide-react";
import { DAYS, DayOfWeek } from "@/lib/store";

function getTodayDay(): DayOfWeek {
  const days: DayOfWeek[] = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[new Date().getDay()];
}

export default function TodayRoutinePage() {
  const { currentStudent, toggleExerciseComplete } = useApp();
  const today = getTodayDay();
  const todayExercises = currentStudent.exercises.filter((e) => e.day === today);
  const completedCount = todayExercises.filter((e) => e.completed).length;
  const allDone = todayExercises.length > 0 && completedCount === todayExercises.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Mi Rutina Hoy</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="border-primary/40 text-primary text-xs">{today}</Badge>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{todayExercises.length} completados
          </span>
        </div>
      </div>

      {allDone && (
        <Card className="card-glass neon-border neon-glow">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse-neon" />
            <h2 className="text-xl font-display font-bold neon-text">¡Rutina Completada!</h2>
            <p className="text-sm text-muted-foreground mt-1">Excelente trabajo hoy 💪</p>
          </CardContent>
        </Card>
      )}

      {todayExercises.length === 0 ? (
        <Card className="card-glass">
          <CardContent className="p-8 text-center">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">Día de descanso</h3>
            <p className="text-sm text-muted-foreground mt-1">No tienes ejercicios programados para hoy</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todayExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className={`card-glass transition-all duration-300 cursor-pointer ${
                exercise.completed ? "neon-border opacity-70" : "hover:neon-border"
              }`}
              onClick={() => toggleExerciseComplete(currentStudent.id, exercise.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Checkbox
                  checked={exercise.completed}
                  onCheckedChange={() => toggleExerciseComplete(currentStudent.id, exercise.id)}
                  className="h-6 w-6 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className={`h-5 w-5 ${exercise.completed ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${exercise.completed ? "line-through text-muted-foreground" : ""}`}>
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {exercise.sets} series × {exercise.reps} reps — {exercise.weight > 0 ? `${exercise.weight} kg` : "Sin peso"}
                  </p>
                </div>
                {exercise.completed && (
                  <Badge className="bg-primary/15 text-primary border-0 text-xs">Hecho</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
