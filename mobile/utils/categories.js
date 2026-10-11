export function categorise(systolic, diastolic) {
  if (systolic >= 180 || diastolic >= 120) return 'severe'
  if (systolic >= 160 || diastolic >= 100) return 'stage2'
  if (systolic >= 140 || diastolic >= 90)  return 'stage1'
  if (systolic >= 130 || diastolic >= 85)  return 'high-normal'
  if (systolic >= 120 || diastolic >= 80)  return 'normal'
  return 'optimal'
}

export const CATEGORY_LABELS = {
  'optimal':     'Optimal',
  'normal':      'Normal',
  'high-normal': 'High Normal',
  'stage1':      'Stage 1',
  'stage2':      'Stage 2',
  'severe':      'Severe',
}

export const CATEGORY_COLORS = {
  'optimal':     '#1a9e5c',
  'normal':      '#43a047',
  'high-normal': '#f5a623',
  'stage1':      '#fb8c00',
  'stage2':      '#e53935',
  'severe':      '#b71c1c',
}
