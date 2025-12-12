import nodemailer from 'nodemailer';

// SMTP Transporter
const createTransporter = () => {
  // Önce port 587 (STARTTLS) dene
  return nodemailer.createTransport({
    host: 'mail.bazaarewatan.com',
    port: 465,
    secure: true, // STARTTLS için false
    auth: {
      user: 'support@bazaarewatan.com',
      pass: 'Ciko5744**'
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    }
  });
};

const transporter = createTransporter();

// Bağlantıyı test et
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Bağlantı Hatası:', error);
  } else {
    console.log('✅ SMTP Sunucusu hazır');
  }
});

// 6 haneli doğrulama kodu oluştur
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Doğrulama emaili gönder
export async function sendVerificationEmail(to: string, code: string, name: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"بازار وطن" <support@bazaarewatan.com>',
      to: to,
      subject: 'کد تایید ثبت نام - بازار وطن',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🛒 بازار وطن</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">تایید ثبت نام</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">سلام ${name}! 👋</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
                از ثبت نام شما در بازار وطن متشکریم! برای تکمیل ثبت نام، لطفاً کد تایید زیر را وارد کنید:
              </p>
              
              <!-- Verification Code -->
              <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px 0; font-size: 14px;">کد تایید شما:</p>
                <div style="background: #ffffff; border-radius: 8px; padding: 15px 30px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: bold; color: #f97316; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</span>
                </div>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                ⏰ این کد تا <strong>10 دقیقه</strong> معتبر است.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2024 بازار وطن - تمامی حقوق محفوظ است
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email gönderildi:', to);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Email gönderme hatası:', error.message);
    console.error('❌ Hata detayı:', error);
    return false;
  }
}

// Şifre sıfırlama emaili gönder
export async function sendPasswordResetEmail(to: string, code: string, name: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"بازار وطن" <support@bazaarewatan.com>',
      to: to,
      subject: 'بازیابی رمز عبور - بازار وطن',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 بازیابی رمز عبور</h1>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">سلام ${name}!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                درخواست بازیابی رمز عبور دریافت شد. کد تایید شما:
              </p>
              
              <div style="background: #f3f4f6; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 6px;">${code}</span>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                ⏰ این کد تا <strong>10 دقیقه</strong> معتبر است.
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2024 بازار وطن</p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Şifre sıfırlama emaili gönderildi:', to);
    return true;
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    return false;
  }
}

