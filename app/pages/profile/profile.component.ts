import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// تأكد من استيراد AuthService و User بشكل صحيح
import { AuthService, User } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // استيراد RouterLink هنا أيضاً

@Component({
  selector: 'app-profile',
  standalone: true,
  // تأكد من وجود CommonModule و RouterLink في imports
  imports: [CommonModule, RouterLink], // إضافة RouterLink للسماح باستخدام routerLink في HTML
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null; // **هذه هي الخاصية 'currentUser' التي يجب أن تكون موجودة**

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // الاشتراك في التغيرات على المستخدم الحالي
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // إذا لم يكن هناك مستخدم مسجل الدخول، أعد التوجيه إلى صفحة تسجيل الدخول
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  // **هذه هي الدالة 'onLogout' التي يجب أن تكون موجودة**
  onLogout(): void {
    this.authService.logout(); // استدعاء دالة تسجيل الخروج من الخدمة
    this.router.navigate(['/login']); // التوجيه إلى صفحة تسجيل الدخول بعد تسجيل الخروج
  }
}