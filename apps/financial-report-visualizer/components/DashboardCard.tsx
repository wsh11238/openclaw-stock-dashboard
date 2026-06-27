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
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div ref={cardRef} className="min-w-0 bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            className="group text-left"
            title={isExpanded ? '隐藏图表' : '显示图表'}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors">
              {title}
            </h3>
          </button>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-slate-400 hover:text-cyan-700 transition-colors p-2 rounded-full hover:bg-cyan-50"
          title="下载图表截图"
        >
          <Download size={20} />
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Fixed height for chart container to prevent overflow and ensure Recharts renders correctly */}
          <div className="w-full h-[300px] sm:h-[320px] mb-6 overflow-hidden pr-6 sm:pr-0">
            {children}
          </div>

          <div className="mt-auto bg-slate-50 p-4 rounded-lg border-l-4 border-cyan-600">
            <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
              <span className="bg-cyan-700 text-white text-xs px-2 py-0.5 rounded-full mr-2">小白解读</span>
              分析观点
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">
              {analysis}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCard;
