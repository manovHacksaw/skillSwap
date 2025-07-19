import React from "react";

// Card highlight colors
const cardColors = [
  "bg-[#FEF9C3]", // Yellow
  "bg-[#CFFAFE]", // Mint/Aqua
  "bg-[#FDE2E4]", // Peach/Pink
];

const cardShadow = "shadow-[8px_8px_0_0_rgba(0,0,0,1)]";
const border = "border-4 border-black";

const steps = [
  {
    title: "Create Your Skill Card",
    desc: "Add your expertise, topics, and rates to a personal skill card so learners know what you teach.",
    color: cardColors[0],
    img: null, // Placeholder for future image
  },
  {
    title: "Match with Learners",
    desc: "Our decentralized protocol matches you to learners looking for your skills. Build connections transparently.",
    color: cardColors[1],
    img: null, // Placeholder for future image
  },
  {
    title: "Earn & Build Reputation",
    desc: "Teach, receive on-chain credentials, and earn crypto rewards for your knowledge.",
    color: cardColors[2],
    img: null, // Placeholder for future image
  },
];

// Arrow SVG (curved, black, animated wiggle)
const Arrow = ({ direction = "right", className = "" }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    className={`mx-auto my-2 ${className}`}
    style={{
      transform: direction === "left" ? "scaleX(-1)" : undefined,
    }}
  >
    <path
      d="M8 16C24 48 40 16 56 48"
      stroke="black"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      className="arrow-path"
    />
    <path
      d="M56 48l-8-4m8 4l-4-8"
      stroke="black"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <style jsx>{`
      .arrow-path {
        animation: wiggle 1.5s ease-in-out infinite;
      }
      @keyframes wiggle {
        0%, 100% { stroke-dashoffset: 0; }
        50% { stroke-dashoffset: 6; }
      }
    `}</style>
  </svg>
);

export default function HowItWorksSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          How It Works
        </h2>
        <div className="relative w-full flex flex-col items-center">
          {steps.map((step, i) => (
            <React.Fragment key={step.title}>
              <div
                className={`
                  w-full md:w-3/4
                  ${i % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:mr-0 md:ml-auto"}
                  mb-8
                  flex flex-col md:flex-row items-center
                  transition-all
                  opacity-0 translate-y-8
                  animate-fade-in-up
                  ${i % 2 === 0 ? "md:pl-4" : "md:pr-4"}
                `}
                style={{
                  animationDelay: `${i * 0.2 + 0.2}s`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Removed image placeholder */}
                <div
                  className={`
                    flex-1 p-6 rounded-xl ${border} ${cardShadow} ${step.color}
                    flex flex-col justify-center
                  `}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <h3 className="text-xl md:text-2xl font-black mb-2 text-black font-inter uppercase">
                    {step.title}
                  </h3>
                  <p className="text-gray-900 font-medium font-inter">
                    {step.desc}
                  </p>
                </div>
              </div>
              {/* Arrow (except after last card) */}
              {i < steps.length - 1 && (
                <div className="w-full flex justify-center items-center mb-4">
                  <Arrow direction={i % 2 === 0 ? "right" : "left"} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (max-width: 768px) {
          .md\\:w-3\\/4 { width: 100% !important; }
          .md\\:ml-0, .md\\:mr-auto, .md\\:mr-0, .md\\:ml-auto, .md\\:pl-4, .md\\:pr-4 { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </section>
  );
} 