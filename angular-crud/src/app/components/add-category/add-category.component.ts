import { Component, OnInit } from '@angular/core';
import { Category} from 'src/app/models/category.model';
import { CategoryService} from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  category: Category = {
    name: '',
    url: ''
  }
  submitted = false;
  message: string = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  saveCategory(): void {
    const data = {
      name: this.category.name,
      url: this.category.url
    };
    this.categoryService.create(data)
    .subscribe(
      (response: any) => {
        console.log( response);
        
        if (response.success === false){
          this.submitted = response.success;
          this.message = response.message;
        } else {
          this.submitted = true;
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  newCategory(): void {
    this.submitted = false;
    this.category = {
      name: '', 
      url: '',
    };
  }
}
