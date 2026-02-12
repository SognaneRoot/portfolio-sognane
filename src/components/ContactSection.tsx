import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Github,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { sendEmail } = await import('../utils/emailService');
      
      // Envoi du message via service email
      const result = await sendEmail(formData);
      
      if (result.success) {
        alert(
          `Merci ${formData.name} ! ${result.message}`
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Échec de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert(
        `Désolé ${formData.name}, une erreur s'est produite lors de l'envoi. Veuillez réessayer ou me contacter directement à sognanendiaga221@gmail.com`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/221706056839",
      color: "hover:text-green-600",
    },
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
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Restons en{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contact
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question, un projet ou simplement envie
            d'échanger ? N'hésitez pas à me contacter !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl mb-6">
                Envoyez-moi un message
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="votre.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 min-h-[120px]"
                    placeholder="Décrivez votre projet ou votre demande..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact info */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-6">
                  Informations de contact
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-1">Email</h4>
                      <p className="text-gray-600">
                        sognanendiaga221@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-1">
                        Téléphone
                      </h4>
                      <p className="text-gray-600">
                        +221 70 605 68 39
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-1">
                        Localisation
                      </h4>
                      <p className="text-gray-600">
                        Rufisque, Mbour, Sénégal
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social links */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-6">Suivez-moi</h3>

                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-gray-100 p-4 rounded-lg transition-all duration-300 hover:bg-gray-200 hover:scale-110 ${social.color}`}
                        title={social.name}
                      >
                        <IconComponent className="h-6 w-6" />
                      </a>
                    );
                  })}
                </div>

                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Disponible pour:</strong> Stage,
                      CDI, missions techniques, Freelance
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      🌐 <strong>Portfolio:</strong>{" "}
                      <a
                        href="https://monportfolio.ct.ws"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        monportfolio.ct.ws
                      </a>
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      📧 <strong>Email automatique:</strong> Vos messages sont envoyés directement par email.
                      Réponse garantie sous 24h !
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}