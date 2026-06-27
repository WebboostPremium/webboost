import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/dashboard/solicitudes', destination: '/dashboard/tickets', permanent: true },
      { source: '/dashboard/pagos', destination: '/dashboard/facturas', permanent: true },
      { source: '/admin/pagos', destination: '/admin/facturacion', permanent: true },
    ]
  },
};

export default nextConfig;
