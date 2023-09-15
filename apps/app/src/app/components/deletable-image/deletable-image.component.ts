import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiButtonModule} from '@taiga-ui/core';
import {TUI_IS_MOBILE} from '@taiga-ui/cdk';

@Component({
    selector: 'nw-deletable-image',
    standalone: true,
    imports: [CommonModule, TuiButtonModule],
    templateUrl: './deletable-image.component.html',
    styleUrls: ['./deletable-image.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletableImageComponent {
    @Input() src: string | null = null;
    @Output() readonly delete = new EventEmitter<void>();

    constructor(@Inject(TUI_IS_MOBILE) protected readonly isMobile: boolean) {}
}
