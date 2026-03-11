import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Save, Loader2, Sparkles, Pencil, X, Check, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: "text" | "multiple_choice" | "yes_no";
  options: string | null;
  sort_order: number;
}

const TYPE_LABELS: Record<string, string> = {
  text: "Texto Libre",
  multiple_choice: "Opción Múltiple",
  yes_no: "Sí / No",
};

export default function SurveyConfigPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New question form
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<"text" | "multiple_choice" | "yes_no">("text");
  const [newOptions, setNewOptions] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editType, setEditType] = useState<"text" | "multiple_choice" | "yes_no">("text");
  const [editOptions, setEditOptions] = useState("");

  const fetchQuestions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("custom_survey_questions" as any)
      .select("*")
      .eq("trainer_id", user.id)
      .order("sort_order", { ascending: true });
    setQuestions((data as any as SurveyQuestion[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const addQuestion = async () => {
    if (!user || !newText.trim()) return;
    if (newType === "multiple_choice" && !newOptions.trim()) {
      toast.error("Ingresa las opciones separadas por comas");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("custom_survey_questions" as any).insert({
      trainer_id: user.id,
      question_text: newText.trim(),
      question_type: newType,
      options: newType === "multiple_choice" ? newOptions.trim() : null,
      sort_order: questions.length,
    } as any);
    if (error) toast.error("Error al agregar pregunta");
    else {
      toast.success("Pregunta agregada");
      setNewText("");
      setNewOptions("");
      setNewType("text");
      fetchQuestions();
    }
    setSaving(false);
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("custom_survey_questions" as any).delete().eq("id", id);
    if (error) toast.error("Error al eliminar");
    else {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Pregunta eliminada");
    }
  };

  const startEdit = (q: SurveyQuestion) => {
    setEditingId(q.id);
    setEditText(q.question_text);
    setEditType(q.question_type);
    setEditOptions(q.options || "");
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;
    const { error } = await supabase.from("custom_survey_questions" as any).update({
      question_text: editText.trim(),
      question_type: editType,
      options: editType === "multiple_choice" ? editOptions.trim() : null,
    } as any).eq("id", editingId);
    if (error) toast.error("Error al actualizar");
    else {
      toast.success("Pregunta actualizada");
      setEditingId(null);
      fetchQuestions();
    }
  };

  const moveQuestion = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setQuestions(updated);
    // Persist sort order
    await Promise.all(
      updated.map((q, i) =>
        supabase.from("custom_survey_questions" as any).update({ sort_order: i } as any).eq("id", q.id)
      )
    );
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Configurar Encuesta</h1>
        <p className="text-muted-foreground text-sm mt-1">Diseña las preguntas de diagnóstico para tus alumnos</p>
      </div>

      {/* Add Question */}
      <Card className="card-glass neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> Agregar Pregunta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Pregunta</Label>
            <Input
              placeholder="Ej: ¿Cuántas horas duermes por noche?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Tipo de Respuesta</Label>
            <Select value={newType} onValueChange={(v) => setNewType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto Libre</SelectItem>
                <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                <SelectItem value="yes_no">Sí / No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newType === "multiple_choice" && (
            <div className="space-y-1.5">
              <Label className="text-sm">Opciones (separadas por comas)</Label>
              <Input
                placeholder="Ej: Poco, Regular, Mucho"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
                maxLength={500}
              />
            </div>
          )}
          <Button onClick={addQuestion} disabled={saving || !newText.trim()} className="w-full gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Agregar
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Preguntas ({questions.length})</span>
        </div>

        {questions.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Aún no has agregado preguntas. Tus alumnos verán un mensaje de espera.</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((q, i) => (
            <Card key={q.id} className="card-glass">
              <CardContent className="p-4">
                {editingId === q.id ? (
                  <div className="space-y-3">
                    <Input value={editText} onChange={(e) => setEditText(e.target.value)} maxLength={500} />
                    <Select value={editType} onValueChange={(v) => setEditType(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto Libre</SelectItem>
                        <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                        <SelectItem value="yes_no">Sí / No</SelectItem>
                      </SelectContent>
                    </Select>
                    {editType === "multiple_choice" && (
                      <Input value={editOptions} onChange={(e) => setEditOptions(e.target.value)} placeholder="Opciones separadas por comas" maxLength={500} />
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} className="gap-1"><Check className="h-3 w-3" /> Guardar</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 pt-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveQuestion(i, "up")} disabled={i === 0}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveQuestion(i, "down")} disabled={i === questions.length - 1}>
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{q.question_text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          {TYPE_LABELS[q.question_type]}
                        </Badge>
                        {q.options && (
                          <span className="text-[10px] text-muted-foreground truncate">{q.options}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => startEdit(q)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteQuestion(q.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
