import { NextResponse } from 'next/server';
import { Resend } from 'resend';


const resend = new Resend ('re_evdXva8N_jmv8ThYKyw4SLriw2t95fa4r');

export async function GET(request) {

  return NextResponse.json({ name: 'John Doe' });
}