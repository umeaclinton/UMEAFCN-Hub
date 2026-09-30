import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Remote Job Opportunity';
    const company = searchParams.get('company') || 'Top Global Company';
    const category = searchParams.get('category') || 'Remote';
    const salary = searchParams.get('salary') || '$20/hr - $50/hr';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0b1120',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle Accent Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              opacity: 0.25,
              filter: 'blur(120px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-120px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              backgroundColor: '#b8962e',
              opacity: 0.2,
              filter: 'blur(120px)',
            }}
          />

          {/* Top Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Brand Logo Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                padding: '10px 22px',
                borderRadius: '9999px',
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#b8962e',
                }}
              />
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#f8fafc',
                }}
              >
                UMEAFCN HUB
              </span>
            </div>

            {/* Category / Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '10px 22px',
                borderRadius: '9999px',
                color: '#34d399',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              <span>🌍 VERIFIED REMOTE OPENING</span>
            </div>
          </div>

          {/* Center Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              marginTop: '10px',
            }}
          >
            {/* Company Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                🏢 {company} IS HIRING
              </span>
            </div>

            {/* Job Title */}
            <div
              style={{
                fontSize: title.length > 40 ? '48px' : '56px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                maxWidth: '1020px',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {title}
            </div>

            {/* Badges / Perks Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '10px',
              }}
            >
              {/* Salary Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  color: '#7dd3fc',
                  fontSize: '22px',
                  fontWeight: 700,
                }}
              >
                💵 {salary}
              </div>

              {/* Location Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '22px',
                  fontWeight: 600,
                }}
              >
                📍 100% Work from Anywhere
              </div>

              {/* Global Talent */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '22px',
                  fontWeight: 600,
                }}
              >
                ⚡ Immediate Consideration
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #1e293b',
              paddingTop: '25px',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#94a3b8',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              <span>🔗 Verified Application Portal:</span>
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>umeafcnhub.online</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              Apply Online Now →
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
    return new Response('Failed to generate LinkedIn card', { status: 500 });
  }
}
