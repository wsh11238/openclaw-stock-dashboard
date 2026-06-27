
import React, { useRef } from 'react';
import { StockOverlap } from '../types';
import { Download, Users } from 'lucide-react';

interface Props {
  data: StockOverlap[];
}

const ConsensusCard: React.FC<Props> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    try {
      const canvas = await window.html2canvas(cardRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `InvestorConsensus.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white text-slate-500 shadow-sm border border-slate-200"
      >
        <Download size={16} />
      </button>

      <div ref={cardRef} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 p-2 rounded-lg">
            <Users className="text-yellow-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">大佬共同持仓</h3>
            <p className="text-indigo-200 text-xs">Smart Money 共识重合度分析</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(stock => (
            <div key={stock.ticker} className="bg-white/10 border border-white/5 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                   <div className="font-bold text-lg">{stock.name}</div>
                   <div className="text-xs text-indigo-300 font-mono">{stock.ticker}</div>
                </div>
                <div className="bg-yellow-500 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">
                  {stock.count} 位大佬持有
                </div>
              </div>
              
              <div className="space-y-2">
                {stock.holders.map((holder, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm border-t border-white/10 pt-1.5 first:border-0 first:pt-0">
                    <span className="text-slate-200 text-xs">{holder.investor_name}</span>
                    <div className="flex items-center gap-2">
                      {holder.activity === 'new' && <span className="text-[10px] bg-red-500 px-1 rounded text-white font-bold">新进</span>}
                      {holder.activity === 'add' && <span className="text-[10px] text-red-300">增持</span>}
                      {holder.activity === 'reduce' && <span className="text-[10px] text-green-300">减持</span>}
                      {holder.activity === 'unchanged' && <span className="text-[10px] text-slate-400">持有</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-xs text-indigo-300/50">
           数据基于当前展示的投资者持仓样本统计
        </div>
      </div>
    </div>
  );
};

export default ConsensusCard;
