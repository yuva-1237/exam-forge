import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { categories as categoriesDb, generateId } from '@/lib/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import CategoryIcon from '@/components/CategoryIcon';

export default function ManageCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const reload = () => setCats(categoriesDb.getAll());
  useEffect(reload, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editId) {
      categoriesDb.update(editId, { name: name.trim(), description: description.trim(), icon });
      toast({ title: 'Category updated' });
    } else {
      categoriesDb.add({ id: generateId(), name: name.trim(), description: description.trim(), icon });
      toast({ title: 'Category added' });
    }
    setName(''); setDescription(''); setIcon('📚'); setEditId(null);
    reload();
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id); setName(cat.name); setDescription(cat.description); setIcon(cat.icon);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this category and all its questions?')) return;
    categoriesDb.remove(id);
    toast({ title: 'Category deleted', variant: 'destructive' });
    reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-card-foreground">{editId ? 'Edit Category' : 'Add Category'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required maxLength={50} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} maxLength={200} placeholder="Short description" />
            </div>
            <div className="space-y-2">
              <Label>Icon (URL or emoji)</Label>
              <Input value={icon} onChange={e => setIcon(e.target.value)} placeholder="https://... or 📚" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); setIcon('📚'); }} className="rounded-lg border border-border px-6 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Icon</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Description</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3 text-2xl">
                    <CategoryIcon icon={c.icon} className="h-8 w-auto text-center" />
                  </td>
                  <td className="p-3 font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{c.description}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(c)} className="text-xs font-medium text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs font-medium text-destructive hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
