import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Building2, Users, Presentation, DoorOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-10 w-10" />,
  Users: <Users className="h-10 w-10" />,
  Presentation: <Presentation className="h-10 w-10" />,
  DoorOpen: <DoorOpen className="h-10 w-10" />,
};

export type Slide = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: string;
  bgImage?: string;
};

interface HeroSliderProps {
  slides: Slide[];
}

const HeroSlider = ({ slides }: HeroSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (!slides.length) return null;

  return (
    <section className="relative bg-secondary py-12 lg:py-16">
      <div className="container">
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                <div
                  className={cn(
                    "mx-auto flex max-w-3xl flex-col items-center text-center transition-all duration-500",
                    i === selectedIndex ? "opacity-100 scale-100" : "opacity-40 scale-95"
                  )}
                  style={slide.bgImage ? { backgroundImage: `url(${slide.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  <div className="mb-4 rounded-xl bg-primary/10 p-4 text-primary transition-transform duration-500 group-hover:scale-110">
                    {iconMap[slide.icon] ?? <Building2 className="h-10 w-10" />}
                  </div>
                  <h3 className="font-display text-2xl font-bold lg:text-3xl">{slide.title}</h3>
                  <p className="mt-3 max-w-xl text-muted-foreground">{slide.description}</p>
                  <Button className="mt-6" size="lg" asChild>
                    <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-background"
            aria-label="Önceki"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-background"
            aria-label="Sonraki"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
