import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface InvestmentChartProps {
  symbol: string;
  isPositive?: boolean;
}

// Generate mock historical data for the investment
function generateMockData(symbol: string) {
  const baseValue = Math.random() * 100 + 50;
  const volatility = symbol === "BTC" || symbol === "ETH" ? 0.08 : 0.03;
  
  const data = [];
  let value = baseValue;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * volatility * value;
    value = Math.max(value + change, baseValue * 0.7);
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  return data;
}

export function InvestmentChart({ symbol, isPositive = true }: InvestmentChartProps) {
  const data = generateMockData(symbol);
  const color = isPositive ? "hsl(var(--finance))" : "hsl(var(--destructive))";

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip 
            contentStyle={{ 
              background: "hsl(var(--background))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${symbol})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
