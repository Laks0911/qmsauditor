import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, AlertOutlined, ClockCircleOutlined } from '@ant-design/icons';

const StatsCards = ({ audits = [], findings = [] }) => {
  // Ensure audits and findings are always arrays
  const auditArray = Array.isArray(audits) ? audits : (audits.results || []);
  const findingArray = Array.isArray(findings) ? findings : (findings.results || []);

  // Calculate stats safely
  const totalAudits = auditArray.length;
  const completedAudits = auditArray.filter(
    (audit) => audit.status === 'completed'
  ).length;
  const pendingAudits = auditArray.filter(
    (audit) => audit.status === 'pending'
  ).length;
  const totalFindings = findingArray.length;

  const cards = [
    {
      title: 'Total Audits',
      value: totalAudits,
      icon: <ClockCircleOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Completed',
      value: completedAudits,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Pending',
      value: pendingAudits,
      icon: <AlertOutlined />,
      color: '#faad14',
    },
    {
      title: 'Total Findings',
      value: totalFindings,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
    },
  ];

  return (
    <Row gutter={16}>
      {cards.map((card, i) => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <Card>
            <Statistic
              title={card.title}
              value={card.value}
              prefix={card.icon}
              valueStyle={{ color: card.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
