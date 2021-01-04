import { Component, OnInit } from '@angular/core';
import { Category} from 'src/app/models/category.model';
import { CategoryService} from 'src/app/services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  categories?: Category[] = [];
  currentCategory?: Category;
  currentIndex = -1;
  name = '';

  constructor( private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.retiveCategories();
  }
  retiveCategories(): void {
    this.categoryService.getAll()
    .subscribe(
      (data: any) => {
        var newCategories: Category[] = [];
        data['categories'].forEach((item: any) => {
          var category: Category = {
            id: item._id,
            name: item.name,
            url: item.url
          };
          newCategories.push(category);
        });
        this.categories = newCategories;
        console.log(this.categories);
      },
      error => {
        console.log(error);
      }
    )
  }

}
