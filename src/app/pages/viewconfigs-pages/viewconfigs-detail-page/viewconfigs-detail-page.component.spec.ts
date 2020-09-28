import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewconfigsDetailPageComponent } from './viewconfigs-detail-page.component';

describe('ViewconfigsDetailPageComponent', () => {
    let component: ViewconfigsDetailPageComponent;
    let fixture: ComponentFixture<ViewconfigsDetailPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewconfigsDetailPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewconfigsDetailPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
