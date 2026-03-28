import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-primary dark:bg-surface-dark dark:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
