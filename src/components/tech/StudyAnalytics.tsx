import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Clock, TrendingUp, Calendar } from "lucide-react";

interface StudySession {
  category: string;
  duration: number;
  date: string;
}

const mockWeeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 1 },
  { day: "Sat", hours: 4 },
  { day: "Sun", hours: 2.5 },
];

const mockCategoryData = [
  { name: "DSA", hours: 8, color: "hsl(var(--tech))" },
  { name: "System Design", hours: 4, color: "hsl(var(--trading))" },
  { name: "Frontend", hours: 3, color: "hsl(var(--finance))" },
  { name: "AI/ML", hours: 2, color: "hsl(var(--spiritual))" },
];

export function StudyAnalytics() {
  const totalHours = useMemo(() => 
    mockWeeklyData.reduce((sum, d) => sum + d.hours, 0), 
    []
  );

  const avgPerDay = (totalHours / 7).toFixed(1);
  const bestDay = mockWeeklyData.reduce((best, d) => d.hours > best.hours ? d : best);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-tech" />
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>
          <p className="text-2xl font-semibold">{totalHours}h</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-finance" />
            <span className="text-xs text-muted-foreground">Daily Avg</span>
          </div>
          <p className="text-2xl font-semibold">{avgPerDay}h</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-trading" />
            <span className="text-xs text-muted-foreground">Best Day</span>
          </div>
          <p className="text-2xl font-semibold">{bestDay.day}</p>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="p-4 rounded-xl border border-border/50 bg-card">
        <h3 className="text-sm font-medium mb-4">Weekly Study Hours</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWeeklyData} barCategoryGap="20%">
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                hide 
                domain={[0, 'dataMax + 1']}
              />
              <Bar 
                dataKey="hours" 
                radius={[4, 4, 0, 0]}
                fill="hsl(var(--tech))"
              >
                {mockWeeklyData.map((entry, index) => (
                  <Cell 
                    key={index}
                    fill={entry.day === bestDay.day ? "hsl(var(--tech))" : "hsl(var(--muted))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="p-4 rounded-xl border border-border/50 bg-card">
        <h3 className="text-sm font-medium mb-4">Time by Category</h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  dataKey="hours"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {mockCategoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm">{cat.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{cat.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
