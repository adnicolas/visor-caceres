import { Component, OnInit } from '@angular/core';
import { UrlParamsService } from '@cotvisor/services/url-params.service';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';

@Component({
  selector: 'gss-restore-password-page',
  templateUrl: './restore-password-page.component.html',
  styleUrls: ['./restore-password-page.component.scss']
})
export class RestorePasswordPageComponent extends ParentComponent implements OnInit {

  public authentication: { token: string, userId: number };

  constructor(private urlParamsService: UrlParamsService) {
    super();
    const url = window.location.href;
    const token: string = this.urlParamsService.getParamFromURL(url, 'token');
    const userIdString: string = this.urlParamsService.getParamFromURL(url, 'userid');
    let userId: number = null;
    if (userIdString) {
      userId = parseInt(userIdString, 10);
    }
    this.authentication = { token, userId };
  }

  ngOnInit() {
  }

}
