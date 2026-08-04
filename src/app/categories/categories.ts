import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DatePipe } from '@angular/common';
import { FormRoot, FormField, form, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'ep-categories',
  imports: [DatePipe, FormRoot, FormField],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly categoryService = inject(CategoryService);

  protected readonly getCategories = this.categoryService.categories();

  private readonly creationFailed = signal(false);
  protected readonly field = signal({
    name: ''
  })
  protected readonly category = form(
    this.field,
    f => {
      required(f.name);
    },
    {
      submission: {
        action: async () => await this.createCategory()
      }
    }
  )

  private async createCategory() {
    this.creationFailed.set(false);
    const { name } = this.category().value();
    try{
      await firstValueFrom(this.categoryService.create({ name }));

      this.field.set({ name:'' });
      this.category().reset();

      this.getCategories.reload();
      return;
    } catch {
      this.creationFailed.set(true);
    }
  }
}

