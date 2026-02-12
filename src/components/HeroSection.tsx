import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import TypewriterText from "./TypewriterText";
import profileImage from "figma:asset/28e6dd97f48a8e4ccbb521e9e3642fe366e7020c.png";

export default function HeroSection() {
  const scrollToCV = () => {
    const element = document.querySelector("#cv");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <ImageWithFallback
              src={profileImage}
              alt="Photo de profil"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
            Bonjour, je suis{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ndiaga Sognane
            </span>
          </h1>

          <div className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto min-h-[2.5rem] flex items-center justify-center">
            <TypewriterText
              baseText="Technicien en "
              words={[
                "Administration Système",
                "Sécurité",
                "Cloud",
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
              className="text-xl sm:text-2xl"
            />
          </div>

          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto italic">
            "Passionné par l'innovation et la résolution de problèmes techniques."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToCV}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              Voir mon CV
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Me contacter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <h3 className="text-2xl mb-2 text-blue-600">2+</h3>
            <p className="text-gray-600">Années de formation</p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <h3 className="text-2xl mb-2 text-purple-600">
              16+
            </h3>
            <p className="text-gray-600">Projets techniques</p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <h3 className="text-2xl mb-2 text-blue-600">10+</h3>
            <p className="text-gray-600">Certifications</p>
          </div>
        </div>
      </div>
    </section>
  );
}