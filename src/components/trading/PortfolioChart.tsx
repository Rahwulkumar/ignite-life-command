import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { date: "Dec 1", value: 10000 },
  { date: "Dec 5", value: 10250 },
  { date: "Dec 10", value: 10100 },
  { date: "Dec 15", value: 10800 },
  { date: "Dec 20", value: 11200 },
  { date: "Dec 25", value: 11050 },
  { date: "Dec 30", value: 12450 },
];

export function PortfolioChart() {
  const startValue = mockData[0].value;
  const endValue = mockData[mockData.length - 1].value;
  const change = ((endValue - startValue) / startValue * 100).toFixed(1);
  const isPositive = endValue > startValue;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Portfolio Performance</h2>
        <span className={`text-sm font-medium ${isPositive ? "text-finance" : "text-destructive"}`}>
          {isPositive ? "+" : ""}{change}% this month
        </span>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--finance))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--finance))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              hide 
              domain={["dataMin - 500", "dataMax + 500"]} 
            />
            <Tooltip 
              contentStyle={{ 
                background: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--finance))"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
