import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PagingInfo } from '../../types/dt-paging-info';

@Component({
  selector: 'ngx-emma-paging-info',
  standalone: true,
  templateUrl: './paging-info.component.html',
  styleUrl: './paging-Info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingInfoComponent {
  pagingInfo = input.required<PagingInfo>();
}
