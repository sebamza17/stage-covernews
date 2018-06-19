import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AuthorService} from './author.service'
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  
  displayedColumns = ['name', 'show', 'reviewAuthor','_id','options'];

  authors = new MatTableDataSource<Author>();
  autoCompleteAuthor: FormControl = new FormControl();
  autoCompletefilteredOptions: Observable<string[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public authorSvc: AuthorService, public dialog: MatDialog) {
    this.authorSvc.get()
    .subscribe((data: Author[])=>{
      this.authors = new MatTableDataSource<Author>(data);
    });
   }

  ngOnInit() {
    this.authors.paginator = this.paginator;

    this.autoCompleteAuthor.valueChanges
      .subscribe(val=>{
        this.authorSvc.search(val)
        .subscribe((data: Author[]) => {
          this.authors = new MatTableDataSource<Author>(data);
        });;
      });
  }

  /**
   * Open Dialog for edit author
   * @param author 
   */
  editAuthor(author: Author) {
    const openEditAuthor = this.dialog.open(AuthorEditComponent, {
      height: '350px',
      data: author
    });

    openEditAuthor.afterClosed().subscribe(result => {
      
    });
  }
}

export interface Author {
  name: string;
  show: boolean;
  reviewAuthor: boolean,
  amount: number;
  _id: string
}

@Component({
  selector: 'app-author-edit',
  templateUrl: 'author-edit.component.html',
})
export class AuthorEditComponent  implements OnInit{
  constructor(public dialogRef: MatDialogRef<AuthorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      console.log(this.data);
    }
  ngOnInit(){}

  onNoClick(): void {
    this.dialogRef.close();
  }
}