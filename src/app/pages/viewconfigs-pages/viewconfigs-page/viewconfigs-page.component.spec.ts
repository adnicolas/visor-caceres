import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewconfigsPageComponent } from './viewconfigs-page.component';

describe('ViewconfigsPageComponent', () => {
    let component: ViewconfigsPageComponent;
    let fixture: ComponentFixture<ViewconfigsPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewconfigsPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewconfigsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
