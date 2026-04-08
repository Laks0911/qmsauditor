import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  BugOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
  // Remove both access and refresh tokens
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  
  // Clear any pending axios requests
  window.location.href = '/login';  // Hard redirect, not navigate()
};



  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'audits',
      icon: <FileTextOutlined />,
      label: <Link to="/audits">Audits</Link>,
    },
    {
      key: 'findings',
      icon: <BugOutlined />,
      label: <Link to="/findings">Findings</Link>,
    },
    {
      key: 'reports',
      icon: <FileOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={200}
      style={{ background: '#001529' }}
    >
      <div style={{ color: 'white', padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
        {!collapsed && 'QMSAuditor'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
