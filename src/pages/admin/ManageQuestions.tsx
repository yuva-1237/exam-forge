import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { questions as questionsDb, categories as categoriesDb, generateId } from '@/lib/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Question, Option, Category } from '@/types';

const emptyOption = (): Option => ({ id: generateId(), text: '', isCorrect: false });

export default function ManageQuestions() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [filterCat, setFilterCat] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [options, setOptions] = useState<Option[]>([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
  const { toast } = useToast();

  const reload = () => {
    setAllQuestions(questionsDb.getAll());
    setCats(categoriesDb.getAll());
  };
  useEffect(reload, []);

  const filtered = allQuestions.filter(q => {
    if (filterCat !== 'all' && q.categoryId !== filterCat) return false;
    if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
    return true;
  });

  const resetForm = () => {
    setEditId(null); setText(''); setCategoryId(''); setDifficulty('medium');
    setNegativeMarking(0.25); setOptions([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
    setShowForm(false);
  };

  const startEdit = (q: Question) => {
    setEditId(q.id); setText(q.text); setCategoryId(q.categoryId); setDifficulty(q.difficulty);
    setNegativeMarking(q.negativeMarking);
    setOptions(q.options.length >= 4 ? q.options.map(o => ({ ...o })) : [...q.options.map(o => ({ ...o })), ...Array(4 - q.options.length).fill(null).map(() => emptyOption())]);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !categoryId) { toast({ title: 'Fill all fields', variant: 'destructive' }); return; }
    const validOpts = options.filter(o => o.text.trim());
    if (validOpts.length < 2) { toast({ title: 'At least 2 options required', variant: 'destructive' }); return; }
    if (!validOpts.some(o => o.isCorrect)) { toast({ title: 'Mark at least one correct answer', variant: 'destructive' }); return; }

    if (editId) {
      questionsDb.update(editId, { text: text.trim(), categoryId, difficulty, negativeMarking, options: validOpts });
      toast({ title: 'Question updated' });
    } else {
      questionsDb.add({ id: generateId(), text: text.trim(), categoryId, difficulty, negativeMarking, options: validOpts });
      toast({ title: 'Question added' });
    }
    resetForm();
    reload();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this question?')) return;
    questionsDb.remove(id);
    toast({ title: 'Question deleted', variant: 'destructive' });
    reload();
  };

  const updateOption = (index: number, updates: Partial<Option>) => {
    setOptions(prev => prev.map((o, i) => i === index ? { ...o, ...updates } : updates.isCorrect ? { ...o, isCorrect: false } : o));
  };

  const getCatName = (id: string) => cats.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-foreground">Manage Questions</h1>
          <button onClick={() => { resetForm(); setShowForm(true); setCategoryId(cats[0]?.id || ''); }} className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            + Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="all">All Categories</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <span className="text-sm text-muted-foreground self-center">{filtered.length} questions</span>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-card-foreground">{editId ? 'Edit Question' : 'Add Question'}</h2>
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Input value={text} onChange={e => setText(e.target.value)} required maxLength={500} placeholder="Enter question..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Negative Marking</Label>
                <Input type="number" step="0.05" min="0" max="1" value={negativeMarking} onChange={e => setNegativeMarking(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Options (mark correct answer)</Label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground w-6">{String.fromCharCode(65 + i)}</span>
                  <Input value={opt.text} onChange={e => updateOption(i, { text: e.target.value })} placeholder={`Option ${String.fromCharCode(65 + i)}`} maxLength={200} className="flex-1" />
                  <label className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => updateOption(i, { isCorrect: true })} className="accent-primary" />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                {editId ? 'Update' : 'Add'} Question
              </button>
              <button type="button" onClick={resetForm} className="rounded-lg border border-border px-6 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Questions List */}
        <div className="space-y-3">
          {filtered.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{q.text}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{getCatName(q.categoryId)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      q.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>{q.difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(q)} className="text-xs font-medium text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-xs font-medium text-destructive hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
