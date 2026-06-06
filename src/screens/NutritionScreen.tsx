import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockNutrition } from '../data/mockData';

const MACRO_COLORS = {
  protein: '#3B82F6', carbs: '#F59E0B', fat: '#EF4444',
};

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎',
};
const MEAL_NAMES: Record<string, string> = {
  breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena', snack: 'Snack',
};

const weeklyCalories = [
  { day: 'Lun', cal: 2650 }, { day: 'Mar', cal: 2720 },
  { day: 'Mié', cal: 2480 }, { day: 'Jue', cal: 2810 },
  { day: 'Vie', cal: 2590 }, { day: 'Sáb', cal: 3100 },
  { day: 'Dom', cal: 2340 },
];

const MacroRing: React.FC<{ label: string; value: number; goal: number; color: string }> = ({
  label, value, goal, color,
}) => {
  const pct = Math.min((value / goal) * 100, 100);
  const r = 30; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="38" cy="38" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 38 38)"
        />
        <text x="38" y="38" textAnchor="middle" dominantBaseline="central" fill="var(--text-1)" fontSize="13" fontWeight="700">
          {Math.round(pct)}%
        </text>
      </svg>
      <p style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{value}g / {goal}g</p>
    </div>
  );
};

export const NutritionScreen: React.FC = () => {
  const { totals, goals, meals } = mockNutrition;
  const [expandedMeal, setExpandedMeal] = useState<string | null>('m1');
  const calPct = Math.round((totals.calories / goals.calories) * 100);

  return (
    <div className="screen anim-fade">
      <div style={{ padding: '20px 16px 16px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 24 }}>Nutrición</h2>
          <button className="btn btn-primary btn-sm">
            <Plus size={16} /> Añadir
          </button>
        </div>

        {/* Calorie Ring */}
        <div className="gradient-card-3" style={{ marginBottom: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>Calorías de Hoy</p>
              <div className="flex items-end gap-8">
                <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>{totals.calories}</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>/ {goals.calories}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
                {goals.calories - totals.calories} kcal restantes
              </p>
            </div>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="28" fill="none"
                stroke="white" strokeWidth="6"
                strokeDasharray={`${(calPct / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
              <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="800">
                {calPct}%
              </text>
            </svg>
          </div>
        </div>

        {/* Macros */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h4 style={{ marginBottom: 16 }}>Macronutrientes</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, justifyItems: 'center' }}>
            <MacroRing label="Proteína" value={totals.protein} goal={goals.protein} color={MACRO_COLORS.protein} />
            <MacroRing label="Carbos" value={totals.carbs} goal={goals.carbs} color={MACRO_COLORS.carbs} />
            <MacroRing label="Grasa" value={totals.fat} goal={goals.fat} color={MACRO_COLORS.fat} />
          </div>
        </div>

        {/* Weekly calories chart */}
        <div className="card" style={{ padding: '16px 8px', marginBottom: 16 }}>
          <h4 style={{ padding: '0 8px', marginBottom: 12 }}>Calorías esta semana</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={weeklyCalories}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[2000, 3200]} tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-3)', fontSize: 12 }}
                itemStyle={{ color: 'var(--text-1)', fontWeight: 700 }}
              />
              <Line type="monotone" dataKey="cal" stroke="var(--success)" strokeWidth={2.5}
                dot={{ fill: 'var(--success)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Meals */}
        <h4 style={{ marginBottom: 12 }}>Comidas de Hoy</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {meals.map(meal => {
            const mealCals = meal.foods.reduce((a, f) => a + f.calories, 0);
            const mealProt = meal.foods.reduce((a, f) => a + f.protein, 0);
            const isExpanded = expandedMeal === meal.id;
            return (
              <div key={meal.id} className="card">
                <div
                  className="flex items-center justify-between"
                  style={{ padding: '14px 16px', cursor: 'pointer' }}
                  onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                >
                  <div className="flex items-center gap-12">
                    <span style={{ fontSize: 22 }}>{MEAL_ICONS[meal.type]}</span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{MEAL_NAMES[meal.type]}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        {mealCals} kcal · {mealProt}g proteína · {meal.time}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-3)" /> : <ChevronDown size={18} color="var(--text-3)" />}
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                    {meal.foods.map((food, i) => (
                      <div key={food.id} style={{ padding: '10px 0', borderBottom: i < meal.foods.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div className="flex items-center justify-between">
                          <p style={{ fontSize: 14, fontWeight: 500 }}>{food.name}</p>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{food.calories} kcal</p>
                        </div>
                        <div className="flex gap-12" style={{ marginTop: 4 }}>
                          <span style={{ fontSize: 12, color: MACRO_COLORS.protein }}>P: {food.protein}g</span>
                          <span style={{ fontSize: 12, color: MACRO_COLORS.carbs }}>C: {food.carbs}g</span>
                          <span style={{ fontSize: 12, color: MACRO_COLORS.fat }}>G: {food.fat}g</span>
                          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{food.serving}g</span>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 10 }}>
                      <Plus size={14} /> Añadir alimento
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
