"use client";

import { useState, useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import MetroHero from "@/components/ui/scroll-locked-video-hero";

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

export const sampleMediaContent: MediaContentCollection = {
  video: {
    src: "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1280&auto=format&fit=crop",
    background:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    title: "Seireitei Sacred Citadel • 瀞霊廷",
    date: "Bleach Canon • Soul Society Arc",
    scrollToExpand: "Scroll Down to Traverse the Gotei 13 Quarters",
    about: {
      overview:
        "In Tite Kubo’s Bleach, the Soul Society (尸魂界) is the afterlife sanctuary where souls reside after receiving the Konsō (Soul Burial) rite from Shinigami. The fortified heart of this spiritual dimension is Seireitei, an immense circular metropolis protected by walls of spirit-repelling Sekkiseki stone and defended by the 13 Court Guard Squads (Gotei 13).",
      conclusion:
        "From the four monumental gates (Hakudaumon, Shūrumon, Kōryūmon, and Kokuryōmon) to the fiery Sōkyoku execution mesa and the First Division barracks of Captain-Commander Yamamoto, every avenue pulses with concentrated Reishi and ancient Zanpakutō blade lore.",
    },
  },
  image: {
    src: "/seireitei-home.webp",
    background:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    title: "The Court of Pure Souls • 護廷十三隊",
    date: "Thousand-Year Realm • Seireitei",
    scrollToExpand: "Scroll Down to Enter the Sacred Sanctum",
    about: {
      overview:
        "Encircled by the eighty outer districts of Rukongai, the Seireitei houses the Central 46 judicial assembly, the Shin’ō Academy for training Soul Reapers, and the research facilities of the S.R.D.I. founded by Kisuke Urahara.",
      conclusion:
        "High above within an elevated dimensional barrier floats the Royal Realm (Reiōkyū), where the five elite officers of Squad Zero protect the Soul King—the fundamental anchor maintaining the tripartite balance between the Human World, Hueco Mundo, and Soul Society.",
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: "video" | "image" }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className="max-w-4xl mx-auto text-left">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-wide font-serif">
        Soul Society Lore & Architectural Breakdown
      </h2>
      <p className="text-lg mb-8 text-neutral-300 leading-relaxed font-sans">
        {currentMedia.about.overview}
      </p>

      <p className="text-lg mb-8 text-neutral-400 leading-relaxed font-sans">
        {currentMedia.about.conclusion}
      </p>
    </div>
  );
};

export const VideoExpansionTextBlend = () => {
  const mediaType = "video";
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansionTextBlend = () => {
  const mediaType = "image";
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const VideoExpansion = () => {
  const mediaType = "video";
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansion = () => {
  const mediaType = "image";
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export function Demo() {
  const [mediaType, setMediaType] = useState<"video" | "image">("video");
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event("resetSection");
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
    <div className="min-h-screen bg-[#05060f]">
      <div className="fixed top-20 right-8 z-50 flex gap-2">
        <button
          onClick={() => setMediaType("video")}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            mediaType === "video"
              ? "bg-[#6fb7ff] text-[#05060f] font-bold shadow-[0_0_15px_rgba(111,183,255,0.5)]"
              : "bg-black/60 text-white border border-white/20 hover:border-white/50"
          }`}
        >
          VIDEO PREVIEW
        </button>

        <button
          onClick={() => setMediaType("image")}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            mediaType === "image"
              ? "bg-[#c9a65b] text-[#05060f] font-bold shadow-[0_0_15px_rgba(201,166,91,0.5)]"
              : "bg-black/60 text-white border border-white/20 hover:border-white/50"
          }`}
        >
          CITADEL IMAGE
        </button>
      </div>

      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === "video" ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
}

export function DemoOne() {
  return <MetroHero />;
}

export default DemoOne;
