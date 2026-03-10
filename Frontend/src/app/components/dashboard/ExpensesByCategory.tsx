import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Alimentação', value: 33.1, color: '#3B82F6' },
  { name: 'Transporte', value: 11.7, color: '#6EE7B7' },
  { name: 'Lazer', value: 14.4, color: '#10B981' },
  { name: 'Contas', value: 14.3, color: '#EF4444' },
  { name: 'Outros', value: 9.2, color: '#6B7280' },
];

export function ExpensesByCategory() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Despesas por Categoria</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value, entry: any) => `${value} - ${entry.payload.value}%`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
