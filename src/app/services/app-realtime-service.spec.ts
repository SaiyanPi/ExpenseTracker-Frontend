import { TestBed } from '@angular/core/testing';

import { AppRealtimeService } from './app-realtime-service';

describe('AppRealtimeService', () => {
  let service: AppRealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
