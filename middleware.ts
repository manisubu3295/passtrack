import { NextRequest, NextResponse } from 'next/server';

const unauthorizedResponse = () =>
  new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="PassTrack Admin"',
    },
  });

const serverConfigMissingResponse = () =>
  new NextResponse('Admin credentials are not configured.', {
    status: 500,
  });

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      return serverConfigMissingResponse();
    }

    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  const encoded = authHeader.split(' ')[1] ?? '';
  let decoded = '';

  try {
    decoded = atob(encoded);
  } catch {
    return unauthorizedResponse();
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== adminUsername || password !== adminPassword) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
