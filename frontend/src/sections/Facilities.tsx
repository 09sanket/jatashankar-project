import React from 'react';
import Image from 'next/image';
// Import icons for facilities without images
import { FlaskConical, BookOpen, Stethoscope, Users, GraduationCap, Award, Wifi, ShieldCheck } from 'lucide-react';

// Placeholder images – replace with real assets in /public/facilities/*
const placeholderLab = '';

const placeholderLibrary = '';
const placeholderClinical = '';
const placeholderFaculty = '';
const placeholderSmart = '';
const placeholderSports = '';
const placeholderWifi = '';
const placeholderSecurity = '';

const topHighlights = [
  { icon: '🏢', text: 'आधुनिक इंफ्रास्ट्रक्चर' },
  { icon: '🧪', text: 'उन्नत प्रयोगशालाएं' },
  { icon: '👨‍🏫', text: 'विशेषज्ञ शिक्षक' },
  { icon: '🩺', text: 'क्लिनिकल प्रशिक्षण' },
  { icon: '💻', text: 'स्मार्ट क्लासरूम' },
  { icon: '📚', text: 'समृद्ध पुस्तकालय' },
  { icon: '📶', text: 'Wi-Fi कैंपस' },
  { icon: '🛡️', text: 'सुरक्षित परिसर' },
];

const facilities = [
  {
    title: 'आधुनिक प्रयोगशालाएं',
    description: 'फिजियोथेरेपी, एमएलटी और अन्य कोर्सों हेतु आधुनिक लैब सुविधाएं।',
    image: placeholderLab,
  },
  {
    title: 'समृद्ध पुस्तकालय',
    description: 'हजारों पुस्तकों और डिजिटल संसाधनों से युक्त पुस्तकालय।',
    image: placeholderLibrary,
  },
  {
    title: 'क्लिनिकल प्रशिक्षण',
    description: 'अस्पतालों एवं क्लिनिकल सेटअप में व्यावहारिक प्रशिक्षण।',
    image: placeholderClinical,
  },
  {
    title: 'अनुभवी फैकल्टी',
    description: 'योग्य और अनुभवी शिक्षकों द्वारा गुणवत्तापूर्ण शिक्षण।',
    image: placeholderFaculty,
  },
  {
    title: 'स्मार्ट क्लासरूम',
    description: 'डिजिटल बोर्ड एवं आधुनिक शिक्षण तकनीकों से युक्त कक्षाएं।',
    image: placeholderSmart,
  },
  {
    title: 'खेल सुविधाएं',
    description: 'विद्यार्थियों के शारीरिक विकास हेतु खेल सुविधाएं।',
    image: placeholderSports,
  },
  {
    title: 'Wi‑Fi कैंपस',
    description: 'पूरे परिसर में हाई‑स्पीड इंटरनेट सुविधा।',
    image: placeholderWifi,
  },
  {
    title: 'सुरक्षित परिसर',
    description: '24×7 सुरक्षा एवं CCTV निगरानी।',
    image: placeholderSecurity,
  },
];

export default function Facilities() {
  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16" id="facilities">
      {/* TOP AREA */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            FACILITIES
          </span>
          <h2 className="text-4xl font-bold text-gray-900">
            आधुनिक सुविधाएं
          </h2>
          <h3 className="text-xl text-gray-700">
            बेहतर शिक्षा का मजबूत आधार
          </h3>
          <p className="text-gray-600 max-w-prose">
            हमारे संस्थान में विद्यार्थियों के सर्वांगीण विकास हेतु आधुनिक सुविधाएं, उन्नत प्रयोगशालाएं, अनुभवी शिक्षक, क्लिनिकल प्रशिक्षण और तकनीक‑संचालित शिक्षण वातावरण उपलब्ध कराया जाता है।
          </p>
          <div className="border-b border-gray-300 w-24" />
          <div className="grid grid-cols-2 gap-4">
            {topHighlights.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-red-600 text-xl" aria-hidden="true">{item.icon}</span>
                <span className="text-gray-800 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="relative">
          {/* Curved frame */}
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-gold-500">
            <Image
              src="/branding/homeimg.jpeg"
              alt="Institute building"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* SECOND AREA */}
      <div className="mt-20 text-center">
        <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          हमारी सुविधाएं
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
          सीखने और बढ़ने का बेहतरीन वातावरण
        </h2>
      </div>

      {/* FACILITY MARQUEE SLIDER */}
      <div className="mt-12 w-full overflow-hidden relative">
        <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .slider-track {
            display: flex;
            width: max-content;
            animation: slide 30s linear infinite;
          }
          .slider-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        {/* Left and Right Fade masks */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="slider-track gap-6 py-6 px-4">
          {[...facilities, ...facilities, ...facilities].map((card, idx) => {
            
            // Icon resolver
            let IconComp = FlaskConical;
            if (card.title === 'समृद्ध पुस्तकालय') IconComp = BookOpen;
            else if (card.title === 'क्लिनिकल प्रशिक्षण') IconComp = Stethoscope;
            else if (card.title === 'अनुभवी फैकल्टी') IconComp = Users;
            else if (card.title === 'स्मार्ट क्लासरूम' || card.title === 'स्मार्ट क्लासरुम') IconComp = GraduationCap;
            else if (card.title === 'खेल सुविधाएं') IconComp = Award;
            else if (card.title === 'Wi‑Fi कैंपस') IconComp = Wifi;
            else if (card.title === 'सुरक्षित परिसर') IconComp = ShieldCheck;

            return (
              <div
                key={idx}
                className="flex items-center space-x-4 bg-white border border-gray-100 rounded-full px-6 py-4 shadow-[0_4px_12px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF8F2] flex items-center justify-center border border-[#D4A017]/20 shrink-0">
                  <IconComp className="h-7 w-7 text-[#9B111E]" />
                </div>
                <div className="flex flex-col pr-4">
                  <span className="text-base font-bold text-gray-900 whitespace-nowrap">{card.title}</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{card.description.substring(0, 32)}...</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CTA STRIP */}
      <div className="mt-16 max-w-7xl mx-auto bg-cream-50 border border-gold-200 rounded-full flex items-center justify-between px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <span className="text-red-600 text-2xl" aria-hidden="true">💡</span>
          <p className="text-gray-800 text-sm md:text-base">
            हमारा उद्देश्य छात्रों को सर्वोत्तम सुविधाओं के साथ एक उज्ज्वल भविष्य देना है।
          </p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
          हमसे संपर्क करें
        </button>
      </div>
    </section>
  );
}
