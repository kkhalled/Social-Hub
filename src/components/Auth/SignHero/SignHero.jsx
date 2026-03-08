import {
  faBell,
  faHeart,
  faImage,
  faMessage,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import hero from "../../../assets/hero.jpg"
export default function SignHero({title,titleMin,text}) {
  const cards = [
    {
      title: "Real-time Chat",
      desc: "Instant messaging",
      icon: faMessage,
    },
    {
      title: "Share Media",
      desc: "Photos & videos",
      icon: faImage,
    },
    {
      title: "Smart Alerts",
      desc: "Stay updated",
      icon: faBell,
    },
    {
      title: "Communities",
      desc: "Find your tribe",
      icon: faUsers,
    },
  ];

  const status = [
    {
      icon: faUsers,
      value: "2M+",
      title: "Active Users",
    },
    {
      icon: faHeart,
      value: "10M+",
      title: "Posts Shared",
    },
    {
      icon: faMessage,
      value: "50M+",
      title: "Messages Sent",
    },
  ];

  return (
    <div
      className="hidden lg:flex min-h-screen px-10 py-10 flex-col justify-between text-white bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(#1447e6cc,#1447e6cc),url(/bg-social.png)" }}
    >
      {/* HEADER */}
      <header>
        <Link to="/" className="flex items-center gap-2 t font-bold">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-lg">
            S
          </span>
          <span>SocialHub</span>
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="space-y-2 flex flex-col justify-between">
        {/* HERO TEXT */}
        <div className="max-w-xl space-y-4 ">
          <h1 className="text-4xl max-w-70 font-bold leading-tight">
            {title}{" "} 
            <span className=" bg-linear-to-r from-cyan-400 to-blue-100 bg-clip-text text-transparent">
              {titleMin}
            </span>
          </h1>
          <p className="text-white/80 max-w-96">
           {text}
          </p>
        </div>

        {/* FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex gap-4 p-2.5 rounded-xl bg-white/10 drop-shadow-2xl drop-shadow-blue-100 backdrop-blur-md border border-white/10"
            >
              <span className="   mt-1">
                <FontAwesomeIcon icon={card.icon} className=" bg-gray-300/20 p-1.5 rounded " />
              </span>
              <div>
                <h3 className="">{card.title}</h3>
                <p className="text-sm text-white/70">{card.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* STATS */}
        <div className="flex flex-wrap gap-8">
          {status.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-xl font-bold">
                <FontAwesomeIcon icon={item.icon}  />
                <span>{item.value}</span>
              </div>
              <span className="text-sm text-white/70">{item.title}</span>
            </div>
          ))}
        </div>
      </main>

      {/* TESTIMONIAL */}
      <footer className="max-w-2xl p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 space-y-4">
        <div className="flex gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} />
          ))}
        </div>

        <p className="italic text-white/90">
          “SocialHub has completely changed how I connect with friends and
          discover new communities. The experience is seamless.”
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full " >
          <img src={hero} className="rounded-full" alt="" />
          </div>
          <div>
            <h5 className="font-semibold">Alex Johnson</h5>
            <span className="text-sm text-white/70">Product Designer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
