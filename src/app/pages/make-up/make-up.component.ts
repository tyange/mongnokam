import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Octokit } from '@octokit/core';
import { v4 as uuidv4 } from 'uuid';

import { Repo } from '../../components/repo-lists/repo-list/repos/repo/repo.model';
import { User } from 'src/app/shared/user/user.model';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserService } from 'src/app/shared/user/user.service';
import { ReposService } from 'src/app/components/repo-lists/repo-list/repos/repos.service';
import { RepoListsService } from 'src/app/components/repo-lists/repo-lists.service';

const dummyDatas = [
  {
    id: 'list1',
    createdDate: Date.now().toLocaleString(),
    'list-name': 'react',
    'list-repos': [
      {
        id: '10',
        title: 'test-my-repos11',
        url: 'https://www.google.com/',
        location: 'list0',
      },
      {
        id: '11',
        title: 'test-my-repos11',
        url: 'https://www.google.com/',
        location: 'list1',
      },
      {
        id: '12',
        title: 'test-my-repos12',
        url: 'https://www.google.com/',
        location: 'list1',
      },
      {
        id: '13',
        title: 'test-my-repos13',
        url: 'https://www.google.com/',
        location: 'list1',
      },
      {
        id: '14',
        title: 'test-my-repos14',
        url: 'https://www.google.com/',
        location: 'list1',
      },
    ],
  },
  {
    id: 'list2',
    'list-name': 'angular',
    createdDate: Date.now().toLocaleString(),
    'list-repos': [
      {
        id: '15',
        title: 'test-my-repos15',
        url: 'https://www.google.com/',
        location: 'list2',
      },
      {
        id: '16',
        title: 'test-my-repos16',
        url: 'https://www.google.com/',
        location: 'list2',
      },
      {
        id: '17',
        title: 'test-my-repos17',
        url: 'https://www.google.com/',
        location: 'list2',
      },
      {
        id: '18',
        title: 'test-my-repos18',
        url: 'https://www.google.com/',
        location: 'list2',
      },
      {
        id: '19',
        title: 'test-my-repos19',
        url: 'https://www.google.com/',
        location: 'list2',
      },
      {
        id: '20',
        title: 'test-my-repos20',
        url: 'https://www.google.com/',
        location: 'list2',
      },
    ],
  },
  {
    id: 'list3',
    'list-name': 'vue',
    createdDate: Date.now().toLocaleString(),
    'list-repos': [
      {
        id: '21',
        title: 'test-my-repos21',
        url: 'https://www.google.com/',
        location: 'list3',
      },
      {
        id: '22',
        title: 'test-my-repos22',
        url: 'https://www.google.com/',
        location: 'list3',
      },
      {
        id: '23',
        title: 'test-my-repos23',
        url: 'https://www.google.com/',
        location: 'list3',
      },
      {
        id: '24',
        title: 'test-my-repos24',
        url: 'https://www.google.com/',
        location: 'list3',
      },
      {
        id: '25',
        title: 'test-my-repos25',
        url: 'https://www.google.com/',
        location: 'list3',
      },
    ],
  },
  {
    id: 'list4',
    'list-name': 'spring boot',
    createdDate: Date.now().toLocaleString(),

    'list-repos': [
      {
        id: '26',
        title: 'test-my-repos26',
        url: 'https://www.google.com/',
        location: 'list4',
      },
      {
        id: '27',
        title: 'test-my-repos27',
        url: 'https://www.google.com/',
        location: 'list4',
      },
      {
        id: '28',
        title: 'test-my-repos28',
        url: 'https://www.google.com/',
        location: 'list4',
      },
      {
        id: '29',
        title: 'test-my-repos29',
        url: 'https://www.google.com/',
        location: 'list4',
      },
      {
        id: '30',
        title: 'test-my-repos30',
        url: 'https://www.google.com/',
        location: 'list4',
      },
    ],
  },
];

@Component({
  selector: 'app-make-up',
  templateUrl: './make-up.component.html',
  styleUrls: ['./make-up.component.css', '../../shared/styles/main.css'],
})
export class MakeUpComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = true;
  isProviderLoading: boolean = false;
  isConsumerLoading: boolean = false;
  allRepos!: Array<Repo>;
  myLists!: Array<{
    id: string;
    'list-name': string;
    createdDate: string;
    'list-repos': Array<Repo>;
  }>;
  loggedInUser!: User;
  allPageNumArray!: Array<number>;

  private pageNumCalc = (userData: User) => {
    const allReposAmount =
      userData.privateRepoAmount + userData.publicRepoAmount;
    const repoPageNum = Math.floor(allReposAmount / 30) + 1;
    let repoPageArr = [];
    for (let i = 1; i < repoPageNum + 1; i++) {
      repoPageArr.push(i);
    }

    return repoPageArr;
  };

  octokit = new Octokit();

  private isAuthSub!: Subscription;
  private myListsSub!: Subscription;
  private allReposSub!: Subscription;
  private userSub!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private reposService: ReposService,
    private repoListsService: RepoListsService
  ) {}

  ngOnInit() {
    // load auth-status
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAuthSub = this.authService
      .authStatsuListener()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });

    this.allRepos = this.reposService.getAllRepos();
    this.allReposSub = this.reposService
      .getAllReposUpdateListener()
      .subscribe((allReposData: any) => {
        this.allRepos = allReposData.allRepos;
        this.isProviderLoading = false;
      });

    // need load my-lists conditionally from database, localStroage or firebase
    this.myLists = this.repoListsService.getMyListsInLocalStorage();
    this.myListsSub = this.repoListsService
      .getMyListsUpdateListener()
      .subscribe((listsData) => {
        this.myLists = listsData.lists;
      });

    // get userData
    this.loggedInUser = this.userService.getUserInLocalStorage();
    if (this.loggedInUser) {
      this.allPageNumArray = this.pageNumCalc(this.loggedInUser);
    }
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((userData) => {
        this.loggedInUser = userData.user;
        this.allPageNumArray = this.pageNumCalc(this.loggedInUser);
      });
  } //ngOnInit

  loadReposPageHandler(pageNum: number) {
    this.isProviderLoading = true;

    this.reposService.loadRepos(pageNum);
  }

  onAddMyList() {
    const newList = {
      id: uuidv4(),
      'list-name': '생성된 리스트',
      createdDate: new Date().toLocaleString(),
      'list-repos': [],
    };

    this.repoListsService.addMyList(newList);
  }

  editListName(listObj: { listId: string; listName: string }) {
    // finding editing list
    const currentLists = this.myLists;
    const editingList = this.myLists.find(
      (list) => list.id === listObj.listId
    )!;

    // storing editing list index
    const editingListIndex = this.myLists.findIndex(
      (list) => list.id === listObj.listId
    )!;

    // change list name
    editingList['list-name'] = listObj.listName;

    // replace original list to editedList
    currentLists.splice(editingListIndex, 1, editingList);

    // replace original lists to editedLists
    this.myLists = currentLists;
  }

  ngOnDestroy() {
    this.isAuthSub.unsubscribe();
    this.myListsSub.unsubscribe();
    this.allReposSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
