import React from "react";

const LoginRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  h-full">
      <div className="text-center space-y-8 h-fit ">{children}</div>
    </main>
  );
};

export default LoginRoot;
