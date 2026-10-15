import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sliders, Clock, Award, ShieldAlert } from 'lucide-react';

interface AiInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  badgeColor: string;
}

interface AiInsightsListProps {
  insights?: AiInsight[];
}

const DEFAULT_INSIGHTS: AiInsight[] = [
  {
    id: '1',
    category: 'Resource Optimization',
    title: 'Resource Optimization',
    description: '2 projects are over-resourced. Consider reallocating team members.',
    badgeColor: 'teal',
  },
  {
    id: '2',
    category: 'Potential Delay',
    title: 'Potential Delay',
    description: 'Marketing Automation may face delay due to resource constraints.',
    badgeColor: 'amber',
  },
  {
    id: '3',
    category: 'High Performer',
    title: 'High Performer',
    description: "John Doe's productivity is 40% above team average.",
    badgeColor: 'green',
  },
  {
    id: '4',
    category: 'Skill Gap',
    title: 'Skill Gap',
    description: 'Consider upskilling team in AI/ML for upcoming projects.',
    badgeColor: 'purple',
  },
];

export const AiInsightsList: React.FC<AiInsightsListProps> = ({ insights = DEFAULT_INSIGHTS }) => {
  const navigate = useNavigate();

  const getIconAndBg = (category: string) => {
    switch (category) {
      case 'Resource Optimization':
        return { icon: Sliders, bg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' };
      case 'Potential Delay':
        return { icon: Clock, bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
      case 'High Performer':
        return { icon: Award, bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' };
      case 'Skill Gap':
      default:
        return { icon: ShieldAlert, bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/30' };
    }
  };

  const handleInsightClick = (insight: AiInsight) => {
    if (insight.category === 'Skill Gap') {
      navigate('/skills-training');
    } else if (insight.category === 'Potential Delay' || insight.category === 'Resource Optimization') {
      navigate('/workload');
    } else {
      navigate('/insights');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-700" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-base font-bold text-white tracking-wide">AI Insights & Recommendations</h3>
        <Link
          to="/insights"
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-between relative z-10">
        {insights.map((insight) => {
          const { icon: Icon, bg } = getIconAndBg(insight.category);
          return (
            <div
              key={insight.id}
              onClick={() => handleInsightClick(insight)}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} flex-shrink-0 mt-0.5 shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {insight.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
