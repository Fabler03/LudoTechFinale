import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadGamePage } from './upload-game.page';

describe('UploadGamePage', () => {
  let component: UploadGamePage;
  let fixture: ComponentFixture<UploadGamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
