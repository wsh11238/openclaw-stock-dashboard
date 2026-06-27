import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  analysis: string;
  companyName: string;
}

// Declare global types for window to access html2canvas
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, children, analysis, companyName }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    
    setIsDownloading(true);
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `${companyName}-${title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
      alert('截图下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={cardRef} className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
          title="下载图表截图"
        >
          <Download size={20} />
        </button>
      </div>
      
      {/* Fixed height for chart container to prevent overflow and ensure Recharts renders correctly */}
      <div className="w-full h-[320px] mb-6">
        {children}
      </div>

      <div className="mt-auto bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">小白解读</span>
          分析观点
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed text-justify">
          {analysis}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;