import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  output,
} from '@angular/core';
import { Paginator } from '../types/paginator';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngx-emma-paginator',
  standalone: true,
  imports: [NgClass],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  protected page = output<number>();
  protected totalPages = computed(() =>
    Math.ceil(this.options().length / this.options().pageSize)
  );
  protected currentPage = computed(() => this.options().currentPage || 1);
  protected startIndex = computed(
    () => (this.currentPage() - 1) * this.options().pageSize + 1
  );
  protected endIndex = computed(
    () => this.startIndex() + this.options().pageSize - 1
  );
  protected pagesToShow = computed(() => {
    const pages: number[] = [];
    const totalPages = this.totalPages();
    let startPage: number;
    let endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(1, this.currentPage() - 2);
      endPage = startPage + 4;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - 4;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  });

  options = model.required<Paginator>();

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || this.options().disabled) return;
    this.updateCurrentPage(page);
    this.page.emit(page);
  }
  changePage(change: number): void {
    const newPage = this.currentPage() + change;
    if (newPage < 1 || newPage > this.totalPages() || this.options().disabled)
      return;
    this.updateCurrentPage(newPage);
  }

  private updateCurrentPage(page: number): void {
    this.options.update((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
    this.page.emit(page);
  }
}
