import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  model,
  output,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchOptions } from '../types/search-options';

@Component({
  selector: 'ngx-emma-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  protected searched = output<string>();
  options = model<SearchOptions>({
    search: '',
    searchPlaceholder: '',
    searchDelay: 300,
    minlength: 0,
    maxLength: 255,
  });
  searchControl = new FormControl<string>('');
  ngOnInit() {
    this.searchControl.setValue(this.options()?.search || '');
    const { minlength, maxLength } = this.options();
    const validators: ValidatorFn[] = [];
    if (maxLength) {
      validators.push(Validators.maxLength(maxLength));
    }
    if (minlength) {
      validators.push(Validators.minLength(minlength));
    }
    if (validators.length > 0) {
      this.searchControl.setValidators(validators);
    }
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.options()?.searchDelay || 300),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        if (this.searchControl.valid) {
          const search = value?.toString().trim() || '';
          if (
            search === '' ||
            search.length >= (this.options()?.minlength || 1)
          ) {
            this.searched.emit(search?.toString().trim() || '');
          }
        }
      });
  }
}
