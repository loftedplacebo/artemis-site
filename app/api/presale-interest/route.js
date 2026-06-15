import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name) {
  return name.length >= 2 && name.length <= 120;
}

function isValidWalletAddress(walletAddress) {
  return /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  };
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = String(payload?.name || '').trim();
    const email = String(payload?.email || '').trim();
    const walletAddress = String(payload?.walletAddress || '').trim().toLowerCase();
    const consentToEmail = payload?.consentToEmail === true;

    if (
      !isValidName(name) ||
      !isValidEmail(email) ||
      !isValidWalletAddress(walletAddress) ||
      !consentToEmail
    ) {
      return NextResponse.json({ error: 'Invalid presale interest payload' }, { status: 400 });
    }

    const supabase = getSupabaseConfig();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Presale contact database is not configured' },
        { status: 503 }
      );
    }

    const response = await fetch(
      `${supabase.url}/rest/v1/presale_contacts?on_conflict=wallet_address`,
      {
        method: 'POST',
        headers: {
          apikey: supabase.serviceRoleKey,
          authorization: `Bearer ${supabase.serviceRoleKey}`,
          'content-type': 'application/json',
          prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          name,
          email,
          consent_to_email: true,
          source: payload?.source || 'presale-success',
          last_transaction_hash: payload?.transactionHash || null,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Unable to save presale contact' },
        { status: 502 }
      );
    }

    console.info('Presale interest saved', {
      walletAddress,
      source: payload?.source || 'presale',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to capture presale interest' }, { status: 500 });
  }
}
