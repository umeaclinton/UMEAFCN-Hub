import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // This will delete all records from the posts table
    await sql`TRUNCATE TABLE posts;`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'All posts have been successfully cleared from the database.'
    });
  } catch (error: any) {
    console.error('Error clearing database:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
