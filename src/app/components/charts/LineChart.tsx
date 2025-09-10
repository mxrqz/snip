interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  height?: number;
}

export default function LineChart({ 
  data, 
  title,
  height = 200 
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-background rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center text-muted-foreground py-8">
          Nenhum dado disponível
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-background rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            points={points}
            className="transition-all duration-300"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--foreground))"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-center">
              {item.label}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
}