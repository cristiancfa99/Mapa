import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon, Sun, Bell, Shield, Download, LogOut,
  Crown, HelpCircle, ChevronRight, Ruler,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, iconBg, label, value, right, onClick, danger }) => (
  <div className="settings-row" onClick={onClick}>
    <div className="settings-row-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 15, color: danger ? 'var(--error)' : 'var(--text-1)', fontWeight: 500 }}>{label}</p>
      {value && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{value}</p>}
    </div>
    {right ?? <ChevronRight size={16} color="var(--text-3)" />}
  </div>
);

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="screen-full" style={{ background: 'var(--bg)' }}>
      <Header title="Configuración" showBack />

      <div style={{ padding: '16px 16px 32px' }}>
        {/* Profile mini card */}
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div className="flex items-center gap-12">
            <div className="avatar avatar-md" style={{ background: 'var(--primary-dim)', color: 'var(--primary)', fontWeight: 800 }}>
              {user?.name?.slice(0, 1) ?? 'A'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{user?.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{user?.email}</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>
              Editar
            </button>
          </div>
        </div>

        {/* Appearance */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
          Apariencia
        </p>
        <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
          <SettingsRow
            icon={isDark ? <Moon size={16} color="white" /> : <Sun size={16} color="#374151" />}
            iconBg={isDark ? '#374151' : '#FEF9C3'}
            label="Modo Oscuro"
            right={
              <label className="toggle" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                <span className="toggle-slider" />
              </label>
            }
          />
          <SettingsRow
            icon={<Ruler size={16} color="white" />}
            iconBg="#7C3AED"
            label="Unidades"
            value="Kilogramos / Centímetros"
          />
        </div>

        {/* Notifications */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
          Notificaciones
        </p>
        <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
          <SettingsRow
            icon={<Bell size={16} color="white" />}
            iconBg="#F97316"
            label="Recordatorios de Entrenamiento"
            value="07:00 AM"
            right={
              <label className="toggle" onClick={e => e.stopPropagation()}>
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            }
          />
          <SettingsRow
            icon={<Bell size={16} color="white" />}
            iconBg="#EF4444"
            label="Notificaciones de Comunidad"
            right={
              <label className="toggle" onClick={e => e.stopPropagation()}>
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            }
          />
        </div>

        {/* Premium */}
        {!user?.isPremium && (
          <>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Premium
            </p>
            <div
              className="card"
              style={{
                marginBottom: 20, overflow: 'hidden', cursor: 'pointer',
                background: 'linear-gradient(135deg, #F59E0B15, #EF444415)',
                border: '1px solid #F59E0B40',
              }}
            >
              <div style={{ padding: 16 }}>
                <div className="flex items-center gap-12" style={{ marginBottom: 12 }}>
                  <Crown size={24} color="#F59E0B" />
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700 }}>FitTrack Pro</p>
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Desbloquea todo el potencial</p>
                  </div>
                </div>
                {[
                  '✓ IA avanzada y planes personalizados',
                  '✓ Estadísticas ilimitadas',
                  '✓ Rutinas ilimitadas',
                  '✓ Sin publicidad',
                ].map(f => (
                  <p key={f} style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{f}</p>
                ))}
                <button className="btn btn-full" style={{
                  marginTop: 14,
                  background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                  color: 'white', padding: '12px', fontSize: 15, fontWeight: 700, borderRadius: 12,
                }}>
                  Comenzar Prueba Gratis
                </button>
              </div>
            </div>
          </>
        )}

        {/* Account */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
          Cuenta
        </p>
        <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
          <SettingsRow
            icon={<Shield size={16} color="white" />}
            iconBg="#10B981"
            label="Privacidad"
          />
          <SettingsRow
            icon={<Download size={16} color="white" />}
            iconBg="#3B82F6"
            label="Exportar mis datos"
            value="Descarga tus entrenamientos en JSON/CSV"
          />
          <SettingsRow
            icon={<HelpCircle size={16} color="white" />}
            iconBg="#8B5CF6"
            label="Ayuda y soporte"
          />
        </div>

        {/* Logout */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <SettingsRow
            icon={<LogOut size={16} color="var(--error)" />}
            iconBg="var(--error-dim)"
            label="Cerrar Sesión"
            danger
            onClick={handleLogout}
            right={null}
          />
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 24 }}>
          FitTrack Pro v1.0.0
        </p>
      </div>
    </div>
  );
};
