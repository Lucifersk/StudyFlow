interface ChartBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: 'primary' | 'secondary' | 'pink' | 'yellow';
}

export const ChartBar = ({ label, value, maxValue, color = 'primary' }: ChartBarProps) => {
  const percentage = (value / maxValue) * 100;
  
  const colorClasses = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-accent',
    pink: 'bg-accent-pink',
    yellow: 'bg-accent-yellow',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}h</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
