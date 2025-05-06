
import React from 'react'; 

export default function AppGroupLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}