import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'nw-main',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPage {}
