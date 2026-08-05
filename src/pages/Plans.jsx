import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bot, CalendarClock, Car, CheckCircle, Crown, FileText, Lock, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PLANS, getSubscriptionAccess, getTenantAiUsage } from '../services/commercialService';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '22px'
};

const Plans = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const access = getSubscriptionAccess(currentUser);
  const { clientes, agendamentos } = useData();
  const [aiUsage, setAiUsage] = useState({ limit: access.plan.limits.aiCredits || 0, remaining: access.plan.limits.aiCredits || 0, used: 0 });

  useEffect(() => {
    getTenantAiUsage(currentUser?.tenantId, currentUser?.planId).then(setAiUsage).catch(() => undefined);
  }, [currentUser?.tenantId, currentUser?.planId]);

  const monthlyAppointments = useMemo(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    return agendamentos.filter((item) => {
      if (!item?.dataStr) return false;
      const [, itemMonth, itemYear] = item.dataStr.split('/');
      return itemMonth === month && itemYear === year;
    }).length;
  }, [agendamentos]);

  const monthlyServiceOrders = useMemo(() => {
    const monthKey = new Date().toISOString().slice(0, 7);
    return agendamentos.filter((item) => {
      if (!item?.osGeneratedAt) return false;
      const parsed = new Date(item.osGeneratedAt);
      if (Number.isNaN(parsed.getTime())) return false;
      return parsed.toISOString().slice(0, 7) === monthKey;
    }).length;
  }, [agendamentos]);

  const usageCards = [
    {
      icon: Car,
      label: 'Clientes/veiculos',
      used: clientes.length,
      limit: access.plan.limits.vehicles
    },
    {
      icon: CalendarClock,
      label: 'Agendamentos do mes',
      used: monthlyAppointments,
      limit: access.plan.limits.appointments
    },
    {
      icon: FileText,
      label: 'Ordens de servico',
      used: monthlyServiceOrders,
      limit: access.plan.limits.serviceOrders
    },
    {
      icon: Bot,
      label: 'Creditos IA',
      used: aiUsage.used || 0,
      limit: aiUsage.limit ?? access.plan.limits.aiCredits
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Planos e Assinatura</h1>
          <p style={{ color: '#aaa', marginTop: 4 }}>Controle comercial, limites do plano e status da empresa.</p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Plano atual</p>
            <h2 style={{ margin: '6px 0 0', fontSize: 26 }}>{access.plan.label}</h2>
            <p style={{ color: '#aaa', margin: '6px 0 0' }}>{currentUser?.companyName || 'Empresa'} · {access.plan.monthlyPrice}/mes</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, background: access.blocked ? 'rgba(239,68,68,.15)' : 'rgba(34,197,94,.12)', color: access.blocked ? '#fca5a5' : '#86efac', fontWeight: 800 }}>
              {access.blocked ? <Lock size={16} /> : <CheckCircle size={16} />}
              {access.status}
            </span>
            {currentUser?.nextBillingDate ? <p style={{ color: '#aaa', margin: '8px 0 0' }}>Proxima cobranca: {currentUser.nextBillingDate}</p> : null}
          </div>
        </div>

        {access.warning ? (
          <div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: 'rgba(245,158,11,.12)', color: '#fde68a', display: 'flex', gap: 10 }}>
            <AlertTriangle size={18} />
            Pagamento vencido ha {access.pastDueDays} dia(s). O bloqueio automatico ocorre apos 5 dias corridos.
          </div>
        ) : null}
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Consumo do plano</h2>
            <p style={{ color: '#aaa', margin: '6px 0 0' }}>Acompanhe limites comerciais antes de precisar ampliar o plano.</p>
          </div>
          <span style={{ color: '#aaa', fontSize: 13 }}>Referência: mês atual</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {usageCards.map((item) => <UsageCard key={item.label} {...item} />)}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {Object.entries(PLANS).map(([id, plan]) => {
          const active = currentUser?.planId === id;
          const featured = plan.recommended;

          return (
          <article key={id} style={{
            ...cardStyle,
            position: 'relative',
            borderColor: active || featured ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
            background: featured ? 'linear-gradient(180deg, rgba(var(--primary-rgb),0.14), rgba(255,255,255,0.03))' : cardStyle.background,
            boxShadow: featured ? '0 18px 45px rgba(0,0,0,0.22)' : 'none'
          }}>
            {featured ? (
              <span style={{ position: 'absolute', top: 14, right: 14, padding: '6px 10px', borderRadius: 999, background: 'var(--primary-color)', color: '#111827', fontSize: 11, fontWeight: 900 }}>
                Mais vendido
              </span>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 22, paddingRight: featured ? 92 : 0 }}>{plan.label}</h3>
              {id === 'premium' ? <Crown color="#facc15" size={22} /> : <Users color="var(--primary-color)" size={22} />}
            </div>
            <strong style={{ display: 'block', fontSize: 26, marginTop: 12 }}>{plan.monthlyPrice}</strong>
            {featured ? <p style={{ color: '#d9f99d', margin: '8px 0 0', fontSize: 13 }}>Plano recomendado para a maioria das esteticas automotivas.</p> : null}
            <div style={{ marginTop: 16, display: 'grid', gap: 8, color: '#ccc', fontSize: 14 }}>
              <span>Usuarios: {plan.limits.users}</span>
              <span>Clientes/veiculos: {plan.limits.vehicles}</span>
              <span>Agendamentos/mes: {plan.limits.appointments}</span>
              <span>Ordens de servico/mes: {plan.limits.serviceOrders}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bot size={15} /> IA: {plan.limits.aiCredits} creditos/mes</span>
            </div>
            <div style={{ marginTop: 18, display: 'grid', gap: 9 }}>
              {plan.features.map((feature) => (
                <span key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ddd', fontSize: 14 }}>
                  <CheckCircle size={15} color="#86efac" /> {feature}
                </span>
              ))}
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
};

const UsageCard = ({ icon: Icon, label, used, limit }) => {
  const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const tone = percent >= 100 ? '#ef4444' : percent >= 80 ? '#f59e0b' : 'var(--primary-color)';
  const status = limit <= 0 ? 'Nao incluido neste plano' : percent >= 100 ? 'Limite atingido' : percent >= 80 ? 'Perto do limite' : 'Dentro do limite';

  return (
    <article style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'rgba(var(--primary-rgb), 0.14)', color: 'var(--primary-color)' }}>
            <Icon size={19} />
          </span>
          <strong>{label}</strong>
        </div>
        <span style={{ color: tone, fontWeight: 800, fontSize: 12 }}>{status}</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <strong style={{ fontSize: 28 }}>{used}</strong>
        <span style={{ color: '#aaa' }}>/ {limit}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginTop: 12 }}>
        <div style={{ width: `${percent}%`, height: '100%', background: tone }} />
      </div>
    </article>
  );
};

export default Plans;
