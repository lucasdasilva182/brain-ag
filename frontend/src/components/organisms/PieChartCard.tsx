import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardTitle } from '../atoms/Card';

const CORES = ['#3FBE73', '#FFFFFF', '#6FDB9A', '#2C8F55', '#9A9A93', '#1F5C38'];

interface PieChartCardProps {
  titulo: string;
  dados: { label: string; value: number }[];
}

export function PieChartCard({ titulo, dados }: PieChartCardProps) {
  const semDados = dados.length === 0 || dados.every((d) => d.value === 0);

  return (
    <Card>
      <CardTitle>{titulo}</CardTitle>
      {semDados ? (
        <p style={{ color: '#9A9A93', fontSize: 14 }}>
          Ainda não há dados suficientes para exibir este gráfico.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={dados}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry: { name?: string }) => entry.name}
            >
              {dados.map((entrada, index) => (
                <Cell key={entrada.label} fill={CORES[index % CORES.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ color: '#F3F3F0', fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
