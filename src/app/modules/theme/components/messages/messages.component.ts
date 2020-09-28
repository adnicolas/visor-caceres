import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'the-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    @Input() severity: string;
    @Input() text: string;

    constructor() { }

    ngOnInit() {
    }

}
