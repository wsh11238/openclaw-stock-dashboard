
import React, { useRef, useState } from 'react';
import { InvestorProfile, Holding } from '../types';
import { Download, ArrowUpRight, ArrowDownRight, Minus, Plus, Share2 } from 'lucide-react';

interface Props {
  data: InvestorProfile;
}

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'new': return <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">NEW</span>;
    case 'add': return <ArrowUpRight size={14} className="text-red-500" />;
    case 'reduce': return <ArrowDownRight size={14} className="text-green-500" />; // Chinese market convention: Green is down/sell
    case 'sold': return <span className="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold">SOLD</span>;
    default: return <Minus size={14} className="text-slate-300" />;
  }
};

const InvestorCard: React.FC<Props> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    setIsDownloading(true);
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `InvestTracker-${data.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
    setIsDownloading(false);
  };

  const newBuys = data.holdings.filter(h => h.activity === 'new');
  const topHoldings = data.holdings.filter(h => h.activity !== 'sold' && h.activity !== 'new').slice(0, 5);

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Capture Area */}
      <div ref={cardRef} className="bg-white p-5 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-4">
          <div className={`w-12 h-12 rounded-full ${data.avatar_color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {data.name.substring(0, 1)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">{data.name}</h3>
            <p className="text-xs text-slate-500">{data.firm}</p>
          </div>
          <div className="ml-auto text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {data.report_date}
          </div>
        </div>

        {/* Highlights: New Buys */}
        {newBuys.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">✨ 新进建仓 (New Buys)</h4>
            <div className="flex flex-wrap gap-2">
              {newBuys.map(h => (
                <div key={h.ticker} className="bg-red-50 border border-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                  <Plus size={12} strokeWidth={3} />
                  <span>{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Holdings Table */}
        <div className="mb-4 flex-grow">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🏆 核心持仓 (Top Holdings)</h4>
           <div className="space-y-2">
             {topHoldings.map((h, idx) => (
               <div key={h.ticker} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                 <div className="flex items-center gap-2">
                   <span className={`w-4 h-4 flex items-center justify-center rounded text-[10px] font-bold ${idx < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                     {idx + 1}
                   </span>
                   <span className="font-medium text-slate-700">{h.name}</span>
                   <span className="text-xs text-slate-400 scale-90">{h.ticker}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   {h.position_pct && <span className="text-xs text-slate-500 font-mono">{h.position_pct}%</span>}
                   <ActivityIcon type={h.activity} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Analysis Snippet */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-auto">
          <h4 className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
             💡 投资笔记
          </h4>
          <div className="text-xs text-slate-500 leading-relaxed line-clamp-4 prose prose-slate max-w-none">
             {/* Simple markdown render for summary */}
             {data.analysis_summary.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 2).join(' ')}...
          </div>
        </div>
        
        {/* Footer for Screenshot */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300">
           <span>数据来源: {data.source}</span>
           <span>Generated by SuperInvestorTracker</span>
        </div>
      </div>

      {/* Action Bar (Not captured) */}
      <div className="p-3 bg-white border-t border-slate-100 flex justify-end gap-2">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
        >
          {isDownloading ? '生成中...' : <><Download size={14} /> 保存图片</>}
        </button>
      </div>
    </div>
  );
};

export default InvestorCard;
