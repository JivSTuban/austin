import { useEffect } from 'react';

const Maps = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Maps Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Area Map
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the neighborhoods and areas where I provide real estate services
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/d/u/0/embed?mid=1A0dmA2i1Ptobe10tRuicZAba8bUN97I&ehbc=2E312F&noprof=1" 
                width="100%" 
                height="780px"
                title="Service Areas Map"
                className="border-0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-grow"></div>
     
    </div>
  );
};

export default Maps;
