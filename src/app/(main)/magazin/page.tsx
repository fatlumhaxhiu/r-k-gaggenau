import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { siteData } from "@/data/mockData";

export default function Magazin() {
  const highlightArticle = siteData.blogArticles.find(a => a.isHighlight) || siteData.blogArticles[0];
  const regularArticles = siteData.blogArticles.filter(a => !a.isHighlight);

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      
      {/* 1. Hero Text Split */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <h5 className="text-xs font-bold tracking-widest text-primary-container uppercase mb-4">
                EINBLICKE & EXPERTISE
              </h5>
              <h1 className="font-heading text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
                Atmosphärische <br/><span className="text-primary-container italic">Präzision.</span>
              </h1>
            </div>
            <div className="max-w-md pb-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wir erkunden die Schnittstelle zwischen architektonischer Instandhaltung, Umweltgesundheit und der stillen Kunst akribischer Ordnung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Highlight Article & Intro Block */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            
            {/* Massive Highlight Image Card */}
            <Link href={`/magazin/${highlightArticle.slug}`} className="relative h-[550px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer group block">
              <Image 
                src={highlightArticle.image}
                alt="Highlight Article"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
              
              <div className="absolute bottom-0 left-0 p-10 lg:p-14 w-full md:w-4/5 text-white">
                <span className="inline-block bg-primary-container px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase rounded-sm mb-6">
                  {highlightArticle.tag}
                </span>
                <h2 className="text-3xl lg:text-4xl font-heading font-black mb-4 leading-tight">
                  {highlightArticle.title}
                </h2>
                <p className="text-white/80 font-medium leading-relaxed">
                  {highlightArticle.desc}
                </p>
              </div>
            </Link>

            {/* Side Information Box */}
            <div className="bg-muted/40 rounded-2xl p-10 flex flex-col justify-center border border-border/50">
              <span className="text-xs font-bold tracking-widest text-primary-container uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> {highlightArticle.date}
              </span>
              <p className="text-foreground leading-relaxed mb-10 font-medium">
                Wir bringen Ihnen exklusive Einblicke und tiefe redaktionelle Beiträge aus der Welt der hochprofessionellen Architekturerhaltung. Erfahren Sie heute mehr in unserem Monats-Fokus.
              </p>
              <Link href={`/magazin/${highlightArticle.slug}`} className="text-sm font-bold text-foreground flex items-center gap-2 group mt-auto hover:text-primary-container transition-colors">
                Vollständigen Artikel lesen <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Article Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link key={article.id} href={`/magazin/${article.slug}`} className="group flex flex-col pt-4">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 shadow-sm border border-border/20">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-primary-container uppercase">
                    {article.tag}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span> {article.date}
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-foreground mb-3 leading-tight group-hover:text-primary-container transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {article.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curated Precision Newsletter Box */}
      <section className="pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-linear-to-r from-green-50 to-primary/10 rounded-[2rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            
            <div className="flex-1 max-w-xl z-10">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                Kuratierte Präzision.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Werden Sie Teil unserer Community für monatliche Updates zu Umweltschutz, High-End-Design und Lifestyle-Ergonomie.
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 z-10 flex border border-border/40 p-2 bg-background/50 backdrop-blur-md rounded-lg shadow-sm">
              <Input 
                placeholder="email@adresse.de" 
                className="flex-1 h-12 bg-transparent border-none outline-none focus-visible:ring-0 px-4 placeholder:text-muted-foreground shadow-none" 
              />
              <Button className="h-12 px-8 bg-[#151515] hover:bg-black text-white rounded-md shadow-lg shadow-black/10">
                ABONNIEREN
              </Button>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
