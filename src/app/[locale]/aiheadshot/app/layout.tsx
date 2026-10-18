import '../aiheadshot.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-page" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
