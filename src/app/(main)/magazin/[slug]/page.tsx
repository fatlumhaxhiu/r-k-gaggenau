import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true }
  });
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const article = await prisma.blogPost.findUnique({
    where: { slug, status: "published" },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* 1. Article Hero / Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-32 bg-muted/10">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Link href="/magazin" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-10 transition-colors group">
            <ChevronRight className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" /> Zurück zum Magazin
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-bold tracking-widest text-primary-container uppercase bg-primary-container/10 px-3 py-1 rounded-sm">
              {article.category}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span> 
              {article.created_at ? new Date(article.created_at).toLocaleDateString("de-DE") : "Neu"}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-8">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* 2. Hero Image Banner */}
      <section className="w-full max-w-6xl mx-auto px-6 lg:px-12 -mt-16 mb-20 relative z-10">
        <div className="relative h-[400px] sm:h-[500px] lg:h-[650px] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-border/20">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
             <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-400 text-6xl">image</span>
             </div>
          )}
        </div>
      </section>

      {/* 3. Article Content Body */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="max-w-none prose prose-lg dark:prose-invert">
            {/* Split content by newlines and render as paragraphs for basic rich text support */}
            {article.content?.split("\n").map((para, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Individuelle Analyse CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="bg-primary-container rounded-[2rem] p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-10 blur-3xl rounded-full bg-white w-64 h-64 mix-blend-overlay"></div>
             <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-6 relative z-10">
               Individuelle Analyse
             </h2>
             <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
               Ist Ihre Umgebung für maximale Leistungsfähigkeit und Erholung optimiert? Fordern Sie unsere wissenschaftliche Luft- oder Materialqualitätsdiagnose an.
             </p>
             <Link 
               href="/kontakt"
               className={cn(buttonVariants({ variant: "default", size: "lg" }), "bg-white text-primary-container hover:bg-white/90 h-14 px-10 text-base font-bold rounded-md relative z-10 shadow-lg")}
             >
               Diagnose anfordern
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
