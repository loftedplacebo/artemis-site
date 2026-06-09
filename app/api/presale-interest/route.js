import { NextResponse } from 'next/server';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const email = String(payload?.email || '').trim();
    const walletAddress = String(payload?.walletAddress || '').trim();

    if (!isValidEmail(email) || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: 'Invalid presale interest payload' }, { status: 400 });
    }

    console.info('Presale interest captured', {
      walletAddress,
      source: payload?.source || 'presale',
      timestamp: payload?.timestamp || new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to capture presale interest' }, { status: 500 });
  }
}
