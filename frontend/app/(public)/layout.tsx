import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/sections/footer";
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Navbar />
      {children}
      <Footer />
    </section>
  );
}
