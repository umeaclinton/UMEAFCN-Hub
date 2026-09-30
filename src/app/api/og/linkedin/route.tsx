import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title    = searchParams.get('title')   || 'Remote Job Opportunity';
    const company  = searchParams.get('company') || 'Top Global Company';
    const salary   = searchParams.get('salary')  || '$20/hr – $50/hr';

    // Strip any emoji from salary if passed in
    const cleanSalary = salary.replace(/[💰💵]/g, '').trim();

    // logo-dark.jpg has a pure black background (0,0,0) that blends seamlessly with the card
    const logoUrl = new URL('/logo-dark.jpg', request.url).toString();

    // Brand gold colour — pulled from the UMEAFCN Hub logo
    const GOLD      = '#C9A84C';
    const BLACK     = '#000000';
    const WHITE     = '#FFFFFF';

    // Clamp title length so it never overflows
    const displayTitle = title.length > 72 ? title.substring(0, 70) + '…' : title;
    const titleSize    = displayTitle.length > 50 ? '50px' : '60px';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: BLACK,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '0',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            position: 'relative',
          }}
        >
          {/* ── Top gold accent bar ── */}
          <div style={{ width: '100%', height: '5px', backgroundColor: GOLD, display: 'flex' }} />

          {/* ── Header row ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '35px 60px 0 60px',
            }}
          >
            {/* Logo (blends seamlessly into black) + Brand name + Website */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={logoUrl}
                width={64}
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: WHITE, letterSpacing: '1px' }}>
                  UMEAFCN HUB
                </span>
                <span style={{ fontSize: '15px', color: WHITE, fontWeight: 500, letterSpacing: '0.5px', opacity: 0.9 }}>
                  www.umeafcnhub.online
                </span>
              </div>
            </div>

            {/* Verified Remote pill (Gold border, Gold dot, WHITE text, Black background) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `1.5px solid ${GOLD}`,
                borderRadius: '9999px',
                padding: '9px 22px',
                backgroundColor: BLACK,
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: GOLD, display: 'flex' }} />
              <span style={{ color: WHITE, fontSize: '15px', fontWeight: 700, letterSpacing: '1px' }}>
                VERIFIED REMOTE OPENING
              </span>
            </div>
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '45px 60px 0 60px',
              gap: '18px',
            }}
          >
            {/* Company name row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '4px', height: '26px', backgroundColor: GOLD, borderRadius: '2px', display: 'flex' }} />
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: GOLD,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {company} IS HIRING
              </span>
            </div>

            {/* Job title */}
            <div
              style={{
                fontSize: titleSize,
                fontWeight: 900,
                color: WHITE,
                lineHeight: 1.12,
                letterSpacing: '-0.5px',
                maxWidth: '1060px',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {displayTitle}
            </div>

            {/* Badge row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              {/* Salary badge (NO emoji) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: GOLD,
                  padding: '8px 22px',
                  borderRadius: '9999px',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: BLACK }}>
                  {cleanSalary}
                </span>
              </div>

              {/* Work Mode badge: Remote - On-site - Hybrid (Gold circle, black background, white text, location pin) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1.5px solid ${GOLD}`,
                  backgroundColor: BLACK,
                  padding: '8px 22px',
                  borderRadius: '9999px',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 600, color: WHITE }}>
                  📍 Remote - On-site - Hybrid
                </span>
              </div>

              {/* Applicants are welcome (Gold border, pure white text, black background) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1.5px solid ${GOLD}`,
                  backgroundColor: BLACK,
                  padding: '8px 22px',
                  borderRadius: '9999px',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 600, color: WHITE }}>
                  Applicants are welcome
                </span>
              </div>
            </div>

            {/* ── Check Your Eligibility (Gold outline, gold dot, white text, black background) ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: `1.5px solid ${GOLD}`,
                borderRadius: '9999px',
                padding: '10px 26px',
                backgroundColor: BLACK,
                width: 'fit-content',
                marginTop: '25px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: GOLD, display: 'flex' }} />
              <span style={{ color: WHITE, fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
                Check Your Eligibility →
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 627,
      }
    );
  } catch (e: any) {
    console.error('LinkedIn OG Error:', e);
    return new Response('Failed to generate card', { status: 500 });
  }
}
