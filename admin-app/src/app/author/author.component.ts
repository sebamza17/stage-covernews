import { Component, OnInit, ViewChild,Inject,ChangeDetectorRef } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AuthorService} from './author.service'
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import {Author} from './author-interface'

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

  constructor(public authorSvc: AuthorService, public dialog: MatDialog, public changeDetectorRefs: ChangeDetectorRef) {
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
      data: {action: "update", author: author}
    });

    openEditAuthor.afterClosed().subscribe(result => {
      
    });
  }

  /**
   * Open Dialog for edit author
   * @param author 
   */
  addAuthor() {
    const openEditAuthor = this.dialog.open(AuthorEditComponent, {
      height: '350px',
      data: {action: "addNew", author: {}}
    });

    openEditAuthor.afterClosed().subscribe(result => {
      
    });
  }

  /**
   * Remove Author;
   * @param authorId 
   */
  removeAuthor(authorId: string,index: number){
    this.authorSvc.remove(authorId)
    .subscribe((data)=>{
      const itemIndex = this.authors.data.findIndex(obj => obj["_id"] === authorId);
      this.authors.data.splice(itemIndex, 1);
      this.authors = new MatTableDataSource<Author>(this.authors.data);
      this.changeDetectorRefs.detectChanges();
    })
  }
}


@Component({
  selector: 'app-author-edit',
  templateUrl: 'author-edit.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorEditComponent  implements OnInit{
  author: Author;
  action: string;
  options: object[];

  constructor(public authorSvc: AuthorService,public dialogRef: MatDialogRef<AuthorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {action: string, author: Author}){
      this.author = this.data.author;
      this.action = this.data.action;
      this.options = [{
        value: true,
        label: "Se muestra"
      },{
        value: false,
        label: "No se muestra"
      }]
  }

  ngOnInit(){}

  /**
   * On Cancel action
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * On Save action
   */
  onSave(): void {
    if(this.action === 'addNew'){
      this.authorSvc.add(this.author)
      .subscribe((data)=>{
        this.dialogRef.close();
      });
      return;
    }

    this.authorSvc.update(this.author);
    this.dialogRef.close();
  }
}