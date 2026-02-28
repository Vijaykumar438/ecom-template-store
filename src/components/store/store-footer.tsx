"use client";

import { Phone, MapPin, Clock, Store } from "lucide-react";
import type { Tenant } from "@/types/database";

interface StoreFooterProps {
  tenant: Tenant;
}

export function StoreFooter({ tenant }: StoreFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {tenant.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={tenant.store_name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {tenant.store_name.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="font-bold text-gray-900">{tenant.store_name}</h3>
            </div>
            {tenant.description && (
              <p className="text-sm text-gray-500 mb-3 max-w-sm">
                {tenant.description}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
            <div className="space-y-2">
              {tenant.whatsapp_number && (
                <a
                  href={`https://wa.me/${tenant.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Phone className="h-4 w-4 text-green-500" />
                  {tenant.whatsapp_number}
                </a>
              )}
              {tenant.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{tenant.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              © {currentYear} {tenant.store_name}. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Powered by <span className="font-medium" style={{ color: "var(--primary)" }}>EcomStore</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
