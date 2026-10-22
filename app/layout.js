import "./globals.css";

export const metadata = {
  title: "WordSnap Game - Computer Vocabulary Quiz",
  description: "ทดสอบคำศัพท์คอมพิวเตอร์ภาษาอังกฤษ ทั้งฮาร์ดแวร์ ซอฟต์แวร์ เครือข่าย และการเขียนโปรแกรม กว่า 200 คำ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <div className="bg-grid" />
        <div className="bg-gradient-orb orb-1" />
        <div className="bg-gradient-orb orb-2" />
        <div className="bg-gradient-orb orb-3" />
        {children}
      </body>
    </html>
  );
}
