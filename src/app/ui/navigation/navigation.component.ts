import { Component } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  githubLoginBaseUrl = 'https://github.com/login/oauth/authorize?';
  githubLoginConfig = {
    client_id: environment.githubApiKey,
    allow_signup: 'false',
    scope: 'repo' + ' ' + 'user',
  };
  githubLoginConfigUrl = new URLSearchParams(this.githubLoginConfig).toString();

  githubLoginUrl = this.githubLoginBaseUrl + this.githubLoginConfigUrl;
}
