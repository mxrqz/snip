interface PieChartProps {
  data: Array<{ label: string; value: number; percentage?: number }>;
  title: string;
  size?: number;
}

export default function PieChart({ 
  data, 
  title,
  size = 200 
}: PieChartProps) {
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

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const colors = [
    'hsl(var(--foreground))',
    'hsl(var(--muted-foreground))',
    'hsl(var(--border))',
    'hsl(var(--accent))',
    'hsl(var(--secondary))',
  ];

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-background rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg 
            className="w-full h-full" 
            viewBox="0 0 100 100"
          >
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const path = createPath(percentage, currentAngle);
              const angle = currentAngle;
              currentAngle += (percentage / 100) * 360;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="w-full space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}