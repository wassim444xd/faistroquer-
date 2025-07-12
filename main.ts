import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // استيراد وظيفة provideRouter
import { routes } from './app/app.routes'; // استيراد تعريف المسارات من app.routes.ts

// bootstrapApplication: تقوم ببدء تشغيل تطبيق Angular باستخدام المكون الجذري (AppComponent)
// providers: مصفوفة من الخدمات التي ستكون متاحة على مستوى التطبيق بالكامل
// provideRouter(routes): تهيئة Angular Router بالمسارات التي قمنا بتعريفها
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // هذا هو الجزء الحيوي الذي يجعل التنقل يعمل
  ]
}).catch(err => console.error(err)); // التقاط أي أخطاء قد تحدث أثناء بدء التشغيل
