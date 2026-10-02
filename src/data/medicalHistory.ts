export interface MedicationItem {
  name: string
  dose: string
  instructions: string
}

export const MEDICAL_HISTORY_HOSPITAL = 'مستشفى الملك فهد - قسم الطوارئ'

export interface CompletedVisit {
  id: string
  dateLabel: string
  visitTime: string
  sortDate: string
  reason: string
  statusLabel: string
  doctorName: string
  clinicRoom: string
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
  dischargeInstructions: string
  medications: MedicationItem[]
}

export const pastEmergencyVisits: CompletedVisit[] = [
  {
    id: 'VIS-2026-1012',
    dateLabel: '12 أكتوبر 2026',
    visitTime: '09:15',
    sortDate: '2026-10-12',
    reason: 'ألم حاد في البطن',
    statusLabel: 'مكتملة ✅',
    doctorName: 'د. أحمد العتيبي',
    clinicRoom: '204',
    diagnosis: 'التهاب معدة وقولون',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '92',
      temperature: '37°م',
      spo2: '99%',
    },
    labSummary: 'تعداد دم + CRP + وظائف كبد',
    labResults: [
      { test: 'WBC', result: '9.8 ×10⁹/L' },
      { test: 'CRP', result: '22 mg/L', flag: 'مرتفع' },
    ],
    scanSummary: 'سونار بطن',
    scanReport: {
      finding: 'لا تجمعات — المعدة mildly distended',
      impression: 'التهاب معدة محتمل',
    },
    finalSummary: 'تم تخفيف الألم بعد العلاج الداعم.',
    dischargeInstructions: 'حمية خفيفة 48 ساعة، مراجعة العيادات إذا استمر الألم.',
    medications: [
      {
        name: 'Omeprazole 20mg',
        dose: '20 ملغ',
        instructions: 'قرص يومياً قبل الإفطار — 14 يوماً',
      },
    ],
  },
  {
    id: 'VIS-2026-0828',
    dateLabel: '28 أغسطس 2026',
    visitTime: '21:40',
    sortDate: '2026-08-28',
    reason: 'ارتفاع في الحرارة وزكام شديد',
    statusLabel: 'مكتملة ✅',
    doctorName: 'د. سارة الحربي',
    clinicRoom: '204',
    diagnosis: 'عدوى فيروسية respiratoire',
    vitals: {
      bloodPressure: '116/74',
      heartRate: '96',
      temperature: '38.9°م',
      spo2: '97%',
    },
    labSummary: 'مسحة أنف + CRP',
    labResults: [
      { test: 'CRP', result: '14 mg/L', flag: 'مرتفع قليلاً' },
      { test: 'Influenza A/B', result: 'سلبي' },
    ],
    scanSummary: 'أشعة صدر — عند الحاجة',
    scanReport: {
      finding: 'لا infiltrates',
      impression: 'صدر ضمن الحدود',
    },
    finalSummary: 'حالة مستقرة بعد العلاج.',
    dischargeInstructions: 'راحة، سوائل، عزل منزلي 3 أيام عند استمرار الحرارة.',
    medications: [
      {
        name: 'Paracetamol 500mg',
        dose: '500 ملغ',
        instructions: 'كل 6 ساعات عند الحرارة',
      },
    ],
  },
  {
    id: 'VIS-2026-0515',
    dateLabel: '15 مايو 2026',
    visitTime: '16:05',
    sortDate: '2026-05-15',
    reason: 'التواء في الكاحل',
    statusLabel: 'مكتملة ✅',
    doctorName: 'د. فيصل العمري',
    clinicRoom: '204',
    diagnosis: 'التواء درجة II — كاحل أيمن',
    vitals: {
      bloodPressure: '118/70',
      heartRate: '82',
      temperature: '36.9°م',
      spo2: '99%',
    },
    labSummary: 'لا تحاليل — إصابة عضلية هيكلية',
    labResults: [{ test: '—', result: 'غير مطلوب', flag: '—' }],
    scanSummary: 'X-Ray كاحل أيمن',
    scanReport: {
      finding: 'لا كسر واضح',
      impression: 'التواء ligament lateral',
    },
    finalSummary: 'تثبيت الكاحل وبرنامج ثلج.',
    dischargeInstructions: 'رفع القدم وتجنب الحمل الكامل 5 أيام.',
    medications: [
      {
        name: 'Ibuprofen 400mg',
        dose: '400 ملغ',
        instructions: 'كل 8 ساعات بعد الأكل',
      },
    ],
  },
  {
    id: 'VIS-2026-0103',
    dateLabel: '03 يناير 2026',
    visitTime: '11:20',
    sortDate: '2026-01-03',
    reason: 'ضيق تنفس خفيف',
    statusLabel: 'مكتملة ✅',
    doctorName: 'د. نورة القحطاني',
    clinicRoom: '204',
    diagnosis: 'Bronchospasm خفيف',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '88',
      temperature: '37°م',
      spo2: '95%',
    },
    labSummary: 'غازات شريان + تعداد دم',
    labResults: [
      { test: 'PaO₂', result: '82 mmHg', flag: 'منخفض قليلاً' },
    ],
    scanSummary: 'Chest X-Ray PA',
    scanReport: {
      finding: 'فرط انتفاخ خفيف',
      impression: 'لا neumonia',
    },
    finalSummary: 'تحسّن بعد nebulizer.',
    dischargeInstructions: 'متابعة عيادة chest خلال أسبوع.',
    medications: [
      {
        name: 'Salbutamol Inhaler',
        dose: '100 mcg/puff',
        instructions: '2 puffs كل 4–6 ساعات عند الضيق',
      },
    ],
  },
].sort((a, b) => b.sortDate.localeCompare(a.sortDate))

export const completedEmergencyVisit = pastEmergencyVisits[0]
