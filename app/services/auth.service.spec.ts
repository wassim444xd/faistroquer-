import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { id: 1, username: 'testuser', email: 'test@example.com' },
    { id: 2, username: 'admin', email: 'admin@example.com' }
  ];

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User | null> {
    const foundUser = this.users.find(u => u.email === email && password === 'password');

    // **التغيير هنا: تحويل undefined إلى null**
    return of(foundUser || null).pipe( // إذا كان foundUser undefined، فاجعله null
      delay(1000),
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    const newUser: User = {
      id: this.users.length + 1,
      username: username,
      email: email
    };
    // تحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل (إضافة بسيطة لمنع التسجيل المكرر)
    if (this.users.some(u => u.email === email)) {
        // يمكنك إرجاع خطأ Observable هنا بدلاً من إضافة المستخدم
        return new Observable(observer => observer.error('L\'email est déjà utilisé.'));
    }
    this.users.push(newUser);
    console.log('Nouvel utilisateur enregistré (simulé):', newUser);

    return of(newUser).pipe(
      delay(1000),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}