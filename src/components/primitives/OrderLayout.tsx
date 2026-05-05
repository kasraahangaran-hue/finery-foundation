import type { ReactNode } from 'react';

interface OrderLayoutProps {
  children: ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => (
  <div className="min-h-screen flex flex-col pt-safe pb-safe px-safe select-none-ui">
    {children}
  </div>
);

export default OrderLayout;