import React from 'react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      title: 'WEAR ALL DAY COMFORT',
      description:
        'Lightweight, bouncy, and wildly comfortable, JUTU shoes make any outing feel effortless. Slip in, lace up, or slide them on and enjoy the comfy support.',
    },
    {
      title: 'DESIGNED FOR EVERYDAY WEAR',
      description:
        'Easy-to-wear styles made for daily routines, weekend plans, travel, and everything in between.',
    },
    {
      title: 'PREMIUM QUALITY & DURABILITY',
      description:
        'Engineered with high-grade breathable uppers, reinforced stitching, and anti-slip outsoles designed to last through every daily step and long walk.',
    },
  ];

  return (
    <section className="w-full px-3 sm:px-4 md:px-5 py-5 sm:py-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {props.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-stone-200/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-start shadow-xs hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-stone-900 mb-2.5">
              {item.title}
            </h3>
            <p className="text-xs sm:text-[13px] leading-relaxed text-stone-600 font-normal">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
