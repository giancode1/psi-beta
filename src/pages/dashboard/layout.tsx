// components/DashboardLayout.js
import React, { useState } from "react";
import { Karla } from "next/font/google";
import styles from "../../styles/layout.module.css";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Sidebar from "../../components/layout/Sidebar";

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-karla",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={`h-full min-h-screen ${karla.className}`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <Header />
          <PageWrapper children={children} />
        </div>
      </div>
    </>
  );
}
