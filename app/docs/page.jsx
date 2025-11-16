"use client";

import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">API Documentation</h1>
          <p className="text-sm mt-1">Documenté à partir de  <code>/openapi.json</code></p>
        </div>
      </header>
      <main className="p-6 container mx-auto">
        <SwaggerUI url="/openapi.json" />
      </main>
    </div>
  );
}
