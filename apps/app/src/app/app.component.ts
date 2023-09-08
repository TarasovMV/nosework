import {TuiRootModule, TuiDialogModule, TuiAlertModule} from '@taiga-ui/core';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule],
    selector: 'nosework-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    title = 'app';
}
