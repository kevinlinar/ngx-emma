import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { DTLengthMenu } from '../../types';

@Component({
  selector: 'ngx-emma-length-menu',
  standalone: true,
  templateUrl: './length-menu.component.html',
  styleUrl: './length-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class LengthMenuComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected length = output<number>();
  protected lengthMenuControl = new FormControl<number>(Number());
  lengthMenu = input.required<DTLengthMenu>();

  constructor() {
    effect(() => {
      this.lengthMenuControl.patchValue(this.lengthMenu().length, {
        emitEvent: false,
      });
    });
  }
  ngOnInit() {
    this.lengthMenuControl.setValue(
      this.lengthMenu().length || this.lengthMenu().menu[0],
    );
    this.lengthMenuControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.length.emit(Number(value));
        }
      });
  }
}
