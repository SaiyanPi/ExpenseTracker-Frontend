import { Component, inject } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ep-categories',
  imports: [DatePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  protected readonly categories = inject(CategoryService).categories();
}
