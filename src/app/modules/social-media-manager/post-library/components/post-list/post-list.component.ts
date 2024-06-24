import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PostLibraryService } from '../../services/post-library.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 50, //rows,
    recordArray: [10, 50, 100]
  };
  totalDataCount: any = 0;
  showModal: boolean = false;
  modalData: any;

  globalFilterColumn = [
    'id',
    'post',
    'hashtag',
    'postLabel',
    'createdAt',
    'approved',
    'scheduledDate'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Post', field: 'post' },
    { header: 'HashTag', field: 'hashtag' },
    { header: 'Post Label', field: 'postLabel' },
    { header: 'Approve', field: 'approved' },
    { header: 'Scheduled Date', field: 'scheduledDate' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private postLibraryService: PostLibraryService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadPosts(0, 50);
  }

  loadPosts(page?: any, size?: any) {
    this.postLibraryService
      .getPostsByPages(page, size)
      .then((data: any) => {
        this.totalDataCount = data.shift();
        console.log('dta', data);
        data = data.map((item: any) => {
          //console.log('ite', item);
          item['postLabel'] = item.postLabels.map((e: any) => e.name).join(',');
          return item;
        });
        this.rowData = data;
        //console.log('rowdata', this.rowData);
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }
  approvePost(id: any) {
    if (
      confirm(
        'Once this is posted you cannot edit or delete the post through our application.'
      )
    ) {
      this.postLibraryService.approvePost(id).then(
        () => {
          this.toastService.success('Post approved successfully.');
          // this.LoadSocialMediaByPagination(this.config.currentPage - 1, 50);
          this.loadPosts(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
        },
        () => {
          this.toastService.error(
            'Unable to approve the post. Kindly review the content as some of the necessary fields have not been completed.'
          );
        }
      );
    }
  }
  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.post,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.post;
    this.modalData.titleName = 'Post';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.postLibraryService
      .deletePostById(id)
      .then(() => {
        this.toastService.success('Post deleted successfully');
        this.loadPosts(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord
        );
      })
      .catch(() => {
        this.toastService.error('Error while deleting template');
      });
  }

  editTemplate(id: any) {
    this.router.navigate(['/post-library', id, 'edit']);
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.loadPosts(
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  formatWord(word: boolean) {
    //console.log('format word', word);
    if (word === true) {
      //console.log('yes');
      return 'Yes';
    }
    if (word === false) {
      //console.log('no');
      return 'No';
    } else {
      //console.log('else');
      return word;
    }
  }
}
