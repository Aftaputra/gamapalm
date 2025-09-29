"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, ArrowRight, CheckCircle, BarChart, Users, MessageSquare, Shield } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const newsSlides = [
  {
    image: "https://images.unsplash.com/photo-1708738793054-32b71e3fc822?q=80&w=1440&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Satellite Monitoring Kurangi Waktu Inspeksi Lapangan hingga 70%",
    description: "Implementasi teknologi pemantauan satelit dalam sistem inspeksi ISPO berhasil memangkas waktu verifikasi lapangan secara signifikan. Inovasi ini memungkinkan identifikasi area prioritas inspeksi secara real-time, mengoptimalkan alokasi sumber daya dan mempercepat proses sertifikasi berkelanjutan..",
  },
  {
    image: "https://images.unsplash.com/photo-1610925877801-8e3b91ddda41?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "500+ Perusahaan Sudah Memulai Proses Sertifikasi ISPO 2024",
    description: "Tercatat lebih dari 500 perusahaan perkebunan kelapa sawit telah mengajukan sertifikasi ISPO sepanjang tahun 2024, mencerminkan peningkatan kesadaran industri terhadap praktik berkelanjutan. Gelombang partisipasi ini memperkuat komitmen Indonesia dalam mencapai target sertifikasi nasional dan meningkatkan daya saing global minyak sawit berkelanjutan.",
  },
  {
    image: "https://images.unsplash.com/photo-1593924689241-1b78c38f0071?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "AI Detection Berhasil Identifikasi 150 Hektar Perubahan Lahan Ilegal",
    description: "Sistem kecerdasan buatan berhasil mendeteksi perubahan lahan ilegal seluas 150 hektar melalui analisis citra satelit real-time dalam platform monitoring ISPO. Teknologi ini mampu mengidentifikasi pola deforestasi mencurigakan dengan akurasi 95%, mempercepat respons tim investigasi lapangan untuk tindakan penegakan hukum.",
  },
];

// PERUBAHAN: Navbar disederhanakan agar lebih rapi dan solid
const Navbar = () => (
    <header className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
            <Link href="/" className="flex items-center gap-3">
                {/* Logo disamakan dengan dashboard admin */}
                <div className="p-2 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Smart ISPO</h1>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-4">
                <Link href="/login/perusahaan" className="text-sm font-medium px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                    Portal Perusahaan
                </Link>
                {/* Tombol utama disamakan dengan tema biru */}
                <Link href="/login/staf" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Portal Staf
                </Link>
            </nav>
        </div>
    </header>
);

const HeroSection = () => (
    <section className="relative h-screen flex items-center justify-center text-white pt-16">
        {/* PERUBAHAN: Overlay disamakan dengan tema biru */}
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src="https://cdn.pixabay.com/photo/2023/12/04/13/12/business-man-8429442_1280.jpg" alt="Perkebunan Kelapa Sawit" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 text-center max-w-3xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Sertifikasi ISPO: Terstruktur, Transparan, Terpercaya.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-200">
                Platform digital terpadu untuk mengelola seluruh proses sertifikasi Indonesian Sustainable Palm Oil (ISPO) dengan efisien dan kolaboratif.
            </p>
            {/* PERUBAHAN: Tombol utama disamakan dengan tema biru */}
            <Link href="/login/perusahaan" className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105">
                Daftar & Mulai Sertifikasi <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-semibold text-blue-600">Fitur Unggulan</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Platform untuk Semua Kebutuhan Sertifikasi</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Dari pengajuan awal hingga penerbitan sertifikat digital, semua terintegrasi dalam satu sistem yang mudah digunakan.</p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* PERUBAHAN: Semua ikon dan background-nya disatukan ke tema biru */}
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full"><CheckCircle className="w-8 h-8 text-blue-600"/></div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">Alur yang Terstruktur</h3>
                    <p className="mt-2 text-sm text-slate-600">Menavigasi 7 Prinsip ISPO menjadi lebih mudah dengan checklist dan panduan di setiap langkahnya.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full"><Users className="w-8 h-8 text-blue-600"/></div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">Kolaborasi Real-time</h3>
                    <p className="mt-2 text-sm text-slate-600">Perusahaan, Admin, dan Auditor bekerja di satu platform yang sama untuk feedback dan verifikasi yang lebih cepat.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full"><BarChart className="w-8 h-8 text-blue-600"/></div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">Monitoring & Laporan</h3>
                    <p className="mt-2 text-sm text-slate-600">Pantau progres kepatuhan secara real-time melalui dashboard yang informatif dan mudah dipahami.</p>
                </div>
            </div>
        </div>
    </section>
);

const NewsSlider = () => {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-slate-900 text-center">Berita & Informasi Terbaru</h2>
                <div className="mt-12 overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {newsSlides.map((slide, index) => (
                            <div className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4" key={index}>
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200/80 overflow-hidden h-full flex flex-col">
                                    <img src={slide.image} alt={slide.title} className="h-48 w-full object-cover"/>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-semibold text-slate-900">{slide.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600 flex-grow">{slide.description}</p>
                                        {/* PERUBAHAN: Link disamakan dengan tema biru */}
                                        <a href="#" className="mt-4 text-sm font-semibold text-blue-600 hover:underline self-start">Baca Selengkapnya</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Smart ISPO System. All Rights Reserved.</p>
            <p className="mt-2">Platform Demonstrasi untuk Manajemen Sertifikasi ISPO.</p>
        </div>
    </footer>
);

const ContactAdminButton = () => (
    // PERUBAHAN: Tombol disamakan dengan tema biru
    <a href="mailto:admin@smartispo.com" className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-30" title="Tanya Admin">
        <MessageSquare className="w-6 h-6" />
    </a>
);

export default function HomePage() {
    return (
        <div className="bg-white">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <NewsSlider />
            </main>
            <Footer />
            <ContactAdminButton />
        </div>
    );
}