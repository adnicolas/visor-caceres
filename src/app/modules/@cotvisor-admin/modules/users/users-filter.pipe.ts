import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Pipe({
  name: 'usersfilter',
})
export class UsersFilterPipe implements PipeTransform {
  public transform(users: UserModel[], searchText: string): any[] {
    if (!users) { return []; }
    if (!searchText) { return users; }
    searchText = Utilities.removeAccents(searchText.toLocaleLowerCase());
    return users.filter((user) => {
      return Utilities.removeAccents(user.userName.toLowerCase()).includes(searchText) || user.email.toLowerCase().includes(searchText);
    });
  }
}
