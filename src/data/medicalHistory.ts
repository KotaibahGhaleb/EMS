export interface MedicationItem {
  name: string
  dose: string
  instructions: string
}

export interface CompletedVisit {
  id: string
  visitDate: string
  department: string
  doctorName: string
  diagnosis: string
  vitals: {
    bloodPressure: string
    heartRate: string
    temperature: string
    spo2: string
  }
  labSummary: string
  labResults: { test: string; result: string; flag?: string }[]
  scanSummary: string
  scanReport: { finding: string; impression: string }
  finalSummary: string
  medications: MedicationItem[]
}

export const completedEmergencyVisit: CompletedVisit = {
  id: 'VIS-2025-8842',
  visitDate: '18 رجب 1447 هـ — 14:30',
  department: 'قسم الطوارئ — مستشفى الملك فهد',
  doctorName: 'د. سارة الحربي',
  diagnosis: 'التهاب حلق حاد — Acute Pharyngitis',
  vitals: {
    bloodPressure: '118/76',
    heartRate: '88',
    temperature: '37.8°م',
    spo2: '98%',
  },
  labSummary: 'تعداد دم كامل + CRP',
  labResults: [
    { test: 'WBC', result: '11.2 ×10⁹/L', flag: 'مرتفع قليلاً' },
    { test: 'CRP', result: '18 mg/L', flag: 'مرتفع' },
    { test: 'Hb', result: '14.1 g/dL' },
  ],
  scanSummary: 'أشعة X-Ray للصدر — PA view',
  scanReport: {
    finding: 'الرئتان clear، لا تجمعات pleural',
    impression: 'لا دلالة على ارتشاح رئوي — ضمن الحدود الطبيعية',
  },
  finalSummary:
    'حالة مستقرة بعد العلاج الداعم. يُنصح بالراحة، السوائل، ومتابعة العيادات الخارجية إذا استمرت الأعراض أكثر من 5 أيام.',
  medications: [
    {
      name: 'Paracetamol 500mg',
      dose: '500 ملغ',
      instructions: 'قرص كل 6–8 ساعات عند الحاجة — بحد أقصى 4 مرات يومياً',
    },
    {
      name: 'Amoxicillin 500mg',
      dose: '500 ملغ',
      instructions: 'قرص كل 8 ساعات لمدة 5 أيام — بعد الأكل',
    },
  ],
}
