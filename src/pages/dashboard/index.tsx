// pages/dashboard/index.js
import { withRoleProtection } from '../../utils/auth';
import React from 'react';

export default function Dashboard() {
  return (
    <>
      <h1>Hola</h1>
      <p>Bienvenido al Dashboard</p>
    </>
  );
}
export const getServerSideProps = withRoleProtection(['ti']);


