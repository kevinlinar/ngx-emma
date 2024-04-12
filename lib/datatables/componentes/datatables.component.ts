import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  model,
  signal,
  untracked,
} from '@angular/core';
import { DTLangEs } from '../constants';
import { DTOptionsDefault } from '../constants';
import { HttpService } from '../services/http.service';
import { DTRow, DTOptions } from '../types';

@Component({
  selector: 'ngx-emma-datatables',
  standalone: true,
  templateUrl: './datatables.component.html',
  styleUrl: './datatables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatablesComponent implements OnInit {
  private httpService = inject(HttpService);
  private http = computed(() => this.options().http);
  private serverSide = computed(() => this.options().serverSide);
  protected columns = computed(() => this.options().columns);
  protected data = signal<DTRow[]>([]);
  protected showData = effect(() => {
    const options = this.options();
    untracked(() => {
      this.data.set(options.data || []);
    });
  });
  options = model<DTOptions>({
    columns: [],
    data: [],
    serverSide: true,
    language: DTLangEs,
  });

  ngOnInit(): void {
    this.options.set({
      ...DTOptionsDefault,
      ...this.options(),
    });
    if (this.serverSide()) {
      this.getData();
    }
  }
  private getData() {
    const http = this.http();
    if (http) {
      this.httpService.getData<DTRow[]>(http).subscribe((data) => {
        this.options.set({
          ...this.options(),
          data: data,
        });
      });
    }
  }
}
