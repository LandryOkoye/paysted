"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Zap,
  Lock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  Wallet,
  BarChart3,
  Users,
  Menu,
  X,
  Fingerprint,
  Key,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

/* ────────────────────────────────────────────────────── */
/*  LANDING PAGE — PaySted                                */
/*  Inspired by the dark-mode fintech aesthetic           */
/* ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white overflow-x-hidden">
      {/* ═══════════════════════════  NAVBAR  ═══════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0e17]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/PayStepLogo-removebg.png"
                alt="PaySted"
                className="h-8 w-auto object-contain"
              />
              <span className="text-base font-bold tracking-tight text-white">
                Pay<span className="text-emerald-400">sted</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {["Features", "Pricing", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/[0.04]"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="group relative px-6 py-2.5 rounded-full bg-emerald-500 text-sm font-semibold text-black hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                Get Started
                <span className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.05] text-slate-400"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e17]/98 backdrop-blur-xl border-t border-white/[0.06] pb-6">
            <div className="px-6 py-4 space-y-1">
              {["Features", "Pricing", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-white/[0.04]"
                >
                  {item}
                </a>
              ))}
              <div className="pt-3">
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-6 py-3 rounded-full bg-emerald-500 text-sm font-semibold text-black"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════  HERO  ═══════════════════════════ */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                The Sovereign Layer
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
                The Sovereign
                <br />
                Layer for Your
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent">
                  Wealth.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-md leading-relaxed mb-10">
                Protect against inflation, automate your savings, and access
                global finance from Africa with institutional-grade crypto
                rails.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)]"
                >
                  Open Your Vault
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px]">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/10 rounded-3xl blur-2xl scale-110" />
                <img
                  src="/vault-hero.png"
                  alt="PaySted Digital Vault"
                  className="relative z-10 w-full rounded-3xl border border-white/[0.08] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════  TRUSTED BY (Logos Bar)  ═══════════════ */}
      <section className="py-12 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-[11px] text-slate-600 uppercase tracking-[0.25em] font-medium mb-8">
            Secured &amp; Powered by Industry Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-40">
            {["Busha", "Stellar", "Circle", "Flutterwave"].map((name) => (
              <span
                key={name}
                className="text-sm md:text-base font-bold tracking-widest text-slate-500 uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════  FEATURES SECTION  ═══════════════════ */}
      <section id="features" className="py-20 md:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Built for the Global Citizen.
              </h2>
              <p className="mt-4 text-slate-400 max-w-xl text-base leading-relaxed">
                Institutional tools designed to bridge the gap between local
                economies and global opportunities.
              </p>
            </div>
            <a
              href="#features"
              className="hidden md:inline-flex items-center gap-1 mt-4 md:mt-0 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Explore all Features <ChevronRight size={14} />
            </a>
          </div>

          {/* Feature cards — Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* ── Row 1 ─────────────────────────────────── */}

            {/* Card 1 — Inflation Protection (wide) */}
            <div className="md:col-span-7 group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 pb-6 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden min-h-[260px]">
              <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/[0.08] transition-all duration-500" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Floating icon */}
                <Shield size={28} className="text-emerald-400 mb-5" strokeWidth={1.5} />

                <h3 className="text-xl font-bold mb-2 tracking-tight">Inflation Protection</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
                  Store your wealth in stable assets like USDC and USDT. Hedge
                  against local currency volatility with a single tap.
                </p>

                {/* Inline chart graphic */}
                <div className="mt-auto pt-4 flex justify-end -mr-4 -mb-2">
                  <svg width="220" height="100" viewBox="0 0 220 100" fill="none" className="opacity-70">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                    <line x1="0" y1="40" x2="220" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                    <line x1="0" y1="60" x2="220" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                    <line x1="0" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                    {/* Vertical bars */}
                    {[10,30,50,70,90,110,130,150,170,190,210].map((x, i) => (
                      <rect key={i} x={x-3} y={100 - (30 + Math.sin(i*0.8)*15 + i*3)} width="6" rx="1" height={30 + Math.sin(i*0.8)*15 + i*3} fill="rgba(16,185,129,0.15)" />
                    ))}
                    {/* Trend line */}
                    <polyline
                      points="10,75 30,68 50,72 70,60 90,55 110,48 130,42 150,35 170,25 190,18 210,10"
                      fill="none"
                      stroke="url(#chartGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Glow under line */}
                    <polygon
                      points="10,75 30,68 50,72 70,60 90,55 110,48 130,42 150,35 170,25 190,18 210,10 210,100 10,100"
                      fill="url(#areaGrad)"
                    />
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="220" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06d6a0" />
                      </linearGradient>
                      <linearGradient id="areaGrad" x1="110" y1="10" x2="110" y2="100">
                        <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2 — Vault Rules (narrower, highlighted) */}
            <div className="md:col-span-5 group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden min-h-[260px]">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/[0.10] transition-all duration-500" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Floating icon */}
                <RefreshCcw size={28} className="text-emerald-400 mb-5" strokeWidth={1.5} />

                <h3 className="text-xl font-bold mb-2 tracking-tight">Vault Rules</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automate your financial destiny. Set recurring transfers,
                  dollar-cost averaging, and smart-split rules.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 mt-auto pt-6 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  Define Rules <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* ── Row 2 ─────────────────────────────────── */}

            {/* Card 3 — Instant Payouts (narrow) */}
            <div className="md:col-span-4 group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden min-h-[260px]">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/[0.08] transition-all duration-500" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Floating icon */}
                <Zap size={28} className="text-emerald-400 mb-5" strokeWidth={1.5} />

                <h3 className="text-xl font-bold mb-2 tracking-tight">Instant Payouts</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Convert global assets to local currency in seconds. Fast,
                  low-fee off-ramps to mobile money and bank accounts.
                </p>
              </div>
            </div>

            {/* Card 4 — Institutional Security (wide, with icon grid) */}
            <div className="md:col-span-8 group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden min-h-[260px]">
              <div className="absolute top-0 left-0 w-52 h-52 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/[0.06] transition-all duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full">
                {/* Left — text */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 tracking-tight">Institutional Security</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Multi-sig wallets, biometric authentication, and cold storage
                    protocols ensure your assets never leave your control.
                  </p>
                </div>

                {/* Right — 2×2 icon grid */}
                <div className="grid grid-cols-2 gap-3 self-center shrink-0">
                  {[
                    { icon: <Fingerprint size={20} strokeWidth={1.5} />, color: "emerald" },
                    { icon: <Lock size={20} strokeWidth={1.5} />, color: "emerald" },
                    { icon: <Key size={20} strokeWidth={1.5} />, color: "emerald" },
                    { icon: <ShieldCheck size={20} strokeWidth={1.5} />, color: "emerald" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl bg-[#0a0e17] border border-white/[0.04] flex items-center justify-center text-emerald-400 shadow-inner hover:border-emerald-500/20 transition-all duration-300"
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════  PRICING SECTION  ═══════════════════ */}
      <section id="pricing" className="py-20 md:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Institutional Grade for Everyone
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto text-base">
              Choose the tier that fits your wealth management needs. No hidden
              fees, just pure infrastructure.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 hover:border-white/[0.12] transition-all duration-300">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Starter
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-slate-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Basic Vault Access",
                  "Up to 3 Vault Rules",
                  "Standard Support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center py-3 rounded-full border border-white/[0.12] text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white transition-all"
              >
                Start Free
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-emerald-500/[0.08] to-[#111827] border border-emerald-500/30 p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:shadow-[0_0_60px_rgba(16,185,129,0.12)] transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-black uppercase tracking-wider">
                Popular
              </div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Pro
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">$10</span>
                <span className="text-slate-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited Vault Rules",
                  "Lower Conversion Fees",
                  "Priority Support",
                  "Early Access to Futures",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-200"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center py-3 rounded-full bg-emerald-500 text-sm font-bold text-black hover:bg-emerald-400 transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)]"
              >
                Go Pro Now
              </Link>
            </div>

            {/* Enterprise */}
            <div className="group relative rounded-2xl bg-[#111827] border border-white/[0.06] p-8 hover:border-white/[0.12] transition-all duration-300">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Enterprise
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Dedicated Account Manager",
                  "Custom Security Policies",
                  "API Access for Treasury",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block w-full text-center py-3 rounded-full border border-white/[0.12] text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white transition-all"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════  CTA SECTION  ═══════════════════ */}
      <section className="py-20 md:py-32 px-6 lg:px-8 relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Ready to build your borderless future?
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Join thousands of individuals and businesses securing their legacy
            on the sovereign layer.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.55)]"
            >
              Open Your Vault
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[12, 33, 47, 55].map((id) => (
                <img
                  key={id}
                  src={`https://i.pravatar.cc/80?img=${id}`}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-[#0a0e17] object-cover"
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Joined by{" "}
              <span className="text-slate-300 font-semibold">10,000+</span>{" "}
              others
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════  FOOTER  ═══════════════════ */}
      <footer id="about" className="border-t border-white/[0.06] py-12 md:py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/PayStepLogo-removebg.png"
                  alt="PaySted"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-sm font-bold tracking-tight text-white">
                  Pay<span className="text-emerald-400">sted</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                The world&apos;s first crypto digital vault
                &amp; payroll platform for the next generation of workers.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {["Vault", "Payouts", "Invoices", "Rules Engine"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {["Terms of Service", "Privacy Policy", "Security"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Connect
              </h4>
              <ul className="space-y-2.5">
                {["Twitter / X", "Discord", "GitHub"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} PaySted. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Globe size={12} />
              <span>Lagos, Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
