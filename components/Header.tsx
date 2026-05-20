"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const isControlTower = pathname.startsWith("/control-tower");

  const displayName = session?.user?.name?.split(" ")[0] ?? "User";

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">/</span>}
            <span className={i === breadcrumbs.length - 1 ? "text-gray-800 font-medium" : "text-gray-500"}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {!isControlTower && (
          <a
            href="https://docs.google.com/document/d/1fonj6rmlOqbSDfe3w28Eq26lIM96uJDWrWmeSQ4DdnE/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            FRF
          </a>
        )}
        {isControlTower && (
          <a
            href="https://docs.google.com/document/d/1u5YZL3ARhbqQ4XHweymz8uFctdf1Qy0Fq5uMmPwcbys/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            BRD
          </a>
        )}
        <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
          Show Key
        </button>

        <button className="text-gray-500 hover:text-gray-700 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <button className="text-gray-500 hover:text-gray-700 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded px-2 py-1"
          >
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
              {session?.user?.image ? (
                <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full" />
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">{session?.user?.email?.split("@")[0] ?? displayName}</span>
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-36">
              <div className="px-4 py-2 text-xs text-gray-500 border-b">{session?.user?.email}</div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
