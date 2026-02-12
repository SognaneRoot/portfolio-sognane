import { Heart, Linkedin, Github, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/ndiaga-sognane/",
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/SognaneRoot",
      color: "hover:text-gray-800",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/221706056839",
      color: "hover:text-green-600",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (item: string) => {
    let sectionId;
    switch (item.toLowerCase()) {
      case 'accueil':
        sectionId = 'accueil';
        break;
      case 'cv':
        sectionId = 'cv';
        break;
      case 'projets':
        sectionId = 'projets';
        break;
      case 'contact':
        sectionId = 'contact';
        break;
      default:
        sectionId = item.toLowerCase();
    }
    
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <h3 className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ndiaga Sognane
            </h3>
            <p className="text-gray-400 max-w-sm">
              Technicien en Administration Système, Sécurité et
              Cloud passionné par l'innovation et la résolution
              de problèmes techniques.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-lg">Navigation rapide</h4>
            <ul className="space-y-2">
              {["Accueil", "CV", "Projets", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {item}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact and social */}
          <div className="space-y-4">
            <h4 className="text-lg">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>sognanendiaga221@gmail.com</p>
              <p>+221 70 605 68 39</p>
              <p>Rufisque, Mbour, Sénégal</p>
              <p>
                <a
                  href="https://monportfolio.ct.ws"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  monportfolio.ct.ws
                </a>
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
                    title={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-gray-400 mb-4 md:mb-0">
            <span>
              © {currentYear} Ndiaga Sognane - Tous droits
              réservés. Fait avec
            </span>
            <Heart className="h-4 w-4 mx-2 text-red-500 fill-current" />
            <span>et passion 💻</span>
          </div>

          <button
            onClick={scrollToTop}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            aria-label="Retour en haut de la page"
          >
            <span className="text-lg">↑</span>
            <span>Retour en haut</span>
          </button>
        </div>
      </div>
    </footer>
  );
}