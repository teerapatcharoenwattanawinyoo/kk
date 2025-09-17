/**
 * แปลง phone number จาก international format (+66...) เป็น local format (0...)
 */
export function formatPhoneForAPI(phone: string): string {
  if (!phone) return phone;

  // ถ้าเป็น +66 format แปลงเป็น 0
  if (phone.startsWith("+66")) {
    return "0" + phone.slice(3);
  }

  // ถ้าเป็น 66 format (ไม่มี +) แปลงเป็น 0
  if (phone.startsWith("66") && phone.length >= 9) {
    return "0" + phone.slice(2);
  }

  // ถ้าเริ่มต้นด้วย 0 อยู่แล้ว ให้คืนค่าเดิม
  if (phone.startsWith("0")) {
    return phone;
  }

  // กรณีอื่นๆ คืนค่าเดิม
  return phone;
}

/**
 * แปลง phone number จาก local format (0...) เป็น international format (+66...)
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return phone;

  // ถ้าเริ่มต้นด้วย 0 แปลงเป็น +66
  if (phone.startsWith("0")) {
    return "+66" + phone.slice(1);
  }

  // ถ้าเป็น +66 อยู่แล้ว คืนค่าเดิม
  if (phone.startsWith("+66")) {
    return phone;
  }

  // กรณีอื่นๆ คืนค่าเดิม
  return phone;
}

/**
 * ตรวจสอบว่า phone number ถูกต้องหรือไม่
 */
export function isValidThaiPhone(phone: string): boolean {
  // ลบ spaces, dashes, parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // ตรวจสอบ format ต่างๆ
  const patterns = [
    /^0[0-9]{8,9}$/, // 0xxxxxxxxx (9-10 digits)
    /^\+66[0-9]{8,9}$/, // +66xxxxxxxxx
    /^66[0-9]{8,9}$/, // 66xxxxxxxxx
  ];

  return patterns.some((pattern) => pattern.test(cleanPhone));
}
