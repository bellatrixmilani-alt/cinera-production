import { supabase } from '@/lib/supabase';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 1. READ: Fetch all creator projects
export async function getProjects(): Promise<Project[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 2. CREATE: Insert a new project
export async function createProject(title: string, description?: string): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 3. UPDATE: Edit project title/description
export async function updateProject(id: string, updates: { title?: string; description?: string }): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 4. DELETE: Remove project
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}