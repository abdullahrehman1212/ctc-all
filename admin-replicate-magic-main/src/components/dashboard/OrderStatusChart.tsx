import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Draft", value: 0, color: "hsl(215, 16%, 75%)" },
  { name: "Pending", value: 0, color: "hsl(45, 93%, 47%)" },
  { name: "Approved", value: 0, color: "hsl(24, 95%, 53%)" },
  { name: "Received", value: 0, color: "hsl(142, 71%, 45%)" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export const OrderStatusChart = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Order Status</h3>
        <p className="text-muted-foreground text-sm">Current purchase orders</p>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{total}</span>
          <span className="text-muted-foreground text-sm">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
