import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { title, department, type, location } = body;
    const { id } = await params;
    
    const { data, error } = await supabaseAdmin
      .from('job_roles')
      .update({ title, department, type, location })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating job role:", error);
    return NextResponse.json(
      { error: "Failed to update job role" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from('job_roles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting job role:", error);
    return NextResponse.json(
      { error: "Failed to delete job role" },
      { status: 500 }
    );
  }
}
