import type { ReactNode } from 'react';
import './PageLayout.css';

type PageLayoutProps = {
  children: ReactNode;
};

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <section className="page-layout-container">
      {children}
    </section>
  );
};
