import CTASection from "@/components/features/home/CTASection";
import FeatureHighlights from "@/components/features/home/FeatureHighlights";
import HeroIntro from "@/components/features/home/HeroIntro";
import StatsSection from "@/components/features/home/StatsSection";


export default function HomePage() {
  return (
    <div className="space-y-12 p-6">
      <HeroIntro />
      <FeatureHighlights />
      <StatsSection />
      <CTASection />
    </div>
  );
}