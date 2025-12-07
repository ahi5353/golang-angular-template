import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GuestGuard } from './guest-guard';
import { AuthService } from './auth';
import { of } from 'rxjs';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: router }
      ]
    });
    guard = TestBed.inject(GuestGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is not logged in', (done) => {
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    guard.canActivate().subscribe(canActivate => {
      expect(canActivate).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should prevent activation and redirect to dashboard if user is logged in', (done) => {
    authServiceSpy.isLoggedIn.and.returnValue(of(true));

    guard.canActivate().subscribe(canActivate => {
      expect(canActivate).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    });
  });
});
