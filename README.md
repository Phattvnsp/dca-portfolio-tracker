# 📈 DCA Portfolio Tracker (Personal Showcase)

A investment tracking tool built to solve a personal challenge: managing and visualizing long-term DCA (Dollar-Cost Averaging) strategies with precision and ease.

<img width="1470" height="923" alt="Screenshot 2569-04-15 at 00 05 21" src="https://github.com/user-attachments/assets/0b895213-406f-4cf7-8195-a96ca750d309" />

<img width="1470" height="923" alt="Screenshot 2569-04-15 at 00 05 36" src="https://github.com/user-attachments/assets/39bab206-79dd-4671-aa6a-1dd10ec3d219" />

<img width="1470" height="923" alt="image" src="https://github.com/user-attachments/assets/3729d15b-c05e-4548-a32b-4eac25b17565" />


## 🚀 The Motivation
This project was built to centralize transaction history from Excel, automate calculations (Net Cash Flow vs. Valuation), and provide a dashboard experience that tracks every fractional share.

> [!CAUTION]
> **Disclaimer**: การคำนวณ Gain/Loss ในแอปนี้อิงตามโมเดล **Net Cash Flow** เพื่อการติดตามพอร์ตส่วนตัวเท่านั้น ไม่ได้รวมปัจจัยเรื่องอัตราแลกเปลี่ยน (FX) รายวันหรือค่าธรรมเนียมแฝงของโบรกเกอร์แบบ Real-time โปรดตรวจสอบกำไร/ขาดทุนอย่างเป็นทางการจากแอปของโบรกเกอร์ที่คุณใช้ทุกครั้งนะคั้บ!

## 💎 Key Features

- **Automated Data Migration**: Custom Python engine that ingests Excel trade logs, handles currency cleaning, and transparently converts Thai Buddhist years into standard ISO dates.
- **Smart Portfolio Analytics**: 
    - Real-time Gain/Loss tracking based on net cumulative investment.
    - Automatic cleanup of sold-out positions (zero-quantity symbols are dynamically hidden).
- **High Precision Tracking**: Engineered to handle fractional stock purchases with up to 5 decimal points of accuracy.
- **Interactive Insights**: Responsive Donut charts for asset allocation and Area charts for cumulative growth using Recharts.
- **Modern Tech Stack**: Leverages the latest Next.js 15 features, Tailwind CSS v4, and a high-speed SQLite backend.

## 🛠️ The Architecture

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS v4](https://tailwindcss.com/)
- **UI System**: [Shadcn UI](https://ui.shadcn.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Backend & Storage**: [SQLite](https://www.sqlite.org/) via `better-sqlite3`
- **Data Schema**: [Zod](https://zod.dev/) for strict type-safe validation
- **Migration Engine**: Python (Pandas + Openpyxl)

## 📦 Project Setup (For Showcase)

While this is a personal tool, the repository includes a `data/mock_data.xlsx` template for demonstration purposes.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install pandas openpyxl
   python3 migrate.py
   ```

3. **Launch Dashboard**:
   ```bash
   npm run dev
   ```

---
Designed and developed for personal use as part of a modern web engineering exploration.

FYI, this project incorporates AI to help me understand complex areas that are new to me.

Sincerely,
Phatt. :D
