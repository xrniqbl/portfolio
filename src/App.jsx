import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Instagram, 
  Linkedin, 
  ArrowRight, 
  Menu, 
  X, 
  Lock,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  LogOut,
  Upload,
  Image as ImageIcon,
  Loader2,
  Cpu,
  Server,
  Code,
  Globe,
  AlertTriangle,
  Github,
  MessageCircle
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc
} from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from "firebase/auth";

// --- SOCIAL LINKS CONFIGURATION ---
const SOCIALS = {
  whatsapp: "https://wa.me/6289512114437",
  instagram: "https://www.instagram.com/iqbaalesptr",
  linkedin: "https://www.linkedin.com/in/iqbalsaputra04",
  github: "https://github.com/xrniqbl"
};

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyD-tCESftBthOG1yx859Pv859hH7lYrL2o",
  authDomain: "portfolio-98c63.firebaseapp.com",
  projectId: "portfolio-98c63",
  storageBucket: "portfolio-98c63.firebasestorage.app",
  messagingSenderId: "891375724208",
  appId: "1:891375724208:web:00c16db20a7123c0ba3d75",
  measurementId: "G-Y1BVEDFJSM"
};

// --- Initialize Firebase Global ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ID Aplikasi statis untuk penyimpanan data
const APP_ID_KEY = 'portfolio-iqbal-v1'; 

// --- Utility: Resize Image ---
const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(file.type, 0.8)); 
      }
    }
  })
};

// --- Custom Icons (SVGs) ---
const TechIcons = {
  Java: (props) => (
    <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M277.7 334.8c-29.3 2.1-39.7-14.7-27.1-28.5 29.8-32.3 27-81.6 7.4-105.8-34.9-43-108.6-21.8-123.3 32-1.9 6.8 2.5 13.1 9 14.1 6.1 1 12.3-2.5 14.3-8.6 10-30.6 63.6-43.1 82.5-12.7 13 20.8 7.3 52.8-14.2 76.1-30.8 33.3-7.5 73.1 48.9 76.3 33.6 1.9 64.1-13.8 68.1-35 1-5.3-2.5-10.3-7.7-11.2-5.3-.8-10.4 2.6-11.4 7.9-1.9 10 24.3 12.1 42.4 11 36.6-2.2 27.5-22.1 19.3-31.2-14.7-16.1-35.4-8.6-60.6-9.1-34.2-.7-72.3-13.3-94-43.3-19.1-26.3-15.6-61.9 9.3-84.5 35-31.7 93.9-32.6 130.4-2 30.1 25.2 36.3 67.9 16.4 97.5-2 3-7.7 2.6-9.1-.9-7.9-19.5-23.7-48.4-56-59.5-44.1-15.1-94.6 23.3-81.2 68.6 8.5 28.7 39.3 38 65.6 38.6 29.6.6 57.3-6.2 73.8-12.8 5-2 10.8.6 12.7 5.7 1.9 5.1-.6 10.8-5.7 12.7-8.1 3.1-23.4 9.1-66.2 12.8 19.4 8.7 44.5 17.6 69.9 16.1 40.8-2.4 57.9-25.2 53.9-46-1-5.3-6-8.8-11.2-7.9zm-86.8 14.2c-29.3 2.1-39.7-14.7-27.1-28.5 29.8-32.3 27-81.6 7.4-105.8-34.9-43-108.6-21.8-123.3 32-1.9 6.8 2.5 13.1 9 14.1 6.1 1 12.3-2.5 14.3-8.6 10-30.6 63.6-43.1 82.5-12.7 13 20.8 7.3 52.8-14.2 76.1-30.8 33.3-7.5 73.1 48.9 76.3 33.6 1.9 64.1-13.8 68.1-35 1-5.3-2.5-10.3-7.7-11.2-5.3-.8-10.4 2.6-11.4 7.9-1.9 10 24.3 12.1 42.4 11 36.6-2.2 27.5-22.1 19.3-31.2-14.7-16.1-35.4-8.6-60.6-9.1-34.2-.7-72.3-13.3-94-43.3-19.1-26.3-15.6-61.9 9.3-84.5 35-31.7 93.9-32.6 130.4-2 30.1 25.2 36.3 67.9 16.4 97.5-2 3-7.7 2.6-9.1-.9-7.9-19.5-23.7-48.4-56-59.5-44.1-15.1-94.6 23.3-81.2 68.6 8.5 28.7 39.3 38 65.6 38.6 29.6.6 57.3-6.2 73.8-12.8 5-2 10.8.6 12.7 5.7 1.9 5.1-.6 10.8-5.7 12.7-8.1 3.1-23.4 9.1-66.2 12.8 19.4 8.7 44.5 17.6 69.9 16.1 40.8-2.4 57.9-25.2 53.9-46-1-5.3-6-8.8-11.2-7.9z"/>
    </svg>
  ),
  HTML: (props) => (
    <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/>
    </svg>
  ),
  CSS: (props) => (
    <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-115.1-49.3-4.8-47.3H313.1zM192 68l121.1 50.5-4.8 47.3-116.3 49.9-116.3-49.9-4.8-47.3L192 68zm0 263.3l-81.8-22.1 3.9-43.1h-48l-6.2 68.6 132.1 36.1 132.1-36.1-2.9-32.9H273.8l3.9 43.1-85.7 22.1v-35.7z"/>
    </svg>
  ),
  PHP: (props) => (
    <svg viewBox="0 0 640 512" fill="currentColor" {...props}>
        <path d="M320 104.5c171.4 0 307.7 33 318.6 77H320V104.5zM320 407.5c-171.4 0-307.7-33-318.6-77H320v77zM627.3 227.2c-16.5 63.8-154.2 110.3-307.3 110.3-153.1 0-290.8-46.5-307.3-110.3C-4.1 163.4 133.6 116.9 286.7 116.9c153.1 0 290.8 46.5 307.3 110.3z"/>
        <text x="50%" y="55%" textAnchor="middle" dy=".3em" fontSize="200" fontWeight="bold" fill="currentColor">PHP</text>
    </svg>
  ),
  ChatGPT: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4533l-.142.0805L8.7043 5.4596a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l3.1028-1.7963 3.1028 1.7963v3.5873l-3.1028 1.7915-3.1028-1.7915z"/>
    </svg>
  ),
  Gemini: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
       <path d="M12,2 L12.5,4 C13.5,8 16,10.5 20,11.5 L22,12 L20,12.5 C16,13.5 13.5,16 12.5,20 L12,22 L11.5,20 C10.5,16 8,13.5 4,12.5 L2,12 L4,11.5 C8,10.5 10.5,8 11.5,4 L12,2 Z" />
    </svg>
  ),
  Claude: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
        <rect x="20" y="20" width="60" height="60" rx="10" />
        <path d="M35 50 L45 60 L65 40" stroke="black" strokeWidth="8" fill="none" />
    </svg>
  )
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const menuVariants = {
  closed: { opacity: 0, x: "100%" },
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

// --- Components ---

const AboutModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl p-8 relative ${isDarkMode ? 'bg-[#0A0A0A] border border-zinc-800 text-gray-300' : 'bg-white text-gray-700'}`}
          >
            <button 
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Tentang Saya</h2>
            
            <div className="space-y-6 leading-relaxed">
              <p>
                Saya adalah antusias Teknologi Informasi dengan fokus pada <strong className="text-purple-500">infrastruktur IT dan kecerdasan buatan (AI)</strong>. Saat ini, saya menempuh studi di Universitas Adhirejasa Reswara Sanjaya, di mana saya memadukan keahlian teknis dengan manajemen komunitas.
              </p>
              
              <p>
                Selama lebih dari 1,5 tahun, saya mengelola komunitas dan media besar, khususnya sebagai leader di komunitas <strong className="text-purple-500">Honor of Kings</strong> serta pemilik <strong className="text-purple-500">Jadwal Konser Bandung</strong>. Pengalaman ini mengasah kemampuan saya dalam manajemen acara, kepemimpinan tim, dan pemecahan masalah secara sistematis.
              </p>

              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-black'}`}>Keahlian Teknis</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Server className="shrink-0 text-purple-500" size={20} />
                    <span><strong>Infrastruktur IT:</strong> Berpengalaman dalam Mikrotik, manajemen server, dan perangkat keras (pengalaman di ISBI Bandung).</span>
                  </li>
                  <li className="flex gap-3">
                    <Code className="shrink-0 text-purple-500" size={20} />
                    <span><strong>Web Development & Data:</strong> Terampil dalam membangun fondasi web dan optimalisasi data menggunakan Microsoft Office.</span>
                  </li>
                  <li className="flex gap-3">
                    <Cpu className="shrink-0 text-purple-500" size={20} />
                    <span><strong>AI & Inovasi:</strong> Fokus saat ini pada Prompt Engineering dan pemetaan kapabilitas AI untuk efisiensi alur kerja.</span>
                  </li>
                </ul>
              </div>

              <p className="italic border-l-4 border-purple-500 pl-4 py-2">
                "Saya percaya bahwa teknologi bukan sekadar kode atau perangkat keras, melainkan alat untuk menghubungkan orang dan menyelesaikan masalah nyata."
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectDetailModal = ({ project, isOpen, onClose, isDarkMode }) => {
    if (!isOpen || !project) return null;
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl relative ${isDarkMode ? 'bg-[#0A0A0A] border border-zinc-800' : 'bg-white'}`}
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              {/* Header Banner */}
              <div className={`w-full relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                  {/* Background Blur */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                  {project.iconImage && (
                      <img src={project.iconImage} className="w-full h-64 object-cover blur-2xl opacity-40" alt="bg" />
                  )}
                  
                  {/* Content Over Banner */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col md:flex-row items-end gap-6">
                      <div className={`w-28 h-28 rounded-3xl border-4 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                          {project.iconImage ? (
                              <img src={project.iconImage} className="w-full h-full object-cover" alt="icon" />
                          ) : (
                              <Globe size={48} className="text-purple-500" />
                          )}
                      </div>
                      <div className="mb-2">
                          <span className="text-purple-400 font-black text-xs uppercase tracking-[0.2em] bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                            {project.role}
                          </span>
                          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight">{project.title}</h2>
                      </div>
                  </div>
              </div>

              <div className="p-8 md:p-12">
                  {/* Description */}
                  <div className={`mb-16 text-lg md:text-xl leading-relaxed font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {project.desc}
                  </div>

                  {/* Full Gallery Display */}
                  {project.gallery && project.gallery.length > 0 && (
                      <div className="space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="h-px w-10 bg-purple-500"></div>
                             <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Galeri Dokumentasi
                             </h3>
                          </div>
                          
                          {/* Single Column for Full Detail */}
                          <div className="flex flex-col gap-12">
                              {project.gallery.map((img, idx) => (
                                  <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20"
                                  >
                                      <img 
                                        src={img} 
                                        alt={`Documentation ${idx + 1}`} 
                                        className="w-full h-auto object-contain" 
                                        loading="lazy"
                                      />
                                  </motion.div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl border-2 ${isDarkMode ? 'bg-zinc-950 border-red-900/50' : 'bg-white border-red-100'}`}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-6 animate-pulse">
                        <Trash2 size={32} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>Hapus Proyek?</h3>
                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini <strong className="text-red-500">permanen</strong>.
                    </p>
                    <div className="flex flex-col gap-3 w-full">
                        <button onClick={onConfirm} className="w-full py-3.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                            Ya, Hapus Permanen
                        </button>
                        <button onClick={onClose} className={`w-full py-3.5 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            Batalkan
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// --- Tech Stack Marquee Component ---
const TechStack = ({ isDarkMode }) => {
  const tools = [
    { name: "Java", icon: TechIcons.Java },
    { name: "HTML5", icon: TechIcons.HTML },
    { name: "CSS3", icon: TechIcons.CSS },
    { name: "PHP", icon: TechIcons.PHP },
    { name: "Gemini AI", icon: TechIcons.Gemini },
    { name: "ChatGPT", icon: TechIcons.ChatGPT },
    { name: "GitHub", icon: Github }, 
    { name: "Claude AI", icon: TechIcons.Claude },
  ];

  const marqueeTools = [...tools, ...tools, ...tools];

  return (
    <div className={`py-12 border-y ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-white/50 border-black/5'}`}>
        <div className="overflow-hidden flex relative">
            <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r ${isDarkMode ? 'from-[#050505] to-transparent' : 'from-[#FAFAFA] to-transparent'}`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l ${isDarkMode ? 'from-[#050505] to-transparent' : 'from-[#FAFAFA] to-transparent'}`}></div>

            <motion.div 
                className="flex gap-16 items-center px-8"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
                {marqueeTools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                        <div key={index} className={`flex items-center gap-3 shrink-0 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}>
                            <Icon size={32} className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                            <span className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-black'}`}>{tool.name}</span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null); 
  const [selectedProject, setSelectedProject] = useState(null); 
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  
  const [isEditing, setIsEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    desc: '',
    iconImage: '', 
    gallery: []
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
          await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth failed", error);
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const collectionRef = collection(db, 'artifacts', APP_ID_KEY, 'public', 'data', 'projects');
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setProjects(items);
    }, (error) => {
      console.error("Error fetching projects:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js';
      document.body.appendChild(script);
    }
  }, []);

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const base64 = await resizeImage(file);
        setFormData(prev => ({ ...prev, iconImage: base64 }));
      } catch (err) {
        alert("Gagal memproses gambar icon");
      }
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const newImages = await Promise.all(files.map(file => resizeImage(file)));
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }));
      } catch (err) {
        alert("Gagal memproses gambar galeri");
      }
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "admin123") { 
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput("");
    } else {
      alert("Password salah!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setMobileMenuOpen(false); 
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!user) return;

    const collectionRef = collection(db, 'artifacts', APP_ID_KEY, 'public', 'data', 'projects');

    try {
      if (isEditing) {
        const docRef = doc(db, 'artifacts', APP_ID_KEY, 'public', 'data', 'projects', isEditing);
        await updateDoc(docRef, { ...formData });
      } else {
        await addDoc(collectionRef, {
          ...formData,
          createdAt: Date.now()
        });
      }
      setShowForm(false);
      setFormData({ title: '', role: '', desc: '', iconImage: '', gallery: [] });
      setIsEditing(null);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Gagal menyimpan data. Pastikan ukuran gambar tidak terlalu besar.");
    }
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'artifacts', APP_ID_KEY, 'public', 'data', 'projects', showDeleteModal));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      role: project.role,
      desc: project.desc,
      iconImage: project.iconImage || '',
      gallery: project.gallery || []
    });
    setIsEditing(project.id);
    setShowForm(true);
  };

  const navLinks = [
    { name: 'Beranda', href: '#home' },
    { name: 'Portofolio', href: '#projects' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-purple-500 selection:text-white ${isDarkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? (isDarkMode ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/5' : 'bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-xl shadow-gray-200/20') 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center h-12">
          {/* Logo */}
          <motion.a 
            href="#home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xl font-black tracking-tighter z-50 flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            IQBALSAPUTRA<span className="w-2 h-2 rounded-full bg-purple-500 block animate-pulse"></span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-[12px] font-bold tracking-[0.15em] uppercase transition-all relative group ${
                  isDarkMode 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
              <button 
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                      isDarkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-zinc-600 hover:bg-black/10'
                  }`}
              >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {isAdmin ? (
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
                  title="Logout Admin"
                >
                  <span className="hidden md:inline">KELUAR ADMIN</span> <LogOut size={16} />
                </button>
              ) : (
                 <a href={SOCIALS.whatsapp} target="_blank" rel="noopener noreferrer" className={`group px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isDarkMode 
                    ? 'bg-white text-black hover:bg-purple-50' 
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}>
                    Hubungi Saya <ChevronRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </a>
              )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <button onClick={toggleTheme} className={isDarkMode ? 'text-white' : 'text-black'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className={isDarkMode ? 'text-white' : 'text-black'}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className={`fixed inset-0 z-[60] flex flex-col justify-between p-8 backdrop-blur-2xl ${isDarkMode ? 'bg-black/95' : 'bg-white/95'}`}
            >
              <div className="flex justify-between items-center border-b border-gray-500/10 pb-6">
                 <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>NAVIGASI</span>
                 <button onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-full ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                    <X size={24} />
                 </button>
              </div>

              <div className="flex flex-col gap-6 items-start">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`text-5xl font-black tracking-tighter transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600 ${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    {link.name}
                  </motion.a>
                ))}

                {/* Mobile Admin Logout Button */}
                {isAdmin && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={handleLogout}
                        className="flex items-center gap-4 text-3xl font-black text-red-500 hover:text-red-400 mt-4"
                    >
                        <LogOut size={32} /> KELUAR ADMIN
                    </motion.button>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-500/10 pt-6">
                <div className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    &copy; 2026 Iqbal
                </div>
                <div className="flex gap-4">
                    <a href={SOCIALS.instagram} target="_blank" rel="noreferrer"><Instagram size={24} className={isDarkMode ? 'text-white' : 'text-black'}/></a>
                    <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer"><Linkedin size={24} className={isDarkMode ? 'text-white' : 'text-black'}/></a>
                    <a href={SOCIALS.github} target="_blank" rel="noreferrer"><Github size={24} className={isDarkMode ? 'text-white' : 'text-black'}/></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none`}>
          <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 animate-pulse ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-200/60'}`}></div>
          <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-30 animate-pulse delay-1000 ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-200/60'}`}></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 pt-20 lg:pt-0">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1 flex flex-col items-start lg:pr-12 mt-12 lg:mt-0 relative z-20"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md ${
                  isDarkMode 
                  ? 'border-white/10 bg-white/5 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                  : 'border-black/5 bg-white/40 text-purple-700 shadow-sm'
              }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Portfolio Resmi</span>
              </div>
            </motion.div>
            
            <motion.h1 
                variants={fadeInUp} 
                className={`text-5xl md:text-7xl lg:text-[5rem] xl:text-[6rem] font-black leading-[0.9] tracking-tighter mb-8 cursor-default group ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
            >
              <span className="block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                AI
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-white animate-pulse">
                ENTHUSIAST
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className={`text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light tracking-wide ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Prompt Design & AI Capability Mapping untuk integrasi teknologi yang lebih efektif.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
              <a 
                href="#projects"
                className={`group px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1 ${
                  isDarkMode 
                    ? 'bg-white text-black shadow-white/10 hover:shadow-white/20' 
                    : 'bg-black text-white shadow-black/10 hover:shadow-black/20'
                }`}
              >
                Lihat Karya <span className="ml-1 opacity-70">&gt;</span>
              </a>
              
              <button 
                onClick={() => setShowAboutModal(true)}
                className={`px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/5 border ${
                  isDarkMode 
                    ? 'border-white/10 text-purple-300' 
                    : 'border-black/10 text-purple-600'
                }`}
              >
                Tentang Saya <span className="ml-1 opacity-70">&gt;</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="order-1 lg:order-2 w-full h-[60vh] md:h-[60vh] lg:h-screen relative flex items-center justify-center overflow-hidden"
          >
              {/* Removed "FUTURE" text and adjusted robot positioning */}
              <div className="w-[250%] h-[250%] md:w-[180%] md:h-[180%] lg:w-[160%] lg:h-[160%] flex items-center justify-center pointer-events-auto">
                <spline-viewer 
                  url="https://prod.spline.design/3tDaTajD3LVYWYz3/scene.splinecode"
                  class="w-full h-full"
                />
              </div>
          </motion.div>
        </div>
      </section>

      {/* --- TECH STACK MARQUEE --- */}
      <TechStack isDarkMode={isDarkMode} />

      {/* --- PORTFOLIO SECTION --- */}
      <section id="projects" className={`py-32 relative ${isDarkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div className="max-w-2xl">
                <h2 className={`text-3xl md:text-5xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    Karya Terpilih
                </h2>
                <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Mengelola komunitas dan membangun platform digital di Bandung.
                </p>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => {
                    setFormData({ title: '', role: '', desc: '', iconImage: '', gallery: [] });
                    setIsEditing(null);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 font-bold uppercase text-xs tracking-widest"
                >
                  <Plus size={16} /> Tambah Proyek
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.length === 0 ? (
                 <div className={`p-8 rounded-2xl border backdrop-blur-sm ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} opacity-50`}>
                    <p className={`text-center ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Belum ada data proyek. Login admin untuk menambahkan.</p>
                 </div>
              ) : (
                projects.map((project) => {
                  return (
                    <motion.div 
                      key={project.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => !isAdmin && setSelectedProject(project)} 
                      className={`group relative p-8 md:p-10 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer ${
                          isDarkMode 
                              ? 'bg-[#0A0A0A] border-white/5 hover:border-purple-500/50 hover:bg-[#0F0F0F] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)]' 
                              : 'bg-white border-black/5 hover:border-purple-500/50 shadow-xl shadow-gray-200/50 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]'
                      }`}
                    >
                        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-400'}`}></div>

                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-3 z-20" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleEdit(project)} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-transform hover:scale-110"><Edit2 size={18}/></button>
                            <button onClick={() => setShowDeleteModal(project.id)} className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg transition-transform hover:scale-110"><Trash2 size={18}/></button>
                          </div>
                        )}

                        <div className="flex items-start gap-6 mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${
                                isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'
                            }`}>
                                {project.iconImage ? (
                                    <img src={project.iconImage} alt="icon" className="w-full h-full object-cover" />
                                ) : (
                                    <Globe size={28} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                                )}
                            </div>
                            
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-widest block mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {project.role}
                                </span>
                                <h3 className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{project.title}</h3>
                            </div>
                        </div>

                        <p className={`text-base leading-relaxed mb-8 relative z-10 line-clamp-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{project.desc}</p>
                        
                        {/* Mini Gallery Strip (Preview only) */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="mt-auto mb-6">
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Dokumentasi (Klik untuk lihat)</p>
                                <div className="flex gap-2 overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                                    {project.gallery.slice(0, 3).map((img, idx) => (
                                        <div key={idx} className="w-16 h-12 rounded-md overflow-hidden bg-white/5">
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    ))}
                                    {project.gallery.length > 3 && (
                                        <div className="w-16 h-12 rounded-md bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500">
                                            +{project.gallery.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className={`w-full h-px mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10'}`}></div>
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                            }}
                            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative z-10 ${
                                isDarkMode ? 'text-white group-hover:text-purple-400' : 'text-black group-hover:text-purple-600'
                            }`}
                        >
                           Selengkapnya <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT MODAL --- */}
      <AboutModal 
        isOpen={showAboutModal} 
        onClose={() => setShowAboutModal(false)} 
        isDarkMode={isDarkMode} 
      />

      {/* --- PROJECT DETAIL MODAL --- */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        isDarkMode={isDarkMode}
      />

      {/* --- DELETE CONFIRM MODAL --- */}
      <DeleteConfirmModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDelete}
        isDarkMode={isDarkMode}
      />

      {/* --- FORM MODAL --- */}
      <AnimatePresence>
        {showForm && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md`}
        >
            <div className={`w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {isEditing ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-500/10 rounded-full">
                        <X size={20} className={isDarkMode ? 'text-white' : 'text-black'}/>
                    </button>
                </div>
                
                <form onSubmit={handleSaveProject} className="space-y-6">
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Judul</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isDarkMode ? 'bg-black border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-black'}`} />
                </div>
                
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Peran</label>
                    <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isDarkMode ? 'bg-black border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-black'}`} />
                </div>
                
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Deskripsi</label>
                    <textarea required rows="3" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isDarkMode ? 'bg-black border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-black'}`} />
                </div>

                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Upload Icon</label>
                    <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-500 transition-colors ${isDarkMode ? 'border-zinc-700 bg-black' : 'border-zinc-300 bg-zinc-50'}`}>
                        <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                        <div className="flex flex-col items-center gap-2 text-sm">
                            <Upload size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                            <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>Pilih Gambar</span>
                        </div>
                    </label>
                </div>

                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Galeri Foto</label>
                    <label className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-500 transition-colors mb-4 ${isDarkMode ? 'border-zinc-700 bg-black' : 'border-zinc-300 bg-zinc-50'}`}>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon size={24} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                            <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Upload Banyak Foto</span>
                        </div>
                    </label>
                    {formData.gallery.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {formData.gallery.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeGalleryImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-500/10">
                    <button type="button" onClick={() => setShowForm(false)} className={`flex-1 py-3 font-bold rounded-xl ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'}`}>Batal</button>
                    <button type="submit" disabled={isUploading} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className={`py-32 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'} border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className={`relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center ${
              isDarkMode 
              ? 'bg-gradient-to-b from-purple-900/10 to-transparent border border-white/5' 
              : 'bg-white shadow-2xl shadow-purple-500/5 border border-purple-100'
          }`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

              <h2 className={`relative z-10 text-4xl md:text-7xl font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                Mari ciptakan sesuatu <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">yang luar biasa.</span>
              </h2>
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                   <a href={SOCIALS.whatsapp} target="_blank" rel="noopener noreferrer" className={`px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-2xl flex items-center gap-2 ${
                      isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                   }`}>
                      <MessageCircle size={18} /> Hubungi via WhatsApp
                   </a>
                   <div className="flex gap-4">
                      <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className={`p-4 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
                          <Instagram size={24} />
                      </a>
                      <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className={`p-4 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
                          <Linkedin size={24} />
                      </a>
                      <a href={SOCIALS.github} target="_blank" rel="noreferrer" className={`p-4 rounded-full transition-all hover:scale-110 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
                          <Github size={24} />
                      </a>
                   </div>
              </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER & ADMIN LOGIN TRIGGER --- */}
      <footer className={`py-12 text-center border-t ${isDarkMode ? 'bg-[#050505] border-white/5 text-zinc-600' : 'bg-[#FAFAFA] border-black/5 text-zinc-400'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 group relative">
            <p>&copy; 2026 IQBALSAPUTRA DESIGN.</p>
            <div className="relative">
                <button onClick={() => setShowLoginModal(true)} className="opacity-30 hover:opacity-100 transition-opacity p-2">
                    <Lock size={12} />
                </button>
            </div>
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-purple-500 transition-colors"><Instagram size={18} /></a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-purple-500 transition-colors"><Linkedin size={18} /></a>
            <a href={SOCIALS.github} target="_blank" rel="noreferrer" className="hover:text-purple-500 transition-colors"><Github size={18} /></a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && !isAdmin && (
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
             <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black">Admin Access</h3>
                  <button onClick={() => setShowLoginModal(false)}><X size={20} className="text-gray-400 hover:text-black"/></button>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-4 border border-gray-200 rounded-xl mb-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                      />
                  </div>
                  <button type="submit" className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-bold transition-colors">Masuk Dashboard</button>
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;