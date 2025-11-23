import React, { useEffect, useRef } from 'react';

// IMPORTANT: Replace 'YOUR_PUBLISHER_ID' with your actual Google AdSense Publisher ID
// You can find this in your AdSense account under Account > Account information
const AD_CLIENT_ID = 'pub-9095388322048054';

interface AdSenseProps {
  slot?: string;
  style?: React.CSSProperties;
  format?: string;
  className?: string;
}

export const AdSense: React.FC<AdSenseProps> = ({ 
  slot = 'auto', 
  style = { display: 'block' },
  format = 'auto',
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Only load ads on web (AdSense handles responsive automatically)
    if (typeof window === 'undefined') return;

    // Load AdSense script if not already loaded
    if (!(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        // Push ad after script loads
        if (adRef.current && !isLoadedRef.current) {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            isLoadedRef.current = true;
          } catch (e) {
            console.error('AdSense error:', e);
          }
        }
      };
      document.head.appendChild(script);
    } else if (adRef.current && !isLoadedRef.current) {
      // Script already loaded, push ad immediately
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isLoadedRef.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={{ minHeight: '100px', width: '100%', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

