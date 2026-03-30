"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, PlusCircle, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Jobs", href: "/jobs" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-dark-900/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg shadow-neon-blue/5"
            >
                <div className="container mx-auto px-4 flex justify-between items-center">

                    {/* 1. Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(0,247,255,0.5)] group-hover:scale-110 transition-transform">
                            J
                        </div>
                        <span className="text-xl md:text-2xl font-heading font-bold text-white tracking-wide">
                            Job<span className="text-neon-blue group-hover:text-neon-purple transition-colors">Gazette</span>
                        </span>
                    </Link>

                    {/* 2. Desktop Navigation (Center) */}
                    <div className="hidden md:flex items-center  rounded-full px-2 py-1.5 backdrop-blur-md">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive ? "text-neon-blue" : "text-gray-400 hover:text-white"}`}>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* 3. Auth Section (Right) */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            // Logged In State
                            <div className="flex items-center gap-4">

                                {/* 'Post a Job' Button - කෙලින්ම එලියට ගත්තා */}
                                <Link
                                    href="/admin/post-job"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/30 hover:border-neon-blue text-neon-blue rounded-full text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(0,247,255,0.3)] hover:scale-105 active:scale-95"
                                >
                                    <PlusCircle size={16} />
                                    <span>Post Job</span>
                                </Link>

                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-white/10 bg-dark-800 hover:bg-dark-700 transition-all group"
                                    >
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white pl-2">
                                            {session.user?.name?.split(" ")[0]}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                            {session.user?.name?.[0]?.toUpperCase()}
                                        </div>

                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-56 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5"
                                            >
                                                <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                                                    <p className="text-xs text-neon-blue font-bold uppercase tracking-wider mb-1">Account</p>
                                                    <p className="text-sm font-medium text-white truncate">{session.user?.email}</p>
                                                </div>

                                                <div className="p-2">
                                                    <Link
                                                        href="/admin/post-job"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex lg:hidden items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl hover:text-neon-blue transition-colors"
                                                    >
                                                        <PlusCircle size={16} /> Post New Job
                                                    </Link>

                                                    <button
                                                        onClick={() => signOut({ callbackUrl: "/" })}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl hover:text-red-300 transition-colors text-left mt-1"
                                                    >
                                                        <LogOut size={16} /> Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            // Guest State
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="group relative px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                    <span className="relative z-10">Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-[70px] z-40 bg-dark-900/95 backdrop-blur-xl border-b border-white/10 md:hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium py-2 border-b border-white/5 ${pathname === link.href ? "text-neon-blue" : "text-gray-400"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {session ? (
                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white">
                                            {session.user?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{session.user?.name}</p>
                                            <p className="text-xs text-gray-400">{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/admin/post-job"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-neon-blue/10 text-neon-blue rounded-xl font-bold border border-neon-blue/20"
                                    >
                                        <PlusCircle size={18} /> Post a Job
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center justify-center gap-2 w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link href="/login" className="flex justify-center py-3 rounded-xl bg-white/5 text-white font-bold">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="flex justify-center py-3 rounded-xl bg-neon-blue text-black font-bold shadow-lg shadow-neon-blue/20">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}