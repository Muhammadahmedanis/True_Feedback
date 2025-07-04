'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import messages from "@/data/messages.json";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-white text-white">
      <section className="text-center mb-8 md:mb-12">
         <h1 className="text-3xl md:text-5xl font-bold text-black">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-black">
            True Feedback - Where your identity remains a secret.
          </p>
      </section>
      <Carousel className="w-full max-w-sm"
        plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      >
      <CarouselContent className="-ml-1">
        {
          messages.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1 text-black">
              <Card>
                <CardHeader>
                  {message?.title}
                </CardHeader >
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                  <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious className="text-black hover:text-black" />
      <CarouselNext className="text-black hover:text-black" />
    </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6 bg-gray-100 ">
      © 2023 True Feedback. All rights reserved.
    </footer>
    </>
  );
}
