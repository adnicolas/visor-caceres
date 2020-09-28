import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { GlobalAuthService } from '@cotvisor-admin/services';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[loggedUserHasRole]'
})
export class LoggedUserHasRoleDirective implements OnInit, OnDestroy {
  // the role the user must have
  @Input() loggedUserHasRole: string;

  stop$ = new Subject();

  isVisible = false;

  /**
   * @param {ViewContainerRef} viewContainerRef
   * 	-- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef
   *   -- the templateRef to be potentially rendered
   * @param {RolesService} rolesService
   *   -- will give us access to the roles a user has
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private globalAuthService: GlobalAuthService
  ) { }

  ngOnInit() {
    //  We subscribe to the roles$ to know the roles the user has
    this.globalAuthService.authState$.pipe(takeUntil(this.stop$)).subscribe(user => {
      const rolName = user.roles[0].name;
      // If he doesn't have any roles, we clear the viewContainerRef
      if (!rolName) {
        this.viewContainerRef.clear();
      }
      // If the user has the role needed to
      // render this component we can add it
      if (rolName.toLowerCase().includes(this.loggedUserHasRole.toLowerCase())) {
        // If it is already visible (which can happen if
        // his roles changed) we do not need to add it a second time
        if (!this.isVisible) {
          // We update the `isVisible` property and add the
          // templateRef to the view using the
          // 'createEmbeddedView' method of the viewContainerRef
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        // If the user does not have the role,
        // we update the `isVisible` property and clear
        // the contents of the viewContainerRef
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }

  // Clear the subscription on destroy
  ngOnDestroy() {
    this.stop$.next();
  }
}
