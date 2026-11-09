# APEX MikroTik Wallet PRO+

نظام إدارة اشتراكات الإنترنت بواجهة عربية، مكوّن من بوابة عميل ولوحة مدير، ومهيأ للتوسع إلى MikroTik Hotspot وPPPoE.

## محتويات المستودع
- `public/admin.html` — لوحة المدير.
- `public/client.html` — بوابة العميل.
- `server/` — خادم Node.js/Express وواجهات API وطبقة PostgreSQL.
- `server/db/schema.sql` — مخطط قاعدة البيانات.
- `server/src/services/mikrotik.js` — موصل أولي لـ RouterOS 7 REST API.

## المتطلبات والتشغيل
يتطلب Node.js 20+ وPostgreSQL 14+. أنشئ قاعدة بيانات `apex_mikrotik`، انسخ `.env.example` إلى `.env`، ثم اضبط بيانات PostgreSQL وJWT وكلمة مرور المدير وبيانات الراوتر. نفّذ `npm install` ثم `npm run db:migrate` ثم `npm start`. افتح `http://localhost:3000/admin.html` أو `http://localhost:3000/client.html`.

## واجهات API الحالية
- `GET /api/health`
- `POST /api/auth/admin/login`
- `GET/POST /api/customers` (توثيق المدير)
- `PATCH /api/customers/:id/status` (توثيق المدير)
- `POST /api/renewals`
- `GET /api/renewals?status=pending` (توثيق المدير)
- `POST /api/renewals/:id/review` (توثيق المدير)
- `GET /api/router/test` (توثيق المدير)

## حالة التطوير والأمان
الواجهتان الأصليتان محفوظتان وتستخدمان حاليًا localStorage وبيانات تجريبية؛ لم يكتمل ربط كل أزرارهما بواجهات API. الخادم والموصل أوليان ويحتاجان اختبارات وتدقيقًا أمنيًا قبل الإنتاج. لا تضع أسرار الراوتر أو JWT في المتصفح. استخدم HTTPS ومستخدم RouterOS محدود الصلاحيات. طلبات التجديد تُراجع يدويًا، ومنطق اعتمادها الحالي تجريبي ويضيف 30 يومًا ويصفّر الاستهلاك.
