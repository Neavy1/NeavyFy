import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="progress-container" (click)="onProgressClick($event)">
      <div class="time current">{{ currentTime }}</div>
      <mat-progress-bar
        mode="determinate"
        [value]="progress"
        class="custom-progress-bar">
      </mat-progress-bar>
      <div class="time duration">{{ duration }}</div>
    </div>
  `,
  styles: [`
    .progress-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      cursor: pointer;

      @media (max-width: 480px) {
        gap: 0.25rem;
      }
    }

    .time {
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      color: var(--spotify-light-gray);
      min-width: 35px;
      text-align: center;

      @media (max-width: 480px) {
        min-width: 28px;
      }
    }

    .custom-progress-bar {
      flex-grow: 1;
      height: 4px;
    }

    :host ::ng-deep .mat-mdc-progress-bar {
      border-radius: 2px;
    }

    :host ::ng-deep .mdc-linear-progress__bar-inner {
      border-color: var(--spotify-green) !important;
    }
  `]
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() currentTime: string = '0:00';
  @Input() duration: string = '0:00';
  @Output() seek = new EventEmitter<number>();

  onProgressClick(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    this.seek.emit(Math.max(0, Math.min(100, percentage)));
  }
}