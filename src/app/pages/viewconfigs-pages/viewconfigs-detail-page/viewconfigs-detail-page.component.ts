import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'gss-viewconfigs-detail-page',
    templateUrl: './viewconfigs-detail-page.component.html',
    styleUrls: ['./viewconfigs-detail-page.component.scss']
})
export class ViewConfigsDetailPageComponent implements OnInit {
    viewId: string = '';
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.viewId = params.get('id');
        });
    }

}
