interface BarChartProps {
  data: Array<{ label: string; value: number; percentage?: number }>;
  title: string;
  showPercentage?: boolean;
  maxBars?: number;
}

export default function BarChart({ 
  data, 
  title, 
  showPercentage = false, 
  maxBars = 10 
}: BarChartProps) {
  // Limitar e ordenar dados
  const sortedData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, maxBars);

  const maxValue = Math.max(...sortedData.map(item => item.value));

  if (sortedData.length === 0) {
    return (
      <div className="bg-background rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center text-muted-foreground py-8">
          Nenhum dado disponível
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {sortedData.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium truncate">{item.label}</span>
              <span className="text-muted-foreground">
                {item.value} {showPercentage && item.percentage ? `(${item.percentage}%)` : ''}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-foreground h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}